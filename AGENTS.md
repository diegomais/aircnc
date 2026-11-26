# Repository Guidelines

## Project Structure & Module Organization

Aircnc is a pnpm workspace with three applications in `apps/`: `backend` (Express, MongoDB models, controllers, services, and repositories), `frontend` (Next.js pages and React templates), and `mobile` (Expo/React Native screens and components). Backend unit tests live in `apps/backend/test`; API browser tests live in `apps/backend/e2e`. Frontend component tests sit beside their source as `test.tsx`, with browser tests in `apps/frontend/e2e`. Static web assets are in `apps/frontend/public`; shared project documentation and design assets are in `docs/`.

## Build, Test, and Development Commands

Use Node.js 24 and pnpm 12. Run `pnpm install` at the repository root to install workspace dependencies.

- `pnpm --filter aircnc-backend dev` starts the API; `pnpm --filter aircnc-frontend dev` starts the web app.
- `pnpm --filter aircnc-mobile start` starts Expo; add `android`, `ios`, or `web` to launch a target.
- `pnpm --filter aircnc-backend test` runs backend unit tests; `test:e2e` runs Playwright API tests.
- `pnpm --filter aircnc-frontend test` runs Jest; `test:e2e` runs frontend Playwright tests; `build` creates the production Next.js build.
- `pnpm --filter aircnc-mobile verify` checks mobile TypeScript types.

## Coding Style & Naming Conventions

Follow the existing style in the app you are changing. Backend uses JavaScript ES modules and PascalCase class files (for example, `SpotsService.js`). Frontend uses TypeScript/TSX, lowercase route files, and component directories with `index.tsx` and `styles.module.scss`. Mobile screens and components are organized by feature. Use Prettier settings in each app; frontend linting is available with `pnpm --filter aircnc-frontend lint` (note that its script applies fixes).

## Testing Guidelines

Add or update tests alongside the relevant behavior. Backend unit tests use Node's built-in test runner and the `*.test.js` pattern. Frontend unit tests use Jest and Testing Library (`test.tsx`); browser coverage uses Playwright `*.spec.ts` files. Run the corresponding package test command above. E2E tests may require the local services and environment described in `README.md` and app configuration.

## Commit & Pull Request Guidelines

Recent history uses Conventional Commit-style subjects, often scoped, such as `feat(backend): ...`, `fix(backend): ...`, and `test(backend): ...`. Keep commits focused and describe the change in imperative terms. Pull requests should explain the user-visible change, link the related issue when available, and list the checks run. Include screenshots for frontend or mobile UI changes.

## Configuration

Keep credentials and local environment values out of commits. Use the environment files or variables expected by each app, and consult `README.md` and `docker-compose.yml` for local service setup.
