---
name: verify-backend
description: Verify Aircnc backend changes with the Node test suite, Dockerized API and MongoDB readiness checks, and relevant HTTP flows. Use after backend changes.
---

# Verify backend changes

Use this workflow after changes to `apps/backend`. Prioritize behavior changed by the current task and any additional scenarios supplied in `$ARGUMENTS`.

1. Run the backend test suite from the repository root:

   ```bash
   pnpm --filter aircnc-backend test
   ```

   Fix failures related to the change and rerun the affected checks.

2. Start the API and MongoDB with Docker Compose. First record which services are already running so you can leave them untouched afterward:

   ```bash
   docker compose ps
   docker compose up --build -d backend
   ```

   Wait until MongoDB and the backend report `healthy`, and confirm `http://localhost:3333/healthz` returns success. The endpoint reports ready only when Mongoose is connected. Inspect `docker compose logs --tail=100 backend mongo` if either service does not become healthy.

3. Exercise relevant HTTP behavior against `http://localhost:3333`, including success and meaningful validation/error cases. Use `apps/backend/example.http` as a reference for the API routes. Run state-changing requests only against this local Compose stack, and account for any records they create in the local Mongo volume.

4. Check response status codes and bodies, and correlate unexpected behavior with backend and MongoDB logs. Fix issues found and repeat the affected tests and requests.

After verification, stop only the Compose services that were stopped before the run and started for verification, using `docker compose stop <service...>`. Leave pre-existing services running and preserve volumes.

If Docker, MongoDB, or another required dependency is unavailable, investigate repository setup instructions and available tooling first. If it remains blocked, report the specific blocker and which checks could not be completed. Update this skill when resolving a reusable setup issue.
