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
  payment-producer.ts      # Producer that sends payment messages
  payment-consumer.ts      # Consumer that processes payments
  types.ts                # Shared TypeScript types
  demo.ts                 # Example usage script
  __tests__/
    test-utils.ts         # Shared test utilities
    unit/                 # Unit tests
      payment-producer.test.ts
    integration/          # Integration tests
      payment-flow.test.ts
tsconfig.json             # TypeScript configuration
jest.config.js            # Jest test configuration
package.json              # Project dependencies and scripts
```

## Available Scripts

- `npm run consumer` - Start the payment consumer
- `npm run demo` - Run a demo that sends sample payments
- `npm test` - Run all tests
- `npm run test:unit` - Run only unit tests
- `npm run test:integration` - Run only integration tests
- `npm run build` - Compile TypeScript to JavaScript

## Testing Strategy

This project uses a combination of unit and integration tests to ensure reliability:

### Unit Tests
- Test individual components in isolation
- Mock external dependencies (like RabbitMQ)
- Fast execution
- Located in `src/__tests__/unit/`

### Integration Tests
- Test the interaction between components
- Use a real RabbitMQ connection (requires Docker)
- Test the full flow from producer to consumer
- Located in `src/__tests__/integration/`

### Running Tests

```bash
# Run all tests
npm test

# Run only unit tests
npm run test:unit

# Run only integration tests (requires RabbitMQ running)
npm run test:integration
```

## About Test Complexity

You might be wondering about the amount of test code compared to the actual application code. This is actually quite common in professional Node.js/TypeScript projects for several reasons:

1. **Reliability**: Tests ensure your message queue works correctly under different scenarios
2. **Documentation**: Tests serve as living documentation of how the system should behave
3. **Refactoring Safety**: A good test suite allows you to refactor with confidence
4. **Edge Cases**: Tests help catch edge cases that might be hard to reproduce manually

While the test setup might seem complex initially, it follows common patterns used in production-grade Node.js applications. The initial setup is the most involved part - adding new tests will be much simpler now that the foundation is in place.

For a production application, you might also consider:
- Adding end-to-end tests
- Setting up CI/CD pipelines
- Adding performance tests
- Implementing monitoring and metrics

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
   npm run demo
   ```

## Example Test Scripts

Check `src/demo.ts` for example usage, including:
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