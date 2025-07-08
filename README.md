# RabbitMQ TypeScript Example

This project demonstrates a simple payment processing system using RabbitMQ with TypeScript. It includes a producer that sends payment messages and a consumer that processes them asynchronously.

## Prerequisites

- Node.js (v14 or later)
- npm or yarn
- Docker (for running RabbitMQ)
- TypeScript (will be installed as a dev dependency)

## Setup

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd rabbitmqex
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start RabbitMQ**
   ```bash
   docker run -d --name rabbitmq -p 15672:15672 -p 5672:5672 rabbitmq:3-management
   ```
   - Access the RabbitMQ management console at: http://localhost:15672/
   - Default credentials: `guest` / `guest`

## Project Structure

```
src/
  payment-producer.ts  # Producer that sends payment messages
  payment-consumer.ts  # Consumer that processes payments
  test.ts             # Example usage and test scripts
tsconfig.json         # TypeScript configuration
package.json          # Project dependencies and scripts
```

## Available Scripts

- `npm run consumer` - Start the payment consumer
- `npm run producer` - Send a test payment
- `npm test` - Run tests (not implemented yet)
- `npm run build` - Compile TypeScript to JavaScript

## Usage

1. **Start the consumer** (in one terminal):
   ```bash
   npm run consumer
   ```

2. **Send test payments** (in another terminal):
   ```bash
   npm run producer
   ```

3. **Run test scripts**:
   ```bash
   npx ts-node src/test.ts
   ```

## Example Test Scripts

Check `src/test.ts` for example usage, including:
- Sending multiple payments in sequence
- Setting up periodic payments

## RabbitMQ Management Console

Access the RabbitMQ management console at http://localhost:15672/

- **Username**: guest
- **Password**: guest

From here you can:
- Monitor queues and connections
- View message rates
- Inspect individual messages
- Manage exchanges and bindings

## Development

### TypeScript Compilation

```bash
# Compile TypeScript to JavaScript
npm run build

# Watch for changes and compile automatically
npx tsc --watch
```

### Adding New Features

1. Add new message types in `src/types.ts`
2. Create new producer/consumer files following the existing patterns
3. Update tests as needed

## License

MIT