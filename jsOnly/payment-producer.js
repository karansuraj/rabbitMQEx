// payment-producer.js
const amqp = require('amqplib');

// This is a basic JavaScript version of the code
async function sendPayment() {
  const connection = await amqp.connect('amqp://localhost');
  const channel = await connection.createChannel();
  
  await channel.assertQueue('payments');
  
  const payment = {
    gameId: 'fortnite-123',
    playerId: 'player456', 
    amount: 1000, // sats
    timestamp: Date.now()
  };
  
  channel.sendToQueue('payments', Buffer.from(JSON.stringify(payment)));
  console.log('💰 Payment sent:', payment);
  await new Promise(resolve => setTimeout(resolve, 500));
  await connection.close();
}

sendPayment();