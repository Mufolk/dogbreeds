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
- Node.js (v20 or higher)
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

- **Backend**: Docker setup is functional with multi-stage builds and production-ready
- **Frontend**: Docker container works for development but has nginx proxy reverse issues in production deployment

To run both frontend and backend with Docker Compose:
```bash
docker-compose up --build
```

For production deployment, consider using alternative platforms for the frontend due to nginx proxy configuration challenges.

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

**Note**: Testing includes unit and integration tests using Jest and Vitest.

***

## Deployment Information

- **Backend**: Deployed on Railway
  - [Breeds API](https://backend-production-fb36.up.railway.app/api/breeds)
  - [Favorites API](https://backend-production-fb36.up.railway.app/api/favorites)
  - [Health check](https://backend-production-fb36.up.railway.app/api/health)

- **Frontend**: Deployment pending resolution of nginx proxy reverse configuration issues in production; alternative platforms will be considered.

***

## Known Issues and Assumptions

- **Frontend**: nginx proxy reverse configuration issues in production deployment (development Docker setup works fine)
- **Backend**: Docker container and Railway deployment are stable and verified
- **Frontend Code**: Uses composables and models with improved organization and error handling
- **CI/CD**: GitHub Actions implemented for testing, building, and deploying
- **Performance**: Backend caches API responses for performance
- **Styling**: Tailwind CSS used for responsive styling on frontend
- **Testing**: Comprehensive test coverage implemented for both frontend and backend
- **UX**: Improved loading states, pagination UX, and error treatment implemented

***

## Key Commands Summary

| Task | Directory | Command |
|------|-----------|----------|
| Install backend deps | backend | `npm install` |
| Run backend dev | backend | `npm run dev` |
| Install frontend deps | frontend | `npm install` |
| Run frontend dev | frontend | `npm run dev` |
| Run backend tests | backend | `npm run test` |
| Run frontend tests | frontend | `npm run test` |
| Run all with Docker | root | `docker-compose up --build` |

***

## Appendix: Next Steps and Scalability Roadmap

This section outlines recommended architectural and feature enhancements tailored to different project sizes, demonstrating a strategic approach to software scalability and maintainability.

### Small to Medium Size Projects

For projects requiring moderate scalability and improved maintainability:

- **Enhanced Backend Functionality**  
  Introduce user authentication mechanisms, including secure login and registration flows with password hashing (e.g., bcrypt) and JWT-based session management to safeguard API endpoints. Employ role-based access control to govern permissions if needed.

- **Feature-Based Backend Architecture**  
  Transition from traditional MVC to a feature-based folder structure, where each domain feature encapsulates its models, controllers, services, and routes. This improves code cohesiveness, reduces cross-cutting concerns, and facilitates scaling development efforts effectively.

- **Service Separation**  
  Decouple frontend and backend into independently deployable services housed in separate repositories. This enables independent versioning, specialized CI/CD pipelines, and clearer ownership boundaries between teams.

- **Frontend Modularization and State Management**  
  Increase component modularization by decomposing UI into small, reusable, well-isolated components using Vue 3’s Composition API and Single File Components. Adopt a robust Vue state management library, such as Pinia, to centralize application state logic, facilitate debugging, and improve code consistency across modules.

- **API Layer Abstraction**  
  Implement a dedicated API service layer on the frontend to abstract and centralize HTTP requests, allowing easier adaptability to backend changes or API versioning without wide-spread refactoring.

---

### Medium to Large Size Projects

For projects anticipating significant growth in user base, features, and complexity:

- **Backend Clean Architecture and Infrastructure Layering**  
  Architect the backend following principles of Clean Architecture, separating concerns into layers such as Domain (business logic), Application (use cases), Infrastructure (database, external APIs), and Interfaces (HTTP controllers). This enforces strict dependency rules, facilitates unit testing, and supports future substitutions like switching databases or microservice integration.

- **Microservices-Based Frontend and Backend**  
  Split both frontend and backend into microservices/micro-frontends aligned to business capabilities or bounded contexts, each responsible for a standalone feature or domain area. This enhances scalability by enabling independent deployment, technology heterogeneity, and fault isolation.

- **Cloud-Native Infrastructure and Container Orchestration**  
  Utilize Google Cloud Platform (GCP) services such as Cloud Run or GKE for deploying containerized services with automated scaling and high availability. Implement Kubernetes-based orchestration for robust service discovery, load balancing, and rolling deployments.

- **Advanced CI/CD and Infrastructure as Code**  
  Automate build, test, and deployment pipelines with environment-specific strategies using GitHub Actions or Google Cloud Build. Use Terraform or Google Deployment Manager to define cloud infrastructure declaratively and ensure reproducible environments.

- **Observability and Monitoring**  
  Integrate centralized logging (e.g., Stackdriver), distributed tracing, and metrics collection to facilitate active monitoring, alerting, and performance tuning in production environments.

- **Security and Compliance**  
  Adopt comprehensive security practices like OAuth2/OpenID Connect for identity management, enforce API gateway patterns with rate limiting, and audit logging to meet compliance standards.

---

