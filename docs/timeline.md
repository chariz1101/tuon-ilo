# Tuon.ILO — 2-Week Build Timeline

> Target: A fully functional, deployable civic tech web app in 14 days.
> Assumes ~2–4 hours of focused coding per day.

---

## Overview

| Week | Focus |
|---|---|
| Week 1 | Foundation + Admin Dashboard |
| Week 2 | Public Map + Reviews + Polish + Deploy |

---

## Week 1 — Foundation & Admin Dashboard

The goal of Week 1 is to have a working backend and a fully functional admin panel. By end of Day 7, you should be able to add, approve, edit, and delete spots — even before the public map exists.

---

### Day 1 — Project Setup & Supabase

**Goal:** Get the app running locally and connected to the database.

- [/] Confirm Next.js project runs (`npm run dev` shows default page)
- [/] Create Supabase project named `tuon-ilo`
- [/] Run the SQL schema in Supabase SQL Editor (enums + locations + reviews tables)
- [/] Insert the 3 mock data rows for testing
- [/] Create `.env.local` with Supabase URL, anon key, Mapbox token, and admin password
- [/] Create `lib/supabase.ts` — initialize and export the Supabase client
- [/] Create `types/index.ts` — define `Location` and `Review` TypeScript interfaces
- [/] Confirm Supabase connection works (write a quick test query in a page, log result to console)
- [/] Push to GitHub: `feat: supabase setup and schema`

---

### Day 2 — Project Structure & Shared Utilities

**Goal:** Set up the folder structure and shared code so everything is organized before building features.

- [/] Create the full folder structure as defined in the docs (`app/`, `components/`, `lib/`, `types/`)
- [/] Create `lib/validations.ts` — write Zod schemas for the location form and review form
- [/] Create `lib/utils.ts` — add helper functions (e.g. format average rating, badge color logic)
- [ ] Initialize shadcn/ui (`npx shadcn-ui@latest init`)
- [ ] Install and configure shadcn components you'll need: `Button`, `Input`, `Label`, `Select`, `Badge`, `Card`, `Table`
- [ ] Set up a root layout in `app/layout.tsx` with a basic font and background color
- [ ] Push to GitHub: `feat: project structure and shared utilities`

---

### Day 3 — Admin Auth Gate

**Goal:** Build the `/admin` password login page so the dashboard is protected.

- [ ] Create `app/admin/page.tsx` — the login page UI (password input + submit button)
- [ ] Create a Next.js Route Handler `app/api/admin/login/route.ts`
  - Accepts POST with `{ password }`
  - Compares against `process.env.ADMIN_PASSWORD`
  - On success: sets an `admin_session` cookie and returns 200
  - On failure: returns 401
- [ ] On the login page, call the API route on form submit
- [ ] On success, redirect to `/admin/dashboard`
- [ ] Create `app/admin/dashboard/page.tsx` — a simple placeholder overview page for now
- [ ] Add middleware or a server-side check so `/admin/dashboard/*` redirects to `/admin` if the cookie is missing
- [ ] Test: correct password → dashboard. Wrong password → error message shown.
- [ ] Push to GitHub: `feat: admin auth gate with cookie session`

---

### Day 4 — Add Spot Form (Admin)

**Goal:** Admin can add a new location that goes live on the map immediately.

- [ ] Create `components/admin/AddLocationForm.tsx`
  - Fields: Name, Type (CAFE / STUDY_HUB), Latitude, Longitude, Wi-Fi Status, Charging Status, Pricing Details, Contact Info, Image URL, Facebook URL, Instagram URL, Google Maps URL, Noise Level, Is 24 Hours, Opening Time, Closing Time
  - Show/hide opening and closing time fields based on the `is_24_hours` toggle
  - Use shadcn `Input`, `Select`, `Switch`, and `Button` components
  - Validate with Zod schema on submit
- [ ] Create `app/admin/dashboard/add/page.tsx` — renders the form
- [ ] On valid submit, run a Supabase INSERT with `is_approved: true`
- [ ] Show a success message and reset the form after submission
- [ ] Add a navigation bar to the admin dashboard linking to: Add Spot / Queue / Manage
- [ ] Test: fill form → submit → check Supabase table for new row with `is_approved = true`
- [ ] Push to GitHub: `feat: admin add spot form`

---

### Day 5 — Moderation Queue

**Goal:** Admin can see pending public submissions and approve or reject them.

- [ ] Create `app/admin/dashboard/queue/page.tsx`
  - Server component: fetch all locations where `is_approved = false`
  - Render each as a `QueueItem` card
- [ ] Create `components/admin/QueueItem.tsx`
  - Shows all submitted fields
  - Two buttons: **Approve** and **Reject**
- [ ] Create Route Handler `app/api/admin/approve/route.ts`
  - Accepts POST with `{ id }`
  - Runs `UPDATE locations SET is_approved = true WHERE id = $1`
- [ ] Create Route Handler `app/api/admin/reject/route.ts`
  - Accepts POST with `{ id }`
  - Runs `DELETE FROM locations WHERE id = $1`
- [ ] After approve or reject, refresh the queue list
- [ ] Show "No pending submissions" state when queue is empty
- [ ] Test: insert a row manually with `is_approved = false` → approve it → confirm it disappears from queue
- [ ] Push to GitHub: `feat: moderation queue with approve and reject`

---

### Day 6 — Manage Live Spots (Edit & Delete)

**Goal:** Admin can edit any field of a live spot, or permanently delete it.

- [ ] Create `app/admin/dashboard/manage/page.tsx`
  - Fetch all locations where `is_approved = true`
  - Render as a table using shadcn `Table` component
  - Columns: Name, Type, Wi-Fi, Charging, Actions
- [ ] Create `components/admin/ManageTable.tsx`
- [ ] Add **Delete** button per row
  - Calls Route Handler `app/api/admin/delete/route.ts`
  - Runs `DELETE FROM locations WHERE id = $1`
  - Confirm before deleting (simple `window.confirm` dialog is fine for now)
- [ ] Add **Edit** button per row
  - Opens the same `AddLocationForm` but pre-filled with existing data
  - On submit, runs `UPDATE` instead of `INSERT`
- [ ] Create Route Handler `app/api/admin/update/route.ts`
- [ ] Push to GitHub: `feat: manage live spots with edit and delete`

---

### Day 7 — Admin Polish & Buffer Day

**Goal:** Clean up the admin dashboard, fix bugs, and catch up on anything from Days 1–6.

- [ ] Style the admin dashboard consistently (Tailwind — keep it clean and minimal, not fancy)
- [ ] Add loading states to all buttons (disable button + show spinner while awaiting API)
- [ ] Add error handling — show error messages if any API call fails
- [ ] Make the admin dashboard mobile-friendly (basic responsive layout)
- [ ] Review all Route Handlers — make sure unauthenticated requests are rejected
- [ ] Do a full end-to-end test of the admin flow:
  - Login → Add spot → View on manage page → Edit it → Go to queue → Approve a pending item → Delete a spot
- [ ] Push to GitHub: `feat: admin dashboard polish and error handling`

---

## Week 2 — Public Map, Reviews & Deployment

The goal of Week 2 is to build everything the public sees: the interactive Mapbox map, location detail cards, the review system, the public spot submission form, and finally deploy it to Vercel.

---

### Day 8 — Mapbox Setup & Basic Map

**Goal:** Get an interactive map rendering on the screen with pins from the database.

- [ ] Get your Mapbox public token and add it to `.env.local`
- [ ] Create `components/map/MapView.tsx`
  - Initialize `react-map-gl` map centered on Iloilo City (`lng: 122.5644, lat: 10.7202`, zoom 13)
  - Fetch all `is_approved = true` locations from Supabase
  - Render a `<Marker>` for each location
- [ ] Create `components/map/MapPin.tsx` — a styled SVG pin (different colors for CAFE vs STUDY_HUB)
- [ ] Render `MapView` in `app/page.tsx`
- [ ] Confirm: map loads, pins appear at correct coordinates
- [ ] Push to GitHub: `feat: mapbox map with location pins`

---

### Day 9 — Location Detail Sidebar

**Goal:** Clicking a pin opens a sidebar showing full location details and average rating.

- [ ] Add `onClick` to each `<Marker>` — sets a `selectedLocation` state
- [ ] Create `components/location/LocationCard.tsx`
  - Shows: Name, type badge, Wi-Fi badge, Charging badge, Noise Level badge, pricing details
  - Shows location photo if `image_url` is present
  - Shows opening hours or "Open 24 hours" based on `is_24_hours`
  - Shows icon links to Facebook, Instagram, and Google Maps if URLs are present
  - Fetches and displays average rating: `SELECT AVG(rating) FROM reviews WHERE location_id = $1`
  - Renders star display (e.g. ★★★☆☆)
  - Close button to deselect
- [ ] Render `LocationCard` as a sidebar panel when `selectedLocation` is set
- [ ] Style the sidebar so it overlays the map cleanly (fixed position, scrollable)
- [ ] Test: click each mock pin → sidebar shows correct data
- [ ] Push to GitHub: `feat: location detail sidebar`

---

### Day 10 — Filter Bar

**Goal:** Users can filter visible pins by type, Wi-Fi status, and charging status.

- [ ] Create `components/map/FilterBar.tsx`
  - Four filter groups: Type, Wi-Fi, Charging, Noise Level
  - Each option is a toggle button (shadcn `Badge` or `Button` variant)
  - Active filter is visually highlighted
- [ ] Lift filter state to `app/page.tsx`
- [ ] Apply filters client-side — filter the locations array before passing to `MapView`
- [ ] "Clear filters" button resets all filters
- [ ] Test: toggle Noise Level QUIET → only quiet spots show pins
- [ ] Push to GitHub: `feat: filter bar for map pins`

---

### Day 11 — Review System

**Goal:** Users can read and submit reviews for any location.

- [ ] Create `components/location/ReviewList.tsx`
  - Fetches all reviews for `selectedLocation.id`
  - Displays each as a card: stars, comment, relative date
  - Shows "No reviews yet" if empty
- [ ] Create `components/location/ReviewForm.tsx`
  - Fields: star rating (1–5 clickable stars), comment (textarea)
  - On mount, generate or retrieve `session_id` from `localStorage`
  - Before showing form, check if a review from this `session_id` already exists for this location
  - If duplicate: show "You've already reviewed this place" instead of the form
  - On submit: Zod validate → Supabase INSERT into `reviews`
  - After submit: refresh `ReviewList` and update average rating display
- [ ] Add `ReviewList` and `ReviewForm` inside `LocationCard`
- [ ] Test: submit review → star average updates → try submitting again → blocked
- [ ] Push to GitHub: `feat: review system with duplicate prevention`

---

### Day 12 — Public Spot Submission Form

**Goal:** Anyone can submit a new spot, which lands in the admin moderation queue.

- [ ] Add a "Submit a Spot" button on the homepage (floating button or in a navbar)
- [ ] Create a modal or drawer containing the public submission form
  - Same fields as the admin Add Spot form, minus the auto-approve logic
  - Supabase INSERT with `is_approved: false`
- [ ] After submit: show a "Thanks! Your submission is under review." confirmation
- [ ] Validate with Zod before submitting
- [ ] Test: submit a spot → check Supabase → `is_approved = false` → appears in admin queue
- [ ] Push to GitHub: `feat: public spot submission form`

---

### Day 13 — UI Polish & Responsive Design

**Goal:** The app looks clean and works well on mobile.

- [ ] Design the homepage layout properly:
  - Full-screen map as the base layer
  - Filter bar pinned to the top
  - Sidebar slides in from the right on desktop, bottom sheet on mobile
  - "Submit a Spot" as a floating action button (bottom right)
- [ ] Ensure the map resizes correctly on all screen sizes
- [ ] Polish the `LocationCard` sidebar — spacing, typography, badge colors
- [ ] Polish the `FilterBar` — active states, clear button
- [ ] Polish the `ReviewForm` — interactive star selector (clickable, not just a number input)
- [ ] Add a simple header/navbar with the Tuon.ILO logo/name and tagline
- [ ] Test on mobile viewport in Chrome DevTools
- [ ] Push to GitHub: `feat: responsive layout and UI polish`

---

### Day 14 — Deployment & Final Testing

**Goal:** The app is live on a public URL and fully tested end-to-end.

- [ ] Do a final check of `.gitignore` — confirm `.env.local` is NOT committed
- [ ] Run `npm run build` locally — fix any TypeScript or build errors
- [ ] Go to [vercel.com](https://vercel.com) → Import `tuon-ilo` GitHub repo
- [ ] Add all environment variables in Vercel project settings:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `NEXT_PUBLIC_MAPBOX_TOKEN`
  - `ADMIN_PASSWORD`
- [ ] Deploy and open the live URL
- [ ] Full end-to-end test on the live site:
  - [ ] Map loads with pins
  - [ ] Filters work
  - [ ] Click pin → sidebar opens with correct data
  - [ ] Submit a review → average rating updates
  - [ ] Duplicate review is blocked
  - [ ] Submit a public spot → appears in admin queue
  - [ ] Login to `/admin` → approve the submitted spot → pin appears on map
  - [ ] Edit a spot → changes reflect on map
  - [ ] Delete a spot → pin disappears
- [ ] Write the final `README.md` (use the template from the main docs)
- [ ] Push final commit: `chore: production deployment and readme`
- [ ] Share the live link 🎉

---

## Summary Checklist

| Day | Deliverable | Status |
|---|---|---|
| Day 1 | Supabase connected, schema created | ⬜ |
| Day 2 | Folder structure, Zod, shadcn setup | ⬜ |
| Day 3 | Admin login gate with cookie auth | ⬜ |
| Day 4 | Admin: Add Spot form | ⬜ |
| Day 5 | Admin: Moderation queue | ⬜ |
| Day 6 | Admin: Edit and delete live spots | ⬜ |
| Day 7 | Admin polish and full flow test | ⬜ |
| Day 8 | Mapbox map with pins | ⬜ |
| Day 9 | Location detail sidebar | ⬜ |
| Day 10 | Filter bar | ⬜ |
| Day 11 | Review system | ⬜ |
| Day 12 | Public spot submission | ⬜ |
| Day 13 | UI polish and mobile layout | ⬜ |
| Day 14 | Deployed to Vercel, fully tested | ⬜ |

---

*Timeline created: June 2026*
*Estimated daily commitment: 2–4 hours*