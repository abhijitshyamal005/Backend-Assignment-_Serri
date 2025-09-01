# YouTube Video Fetcher Backend

## Overview

Fetches latest YouTube videos for a given search query/tag, stores them in MongoDB, and provides paginated and search APIs. Built with Node.js, Express, and MongoDB.

## Features

- Background fetcher for latest YouTube videos (every 10 seconds)
- Stores videos with title, description, publishedAt, thumbnails, etc.
- GET /videos: Paginated, sorted by publishedAt (desc)
- GET /videos/search?q=: Search by title/description (partial, multi-word)
- Multiple API key support (auto-rotate on quota exhaustion)
- Dockerized for easy deployment
- Optimized search with MongoDB text indexes

## Quick Start

### 1. Install dependencies

```sh
cd backend
npm install
```

### 2. Configure

- Copy your YouTube Data API keys into `.env` (comma-separated if multiple)
- Set your search query/tag in `.env`
- Make sure MongoDB is running locally (default: mongodb://localhost:27017/serri)

### 3. Run the server

```sh
npm start
```

Or use Docker Compose:

```sh
docker-compose up --build
```

### 4. API Endpoints

- `GET /videos?page=1&limit=20` — Paginated, sorted videos
- `GET /videos/search?q=your+query&page=1&limit=20&source=db` — Search videos by title/description

## Environment Variables

- `YOUTUBE_API_KEYS` — Comma-separated YouTube API keys
- `YOUTUBE_SEARCH_QUERY` — Search query/tag (e.g. cricket)
- `MONGO_URI` — MongoDB connection string
- `PORT` — Server port (default: 3000)
- `FETCH_INTERVAL` — Fetch interval in ms (default: 10000)

## Docker

A `Dockerfile` and `docker-compose.yml` are provided for easy setup. See root `README.md` for usage instructions.

---

For frontend instructions, see `../frontend/README.md` and the root `README.md`.

## Scripts

- `npm start` — Start the backend server (production mode)
- `npm run dev` — (If available) Start the backend in development mode (e.g., with nodemon)

> For the frontend, use `npm run dev` to start the Vite development server.
