# YouTube Videos Dashboard (Frontend)

A simple React dashboard to view, search, and paginate YouTube videos fetched by the backend.

## Setup

1. Go to the `frontend` folder:
   ```sh
   cd frontend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the development server:
   ```sh
   npm run dev
   ```
   The app will open at http://localhost:5173 (or similar).

- The frontend proxies API requests to the backend at http://localhost:3000.
- Make sure the backend is running and accessible.

## Features
- Search videos by title or description (multi-word, partial match)
- Pagination and page size selection
- View video details and open on YouTube

## Docker

A `Dockerfile` is provided for containerized frontend development. To build and run:

```sh
cd frontend
# Build image
# docker build -t frontend .
# Run container (map port 5173)
# docker run -p 5173:5173 frontend
```

The frontend expects the backend to be available at `http://localhost:3000` (or update the API URL in the code if needed).
