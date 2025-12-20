# Music Recommendation System – Frontend

This is the frontend for the Music Recommendation System, built with [Next.js](https://nextjs.org), [React](https://react.dev), [TypeScript](https://www.typescriptlang.org/), and [Tailwind CSS](https://tailwindcss.com/).

## Features

- Real-time song search with fuzzy matching
- Paginated, grid-based recommendations with skeleton loading
- Responsive UI with modern design
- Caching of recommendations per song and page for fast navigation
- Integration with a Python Flask backend API

## Getting Started

First, install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the app.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## Configuration

By default, the frontend expects the backend API to be running at `http://127.0.0.1:5000`.  
If your backend runs elsewhere, update the API URL in `src/lib/api.ts`:

```typescript
const API_URL = "http://127.0.0.1:5000";
```

## Project Structure

```
frontend/
├── app/
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── Header.tsx
│   ├── RecommendationList.tsx
│   └── SongSearch.tsx
└── lib/
    └── api.ts
```

## Learn More

- [Next.js Documentation](https://nextjs.org/docs) – learn about Next.js features and API.
- [React Documentation](https://react.dev/) – learn about React.
- [Tailwind CSS Documentation](https://tailwindcss.com/docs) – utility-first CSS framework.

## Backend

The backend is a Python Flask application.  
See the main project [README](../README.md) for backend setup and details.

## Author

Developed by Arth Thakkar
