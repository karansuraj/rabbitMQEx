// payment-consumer.js  
const amqp = require('amqplib');
// This is a basic JavaScript version of the code

async function processPayments() {
  const connection = await amqp.connect('amqp://localhost');
  const channel = await connection.createChannel();
  
  await channel.assertQueue('payments');
  
  channel.consume('payments', (msg) => {
    const payment = JSON.parse(msg.content.toString());
    console.log('⚡ Processing payment:', payment);
    
    // Simulate Lightning Network payment
    setTimeout(() => {
      console.log('✅ Payment confirmed on Lightning Network');
      channel.ack(msg);
    }, 500);
  });
}

processPayments();