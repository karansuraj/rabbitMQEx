import * as amqp from 'amqplib';
// This is a TypeScript version of the code
export interface Payment {
  gameId: string;
  playerId: string;
  amount: number;
  timestamp: number;
}

export async function sendPayment(payment: Omit<Payment, 'timestamp'>): Promise<void> {
  try {
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();
    
    await channel.assertQueue('payments');
    
    const paymentWithTimestamp: Payment = {
      ...payment,
      timestamp: Date.now()
    };
    
    channel.sendToQueue('payments', Buffer.from(JSON.stringify(paymentWithTimestamp)));
    console.log('💰 Payment sent:', paymentWithTimestamp);
    
    // Give RabbitMQ time to process the message
    await new Promise(resolve => setTimeout(resolve, 500));
    await connection.close();
  } catch (error) {
    console.error('Error in payment producer:', error);
    throw error;
  }
}

if (require.main === module) {
  const payment = {
    gameId: 'fortnite-123',
    playerId: 'player456',
    amount: 1000 // sats
  };
  
  // sendPayment(payment)
  //   .then(() => {
  //     console.log('Payment sent successfully!');
  //     // Give it time to actually send before exiting
  //     setTimeout(() => process.exit(0), 1000);
  //   })
  //   .catch((error) => {
  //     console.error('Payment failed:', error);
  //     process.exit(1);
  //   });
  sendPayment(payment)
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}