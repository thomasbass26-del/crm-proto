# RealtyFlow AI — Lead Management Platform

AI-powered lead management platform for real estate teams. Leads flow in from multiple lead magnets, get qualified by an AI bot, and are automatically routed to agents or drip campaigns.

## Features

- **Multi-source lead intake** — Form submissions and API endpoints for 6+ lead magnets
- **AI Bot qualification** — Automated outreach, response analysis, and lead scoring
- **Smart categorization** — Hot leads, nurture, drip campaigns, and cold lead recycling
- **Agent accountability** — Full Outlook email tracking and performance metrics for 50 agents
- **AI-generated drip campaigns** — Automated email sequences tailored to each lead category
- **Real-time pipeline** — Visual Kanban board showing leads flowing through every stage

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) to view the app.

## Deploy to GitHub Pages

This repo includes a GitHub Actions workflow that auto-deploys on every push to `main`.

1. Push this repo to GitHub
2. Go to **Settings → Pages → Source** and select **GitHub Actions**
3. Every push to `main` will auto-build and deploy

Your site will be live at: `https://yourusername.github.io/realtyflow-ai/`

## Tech Stack

- React 18
- Vite 5
- Recharts (data visualization)
- Lucide React (icons)
