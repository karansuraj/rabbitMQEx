import { sendPayment } from './payment-producer';
import { Payment } from './payment-producer';

// Testing with sending 10 payments
async function test1() {
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
async function test2() {
  const payment: Omit<Payment, 'timestamp'> = {
    gameId: 'minecraft-456',
    playerId: 'player789',
    amount: 500
  };
  setInterval(() => sendPayment(payment), 2000);
}

test1();
// test2();