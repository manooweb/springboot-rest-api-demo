# springboot-rest-api-demo

[![Backend CI](https://github.com/manooweb/springboot-rest-api-demo/actions/workflows/backend.yml/badge.svg)](https://github.com/manooweb/springboot-rest-api-demo/actions/workflows/backend.yml) [![API E2E (Bruno)](https://github.com/manooweb/springboot-rest-api-demo/actions/workflows/api-e2e-bruno.yml/badge.svg)](https://github.com/manooweb/springboot-rest-api-demo/actions/workflows/api-e2e-bruno.yml) [![License: MIT](https://img.shields.io/badge/license-MIT-green.svg)](https://github.com/manooweb/springboot-rest-api-demo/blob/main/LICENSE)

# springboot-rest-api-demo

**Fullstack demo project** built with a modern Java / Angular stack.

- **Backend**: Spring Boot 3 (Java 21), PostgreSQL, Flyway, Spring Security, JWT
- **Frontend**: Angular 20 + Angular Material (**standalone components only**)
- **API documentation**: OpenAPI / Swagger
- **API tests**: Bruno (manual + E2E in CI)

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

## Project philosophy

- Angular **standalone components only**
- Simple template-driven forms on purpose
- Backend as the single source of truth
- No premature abstraction
- Focus on clarity and maintainability

---

## Planned improvements

- Angular frontend tests (unit, auth, interceptor, guard)
- UI/UX improvements (layout, spacing, responsive)
- Internationalization (i18n)
- Deployment
