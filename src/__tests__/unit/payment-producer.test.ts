import { sendPayment } from '../../payment-producer';
import { createTestPayment } from '../test-utils';
import amqp from 'amqplib';

// Mock amqplib
jest.mock('amqplib');

const mockConnect = amqp.connect as jest.Mock;
const mockCreateChannel = jest.fn();
const mockAssertQueue = jest.fn();
const mockSendToQueue = jest.fn();

describe('Payment Producer', () => {
  let mockConnection: any;
  let mockChannel: any;
  const testQueue = 'test-payments';

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();

    // Update the queue name in the environment for testing
    process.env.PAYMENT_QUEUE = testQueue;

    // Setup mock channel
    mockChannel = {
      assertQueue: mockAssertQueue.mockResolvedValue(undefined),
      sendToQueue: mockSendToQueue.mockReturnValue(true),
      close: jest.fn().mockResolvedValue(undefined),
    };

    // Setup mock connection
    mockConnection = {
      createChannel: mockCreateChannel.mockResolvedValue(mockChannel),
      close: jest.fn().mockResolvedValue(undefined),
    };

    // Setup the mock to return our mock connection
    mockConnect.mockResolvedValue(mockConnection);
    
    // Mock console.log to prevent test output clutter
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should send a payment message to the queue', async () => {
    const testPayment = createTestPayment({ amount: 200 });
    
    await sendPayment({
      gameId: testPayment.gameId,
      playerId: testPayment.playerId,
      amount: testPayment.amount,
    });

    // Verify connection was created
    expect(mockConnect).toHaveBeenCalledWith('amqp://localhost');
    
    // Verify channel was created
    expect(mockCreateChannel).toHaveBeenCalled();
    
    // Verify queue was asserted with correct parameters
    expect(mockAssertQueue).toHaveBeenCalledWith(testQueue, { durable: true });
    
    // Verify message was sent with correct parameters
    expect(mockSendToQueue).toHaveBeenCalledWith(
      testQueue,
      expect.any(Buffer),
      { persistent: true }
    );
    
    // Verify the sent message contains our payment data
    const sentMessage = JSON.parse(mockSendToQueue.mock.calls[0][1].toString());
    expect(sentMessage.gameId).toBe(testPayment.gameId);
    expect(sentMessage.playerId).toBe(testPayment.playerId);
    expect(sentMessage.amount).toBe(testPayment.amount);
    expect(sentMessage.timestamp).toBeDefined();
    
    // Verify cleanup
    expect(mockChannel.close).toHaveBeenCalled();
    expect(mockConnection.close).toHaveBeenCalled();
  });

  it('should throw an error if sending fails', async () => {
    // Mock sendToQueue to return false
    mockSendToQueue.mockReturnValue(false);
    
    await expect(
      sendPayment({
        gameId: 'test-game',
        playerId: 'test-player',
        amount: 100,
      })
    ).rejects.toThrow('Failed to send payment');
    
    // Verify cleanup still happens on error
    expect(mockChannel.close).toHaveBeenCalled();
    expect(mockConnection.close).toHaveBeenCalled();
  });
});
