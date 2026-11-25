---
name: verify-frontend
description: Verify frontend changes by running the Aircnc frontend and backend, checking the local page in Chrome, and exercising the affected flows. Use after frontend changes.
---

# Verify frontend changes

Use this workflow after frontend changes. Prioritize behavior touched by the current task and any extra scenarios supplied in `$ARGUMENTS`.

1. From the repository root, check which Compose services are already running, then start the services:

   ```bash
   docker compose ps
   docker compose up --build -d backend frontend
   ```

   Compose starts MongoDB as the backend dependency and supplies the local `MONGODB_URI`. If Docker is unavailable or a container fails to start, inspect `docker compose logs backend frontend mongo` and resolve the cause before continuing.

2. Wait for `http://localhost:3000` to return a successful HTTP response. Confirm the backend and MongoDB are running with `docker compose ps` and inspect their logs if needed.

3. Use Claude Chrome MCP to open `http://localhost:3000`. Inspect the page at desktop and mobile-sized viewports when the change affects responsive behavior.

4. Exercise the relevant user flows end to end. Include normal use and meaningful edge or error states for the changed behavior. Check the browser console and network requests when a result is unexpected.

5. Correlate browser behavior with container logs when needed, for example `docker compose logs --tail=100 frontend backend`. Fix issues uncovered by verification, then repeat the affected checks.

After verification, stop only the services that were stopped before the run and were started for verification, using `docker compose stop <service...>`. Leave pre-existing services running and preserve volumes.

If Docker, a required service, or the browser capability is unavailable, investigate the repository's setup instructions and available tooling first. If it remains blocked, report the specific blocker and the checks that could not be completed. Update this skill when resolving a reusable setup issue so future runs avoid the same blocker.
