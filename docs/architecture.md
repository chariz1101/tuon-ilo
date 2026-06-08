## Setup your env.local first

# System Architecture & Documentation

## 1. Database Schema (Supabase / PostgreSQL)
The application utilizes a relational database structure designed for fast geographic queries and aggregated rating calculations.

### `locations` Table
The central repository for all map data.
* `id` (UUID, Primary Key)
* `name` (Text)
* `type` (Enum: 'STUDY_HUB', 'CAFE')
* `latitude` (Float)
* `longitude` (Float)
* `wifi_status` (Enum: 'FREE', 'PAID', 'NONE')
* `charging_status` (Enum: 'FREE', 'PAID', 'NONE')
* `is_approved` (Boolean, Default: False) - *Controls visibility on the frontend.*

### `reviews` Table
Handles user feedback and dynamic rating aggregation.
* `id` (UUID, Primary Key)
* `location_id` (UUID, Foreign Key -> locations.id)
* `rating` (Integer 1-5)
* `comment` (Text)
* `session_id` (Text) - *Used for rate-limiting anonymous submissions.*

## 2. API & Data Flow

### The "Add Location" Moderation Flow
To protect the database from malicious data injection, the platform utilizes a strict moderation pipeline:
1. **Client-Side:** User submits a new location via a form.
2. **Validation:** The data is validated client-side using `Zod` to ensure coordinates and text fields meet schema requirements.
3. **Insertion:** Data is inserted into the `locations` table with `is_approved` automatically set to `false`.
4. **Admin Verification:** The administrator reviews the pending location in the Supabase dashboard (or custom admin route). Upon verification, `is_approved` is toggled to `true`.
5. **Client Fetch:** The Next.js frontend only fetches locations where `is_approved === true`, ensuring the live map remains clean.

## 3. Geospatial Rendering
The application uses Mapbox via `react-map-gl`. Location coordinates fetched from Supabase are mapped to `<Marker>` components. State management holds the current bounding box of the map viewport, allowing the application to re-fetch or filter data efficiently as the user pans and zooms across the city.