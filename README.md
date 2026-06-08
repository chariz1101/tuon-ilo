# Tuon.ILO ☕️📍

**Tuon.ILO** is a community-driven civic technology platform designed to help students, freelancers, and remote workers discover, filter, and review the best study spaces and cafes. 

Built with a focus on fast geospatial querying and seamless user experience, the platform allows users to find locations based on critical amenities like free Wi-Fi, power outlet availability, and ambient noise levels.

## 🚀 Tech Stack

* **Frontend:** Next.js (App Router), React, TypeScript
* **Styling:** Tailwind CSS, shadcn/ui
* **Mapping:** Mapbox GL JS (via `react-map-gl`)
* **Backend & Database:** Supabase (PostgreSQL)
* **Validation:** Zod

## ✨ Core Features

* **Interactive Map Explorer:** Dynamic map interface visualizing approved study hubs.
* **Granular Filtering:** Filter locations by `STUDY_HUB` or `CAFE`, Wi-Fi availability, and charging port access.
* **Community Reviews:** Low-friction, anonymous review system tied to session IDs to prevent spam while encouraging honest feedback.
* **Moderation Queue:** An admin-facing moderation layer where user-submitted locations must be verified before appearing on the public map.

## 🛠️ Local Development

1. Clone the repository:
   ```bash
   git clone [https://github.com/yourusername/tuon-ilo.git](https://github.com/yourusername/tuon-ilo.git)