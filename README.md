# Solace Candidate Assignment

[![Test Suite](https://github.com/dyoun/solace/actions/workflows/test.yml/badge.svg)](https://github.com/dyoun/solace/actions/workflows/test.yml)
[![Docker Build](https://github.com/dyoun/solace/actions/workflows/docker.yml/badge.svg)](https://github.com/dyoun/solace/actions/workflows/docker.yml)
[![GitHub Container Registry](https://img.shields.io/badge/ghcr.io-packages-blue)](https://github.com/dyoun/solace/pkgs/container/solace%2Fpackages)

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

## Docker Support

This project includes full Docker support for containerized deployment.

### Docker Files

The project includes the following Docker-related files:
- `solace-candidate-assignment-main/Dockerfile` - Multi-stage production Docker build
- `solace-candidate-assignment-main/.dockerignore` - Optimized file exclusions for Docker builds
- `solace-candidate-assignment-main/next.config.mjs` - Configured with standalone output for Docker

### Local Docker Build and Run

Build the Docker image:
```bash
cd solace-candidate-assignment-main
docker build -t solace-advocates .
```

Run the container:
```bash
docker run -p 3000:3000 solace-advocates
```

The application will be available at `http://localhost:3000`.

### Docker Image Features

- **Multi-stage Build** - Optimized for production with minimal image size  
- **Alpine Linux** - Lightweight base image (~5MB)  
- **Multi-platform** - Supports both `linux/amd64` and `linux/arm64`  
- **Security** - Runs as non-root user (`nextjs:nodejs`)  
- **Standalone Output** - Self-contained server bundle  
- **Layer Caching** - Optimized for faster subsequent builds

## CI/CD with GitHub Actions

The project includes automated CI/CD pipelines with GitHub Actions.

### Test Pipeline (`.github/workflows/test.yml`)

**Triggers:**
- Push to `main` and `develop` branches  
- Pull requests to `main` and `develop` branches

**Features:**
- **Multi-Node Testing** - Tests on Node.js 18.x and 20.x
- **Test Coverage** - Generates and uploads coverage reports
- **Quality Checks** - Runs linting and type checking if available
- **Fast Execution** - Uses npm cache and optimized Ubuntu runners

**Commands:**
```bash
# Tests run automatically on push/PR, but you can also run manually:
npm test -- --coverage --watchAll=false
npm run lint      # if available
npm run typecheck # if available
```

### Docker Pipeline (`.github/workflows/docker.yml`)

**Triggers:**
- Push to `main` and `develop` branches
- Pull requests to `main` branch  
- Release publications

**Features:**
- **Container Registry** - Pushes to GitHub Container Registry (`ghcr.io`)
- **Smart Tagging** - Automatic semantic versioning and branch-based tags
- **Multi-platform Builds** - Supports AMD64 and ARM64 architectures
- **Security** - Includes build attestation for supply chain security
- **Caching** - GitHub Actions cache for faster builds

### Container Registry

Images are automatically built and published to:
```
ghcr.io/dyoun/{repo}/solace/packages
```

**Available Tags:**
- `latest` - Latest stable build from main branch
- `develop` - Latest development build  
- `pr-{number}` - Pull request builds
- `v1.0.0`, `1.0`, `1` - Semantic version tags from releases

### Pull and Run Published Image

```bash
# Pull the latest published image
docker pull ghcr.io/dyoun/solace/solace-advocates:latest

# Run the published container
docker run -p 3000:3000 ghcr.io/dyoun/solace/solace-advocates:latest
```

### Deployment Ready

The Docker images are production-ready and can be deployed to:
- **Kubernetes** clusters
- **Docker Swarm** 
- **Cloud Run** (Google Cloud)
- **Container Instances** (Azure)
- **ECS/Fargate** (AWS)
- **Railway**, **Fly.io**, **Render**, etc.

The CI/CD pipelines ensure that every code change is automatically tested and containerized, providing a robust deployment workflow for the Solace Advocates application.
