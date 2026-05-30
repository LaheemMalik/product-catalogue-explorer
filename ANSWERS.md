# Design notes

## Why this stack

I considered a few options and picked the simplest one that still demonstrates the things the assessment is checking for.

**React + Vite over Next.js or Remix.** This is a single-view app with no SSR needs and no routing beyond URL query params. Reaching for a framework would have added build complexity and an opinion layer that isn't pulling weight here. Vite gives a fast dev loop and a clean production build with zero config.

**Plain CSS Modules over Tailwind or a UI library.** Tokens in `tokens.css` plus per-component `.module.css` keeps styles scoped without runtime overhead, and forces actual design decisions (palette, spacing scale) rather than picking from a utility menu. I wanted the look to feel deliberate, not generic.

**No state library.** Two pieces of state matter — the URL (filters, search, page) and the input value being typed. URL state lives in a small custom hook (`useUrlState`); input value is local `useState`. Pulling in Redux or Zustand for this would have been resume-padding, not engineering.

**No TypeScript.** Worthwhile in a long-lived codebase, overkill for the time budget here. The fetch wrapper's error shape is documented inline where it matters.

## How I handled slow responses

Three layers:

1. **Timeout.** Every request flows through `apiFetch` in `src/api/client.js`, which wraps `fetch` with an `AbortController` that auto-aborts after 10 seconds. The timeout is tracked with an internal flag so the catch block can distinguish a timeout from an external abort and surface the right error type.
2. **Skeleton UI.** The grid renders `SkeletonGrid` while loading — placeholder cards with the same aspect ratio and padding as real `ProductCard`s. When data arrives, the layout doesn't shift.
3. **Cancellation.** `useProducts` creates a fresh `AbortController` on every parameter change. The previous request is aborted in cleanup. This prevents the classic race condition where a slow response for "phon" arrives after a fast response for "phone" and overwrites it.

## How I handled API errors

The fetch wrapper normalizes every failure into a tagged shape — `{ type, message, status? }` — where `type` is `timeout`, `network`, `http`, or `parse`. The wrapper also handles a quirk of `fetch` that's easy to miss: it resolves on HTTP errors instead of rejecting. We check `response.ok` explicitly and throw on non-2xx.

`ErrorState` looks up a message by type, so a timeout reads differently from a network failure, which reads differently from a 5xx. The Try Again button bumps a counter inside `useProducts` (added to the effect's dependency array), which triggers a fresh fetch without a full page reload. Recovery works end-to-end — verified by breaking the base URL temporarily, watching the error UI appear, fixing the URL, clicking Try Again, and getting products back.

Categories use a softer failure mode: if the category list fetch fails, the app falls back to no filter rather than blocking the user from browsing.

## How I handled invalid input

Validation lives at the boundary in `src/utils/validate.js`, not scattered through components. Three pure functions:

- `sanitizeSearch` — trims, strips control characters, caps length at 100
- `clampLimit` / `clampSkip` — defensive parsing of numeric URL params

The search input also has `maxLength={100}` as a UI-level guard — defense in depth, not redundancy. The sanitizer has unit tests in `tests/validate.test.js`.

## Tradeoffs I deliberately made

- **Pagination over infinite scroll.** Pagination is more accessible and produces shareable URLs (`?page=3`). Infinite scroll looks slicker but breaks the back button and screen readers.
- **Native `<select>` for sort.** A custom popover would have given more visual control but adds an accessibility surface for very little gain. Native pickers are also the best mobile experience.
- **Search overrides category, not combined.** DummyJSON has no `/products/search?category=X` endpoint. I could have searched all results and filtered client-side, but that fights the API and breaks pagination math. The active filter pills surface the active filter clearly.
- **No component tests.** I tested the pure utility (high value, low cost). Component tests would have required jsdom setup and mocking the API, which felt like overhead for a project this size.

## What I'd do next

Roughly in priority order:

- Error boundary around the grid so a single malformed product can't unmount the route
- A product detail view with related items, accessed via URL
- Image lazy-loading with blur-up placeholders for slow connections
- Tests for the fetch wrapper (mocked network) and the `useProducts` hook
- Focus trap inside the mobile drawer while it's open (an a11y gap I left)
- Lightweight analytics on filter/sort usage to inform future iteration

## Time spent

Roughly 8–10 hours across two evenings, including setup, design, and writing these notes.