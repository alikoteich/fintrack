# FinTrack 💰

> Personal finance tracker built for speed and simplicity.

## Stack
- **Vite + React + TypeScript** — fast dev & build
- **Recharts** — spending charts
- **Tailwind CSS** — styling
- **localStorage** — 100% private, no server, no tracking

## Setup

```bash
# 1. Install dependencies
npm install

# 2. Start dev server (hot reload)
npm run dev

# 3. Build for production
npm run build

# 4. Preview production build
npm run preview
```

## Features

- ⚡ **Quick-add expense** in under 3 seconds — amount, category, note, date
- 📊 **Dashboard** — monthly totals, 6-month trend chart, category pie, budget progress
- 📋 **Transactions** — searchable/filterable list with swipe-to-delete (click twice)
- 🎯 **Budget** — set per-category monthly limits with visual progress bars
- 📅 **Month navigation** — browse any past month
- 🌙 **Dark mode** — built-in, easy on the eyes

## Categories
Food & Drinks, Rent & Bills, Transport, Subscriptions, Going Out, Gym & Sport, Shopping, Health, Savings, Other

## Data
Everything stored in browser `localStorage`. To backup: open DevTools → Application → Local Storage → copy `fintrack_expenses` and `fintrack_budget`.

## Deploy
After `npm run build`, the `dist/` folder is a static site — deploy to:
- **Netlify**: drag & drop `dist/` folder
- **Vercel**: `vercel --prod`
- **GitHub Pages**: push `dist/` to gh-pages branch
- **Self-hosted**: serve `dist/` with any static file server (nginx, caddy, etc.)
