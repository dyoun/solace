## Solace Candidate Assignment

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

Install dependencies

```bash
npm i
```

Run the development server:

```bash
npm run dev
```

## Database set up

The app is configured to return a default list of advocates. This will allow you to get the app up and running without needing to configure a database. If you’d like to configure a database, you’re encouraged to do so. You can uncomment the url in `.env` and the line in `src/app/api/advocates/route.ts` to test retrieving advocates from the database.

1. Feel free to use whatever configuration of postgres you like. The project is set up to use docker-compose.yml to set up postgres. The url is in .env.

```bash
docker compose up -d
```

2. Create a `solaceassignment` database.

3. Push migration to the database

```bash
npx drizzle-kit push
```

4. Seed the database

```bash
curl -X POST http://localhost:3000/api/seed
```

## Testing

This project includes a comprehensive testing suite using Jest and React Testing Library.

### Running Tests

Run all tests:
```bash
npm test
```

Run tests in watch mode (automatically re-runs tests when files change):
```bash
npm run test:watch
```

Run tests with coverage report:
```bash
npm run test:coverage
```

### Test Structure

The testing suite covers the following areas:

#### Unit Tests
- **Search Functionality** (`src/__tests__/search.test.ts`)
  - Multi-term search parsing and filtering
  - Case-insensitive matching
  - AND logic validation (all terms must match)
  - Edge cases and error handling

- **Type Definitions** (`src/__tests__/types.test.ts`)
  - Interface validation and constraints
  - Required vs optional field enforcement
  - Data type verification

#### Integration Tests
- **API Endpoints** (`src/__tests__/api/advocates.test.ts`)
  - GET /api/advocates endpoint functionality
  - Response structure validation
  - Error handling scenarios

#### Component Tests
- **Home Page** (`src/__tests__/Home.test.tsx`)
  - Loading states and error handling
  - Search functionality (single and multi-term)
  - Data display and filtering
  - User interactions (typing, clicking, resetting)
  - Accessibility features
  - Responsive design validation

### Test Features

#### Multi-term Search Testing
The search functionality supports sophisticated multi-term queries:
- `"john md"` - finds advocates named John with MD degree
- `"anxiety therapist"` - finds advocates specializing in anxiety therapy
- `"new york 5"` - finds advocates in New York with 5+ years experience

#### Mock Data and Utilities
- Comprehensive mock advocate data
- API response simulation helpers
- Network error testing utilities
- Search term parsing validation

#### Test Coverage
The test suite provides coverage for:
- All search functionality and edge cases
- API endpoint behavior and error handling
- Component rendering and user interactions
- TypeScript type safety and constraints
- Accessibility and responsive design features

### Test Configuration

Tests are configured with:
- Jest with Next.js integration
- React Testing Library for component testing
- TypeScript support throughout
- Custom test utilities and helpers
- Module path resolution for `@/` imports

### Continuous Testing

For development workflow, use watch mode to automatically run tests as you make changes:
```bash
npm run test:watch
```

This ensures immediate feedback on code changes and helps maintain test coverage as the application evolves.
