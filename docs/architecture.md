# Tuon.ILO — Project Documentation

> A community-driven civic technology platform for discovering study spaces and cafes in Iloilo City.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack](#2-tech-stack)
3. [Project Structure](#3-project-structure)
4. [Environment Variables](#4-environment-variables)
5. [Database Schema](#5-database-schema)
6. [Features](#6-features)
   - [Public-Facing Map](#61-public-facing-map)
   - [Admin Dashboard](#62-admin-dashboard)
   - [Review System](#63-review-system)
   - [Moderation Queue](#64-moderation-queue)
7. [Data Flow](#7-data-flow)
8. [Admin Dashboard Routes](#8-admin-dashboard-routes)
9. [Build & Development](#9-build--development)
10. [Deployment](#10-deployment)
11. [Future Improvements](#11-future-improvements)

---

## 1. Project Overview

**Tuon.ILO** (from the Hiligaynon word *tuon*, meaning "to study") is a civic technology web platform that helps students, freelancers, and remote workers in Iloilo City find reliable places to study or work. Users can browse an interactive map, filter locations by amenities, read community reviews, and submit new spots for review.

The name is styled after a local domain — `Tuon.ILO` — positioning it as a dedicated, city-specific directory.

**Core problems it solves:**
- Students don't know which cafes have reliable free Wi-Fi
- No single resource lists study hubs with charging port availability
- No community-driven review system exists for this niche in Iloilo

---

## 2. Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| Frontend Framework | Next.js 14 (App Router) | Routing, SSR, API routes |
| Language | TypeScript | Type safety across the codebase |
| Styling | Tailwind CSS | Utility-first CSS |
| UI Components | shadcn/ui | Pre-built accessible components |
| Map | Mapbox GL JS via `react-map-gl` | Interactive map with custom pins |
| Database | Supabase (PostgreSQL) | Data storage and real-time queries |
| Validation | Zod | Schema validation for form submissions |
| Icons | Lucide React | Consistent icon library |
| Deployment | Vercel | Seamless Next.js hosting |

---

## 3. Project Structure

```
tuon-ilo/
├── app/
│   ├── page.tsx                  # Public map homepage
│   ├── layout.tsx                # Root layout
│   ├── globals.css               # Global styles
│   ├── admin/
│   │   ├── page.tsx              # Admin login page UI
│   │   ├── dashboard/
│   │   │   ├── page.tsx          # Admin overview
│   │   │   ├── add/
│   │   │   │   └── page.tsx      # Add new spot form
│   │   │   ├── queue/
│   │   │   │   └── page.tsx      # Pending submissions queue
│   │   │   └── manage/
│   │   │       └── page.tsx      # Edit/delete live spots
│   └── api/
│       └── admin/
│           ├── login/
│           │   └── route.ts      # Validates password, sets admin_session cookie
│           ├── approve/
│           │   └── route.ts      # Approves a pending location
│           ├── reject/
│           │   └── route.ts      # Deletes a pending location
│           ├── update/
│           │   └── route.ts      # Updates a live location's fields
│           └── delete/
│               └── route.ts      # Deletes a live location
├── components/
│   ├── map/
│   │   ├── MapView.tsx           # Main Mapbox map component
│   │   ├── MapPin.tsx            # Individual map pin marker
│   │   └── FilterBar.tsx         # Wi-Fi / outlet / type / noise filters
│   ├── location/
│   │   ├── LocationCard.tsx      # Sidebar card for a selected spot
│   │   ├── ReviewList.tsx        # List of reviews for a spot
│   │   └── ReviewForm.tsx        # Anonymous review submission form
│   ├── admin/
│   │   ├── AddLocationForm.tsx   # Admin form to add/edit a spot
│   │   ├── QueueItem.tsx         # Single pending submission card
│   │   └── ManageTable.tsx       # Table of live spots with actions
│   └── ui/                       # shadcn/ui auto-generated components
│       ├── button.tsx
│       ├── input.tsx
│       ├── label.tsx
│       ├── select.tsx
│       ├── badge.tsx
│       ├── card.tsx
│       ├── table.tsx
│       └── switch.tsx
├── lib/
│   ├── supabase.ts               # Supabase client initialization
│   ├── validations.ts            # Zod schemas for forms
│   └── utils.ts                  # Shared utility functions (ratings, badges, hours)
├── types/
│   └── index.ts                  # TypeScript interfaces and types
├── .env.local                    # Environment variables (never commit)
└── docs/
    ├── TUON_ILO_DOCS.md          # This file
    └── TUON_ILO_TIMELINE.md      # 2-week build timeline
```

---

## 4. Environment Variables

Create a `.env.local` file in the project root. **Never commit this file to GitHub.**

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_public_token
ADMIN_PASSWORD=your_chosen_admin_password
```

Where to get these:
- **Supabase URL & Anon Key** — Supabase dashboard → Project Settings → API
- **Mapbox Token** — mapbox.com → Account → Access Tokens
- **Admin Password** — a strong password you choose yourself; stored only in this file

---

## 5. Database Schema

Run the following SQL in your **Supabase SQL Editor** to set up the database.

### Enums

```sql
CREATE TYPE location_type AS ENUM ('STUDY_HUB', 'CAFE');
CREATE TYPE amenity_status AS ENUM ('FREE', 'PAID', 'NONE');
CREATE TYPE noise_level AS ENUM ('QUIET', 'MODERATE', 'LIVELY');
```

### Locations Table

The central table. Every map pin comes from here.

```sql
CREATE TABLE locations (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name             TEXT NOT NULL,
  type             location_type NOT NULL,
  latitude         FLOAT NOT NULL,
  longitude        FLOAT NOT NULL,
  wifi_status      amenity_status NOT NULL,
  charging_status  amenity_status NOT NULL,
  pricing_details  TEXT,
  contact_info     TEXT,
  image_url        TEXT,
  facebook_url     TEXT,
  instagram_url    TEXT,
  gmaps_url        TEXT,
  is_24_hours      BOOLEAN DEFAULT FALSE,
  opening_time     TIME,
  closing_time     TIME,
  noise_level      noise_level,
  is_approved      BOOLEAN DEFAULT FALSE,
  created_at       TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

| Column | Notes |
|---|---|
| `is_approved` | Defaults to `false`. Only `true` entries appear on the public map. Admin flips this to `true` after review. |
| `type` | Either `STUDY_HUB` (dedicated study space) or `CAFE` (coffee shop with study-friendly setup) |
| `wifi_status` | `FREE`, `PAID`, or `NONE` |
| `charging_status` | `FREE`, `PAID`, or `NONE` |
| `image_url` | URL to a photo of the location, stored via Supabase Storage |
| `facebook_url` | Facebook page link — most Iloilo cafes use FB as their primary online presence |
| `instagram_url` | Instagram profile link |
| `gmaps_url` | Google Maps link so users can get directions directly |
| `is_24_hours` | If `true`, opening/closing time is ignored and "Open 24 hours" is displayed |
| `opening_time` | Stored as `TIME` e.g. `08:00:00` |
| `closing_time` | Stored as `TIME` e.g. `22:00:00` |
| `noise_level` | `QUIET`, `MODERATE`, or `LIVELY` — useful filter for students needing silence |

### Reviews Table

User-submitted ratings and comments, linked to a location.

```sql
CREATE TABLE reviews (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  location_id  UUID REFERENCES locations(id) ON DELETE CASCADE,
  rating       INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment      TEXT,
  session_id   TEXT NOT NULL,
  created_at   TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

| Column | Notes |
|---|---|
| `session_id` | A browser-generated ID stored in localStorage. Used to prevent the same user from submitting multiple reviews for the same spot. |
| `rating` | Integer between 1 and 5. Average rating is **computed dynamically** via a SQL aggregation query — it is never stored as a column. |

### Mock Data (for local development)

```sql
INSERT INTO locations (name, type, latitude, longitude, wifi_status, charging_status, pricing_details, is_24_hours, opening_time, closing_time, noise_level, is_approved)
VALUES 
  ('Kape Tambayan', 'CAFE', 10.9575, 123.3086, 'FREE', 'PAID', 'Must buy a drink', FALSE, '07:00:00', '22:00:00', 'MODERATE', TRUE),
  ('Focus Study Hub', 'STUDY_HUB', 10.9580, 123.3100, 'FREE', 'FREE', '₱50/hr', FALSE, '08:00:00', '23:00:00', 'QUIET', TRUE),
  ('Night Owl Roasters', 'CAFE', 10.9560, 123.3050, 'PAID', 'NONE', 'Menu items ₱100–200', TRUE, NULL, NULL, 'LIVELY', TRUE);
```

---

## 6. Features

### 6.1 Public-Facing Map

- Interactive Mapbox map centered on Iloilo City
- Color-coded pins: one color for `CAFE`, another for `STUDY_HUB`
- Clicking a pin opens a sidebar card showing:
  - Name, type, pricing details, contact info
  - Photo of the location (if uploaded)
  - Wi-Fi and charging status badges
  - Noise level badge (Quiet / Moderate / Lively)
  - Opening hours or "Open 24 hours"
  - Links to Facebook, Instagram, and Google Maps
  - Average star rating (computed from reviews)
  - List of community reviews
  - "Leave a review" form
- Filter bar at the top to filter by:
  - Location type (`CAFE` / `STUDY_HUB`)
  - Wi-Fi status (`FREE` / `PAID` / `NONE`)
  - Charging status (`FREE` / `PAID` / `NONE`)
  - Noise level (`QUIET` / `MODERATE` / `LIVELY`)
- "Submit a spot" button opens a form for public submissions (lands in moderation queue)
- No login required for any of the above

### 6.2 Admin Dashboard

Accessible at `/admin`. Protected by a password check against `ADMIN_PASSWORD` in `.env.local`.

**Add a Spot (`/admin/dashboard/add`)**
- Full form with all location fields
- Submission auto-sets `is_approved = true` — goes live on the map immediately
- No moderation queue step for admin-added spots

**Pending Queue (`/admin/dashboard/queue`)**
- Lists all locations where `is_approved = false`
- Each entry shows submitted data for review
- **Approve** button: sets `is_approved = true`, pin appears on map
- **Reject** button: deletes the record permanently

**Manage Spots (`/admin/dashboard/manage`)**
- Table of all live (`is_approved = true`) locations
- Edit button: opens pre-filled form to update any field
- Delete button: permanently removes the location and all its reviews (cascades via foreign key)

### 6.3 Review System

- Anyone can leave a review without logging in
- A `session_id` is generated on first visit and stored in the browser
- Before submitting, the app checks if a review from this `session_id` already exists for that `location_id` — if yes, the form is blocked with a "You've already reviewed this place" message
- Average rating is calculated with:

```sql
SELECT AVG(rating) FROM reviews WHERE location_id = $1;
```

- This runs every time a location card is opened — always reflects the latest reviews

### 6.4 Moderation Queue

All public spot submissions go into the queue with `is_approved = false`. This protects the live map from:
- Spam or fake locations
- Incorrect coordinates
- Duplicate entries
- Malicious or irrelevant submissions

Only the admin can promote a submission to live. The admin can also add spots directly, bypassing the queue entirely.

---

## 7. Data Flow

### Public user views the map
```
Browser → Next.js page → Supabase query (WHERE is_approved = true) → Mapbox renders pins
```

### Public user submits a spot
```
Browser form → Zod validation → Supabase INSERT (is_approved = false) → Sits in queue
```

### Public user leaves a review
```
Browser → Check session_id against reviews table → If no duplicate → INSERT into reviews
```

### Admin approves a spot
```
Admin dashboard → Supabase UPDATE SET is_approved = true → Pin appears on public map
```

### Average rating is displayed
```
Location card opens → Supabase SELECT AVG(rating) WHERE location_id = X → Rendered in card
```

---

## 8. Admin Dashboard Routes

| Route | Purpose | Auth Required |
|---|---|---|
| `/admin` | Password login gate | No |
| `/admin/dashboard` | Overview and navigation | Yes |
| `/admin/dashboard/add` | Add a new spot (auto-approved) | Yes |
| `/admin/dashboard/queue` | Review pending submissions | Yes |
| `/admin/dashboard/manage` | Edit or delete live spots | Yes |

**Auth implementation note:** This project uses a simple password check for the admin — not a full auth system. The password is stored in `.env.local` as `ADMIN_PASSWORD` and checked server-side in a Next.js Route Handler. A session cookie is set on success. This is sufficient for a solo-admin civic tech project.

---

## 9. Build & Development

### Install dependencies
```bash
npm install
```

### Run development server
```bash
npm run dev
```

### Build for production
```bash
npm run build
```

### Key scripts
```bash
npm run dev       # Local dev at localhost:3000
npm run build     # Production build
npm run start     # Start production server locally
npm run lint      # Run ESLint
```

---

## 10. Deployment

This project is deployed on **Vercel**.

1. Push your repo to GitHub
2. Go to [vercel.com](https://vercel.com) and import the `tuon-ilo` repository
3. In Vercel's project settings, add all four environment variables from `.env.local`
4. Deploy — Vercel auto-detects Next.js and handles the build

Every `git push` to `main` triggers an automatic redeployment.

---

## 11. Future Improvements

These are features not in the initial build but worth adding later:

| Feature | Description |
|---|---|
| Admin analytics | Simple dashboard showing total spots, reviews per week, top-rated locations |
| Email notifications | Notify admin via email when a new spot is submitted |
| PostGIS radius search | "Find spots within 1km of me" using GPS + Supabase PostGIS extension |
| Report a review | Let users flag suspicious or spam reviews for admin removal |
| "Open now" filter | Filter the map to only show spots currently open based on their hours |
| Mobile app | React Native version using the same Supabase backend |

---

*Last updated: June 2026 — expanded schema with image, social links, hours, and noise level*
*Author: Tuon.ILO project*