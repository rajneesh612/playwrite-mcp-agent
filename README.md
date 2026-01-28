# MCP Agent with Page Object Model

A comprehensive MCP (Model Context Protocol) agent implementation using the Page Object Model (POM) pattern for automation and testing.

## Project Structure

```
src/
├── pages/          # Page Object Models - encapsulates page interactions
├── utils/          # Utility functions and helpers
├── config/         # Configuration files and settings
├── services/       # Business logic and services
└── index.ts        # Application entry point

tests/
├── specs/          # Test specifications
└── fixtures/       # Test data and fixtures

docs/               # Documentation
.vscode/            # VS Code configuration
```

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create `.env` file:
   ```bash
   cp .env.example .env
   ```

3. Build the project:
   ```bash
   npm run build
   ```

## Usage

- Run tests: `npm test`
- Watch mode: `npm run test:watch`
- Development: `npm run dev`
- Lint: `npm run lint`

## Page Object Model

Each page object represents a single webpage or application state and encapsulates:
- Page elements (selectors)
- Page actions (methods)
- Page assertions

See `src/pages/` for examples.

## Contributing

Follow the existing patterns and maintain TypeScript strict mode.
