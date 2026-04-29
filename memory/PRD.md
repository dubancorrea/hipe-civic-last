# HIPE Civic — Product Requirements Document

## Vision
A CUNY-wide civic engagement hub that turns volunteer hours, voter pledges, and campus advocacy into a single, trackable student profile.

## Core User Stories
1. **Student** signs up, logs in (NextAuth credentials), browses opportunities filtered by major, applies with a motivation note, logs hours after acceptance, pledges to vote / joins campaigns, RSVPs to civic events.
2. **Staff** signs up as staff, posts new opportunities, reviews and accepts/declines/completes applications.
3. Both can recover passwords via a 30-min hashed-token reset flow.

## Tech Stack
- Next.js 14 App Router + TypeScript
- Tailwind CSS (Neobrutalism: blue #0055FF, white, black, thick borders, hard shadows)
- NextAuth v4 (Credentials, JWT)
- Mongoose / MongoDB (Atlas in prod, local in dev)
- bcryptjs for password + token hashing

## Routes
- `/`, `/volunteer`, `/volunteer-opportunities`, `/civic-engagement`, `/campus-advocacy`
- `/login-registration`, `/forgot-password`, `/reset-password`
- `/dashboard`, `/dashboard/create-opportunity`, `/dashboard/applicants`

## API
- `/api/auth/[signup|forgot-password|reset-password|...nextauth]`
- `/api/opportunities/[list|apply|my-applications|log-hours]`
- `/api/civic/[pledge|rsvp]`
- `/api/staff/[opportunities|applications|applications/[id]]`

## Seed Data
14 varied CUNY-relevant opportunities in `lib/opportunities.ts` (Arts, Medicine, STEM, Community, Education, Advocacy).
