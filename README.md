# Dog Breeds Explorer

A full-stack application for exploring dog breeds with favorites functionality.

***

## Tech Stack
- **Backend**: Node.js with TypeScript and Express
- **Frontend**: Vue 3 with TypeScript and Vite
- **API**: Dog CEO API integration
- **Testing**: Jest (backend), Vitest (frontend)
- **Containerization**: Docker

***

## Features
- Browse all dog breeds
- View random images for each breed
- Add/remove breeds from favorites
- Persistent favorites storage

***

## Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Docker (optional)

***

## Quick Start

### Development Setup
1. Clone the repository
2. Install dependencies for both frontend and backend:
   ```bash
   npm run install:all
   ```
3. Start both frontend and backend development servers:
   ```bash
   npm run dev
   ```
4. Access frontend at [http://localhost:3000](http://localhost:3000)
5. Backend API runs on [http://localhost:3001](http://localhost:3001)

***

## Project Structure

```
dog-breeds-explorer/
├── backend/      # Node.js TypeScript API
├── frontend/     # Vue 3 TypeScript app
├── .github/      # CI/CD workflows
└── docker-compose.yml  # Development containers
```

***

## Available Scripts

- `npm run dev` - Start both frontend and backend in development mode
- `npm run install:all` - Install dependencies for both frontend and backend
- `npm run test` - Run all tests (frontend and backend)
- `npm run build` - Build both applications for production

***

## API Endpoints

- `GET /api/breeds` - Get all dog breeds
- `GET /api/breeds/:breed/images` - Get 3 images for a specific breed
- `POST /api/favorites` - Add breed to favorites (request body includes breed name)
- `GET /api/favorites` - Get favorite breeds
- `DELETE /api/favorites/:breed` - Remove breed from favorites

***

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

***

## Setup Instructions

### Local Development

#### Backend
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the backend server:
   ```bash
   npm run dev
   ```

#### Frontend
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the frontend server:
   ```bash
   npm run dev
   ```

***

### Using Docker (Optional)

- Backend Docker setup is functional with multi-stage builds.
- Frontend Docker container currently has a proxy bug related to Vue inside Docker requiring debugging.

To run both frontend and backend with Docker Compose (experimental):
```bash
docker-compose up --build
```

If proxy issues occur, run frontend and backend locally instead of inside containers.

***

## Running Tests

### Backend
From the `backend` directory:
```bash
npm run test
```

### Frontend
From the `frontend` directory:
```bash
npm run test
```

Testing includes unit and integration tests using Jest and Vitest.

***

## Deployment Information

- Backend is deployed on Railway accessible at:
  - [Breeds API](https://backend-production-fb36.up.railway.app/api/breeds)
  - [Favorites API](https://backend-production-fb36.up.railway.app/api/favorites)
  - [Health check](https://backend-production-fb36.up.railway.app/api/health)

- Frontend deployment is pending resolution of Docker proxy issues; alternative platforms will be considered.

***

## Known Issues and Assumptions

- Frontend Docker container proxy bug hampers backend communication. Vue's Docker networking behavior differs from React and needs investigation.
- Backend Docker container and Railway deployment are stable and verified.
- Frontend code uses composables and models but organization can be improved.
- CI/CD via GitHub Actions is implemented for testing, building, and deploying.
- Backend caches API responses for performance.
- Tailwind CSS is used for responsive styling on frontend.

***

## Key Commands Summary

| Task                 | Directory | Command                      |
|----------------------|------------|------------------------------|
| Install backend deps  | backend    | npm install                 |
| Run backend dev       | backend    | npm run dev                 |
| Install frontend deps | frontend   | npm install                 |
| Run frontend dev      | frontend   | npm run dev                 |
| Run backend tests     | backend    | npm run test                |
| Run frontend tests    | frontend   | npm run test                |
| Run all with Docker   | root       | docker-compose up --build   |

***

This README provides a complete guide for setup, development, testing, deployment, and contribution for the Dog Breeds Explorer project.