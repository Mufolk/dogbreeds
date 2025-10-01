# Dog Breeds Explorer

A full-stack application for exploring dog breeds with favorites functionality.

## Tech Stack
- **Backend**: Node.js with TypeScript and Express
- **Frontend**: Vue 3 with TypeScript and Vite
- **API**: Dog CEO API integration
- **Testing**: Jest (backend), Vitest (frontend)
- **Containerization**: Docker

## Features
- Browse all dog breeds
- View random images for each breed
- Add/remove breeds from favorites
- Persistent favorites storage

## Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Docker (optional)

## Quick Start

### Development Setup
1. Clone the repository
2. Install dependencies: `npm run install:all`
3. Start development servers: `npm run dev`
4. Open http://localhost:3000 for frontend
5. Backend API runs on http://localhost:3001

## Project Structure

dog-breeds-explorer/ 
├── backend/ # Node.js TypeScript API 
├── frontend/ # Vue 3 TypeScript app 
├── .github/ # CI/CD workflows 
└── docker-compose.yml # Development containers 


## Available Scripts
- `npm run dev` - Start both frontend and backend in development mode
- `npm run install:all` - Install dependencies for both apps
- `npm run test` - Run all tests
- `npm run build` - Build both applications for production

## API Endpoints
- `GET /api/breeds` - Get all dog breeds
- `GET /api/breeds/:breed/images` - Get images for a breed
- `POST /api/favorites` - Add breed to favorites
- `GET /api/favorites` - Get favorite breeds
- `DELETE /api/favorites/:breed` - Remove breed from favorites

## Contributing
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License
MIT