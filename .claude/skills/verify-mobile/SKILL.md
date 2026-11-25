---
name: verify-mobile
description: Verify Aircnc mobile app changes by typechecking, starting the Dockerized API, running the Expo app on a simulator or device, and exercising affected native flows. Use after mobile changes.
---

# Verify mobile changes

Use this workflow after changes to `apps/mobile`. Prioritize behavior changed by the current task and any additional cases supplied in `$ARGUMENTS`.

1. Read `apps/mobile/package.json` for the Expo SDK version and available scripts. Run the app's verification script from the repository root:

   ```bash
   pnpm --filter aircnc-mobile verify
   ```

   If the change depends on Expo or React Native APIs, follow `apps/mobile/AGENTS.md` and use the matching versioned Expo docs.

2. Start the backend and MongoDB with Docker Compose. First record which services are already running so you can leave them untouched afterward:

   ```bash
   docker compose ps
   docker compose up --build -d backend
   ```

   Wait until MongoDB and the backend report `healthy`, and confirm `http://localhost:3333/healthz` returns success. Inspect `docker compose logs --tail=100 backend mongo` and resolve startup or database issues before proceeding.

3. Start Metro and launch the app on an available iOS simulator or Android emulator/device:

   ```bash
   pnpm --filter aircnc-mobile ios
   # or
   pnpm --filter aircnc-mobile android
   ```

   Use an existing development build when the change requires native modules that Expo Go does not include. Do not claim native verification if only a web preview was available.

4. Confirm the app can reach the local API from the selected target. iOS Simulator can use the host's `localhost`. For Android, use `adb reverse tcp:3333 tcp:3333` when supported. For a physical device, use a reachable host address and ensure the API configuration points to it without committing a machine-specific address.

5. Exercise relevant flows on the simulator or device, including meaningful loading, error, and success states. Check navigation, keyboard behavior, and layout at a phone-sized viewport when those areas are affected. Inspect Metro, device, and backend logs when behavior is unexpected; fix issues and repeat the affected checks.

After verification, stop only the Compose services that were stopped before the run and started for verification, using `docker compose stop <service...>`. Leave pre-existing services running and preserve volumes. Stop only the Metro or simulator processes started for this verification.

If Docker, the required simulator/device, app credentials, or another dependency is unavailable, investigate repository setup instructions and available tooling first. If it remains blocked, report the specific blocker and which checks could not be completed. Update this skill when resolving a reusable setup issue.
