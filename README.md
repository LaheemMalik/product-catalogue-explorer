# Product Catalog Explorer

A product catalog browser built on the [DummyJSON](https://dummyjson.com) API. Search, filter, sort, and paginate through ~200 products with shareable URLs and graceful handling of slow networks, errors, and bad input.

## Features

- Search with debouncing and input sanitization
- Category filter — sidebar on desktop, slide-in drawer on mobile
- Sort by price, rating, or name
- Pagination with URL persistence and auto-recovery from stale page numbers
- Active filter pills with individual remove and "Clear all"
- Skeleton loaders matching real card dimensions to prevent layout shift
- Distinct error states for timeout, network, HTTP, and parse failures, with retry
- All state synced to the URL — refresh-safe, shareable, back-button works
- Mobile drawer with body scroll lock, Escape-to-close, and click-outside-to-close

## Tech stack

- React 18 with Vite
- Plain CSS Modules + CSS custom properties (no utility framework)
- Vitest for unit tests on the validation utility
- DummyJSON for the data

No state management library, no router, no UI library. Each was considered and deliberately skipped — rationale in [Notes](#notes-and-decisions) below.

## Getting started

Requires Node 20+.

```bash
npm install
npm run dev       # http://localhost:5173
npm test          # run unit tests
npm run build     # production build
```

## Project structure

```
src/
├── api/             # fetch wrapper + product endpoints
├── components/      # one folder per component, colocated CSS module
├── hooks/           # useProducts, useCategories, useDebounce, useUrlState
├── utils/           # input validation
├── styles/          # tokens.css and reset.css
├── App.jsx
└── main.jsx
tests/               # unit tests
```

## How it handles the assessment requirements

**Slow API responses.** Every request goes through a fetch wrapper that imposes a 10-second timeout via `AbortController`. Skeleton loaders give visual feedback during loading instead of a spinner. In-flight requests are cancelled when their inputs change, so a slow earlier response can't overwrite a faster newer one.

**API errors.** The wrapper normalizes all failures into a typed shape (`timeout | network | http | parse`). The error UI maps each type to a different message and exposes a Try Again button that re-runs the fetch without a full page reload.

**Invalid input.** Search input is sanitized at the boundary (`src/utils/validate.js`): control characters stripped, whitespace trimmed, length capped at 100 characters. Numeric URL params like `page` are parsed defensively and clamped. The sanitizer has unit tests.

## Notes and decisions

- **No state library.** URL params + `useState` cover everything. A store would add dependencies and indirection for no observable benefit.
- **No router.** There's only one view. `URLSearchParams` + `history.replaceState` handles state sync in ~30 lines.
- **No CSS framework.** Hand-rolled tokens give a more deliberate look and exercise actual CSS judgment.
- **No TypeScript.** Worthwhile in a real codebase; overkill for this size and time budget.
- **Search overrides category** when both are active, because the upstream API has no combined endpoint. The active filter pills make this visible to the user.

## What I'd add with more time

- An error boundary around the grid so a single bad product can't crash the page
- A product detail view with related items
- Image lazy-loading with blur-up placeholders for slower connections
- Tests for the fetch wrapper (mocked network) and the `useProducts` hook
- Basic analytics events on filter and search usage