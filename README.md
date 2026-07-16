# ElectroFit

Full-stack e-commerce platform for electrical accessories (sockets, frames, switches). Includes product catalog, smart room-based selection, modular configurator, checkout, reviews, support inbox, and an admin dashboard.

## Tech stack

| Layer | Technologies |
|-------|----------------|
| Backend | Java 17, Spring Boot 3.4, Spring Security, Spring Data JPA, Hibernate, JWT (JJWT), SpringDoc OpenAPI |
| Frontend | Next.js 15, React 19, TypeScript, Tailwind CSS |
| Database | PostgreSQL 15 |
| Email | Brevo REST API (optional) |
| Deploy | Docker Compose; Render (API) + Vercel (frontend) |

## Features

- **Catalog** — filter by brand, series, category, type, and search
- **Smart Select** — recommend products by room type, water proximity, and child safety
- **Configurator** — match frames with compatible mechanisms by series and post count
- **Auth** — register / login, JWT sessions, password reset via email PIN, `USER` / `ADMIN` roles
- **Cart & checkout** — guest or authenticated orders with confirmation emails
- **Reviews** — ratings and comments; verified-buyer flag when the user purchased the product
- **Support** — public contact form and admin inbox with email replies
- **Admin** — product CRUD, order status updates, dashboard stats, support tickets

## Project structure

```
ElectroFit/
├── src/main/java/com/electricalstore/   # Spring Boot API
├── src/main/resources/                  # application*.properties, static images
├── src/test/                            # unit / integration tests
├── frontend/                            # Next.js app
├── backend/Dockerfile                   # API image
├── docker-compose.yml
├── .env.example                         # secrets template (copy to .env)
├── START.bat                            # one-click Docker launch (Windows)
└── scripts/setup-postgres.sql           # optional local DB bootstrap
```

## Prerequisites

**Option A — Docker only:** [Docker Desktop](https://www.docker.com/products/docker-desktop/)

**Option B — local development:**

- JDK 17+, Maven 3.9+
- Node.js 20+
- PostgreSQL 15+

## Quick start (Docker)

1. Copy environment template and set secrets:

   ```bash
   cp .env.example .env
   ```

   Set at least:

   - `POSTGRES_PASSWORD`
   - `SPRING_DATASOURCE_PASSWORD` (same as Postgres password for Compose)
   - `JWT_SECRET` (random string, **min 32 characters**)

2. Start all services:

   - Windows: double-click `START.bat`, or
   - Any OS:

     ```bash
     docker compose up --build
     ```

3. Open:

   | Service | URL |
   |---------|-----|
   | Store | http://localhost:3000 |
   | API | http://localhost:8080 |
   | Swagger UI | http://localhost:8080/swagger-ui.html |

Stop with `Ctrl+C` or `docker compose down`.

## Local development (without Docker)

### 1. Database

Create a database (e.g. `electrofit_db`) and match credentials in `.env`:

```env
SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/electrofit_db
SPRING_DATASOURCE_USERNAME=postgres
SPRING_DATASOURCE_PASSWORD=your-password
JWT_SECRET=your-random-secret-at-least-32-chars
```

Optional helper: `scripts/setup-postgres.sql` (set your own password; do not commit real credentials).

### 2. Backend

```bash
# from repo root
cp .env.example .env   # if not done yet
mvn spring-boot:run
```

API: http://localhost:8080  
Swagger: http://localhost:8080/swagger-ui.html

### 3. Frontend

```bash
cd frontend
cp .env.local.example .env.local
npm install
npm run dev
```

App: http://localhost:3000

`.env.local` should contain:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

## Environment variables

Copy `.env.example` → `.env` (root). **Never commit `.env`.**

| Variable | Purpose |
|----------|---------|
| `POSTGRES_USER` / `POSTGRES_PASSWORD` / `POSTGRES_DB` | Docker Postgres |
| `SPRING_DATASOURCE_URL` | JDBC URL |
| `SPRING_DATASOURCE_USERNAME` / `SPRING_DATASOURCE_PASSWORD` | DB credentials |
| `JWT_SECRET` | HMAC signing key (≥ 32 chars) |
| `JWT_EXPIRATION_MS` | Token TTL (default `3600000` = 1 hour) |
| `APP_CORS_ALLOWED_ORIGINS` | Comma-separated frontend origins |
| `BREVO_API_KEY` | Brevo transactional email (optional locally) |
| `CONTACT_EMAIL` | Sender / contact address |
| `NEXT_PUBLIC_API_URL` | Frontend → API base URL |

On **Render**, set the Spring/DB/JWT/Brevo vars in the dashboard.  
On **Vercel**, set `NEXT_PUBLIC_API_URL` to your API origin (no trailing `/api`).

## Admin access

1. Register via the UI.
2. Promote the user in PostgreSQL:

   ```sql
   UPDATE users SET role = 'ADMIN' WHERE email = 'your-login@email.com';
   ```

3. Log out and log in again so the JWT includes `ADMIN`.

## API overview

| Area | Base path |
|------|-----------|
| Auth | `/api/auth` |
| Products | `/api/products` |
| Orders | `/api/orders` |
| Reviews | `/api/reviews` |
| Profile | `/api/profile` |
| Support | `/api/support` |
| Admin | `/api/admin` |
| Health | `/api/health` |

Interactive docs: `/swagger-ui.html`

## Tests

```bash
mvn test
```

Tests use in-memory H2 and a test JWT (see `src/test/resources/application.properties`).

## Notes

- Catalog data is seeded on backend startup when seeding is enabled (`app.seed.enabled`, default `true`).
- Password reset and order confirmation emails need `BREVO_API_KEY`; without it, reset PINs are logged server-side for local debugging only.
- Free hosting (e.g. Render) may sleep the API after idle time — the storefront shows a short downtime banner while the service wakes up.

## License

Private / educational project unless otherwise specified.
