# Beat App

Beat App is a modern, responsive web-based music player. Built with React and Vite, it allows users to search for tracks, artists, and albums, manage a playback queue, and stream audio seamlessly. The application leverages Material-UI (MUI) for a sleek, premium design and integrates tightly with the browser's Media Session API to provide native-feeling playback controls.

## Features

- **Music Playback & Streaming:** Stream audio tracks fetched via a custom API and proxy.
- **Search System:** Dedicated search interfaces for tracks, albums, and artists.
- **Queue Management:** Add songs to the queue, play next, play previous, and view the persistent queue drawer.
- **Media Controls Integration:** Play, pause, seek, and skip tracks right from your OS or browser's built-in media controls.
- **Responsive Design:** A premium UI built with Material-UI (MUI) and styled using Emotion.
- **State Management:** Efficient, reactive state management across components using Nanostores.

## Technologies Used

- **Frontend Framework:** React 18, Vite
- **Routing:** React Router DOM
- **UI & Styling:** Material-UI (MUI), Emotion, Custom CSS
- **State Management:** Nanostores (`@nanostores/react`)
- **API Interfacing:** Axios, Native Fetch
- **Containerization & Deployment:** Docker, Docker Compose, NGINX

## Project Structure

```text
beat-app/
├── public/                 # Public assets
├── src/
│   ├── assets/             # Images and local static assets
│   ├── components/         # Reusable React components (Player, TrackList, Search grids, etc.)
│   ├── hooks/              # Custom React hooks (if any)
│   ├── layouts/            # Page layout wrappers
│   ├── pages/              # Main route pages (ArtistPage, AlbumPage, Search results)
│   ├── services/           # External API communications (e.g., youtube-api.js)
│   ├── stores/             # Application global and player state (playerStore.js)
│   ├── App.jsx             # Root application component
│   ├── main.jsx            # React entry point
│   ├── audioEl.js          # Shared HTMLAudioElement instantiation
│   └── routes.jsx          # App routing configuration
├── .dockerignore           # Docker ignore file
├── .env.example            # Environment variables template
├── Dockerfile              # Docker building instructions
├── docker-compose.yml      # Service definitions for Docker Compose
├── nginx.conf              # NGINX configuration for serving the built app
├── package.json            # Node module dependencies and scripts
└── vite.config.js          # Vite bundler configuration
```

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm or yarn

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Copy `.env.example` to `.env` and configure any required environment variables.

### Running Development Server

Start the Vite development server:
```bash
npm run dev
```

### Production Build

Build the app for production:
```bash
npm run build
```

Preview the production build locally:
```bash
npm run preview
```

## Deployment Support

The project comes with a completely configured `Dockerfile` and `docker-compose.yml` to run via Nginx. You can easily deploy it by running:
```bash
docker-compose up -d --build
```
This will build the static files and serve them statically over an Nginx web server.
