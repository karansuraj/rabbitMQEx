import * as amqp from 'amqplib';
import { Payment } from './types';

export async function sendPayment(payment: Omit<Payment, 'timestamp'>): Promise<void> {
  let connection: amqp.ChannelModel | null = null;
  let channel: amqp.Channel | null = null;
  
  try {
    connection = await amqp.connect('amqp://localhost');
    channel = await connection.createChannel();
    
    // Get queue name from environment variable or use default
    const queueName = process.env.PAYMENT_QUEUE || 'payments';
    
    // Assert the queue with the same options as in the test
    await channel.assertQueue(queueName, { durable: true });
    
    const paymentWithTimestamp: Payment = {
      ...payment,
      timestamp: Date.now()
    };
    
    const sent = channel.sendToQueue(
      queueName,
      Buffer.from(JSON.stringify(paymentWithTimestamp)),
      { persistent: true }
    );
    
    if (!sent) {
      throw new Error('Failed to send payment to queue');
    }
    
    console.log('Payment sent to queue');
  } catch (error) {
    console.error('Error sending payment:', error);
    throw error;
  } finally {
    if (channel) {
      await channel.close().catch(console.error);
    }
    if (connection) {
      await connection.close().catch(console.error);
    }
  }
}

if (require.main === module) {
  const payment = {
    gameId: 'fortnite-123',
    playerId: 'player456',
    amount: 1000 // sats
  };
  
  sendPayment(payment)
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}