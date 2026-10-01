# Base44 development notes

- Run `docker compose -f docker-compose.base44.yml up -d` to serve the source checkout on port 3000. The container installs with `npm ci` into a named dependency volume before starting Vite; no production bundle is used.
- No backend or database is needed: metrics and algorithms are loaded from Markdown using Vite raw imports, and log analysis runs in the browser.
- PostHog is optional. `src/main.jsx` initializes it only when both `VITE_PUBLIC_POSTHOG_KEY` and `VITE_PUBLIC_POSTHOG_HOST` are set. Platform credentials arrive through `/run/base44/app.env`; do not place values in the repository or override these names in Compose environment settings. Counter.dev is separately included in the existing index.html.
- The platform-provided `__VITE_ADDITIONAL_SERVER_ALLOWED_HOSTS` is forwarded into the web service to accept the rotating preview hostname.
- Verify with `curl -fsS http://localhost:3000/` (contains `/src/main.jsx` and `/@vite/client`) and `docker compose -f docker-compose.base44.yml ps` (web healthy).
- Tests: `docker compose -f docker-compose.base44.yml exec -T web npm test` (11 content tests passed during setup). Browser smoke check: the `LLM SFT` example populates the training log and renders matched metrics including loss value `1.2000`; clear the textarea afterward.
- The slim runtime lacks git, so Husky's prepare hook reports `git command not found`; installation still succeeds and this does not affect the app.
