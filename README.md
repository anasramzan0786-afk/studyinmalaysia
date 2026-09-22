<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Study In Malaysia Portal

Team-only admissions portal for managing universities, programs, fee schedules, and counselor workflows.

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies: `npm install`
2. Copy `.env.example` to `.env` and fill in local values.
3. Run the app: `npm run dev`

## Vercel Deployment

The production build intentionally fails when required security settings are missing. In Vercel, open **Project Settings > Environment Variables** and add these variables for the **Production** environment:

- `DATABASE_URL`
- `DIRECT_URL`
- `JWT_SECRET`
- `COUNSELOR_USERNAME`
- `COUNSELOR_EMAIL`
- `COUNSELOR_PASSWORD`
- `ADMIN_USERNAME`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`

Use the PostgreSQL connection values expected by Prisma. Use long, unique secrets for `JWT_SECRET`, and do not commit real passwords or environment files.
