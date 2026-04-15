# Watchables

A video streaming interface built as a **study project** to explore frontend prototyping, API integration, and AI-assisted development.

> **Disclaimer**: This project is strictly for **educational and non-commercial purposes**. It is not intended for piracy, redistribution of copyrighted content, or any commercial use. All media metadata is sourced from [TMDB](https://www.themoviedb.org/) and video playback is handled by [Vidking Player](https://www.vidking.net/). No content is hosted, stored, or distributed by this application.

## The Idea

Build a Netflix-style streaming UI from scratch — a single-page app where you can browse movies and TV shows, view details, search, manage favorites, track watch history, and resume playback. All user data lives in the browser's localStorage with zero backend.

## Tech Stack

- **React 18** + **TypeScript** — UI framework with full type safety
- **Vite** — Build tool and dev server
- **Tailwind CSS v4** — Utility-first styling with a dark cinematic theme
- **React Router v6** — Client-side routing (9 routes)
- **TanStack React Query** — Data fetching, caching, and state management
- **TMDB API v3** — Movie/TV metadata, posters, cast, genres, search
- **Vidking Player** — Embeddable video player via iframe with progress tracking
- **Vercel** — Hosting platform (SPA with rewrite rules)

## AI as a Development Tool

Built with **Claude Sonnet 4.6** (via GitHub Copilot) as a coding partner.

The goal was to explore what AI-assisted development actually looks like in practice. Not generating code and pasting it in — but treating AI as part of the workflow: I worked through the requirements, made design and architectural decisions, wrote and adjusted code, and used Claude to accelerate the heavier implementation work.

It's a small project for understanding how AI fits into a real development process — where it helps, where you still have to think, and what that collaboration actually produces.

## Running Locally

```bash
npm install
npm run dev
```

Requires a `.env` file with `VITE_TMDB_API_KEY` set to a valid [TMDB API key](https://www.themoviedb.org/settings/api).

## License

Educational use only. Not for commercial distribution.
