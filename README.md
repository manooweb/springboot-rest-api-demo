# springboot-rest-api-demo

[![Backend CI](https://github.com/manooweb/springboot-rest-api-demo/actions/workflows/backend.yml/badge.svg)](https://github.com/manooweb/springboot-rest-api-demo/actions/workflows/backend.yml) [![API E2E (Bruno)](https://github.com/manooweb/springboot-rest-api-demo/actions/workflows/api-e2e-bruno.yml/badge.svg)](https://github.com/manooweb/springboot-rest-api-demo/actions/workflows/api-e2e-bruno.yml) [![Frontend Tests](https://github.com/manooweb/springboot-rest-api-demo/actions/workflows/frontend.yml/badge.svg)](https://github.com/manooweb/springboot-rest-api-demo/actions/workflows/frontend.yml) [![License: MIT](https://img.shields.io/badge/license-MIT-green.svg)](https://github.com/manooweb/springboot-rest-api-demo/blob/main/LICENSE)

# springboot-rest-api-demo

**Fullstack demo project** built with a modern Java / Angular stack.

- **Backend**: Spring Boot 3 (Java 21), PostgreSQL, Flyway, Spring Security, JWT
- **Frontend**: Angular 20 + Angular Material (**standalone components only**)
- **API documentation**: OpenAPI / Swagger
- **API tests**: Bruno (manual + E2E in CI)

---

## Live demo (production)

- Frontend: https://projects.manooweb.fr
- API: https://projects-api.manooweb.fr
- Swagger UI: https://projects-api.manooweb.fr/swagger-ui/index.html
- Healthcheck: https://projects-api.manooweb.fr/api/v1/health
- Demo account: `demo / demo`

## Public MVP release

The currently deployed public MVP corresponds to the following GitHub release:

- **v0.20.0** — UI i18n-ready foundation

See full release notes:
https://github.com/manooweb/springboot-rest-api-demo/releases/tag/v0.18.0

## Known limitations (MVP)

- Swagger UI is publicly accessible (intentional, demo purpose).
- Demo account (`demo / demo`) shared by all users.
- No rate limiting or advanced security hardening yet.

## Backlog / known issues

- Project board: https://github.com/users/manooweb/projects/4/views/1

## Infrastructure (MVP)

- Frontend: Vercel
- Backend: Railway (Spring Boot + PostgreSQL)
- Database migrations: Flyway

---

## Repository structure

- `backend/` : Spring Boot REST API (Projects, Tasks, JWT authentication)
- `frontend/` : Angular UI (login, projects, project details, tasks)
- `bruno/` : API test collections (manual + e2e)
- `docker-compose.yml` : PostgreSQL for local development

---

## Quick start (fullstack)

### Prerequisites

- Java 21
- Node.js + npm
- Docker + Docker Compose

### 1) Start the database

```bash
docker compose up -d
```

### 2) Start the Spring Boot backend

```bash
cd backend
./mvnw spring-boot:run -Dspring-boot.run.profiles=docker
```

### 3) Start the Angular frontend

```bash
cd frontend
npm install
npm run start
```

> The frontend uses an Angular proxy configuration for API calls,
> therefore it must be started via the `start` npm script.

---

## Stop services

### Stop database (keep data)

```bash
docker compose down
```

### Stop database and reset data (remove volumes)

```bash
docker compose down -v
```

---

## Useful URLs

### Frontend

- UI: http://localhost:4200

### Backend

- Swagger UI: http://localhost:8080/swagger-ui.html
- OpenAPI JSON: http://localhost:8080/v3/api-docs

---

## Authentication (JWT)

### Backend

- `POST /api/v1/auth/login` → returns a JWT token
- All `/api/v1/**` endpoints are protected (except login & swagger)
- Required header: `Authorization: Bearer <token>`

### Frontend

- Login page
- JWT token stored client-side
- HTTP interceptor automatically adds `Authorization: Bearer <token>`
- Route guard protects authenticated routes
- Logout clears the token

---

## Functional scope (MVP v0.16.1)

### Projects

- List projects
- Create project via Angular Material dialog
- Project detail page: `/projects/:id`

### Tasks (inside a project)

- List project tasks
- Create task via dialog:
  - title (required)
  - description (optional)
  - dueDate (datepicker, default = today)
  - status (TODO / IN_PROGRESS / DONE)
- Change status with a single click:
  - rotation TODO → IN_PROGRESS → DONE → TODO
  - backend PATCH call
- User feedback via snackbars (success / error)

---

## API testing with Bruno

- Manual requests:
  - `bruno/backend/Projects`
  - `bruno/backend/Tasks`
- Full E2E scenario:
  - `bruno/backend/e2e`

Run E2E tests locally:

```bash
npm install
npm run test:api
```

API tests are also executed in CI using GitHub Actions.

---

## Backend tests (JUnit / Mockito)

Backend tests can be executed with:

```bash
cd backend
./mvnw test
```

Test coverage is intentionally minimal at this stage and will be extended incrementally.

---

## Frontend tests (Angular / Karma / Jasmine)

Frontend unit tests can be executed with:

```bash
cd frontend
npm install
npm test -- --watch=false
```

Run tests with a headless browser (useful for CI):

```bash
cd frontend
npm test -- --watch=false --browsers=ChromeHeadless
```

Frontend tests are also executed in CI using GitHub Actions.

---

## Project philosophy

- Angular **standalone components only**
- Simple template-driven forms on purpose
- Backend as the single source of truth
- No premature abstraction
- Focus on clarity and maintainability

---

## Planned improvements

- UI/UX improvements (layout, spacing, responsive)
- Accessibility
- Internationalization (i18n)
- Deployment
