# GitHub Profile Analyzer API

A production-ready REST API built with Node.js, Express, MySQL, and Sequelize that fetches, analyzes, and stores GitHub profile statistics.

## Features
- Analyze and score GitHub profiles based on repositories, stars, and followers
- Compute advanced metrics (account age, most starred repo, languages used)
- View a leaderboard of top GitHub profiles
- API Rate Limiting, request validation, centralized error handling
- Interactive Swagger Documentation
- Docker & Docker Compose support for easy deployment

## Prerequisites
- Node.js (v18+)
- MySQL (v8.0+)
- Docker and Docker Compose (Optional)

## Installation (Local Development)

1. **Clone the repository** (if applicable) and enter the directory:
   ```bash
   cd github-profile-analyzer-api
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Environment Setup**:
   Copy the example environment file and fill in your details:
   ```bash
   cp .env.example .env
   ```
   > **Note**: Add a `GITHUB_TOKEN` to your `.env` to prevent GitHub API rate limiting.

4. **Start the Application**:
   Development mode (with nodemon):
   ```bash
   npm run dev
   ```
   Production mode:
   ```bash
   npm start
   ```

   *Note: On the first run, Sequelize will automatically create the `github_profiles` table in your MySQL database.*

## Installation (Docker)

1. Build and run using Docker Compose:
   ```bash
   docker-compose up -d --build
   ```
2. The API will be accessible at `http://localhost:3000`.

## API Documentation

Swagger UI is available when the server is running at:
**[http://localhost:3000/api-docs](http://localhost:3000/api-docs)**

### Available Endpoints
- `GET /health` - Health check
- `POST /api/github/analyze` - Analyze a new profile
- `GET /api/github/profiles` - List all analyzed profiles (supports pagination, search, sort)
- `GET /api/github/profiles/:username` - Get a specific profile
- `PUT /api/github/reanalyze/:username` - Re-fetch and update a profile
- `DELETE /api/github/profiles/:username` - Delete a profile
- `GET /api/github/top` - Get the top 10 profiles by score
- `GET /api/github/stats` - Get aggregated system stats

## Deployment

### Railway / Render
1. Connect your GitHub repository to Railway or Render.
2. In the project settings, set the **Build Command** to `npm install` and **Start Command** to `npm start`.
3. Provide the Environment Variables in the platform's dashboard (`DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `GITHUB_TOKEN`). Ensure your database is accessible remotely (e.g., a managed MySQL database).

### VPS (Ubuntu/Debian)
1. Install Docker and Docker Compose on the VPS.
2. Clone your code to the server.
3. Add your `.env` file.
4. Run `docker-compose up -d --build`.
5. (Recommended) Put Nginx in front of the API as a reverse proxy and configure SSL using Certbot.

## Database Schema
The database schema uses a `github_profiles` table. The raw SQL schema can be found in `database/schema.sql`.

## Postman Collection
A Postman collection is included in the `postman/` directory for quick testing. Import `GitHub_Profile_Analyzer.postman_collection.json` into Postman to test all available routes.
