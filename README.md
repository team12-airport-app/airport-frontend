# Airport Frontend — Team 12 (Steve Morrison & Chris Morrison)

![Frontend CI](https://github.com/team12-airport-app/airport-frontend/actions/workflows/frontend-ci.yml/badge.svg)

A small, clean React (Vite) frontend that shows **Arrivals & Departures boards** and a simple **Admin** panel (Airlines & Gates) for the Team 12 Airport app.

- **Live Frontend (CloudFront):** `http://d290kw2od6772.cloudfront.net`
- **Backend API (EC2, Spring Boot):** `http://18.220.153.136`
- **Organization:** https://github.com/team12-airport-app
  - Frontend repo: https://github.com/team12-airport-app/airport-frontend
  - Backend repo: https://github.com/team12-airport-app/airport-backend

---

## 🧭 Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Local Development](#local-development)
- [Environment Variables](#environment-variables)
- [Build & Launch (S3 + CloudFront)](#build--launch-s3--cloudfront)
- [Backend CORS (Required)](#backend-cors-required)
- [Testing & CI](#testing--ci)
- [API Endpoints This UI Calls](#api-endpoints-this-ui-calls)
- [Project Conventions (Branches/PR)](#project-conventions-branchespr)
- [Troubleshooting](#troubleshooting)
- [Demo Checklist](#demo-checklist)
- [Team](#team)

---

## Features

- **Boards** page:
  - Airport switcher (populated from backend)
  - Two aligned tables: **Arrivals** (ETA) and **Departures** (ETD)
  - Auto-refresh loop (configurable)
- **Admin** page:
  - **Airlines** CRUD
  - **Gates** CRUD
  - Surfaces backend 404/409 messages
- **API Status** badge in the header
- **Lightweight global CSS** (responsive, tidy)

> Note on times: The backend currently exposes **actual** times, `departedAt` and `arrivedAt`. The boards display **ETD = departedAt** and **ETA = arrivedAt** when present; otherwise show `—`. Scheduled times are not modeled in this sprint.

---

## Tech Stack

- **React + Vite** (plain JS, no TypeScript)
- **Node 20** for local dev & CI
- **Vitest + React Testing Library** for tests
- **AWS S3 (private)** + **CloudFront (OAC)** for hosting
- **Spring Boot** backend on EC2 (HTTP)

---

## Local Development

**Prereqs:** Node 20.x, npm 10+

```bash
# clone
git clone https://github.com/team12-airport-app/airport-frontend.git
cd airport-frontend

# install
npm ci

# dev server (locked to port 5137)
npm run dev
# http://localhost:5137

Make sure your .env has the API base:

VITE_API_BASE=http://18.220.153.136
VITE_REFRESH_MS=30000

Environment Variables

Create a .env for local dev and a .env.production for builds:

.env (local)

VITE_API_BASE=http://18.220.153.136
VITE_REFRESH_MS=30000

.env.production (for build)

VITE_API_BASE=http://18.220.153.136
VITE_REFRESH_MS=30000

    Vite inlines these at build time. If you change the API base, rebuild before deploying.

Build & Launch (S3 + CloudFront)
1) Build

npm run build
# output: /dist

2) Upload to S3 (private)

Bucket: team12-airport-frontend-cm-prod (Region us-east-2)
We uploaded under a folder called web/. Either use the console or AWS CLI:

aws s3 sync ./dist s3://team12-airport-frontend-cm-prod/web/ --delete --region us-east-2

3) CloudFront distribution (already created)

    Domain: d290kw2od6772.cloudfront.net

    Origin: S3 bucket (not the website endpoint)

    Origin path: /web

    Access: OAC (Origin Access Control) with S3 bucket policy allowing the distribution ARN

    Default root object: index.html

    Custom error responses: map 403 and 404 → 200 with /index.html (SPA fallback)

    Viewer protocol policy: HTTP and HTTPS
    We use HTTP in the demo because the backend is HTTP; HTTPS frontend → HTTP backend would be mixed content.

4) Invalidate after each deploy

CloudFront → Invalidations → Create → /*
5) Open the site

Use HTTP to avoid mixed-content with the HTTP backend:

http://d290kw2od6772.cloudfront.net

Backend CORS (Required)

The backend must allow your CloudFront origin. The backend is running in Docker on EC2 and reads ALLOWED_ORIGINS from env.

Container run (example):

docker run -d --name airport-backend \
  --restart unless-stopped \
  -p 80:8080 \
  -e SPRING_PROFILES_ACTIVE=local \
  -e DB_HOST=team12-flight-mgmt.cfaiwoua8oyz.us-east-2.rds.amazonaws.com \
  -e DB_PORT=3306 \
  -e DB_NAME=flight_management \
  -e DB_USER=airport_admin \
  -e DB_PASSWORD='<DB_PASSWORD>' \
  -e ALLOWED_ORIGINS='http://localhost:5137,http://d290kw2od6772.cloudfront.net,https://d290kw2od6772.cloudfront.net' \
  chrismorrison101/airport-backend:latest

Verify CORS from your laptop:

curl.exe -i -H "Origin: http://d290kw2od6772.cloudfront.net" http://18.220.153.136/manage/airlines
# Expect: HTTP/1.1 200 OK + Access-Control-Allow-Origin: http://d290kw2od6772.cloudfront.net

Testing & CI

Run tests locally:

npm run test    # watch mode
npm run test:run

    Vitest config: vitest.config.js

    Setup: src/setupTests.js

    Example tests:

        src/utils/flightRows.test.js

        src/components/ApiStatus.test.jsx

        src/components/InlineEditRow.test.jsx

GitHub Actions CI (on PRs & main):

    Workflow: .github/workflows/frontend-ci.yml

    Steps: checkout → Node 20 → npm ci → npm run test:run → npm run build

Add the CI badge (already at the top of this README) once the first run completes on main.
🔌 API Endpoints This UI Calls

Public endpoints:

    GET /airports → populate airport switcher

Flight data (via aircraft):

    GET /aircraft

    GET /aircraft/{id}/flights
    Each flight includes:

        id, aircraftId

        fromAirportId, fromAirportCode

        toAirportId, toAirportCode

        departedAt (used as ETD), arrivedAt (used as ETA)

Admin endpoints:

    GET/POST/PUT/DELETE /manage/airlines

    GET/POST/PUT/DELETE /manage/gates

Project Conventions (Branches/PR)

    No direct pushes to main

    Branch naming:

        Features: feat/...

        Fixes: fix/...

        Chores/CI/CSS: chore/...

        Docs: docs/...

    Process: feature branch → PR → peer review → merge when CI is green

    Keep PRs small and focused

Troubleshooting

    API: Unavailable on CloudFront:

        Use HTTP: http://d290kw2od6772.cloudfront.net (HTTPS frontend → HTTP backend is mixed-content)

        Make sure VITE_API_BASE is http://18.220.153.136 at build time

        Ensure backend ALLOWED_ORIGINS includes both http:// and https:// forms of your CloudFront domain

        Invalidate CloudFront /* after redeploys

    AccessDenied from CloudFront/S3:

        Confirm OAC is attached to the origin and the bucket policy allows the distribution ARN

        Ensure the origin is the S3 bucket (...s3.us-east-2.amazonaws.com), not the website endpoint

        If you uploaded to web/, set the Origin path to /web

    Local dev can’t reach API:

        Backend must be reachable at http://18.220.153.136 (or change VITE_API_BASE accordingly)

        From the browser, check DevTools → Network → the exact Request URL

Demo Checklist

    Open http://d290kw2od6772.cloudfront.net → API: Connected shown.

    Switch airports → Arrivals/Departures update (auto-refresh visible).

    /admin → Create, edit, delete an Airline and a Gate; show error surfacing (e.g., duplicate code → 409).

    GitHub PR → show CI green (tests + build).

    (Optional) EC2 proof:

        docker ps on the instance

        curl http://localhost/manage/airports shows data

    Mention:

        Hosting: S3 (private) + CloudFront (OAC) with SPA fallback

        Backend CORS via ALLOWED_ORIGINS

        Tests via Vitest + RTL

Team

    Steve Morrison — Backend/Frontend & DevOps

    Chris Morrison — Frontent/Backend & DevOps

License

Educational project for the Keyin College Semester 4 Final Sprint of SD12 program (Summer 2025).
```
