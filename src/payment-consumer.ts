import * as amqp from 'amqplib';

interface Payment {
  gameId: string;
  playerId: string;
  amount: number;
  timestamp: number;
}

async function processPayments(): Promise<void> {
  try {
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();
    
    await channel.assertQueue('payments');
    
    console.log('🔄 Waiting for payments. To exit press CTRL+C');
    
    channel.consume('payments', (msg) => {
      if (msg === null) return;
      
      const payment: Payment = JSON.parse(msg.content.toString());
      console.log('⚡ Processing payment:', payment);
      
      // Simulate Lightning Network payment
      setTimeout(() => {
        console.log('✅ Payment confirmed on Lightning Network');
        channel.ack(msg);
      }, 500);
    });
    
    // Handle graceful shutdown
    process.once('SIGINT', async () => {
      await channel.close();
      await connection.close();
    });
  } catch (error) {
    console.error('Error in payment consumer:', error);
    process.exit(1);
  }
}

processPayments();
