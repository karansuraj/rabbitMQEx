import * as amqp from 'amqplib';
import { Channel, Connection } from 'amqplib';
import { Payment } from '../types';

// Use any type for the mock connection to avoid type conflicts
interface MockConnection extends Omit<Connection, 'createChannel'> {
  createChannel(): Promise<Channel>;
}

export interface RabbitMQTestContext {
  connection: MockConnection;
  channel: Channel;
  queueName: string;
}

export async function setupRabbitMQ(queueName: string): Promise<RabbitMQTestContext> {
  const connection = await amqp.connect('amqp://localhost');
  const channel = await connection.createChannel();
  await channel.assertQueue(queueName, { durable: true });
  await channel.purgeQueue(queueName); // Clean up any existing messages
  
  // Cast to any to avoid type issues with the mock
  return { connection: connection as unknown as MockConnection, channel, queueName };
}

export async function teardownRabbitMQ(context: RabbitMQTestContext): Promise<void> {
  try {
    await context.channel.deleteQueue(context.queueName);
    await context.channel.close();
    await (context.connection as any).close(); // Use type assertion here
  } catch (error) {
    console.error('Error during teardown:', error);
  }
}

export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function createTestPayment(overrides: Partial<Payment> = {}): Payment {
  return {
    gameId: 'test-game-id',
    playerId: 'test-player-id',
    amount: 100,
    timestamp: Date.now(),
    ...overrides,
  };
}
