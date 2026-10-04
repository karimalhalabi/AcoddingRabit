# Atelier — multi-shop CMS

A complete React storefront and Express headless REST API for **Terra & Form**, **Root & Ritual**, and **Aura Botanica**. Warm ivory and rust design, English/Arabic field labels and RTL layout, animated image cards, a product detail panel, tenant-specific accounts and carts, transactional demo checkout, and an administrator product manager.

## Run

Requires **Node 24.14+** and npm. All commands run from this directory.

```sh
npm ci
npm run dev          # Express :4000 + Vite :5173
```

Alternative requested Create React App runner (stop `npm run dev` first):

```sh
npm start            # Express :4000 + react-scripts :3000
```

The CRA launcher supplies an explicit allowed-host list, fixing CRA 5 startup on link-local cloud interfaces without disabling host checks. Set `DEV_ALLOWED_HOSTS` to additional comma-separated preview hostnames if necessary.

Both runners proxy `/api` and `/uploads` to the same API. They share port 4000 and should not run simultaneously. `npm run dev:web` or `npm run start:react` starts only the selected frontend if the API is already running. The fixed header is 100px, navigation 25px, and footer 75px; the area between them scrolls independently.

```sh
npm run build        # Vite → dist/
npm run build:react  # react-scripts → build/
npm run server       # API, plus dist/ (preferred) or build/ if present
npm test             # isolated HTTP integration tests
npm run benchmark    # 100 parallel clients, 3,000 catalog requests
npm run format:check
```

Vite is the primary toolchain. The requested `react-scripts` 5.0.1 compatibility runner is also tested; its dependency tree includes legacy packages and deprecation warnings. React 19.3, TanStack Query 5, react-hot-toast 2, react-icons 5, and Vite 8 are installed with an exact reproducible lockfile. Node's built-in SQLite API may emit an experimental warning in Node 24.

## Try the CMS

Open the account icon, sign in, then choose **Shop manager** from your account or the navigation bar. For local development, each shop has a demo administrator:

- Email: `admin@atelier.local`
- Password: `AtelierDemo2026!`

Create, edit, archive, restore, delete, and upload product images in the manager. Customer registration always creates a customer role. Each shop requires its own sign-in. Switching shops cannot grant administrator access to the next shop.

**Checkout is a demo.** It stores an order and updates stock atomically. It does not collect card details, authorize a payment, calculate tax, or contact a payment provider. Connect a real payment processor and verify webhook events before using this for real sales.

## Structure

```text
src/
  components/        # Each component alongside its camelCase CSS module
  util/help.js       # Business functions, translations, API client, state hooks
  App.jsx            # Page and modal composition
server/
  data/shops.json    # Three shop definitions and twenty example products
  util/help.cjs      # Database, authentication, validators, routes, app/startup helpers
  app.cjs            # Testable app export
  index.cjs          # Server entry point
  api.test.cjs       # HTTP integration tests
scripts/benchmark.cjs
public/images/       # Local copies of sample Unsplash photography
```

The JSON seed is imported on first database creation. The database is `server/data/atelier.sqlite` by default, is ignored by Git, and persists across restarts. Deleting products does not re-create them on restart. To reset disposable local data, stop the API, remove `server/data/atelier.sqlite*`, then restart. This removes all local users and orders too.

## REST API

| Method       | Route                                              | Access                                  |
| ------------ | -------------------------------------------------- | --------------------------------------- |
| GET          | `/api/health`                                      | Public                                  |
| GET          | `/api/shops`                                       | Public                                  |
| GET          | `/api/shops/:shopId/products`                      | Public, active catalog                  |
| GET          | `/api/shops/:shopId/products?includeArchived=true` | Shop admin                              |
| GET          | `/api/shops/:shopId/auth/me`                       | Current shop session, or null           |
| POST         | `/api/shops/:shopId/auth/register`                 | Public, customer only                   |
| POST         | `/api/shops/:shopId/auth/login`                    | Public, rate limited                    |
| POST         | `/api/shops/:shopId/auth/logout`                   | Session revocation                      |
| POST         | `/api/shops/:shopId/products`                      | Shop admin                              |
| PUT / DELETE | `/api/shops/:shopId/products/:id`                  | Shop admin                              |
| POST         | `/api/shops/:shopId/uploads`                       | Shop admin, multipart image, 5 MB limit |
| POST         | `/api/shops/:shopId/orders`                        | Shop customer/admin                     |
| GET          | `/api/shops/:shopId/orders`                        | Only the current user's orders          |

## Isolation, concurrency, and performance

- One SQLite database, WAL journal, foreign keys, composite tenant keys, prepared statements, and `BEGIN IMMEDIATE` checkout transactions. Prices are calculated in integer cents using the database; submitted prices/totals are ignored. Invalid items roll back the entire transaction.
- Shop-scoped users and hashed server-side sessions with HttpOnly, SameSite cookies. Production cookies are Secure. Registration cannot set a privileged role. Customer bags are scoped to shop and user; guest bags transfer at sign-in. Logout never exposes the signed-in customer's bag to another account.
- Passwords use salted scrypt. Authentication is rate limited. Helmet, body limits, origin checks, and upload signature validation are enabled. Private responses are not cached.
- Public catalogs use a 15-second **server-side** cache keyed by shop, invalidated by product changes and checkout. TanStack Query keys include the shop and, for order history, the current user.
- Local test, 100 simultaneous clients, 3,000 warm catalog requests: **2,750 requests/sec**, **57.73 ms p95**, **65.21 ms maximum**, zero HTTP failures. These are loopback measurements on this sandbox, not a deployment SLA. Re-run `npm run benchmark` on the deployment hardware and measure all actual request mixes, particularly authentication and writes.
- This implementation targets a single API process on one host with durable local storage. SQLite serializes writes; WAL permits concurrent readers. Multiple API workers would need shared cache invalidation and a shared rate-limit store. For larger deployments, keep the tenant contracts and move persistence to one PostgreSQL database with tenant indexes/row-level policies, shared Redis caching, and connection pooling. No distributed-scale performance claim is made here.

## Deployment configuration

Copy `.env.example` to `.env` and set explicit production values. Production requires `ADMIN_EMAIL` and a unique `ADMIN_PASSWORD` of at least 16 characters and refuses the demo password. Deploy a fresh database for production; the bootstrap provisions the configured admin only if it does not exist. Later password rotation must update the account deliberately, not just the environment. Known development admin sessions are revoked and the development account disabled when starting in production.

Set `NODE_ENV=production`, build the frontend, and run `npm run server` behind HTTPS. Optional `TLS_KEY_PATH` / `TLS_CERT_PATH` enable Node's HTTPS server directly. `ALLOWED_ORIGINS` accepts comma-separated trusted origins for deliberate cross-origin deployments; the included frontend uses same-origin cookies and a same-origin API proxy. Configure a reverse proxy to preserve Host and support HTTPS. Development trusts only the loopback Vite/CRA proxy. Production defaults to no trusted proxies: set `TRUST_PROXY` to your specific proxy addresses or CIDRs (for example `loopback` for a same-host reverse proxy), and have that proxy sanitize forwarding headers. Do not use an unrestricted trust setting.

Back up SQLite using a consistent SQLite backup strategy, and persist `public/uploads/` with the database. Uploaded images are public catalog assets. Keep real credentials out of Git. The demo uses no external API credentials. Fonts are served by Google Fonts, with local system fallbacks. Images are sample Unsplash photography downloaded to `public/images/`; replace with your own product photography before selling.
