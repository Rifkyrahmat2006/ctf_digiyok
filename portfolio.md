## 🧪 CTF Digiyok — Jeopardy-Style Capture The Flag Platform

**Tech Stack:** Laravel 12 · PHP 8.2 · React 19 (TypeScript) · Inertia.js · Tailwind CSS v4 · Laravel Reverb (WebSocket) · MySQL · Vite · Radix UI · Pusher-JS

**Description:**
A full-stack, team-based Capture The Flag (CTF) competition platform built for cybersecurity events. Designed with a Jeopardy-style challenge structure, the system enables admins to fully manage events, challenges, teams, and participants while providing competitors with a real-time scoreboard and flag submission interface. The frontend is rendered as a SPA via Inertia.js with no separate API layer, and real-time updates are pushed via Laravel Reverb WebSockets.

**Impact:**
- Eliminated manual scorekeeping by automating team-based scoring with server-side flag validation using hashed comparisons — flags are never exposed to the client
- Real-time scoreboard powered by Laravel Reverb delivers live rank updates on every successful solve, removing the need for polling or page refreshes
- Rate-limiting (1 submission per 3 seconds per team) prevents brute-force flag guessing at the infrastructure level
- Race condition safeguards ensure a challenge can only be solved once per team, even under concurrent submissions
- Admin-controlled user/team provisioning eliminates public registration attack surface while remaining architecturally extensible

**Key Contributions & Features:**
- **Admin Panel:** Full CRUD for users, teams, challenges, and events; submission log visibility; publish/unpublish challenge toggles; writeup management
- **Real-time Scoreboard:** Event-driven (`ScoreboardUpdated`) broadcast via `scoreboard.global` WebSocket channel, surfacing team rank, score, and last solve time
- **Secure Flag Submission:** Server-side hash comparison (SHA/bcrypt), case-sensitive matching, one-solve-per-team enforcement, incorrect attempts logged without score penalty
- **Challenge System:** Category-based challenges (Web, Crypto, Forensic, Reverse, Misc) with fixed scoring, optional inter-challenge dependencies, and per-challenge publish control
- **Writeup Module:** Post-event writeup submission and review per challenge, supporting knowledge sharing among participants
- **Countdown Timer:** Event time management with real-time countdown displayed to participants
- **Role-based Access Control:** Middleware-enforced `admin` vs `participant` roles — admins are fully isolated from competition scoring
- **File Upload Support:** Challenge attachments with server-side validation and storage
- **SPA Architecture:** Inertia.js + React 19 with TypeScript delivers a seamless single-page experience without a separate REST/GraphQL API, reducing round-trips and complexity
