# ORACLE — The Divine Matching

> *Musica Divina · Sacred Sound Matching*

A Progressive Web App (PWA) that analyses your music listening history and assigns you a Greek god archetype, then guides you through a personalised nightlife route across Southampton venues.

Built for **SotonHack 2026**.

---

## Features

- **Archetype Divination** — Google Gemini AI classifies your Spotify recently-played tracks into one of five Greek god archetypes (Zeus, Dionysus, Ares, Demeter, Athena)
- **Sacred Route Planning** — Google Maps turn-by-turn navigation through curated Southampton venues
- **War Council Chat** — tribe messaging with scheduled oracle prophecy notifications
- **Quest & Achievement System** — 12 quests across music, social, and exploration categories
- **Profile Analytics** — radar chart of music dimensions (Energy, Rhythm, Complexity, Darkness, Emotion) powered by Spotify data
- **8-bit Pixel Mode** — canvas-based CRT/scanline visual filter
- **Offline Support** — Service Worker caches static assets for PWA install

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Vanilla JS (ES6+), HTML5, CSS3, Canvas API |
| Backend | Node.js, Express.js |
| AI | Google Gemini API (music taste classification) |
| Maps | Google Maps JavaScript API |
| Auth | Spotify PKCE, Google OAuth2 |
| PWA | Web App Manifest, Service Worker |

---

## Project Structure

```
oracle-divine-matching/
│
├── server.js              # Express server — API proxy & static file serving
├── package.json
├── .env.example           # Environment variable template (copy to .env)
├── .gitignore
│
└── client/                # Frontend static root (served by Express)
    │
    ├── index.html             # App shell — all screens and layout
    ├── manifest.json          # PWA manifest
    ├── sw.js                  # Service Worker — offline caching
    ├── spotify-callback.html  # Spotify OAuth redirect handler
    ├── map.html               # Standalone map view
    │
    ├── js/
    │   └── app.js             # All client-side logic (auth, maps, quests, chat)
    │
    ├── css/
    │   └── styles.css         # Skeuomorphic temple UI — all styles
    │
    └── assets/
        ├── icons/             # PWA home-screen icons (192px, 512px)
        ├── gods/              # God artwork — zeus, ares, athena, demeter, dionysus
        ├── profiles/          # Tribe member avatars (pfp1 – pfp5)
        ├── locations/         # Venue photography (14 Southampton venues)
        └── ui/                # All other UI assets — backgrounds, logos,
                               #   nav icons, rune glyphs, service logos
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- API keys (see [API Keys](#api-keys) below)

### Installation

```bash
git clone https://github.com/your-username/oracle-divine-matching.git
cd oracle-divine-matching
npm install
```

### Configuration

```bash
cp .env.example .env
```

Open `.env` and fill in your credentials:

```env
GEMINI_API_KEY=your_key_here
GOOGLE_MAPS_API_KEY=your_key_here
SPOTIFY_CLIENT_ID=your_client_id_here
GOOGLE_CLIENT_ID=your_client_id_here
```

### Running

```bash
# Production
npm start

# Development (auto-restarts on file change, Node 18+)
npm run dev
```

The app is available at `http://localhost:3000`.

---

## API Keys

| Key | Where to get it | Notes |
|---|---|---|
| `GEMINI_API_KEY` | [Google AI Studio](https://aistudio.google.com) | Server-side only — never sent to the browser |
| `GOOGLE_MAPS_API_KEY` | [Google Cloud Console](https://console.cloud.google.com) — Maps JavaScript API | Injected into HTML at request time by the server |
| `SPOTIFY_CLIENT_ID` | [Spotify Developer Dashboard](https://developer.spotify.com/dashboard) | Public PKCE client — safe to expose |
| `GOOGLE_CLIENT_ID` | Google Cloud Console — OAuth 2.0 credentials | Public OAuth client — safe to expose |

> Add your deployment domain to the allowed origins/redirect URIs in both the Spotify and Google developer consoles.

---

## Deployment

The app is a standard Node.js/Express application and can be deployed to any platform that runs Node.

### Render / Railway / Fly.io

1. Push your repository (without `.env`) to GitHub.
2. Create a new **Web Service** pointing at your repo.
3. Set environment variables (`GEMINI_API_KEY`, `GOOGLE_MAPS_API_KEY`, etc.) in the platform dashboard.
4. Set the start command to `npm start`.

> Never commit `.env`. Set secrets via the platform's environment variable UI so they are encrypted at rest and not visible in your git history.

---

## Architecture Notes

- The Express server is a **thin proxy**: it injects the Google Maps API key into `index.html` at request time (so the key never appears in source control), and forwards music analysis requests to the Gemini API (so the Gemini key never reaches the browser).
- All application state (Spotify tokens, archetype, quest progress) lives in `localStorage` / `sessionStorage`. There is no persistent backend database.
- The Service Worker caches the core static shell for offline use; API and CDN calls are always network-first.

---

## Archetypes

| God | Music Profile |
|---|---|
| Zeus | Orchestral / Cinematic |
| Dionysus | House / Electronic |
| Ares | Rock / Hard Rock |
| Demeter | Folk / Acoustic |
| Athena | Instrumental / Ambient |

---

## License

MIT
