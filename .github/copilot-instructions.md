<!-- .github/copilot-instructions.md: Guidance for AI coding assistants working on this repo -->
# Quick orientation — CS-233-Basic-Web-App

Purpose: Give an AI agent the minimal, actionable knowledge to be useful immediately in this repository.

1) Big picture
- Two-folder simple split: `client/` (React + Vite) and `server/` (Express).
- Client runs on Vite dev server (default port 5173). Server is an Express app listening on port 3000.
- Cross-origin requests are expected: server enables CORS for `http://localhost:5173`.

2) How the app is wired (data flow)
- `server/server.js` exposes endpoints:
  - `GET /api` -> returns `{ fruits: [...] }` (used by client)
  - `GET /`, `/about`, `/contact` -> simple HTML/text responses
  - Server listens on port 3000
- `client/src/App.jsx` uses `axios.get("http://localhost:3000/api")` inside a `useEffect` to fetch `fruits` and populate local state.
- There is no persistence: todo items added in the client are stored in component state only.

3) Dev / run commands (project-specific)
- Start server (with auto-reload):
  - cd server
  - npm run dev   # uses nodemon (script: "dev": "nodemon server")
- Start client (dev + HMR):
  - cd client
  - npm run dev   # starts Vite on port 5173
- Build client for production:
  - cd client
  - npm run build
- Lint client JS/JSX:
  - cd client
  - npm run lint (uses the repo's `client/eslint.config.js`)

4) Project-specific conventions & patterns
- Mixed module systems:
  - `client/` uses ESM (`"type": "module"` in `client/package.json`) and React 19.
  - `server/` uses CommonJS (`require`) in `server/server.js`. Keep this separation when adding files.
- Port/CORS coupling: If you change server port or CORS origin, update both `server/server.js` and any hard-coded client URLs (e.g., `axios.get("http://localhost:3000/api")`).
- Minimal single-file backend: `server/server.js` currently contains routes + middleware. If extracting routes, preserve middleware order (CORS -> logging -> express.json() -> routes) or intentionally re-order with care.

5) Integration points to watch
- Client -> Server: hard-coded axios base URLs in `client/src/App.jsx`.
- ESLint config at `client/eslint.config.js` defines rules for JSX files; follow those rules when editing client code.

6) Where to make common changes (examples)
- Add a new API route: edit `server/server.js`. Example pattern:
  app.get('/my-route', (req,res) => res.json({ ... }))
- Consume new API from client: update `client/src/App.jsx` to call the new endpoint with `axios` and update state.

7) Safety & small guidance for automated edits
- Preserve ports/CORS and the axios URL unless you update both sides.
- When adding server middleware, place logging middleware early if you want all requests logged; current logging middleware sits after `/api` (so `GET /api` is not logged) — move or duplicate logging if needed.
- Avoid introducing new dev dependencies without confirming `package.json` updates for the correct folder (`client/` vs `server/`).

8) Missing items worth asking the maintainer
- Desired long-term structure for the server (single-file vs. express router layout).
- Preferred environment variable usage (PORT, API_BASE) vs. hard-coded values.

If anything here is unclear or you'd like more details (e.g., a suggested router layout, environment variable wiring, or small sample tests), tell me which parts to expand and I will update this file.
