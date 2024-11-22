# Movie Database API

A RESTful API for managing movies, user authentication, and watchlists built with Node.js, Express, and TypeScript.

## Tech Stack
- Node.js & TypeScript
- Express.js
- PostgreSQL
- Redis
- Docker
- Swagger

## Project Structure
```
src/
├── config/           # App configuration
├── controllers/      # Request handlers
├── models/           # Database models
├── routes/           # API routes
├── services/         # Business logic
├── repositories/     # Database Queries
├── utils/            # Helpers & utilities
└── app.ts            # application entrypoint
```

## API Features
- User authentication (JWT)
- Movie management
- Watchlist functionality
- Rating system
- Redis caching
- Swagger documentation

## Prerequisites

- Docker
- Docker Compose

## Quick Start with Docker

1. Clone the repository:
```sh
git clone https://github.com/your-username/movies-db.git
cd movies-db
```
2. Configure environment variables:
```
cp .env.example .env
# Edit .env with your configuration
```
3. Build and run the Docker containers:
```
docker-compose up --build
```
This will start the following services:

- app: The Node.js application.
- db: PostgreSQL database.
- redis: Redis server.

4. Access the API documentation:
Open your browser and navigate to http://localhost:8080/api-docs to view the Swagger API documentation.

## Running Tests
To run the tests, open a terminal in the main directory and run the following commands:
```
npm install
npm test
npm run test:coverage
```

