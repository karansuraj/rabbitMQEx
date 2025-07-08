import * as amqp from 'amqplib';

interface Payment {
  gameId: string;
  playerId: string;
  amount: number;
  timestamp: number;
}

async function sendPayment(): Promise<void> {
  try {
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();
    
    await channel.assertQueue('payments');
    
    const payment: Payment = {
      gameId: 'fortnite-123',
      playerId: 'player456', 
      amount: 1000, // sats
      timestamp: Date.now()
    };
    
    channel.sendToQueue('payments', Buffer.from(JSON.stringify(payment)));
    console.log('💰 Payment sent:', payment);
    
    // Close the connection after a short delay to ensure the message is sent
    setTimeout(() => {
      connection.close();
      process.exit(0);
    }, 500);
  } catch (error) {
    console.error('Error in payment producer:', error);
    process.exit(1);
  }
}

sendPayment();
