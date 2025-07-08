import { sendPayment } from '../../payment-producer';
import { setupRabbitMQ, teardownRabbitMQ, createTestPayment, sleep } from '../test-utils';
import amqp from 'amqplib';

describe('Payment Flow Integration', () => {
  let testContext: any;
  const testQueue = 'test-payments';
  let receivedMessages: any[] = [];

  beforeAll(async () => {
    // Set up a test queue
    testContext = await setupRabbitMQ(testQueue);
    
    // Update the queue name in the environment for testing
    process.env.PAYMENT_QUEUE = testQueue;
    
    // Set up a consumer to listen for messages
    await testContext.channel.consume(testQueue, (msg: amqp.ConsumeMessage | null) => {
      if (msg) {
        receivedMessages.push(JSON.parse(msg.content.toString()));
        testContext.channel.ack(msg);
      }
    }, { noAck: false });
  });

  beforeEach(() => {
    // Reset received messages before each test
    receivedMessages = [];
  });

  afterAll(async () => {
    // Clean up the test queue
    await teardownRabbitMQ(testContext);
    delete process.env.PAYMENT_QUEUE;
  });

  it('should process a payment through the queue', async () => {
    const testPayment = createTestPayment({ amount: 300 });
    
    // Send a test payment
    await sendPayment({
      gameId: testPayment.gameId,
      playerId: testPayment.playerId,
      amount: testPayment.amount,
    });
    
    // Wait for the message to be processed
    await sleep(1000);
    
    // Verify the message was received
    expect(receivedMessages).toHaveLength(1);
    const receivedMessage = receivedMessages[0];
    expect(receivedMessage).not.toBeNull();
    expect(receivedMessage.gameId).toBe(testPayment.gameId);
    expect(receivedMessage.playerId).toBe(testPayment.playerId);
    expect(receivedMessage.amount).toBe(testPayment.amount);
    expect(receivedMessage.timestamp).toBeDefined();
  });

  it('should handle multiple payments in order', async () => {
    const payments = [
      createTestPayment({ amount: 100 }),
      createTestPayment({ amount: 200 }),
      createTestPayment({ amount: 300 })
    ];

    // Send multiple payments
    for (const payment of payments) {
      await sendPayment({
        gameId: payment.gameId,
        playerId: payment.playerId,
        amount: payment.amount,
      });
    }
    
    // Wait for all messages to be processed
    await sleep(1500);
    
    // Verify all messages were received in order
    expect(receivedMessages).toHaveLength(payments.length);
    payments.forEach((payment, index) => {
      expect(receivedMessages[index].amount).toBe(payment.amount);
    });
  });
});
