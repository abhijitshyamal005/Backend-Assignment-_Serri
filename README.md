# Backend Assignment _Serri

This repository contains the backend and frontend code for the Serri assignment.

## Project Structure

```
backend/
    package.json
    README.md
    Dockerfile
    .dockerignore
    src/
        app.js
        config.js
        models/
            video.js
        routes/
            videos.js
        services/
            youtubeFetcher.js
        utils/
            apiKeyManager.js
frontend/
    index.html
    package.json
    README.md
    Dockerfile
    .dockerignore
    vite.config.js
    src/
        App.css
        App.jsx
        main.jsx
```

## Getting Started

### Prerequisites
- Node.js (v16+ recommended)
- MongoDB instance (local or Docker)
- YouTube Data API v3 keys (multiple, comma-separated)

### Environment Variables
Create a `.env` file in the root or `backend/` directory with the following content:

```
YOUTUBE_API_KEYS=your_key1,your_key2
YOUTUBE_SEARCH_QUERY=official
MONGO_URI=mongodb://localhost:27017/serri
PORT=3000
FETCH_INTERVAL=10000
```

### Backend
1. Navigate to the `backend` folder:
   ```sh
   cd backend
   npm install
   npm start
   ```
   Or use Docker:
   ```sh
   docker-compose up --build
   ```

### Frontend
1. Navigate to the `frontend` folder:
   ```sh
   cd frontend
   npm install
   npm run dev
   ```
   Or use Docker:
   ```sh
   docker build -t frontend ./frontend
   docker run -p 5173:5173 frontend
   ```

## API Endpoints
- `GET /videos?page=1&limit=20` — Paginated, sorted videos
- `GET /videos/search?q=your+query&page=1&limit=20&source=db` — Search videos by title/description

## Features
- Background fetcher for latest YouTube videos (every 10 seconds)
- Stores videos with title, description, publishedAt, thumbnails, etc.
- Multiple API key support (auto-rotate on quota exhaustion)
- Dockerized backend and frontend
- Optimized search with MongoDB text indexes

---

For more details, see `backend/README.md` and `frontend/README.md`.



