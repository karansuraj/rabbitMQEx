import { sendPayment } from './payment-producer';
import { Payment } from './types';

/* THIS DEMO WILL NOT WORK WITHOUT RUNNING A CONSUMER FIRST 
  This can be done by running the following command (after installing TS dependencies):
    npm run consumer
*/


// Testing with sending 10 payments
async function demo1() {
  for (let i = 0; i < 10; i++) {
    const payment: Omit<Payment, 'timestamp'> = {
      gameId: `game${i}`,
      playerId: `player${i}`,
      amount: 500
    };
    sendPayment(payment);
  }
}

// Testing with sending payment every 2 seconds
async function demo2() {
  const payment: Omit<Payment, 'timestamp'> = {
    gameId: 'minecraft-456',
    playerId: 'player789',
    amount: 500
  };
  setInterval(() => sendPayment(payment), 2000);
}

demo1();
// demo2();