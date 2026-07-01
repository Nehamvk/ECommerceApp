# E-commerce frontend (React + TypeScript + Vite)

## Stack
- React 18 + TypeScript + Vite
- Tailwind CSS for styling
- React Router for routing/route guards
- React Hook Form + Zod for client-side validation
- Axios with a JWT interceptor

## Setup

```
npm install
cp .env.example .env   # point VITE_API_URL at your running backend
npm run dev
```

App runs at `http://localhost:5173`.

## Auth & authorization model
- JWT is stored in `localStorage` after login/register and attached to every API request automatically (`src/api/client.ts`).
- `AuthContext` exposes `isAuthenticated` and `isAdmin` based on the roles returned by the backend.
- `/admin` is wrapped in `RequireAdmin` (`src/routes/Guards.tsx`) — non-admins are redirected away.
- **Important**: this client-side guard is a UX convenience only. The backend independently enforces `[Authorize(Roles = "Admin")]` on all write endpoints, so hiding the Admin link is not what makes the app secure — the API is.

## Validation
Every form (`Login`, `Register`, `AdminProducts`) validates with a Zod schema in `src/schemas/index.ts` that mirrors the backend's FluentValidation rules, so users get instant feedback before the request ever reaches the server — and the server re-validates everything regardless.
