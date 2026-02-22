# Bellibox (Next.js Full-Stack)

Beli-style restaurant tracking with Letterboxd-style diary/feed, now implemented as a full-stack Next.js app.

## Run

```bash
npm install
npm run dev
```

Open: `http://localhost:3000`

## Environment Variables

Create `.env.local` from `.env.example` and set:

- `GOOGLE_MAPS_API_KEY` for Google Places search
- `JWT_SECRET` for secure auth tokens

## Demo Account

- Email: `demo@bellibox.app`
- Password: `demo123`

## What is implemented

- React/Next.js front-end app (tabs: Discover, Lists, Diary, Feed, Profile)
- Backend API routes under `app/api/*`
- Cookie-based auth (register/login/logout/me)
- Persistent JSON database at `data/db.json`
- Server-backed logs, watchlist, custom lists, profile updates, and feed
- Demo database reset endpoint (`POST /api/bootstrap`)
- Google Maps restaurant search endpoint (`GET /api/maps/search`)
- Place import endpoint (`POST /api/restaurants/import`) for Google/local/manual results
- Fallback local search results when `GOOGLE_MAPS_API_KEY` is not configured
