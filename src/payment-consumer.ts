import * as amqp from 'amqplib';
import { Payment } from './types';
// This is a TypeScript version of the code

async function processPayment(payment: Payment): Promise<void> {
  console.log('⚡ Processing payment:', payment);
  // Simulate payment processing
  await new Promise(resolve => setTimeout(resolve, 1000));
  console.log('Payment confirmed on Lightning Network');
}

async function startConsumer(): Promise<void> {
  try {
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();
    
    await channel.assertQueue('payments');
    
    console.log('Waiting for payments. To exit press CTRL+C');
    
    channel.consume('payments', async (msg) => {
      if (msg) {
        const payment: Payment = JSON.parse(msg.content.toString());
        await processPayment(payment);
        channel.ack(msg);
      }
    });
    
    // Handle graceful shutdown
    process.on('SIGINT', () => {
      console.log('\nShutting down consumer...');
      connection.close()
        .then(() => process.exit(0))
        .catch(() => process.exit(1));
    });
    
  } catch (error) {
    console.error('Error in payment consumer:', error);
    process.exit(1);
  }
}

// Start the consumer if this file is run directly
if (require.main === module) {
  startConsumer().catch(console.error);
}
