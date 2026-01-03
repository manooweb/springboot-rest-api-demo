# springboot-rest-api-demo

[![Backend CI](https://github.com/manooweb/springboot-rest-api-demo/actions/workflows/backend.yml/badge.svg)](https://github.com/manooweb/springboot-rest-api-demo/actions/workflows/backend.yml) [![API E2E (Bruno)](https://github.com/manooweb/springboot-rest-api-demo/actions/workflows/api-e2e-bruno.yml/badge.svg)](https://github.com/manooweb/springboot-rest-api-demo/actions/workflows/api-e2e-bruno.yml) [![License: MIT](https://img.shields.io/badge/license-MIT-green.svg)](https://github.com/manooweb/springboot-rest-api-demo/blob/main/LICENSE)

Demo project to showcase a modern Java backend stack using Spring Boot.

This repository is built step by step as a technical MVP to demonstrate:

- Spring Boot REST API
- Database access with JPA / Hibernate
- Database migrations with Flyway
- Dockerized PostgreSQL
- API documentation with OpenAPI / Swagger
- API testing with Bruno
The project is organized as a mono-repo.

---

## Repository structure

- backend
  Spring Boot application (REST API)

- frontend
  Frontend application (to be implemented later)

- bruno
  Bruno API test collection

---

## Run backend locally

### Prerequisites

- Java 21
- Docker + Docker Compose

### Start PostgreSQL

```bash
docker compose up -d
```

### Start Spring Boot API

```bash
cd backend
./mvnw spring-boot:run -Dspring-boot.run.profiles=docker
```

### URLs

- API: <http://localhost:8080/v3/api-docs>
- Swagger UI: <http://localhost:8080/swagger-ui.html>

---

## Stop and reset PostgreSQL (Docker)

### Stop PostgreSQL

```bash
docker compose down
```

This stops the PostgreSQL container but keeps the database data.

### Restart PostgreSQL

```bash
docker compose up -d
```

### Reset database (WARNING)

```bash
docker compose down -v
```

This removes the PostgreSQL container and deletes all database data.
Use this only if you want to start from a clean database.

---

## API documentation (Swagger / OpenAPI)

The API is documented using Springdoc OpenAPI.

Once the backend is running, Swagger UI is available at:

- <http://localhost:8080/swagger-ui.html>

---

### API testing with Bruno

This repository includes a fully versioned API test suite using **Bruno**, covering both **manual testing** and **automated end-to-end (E2E)** scenarios.

All Bruno collections are stored directly in the repository and can be executed locally or in CI.

---

### Bruno collections structure

- **bruno/backend/Projects**
  Manual API tests for **Projects** endpoints
  (Create, List, Get, Delete)

- **bruno/backend/Tasks**
  Manual API tests for **Tasks** endpoints
  (Create, List, Get, Update status, Delete)

- **bruno/backend/e2e**
  Automated **end-to-end scenario** covering the full lifecycle:

1. Create Project
2. List Projects and verify creation
3. Get Project
4. Create Task
5. List Tasks and verify creation
6. Get Task
7. Update Task status
8. Delete Task
9. Verify Task deletion
10. Delete Project
11. Verify Project deletion

The E2E collection uses **runtime variables** to automatically propagate `projectId` and `taskId` between requests.

---

### Manual API testing (Bruno UI)

1. Start PostgreSQL using Docker
2. Start the Spring Boot backend
3. Open Bruno
4. Open the collection located in `bruno/backend`
5. Run the requests manually in the suggested order

Manual collections rely on **pre-request variables** (such as `baseUrl`) and are designed for readability and onboarding.

---

### Automated API testing (local)

The project uses **Bruno CLI** to run automated E2E API tests locally.

#### Prerequisites

- Node.js
- PostgreSQL running
- Spring Boot backend running

### Run E2E tests

```bash
npm run test:api
```

This command executes the E2E collection located in `bruno/backend/e2e`.

```bash
npm install
```

is necessary the first time you want to run tests to install Bruno CLI.

---

### API testing in CI (GitHub Actions)

Automated API tests are executed in CI using **GitHub Actions**.

The workflow:

- Starts PostgreSQL
- Starts the Spring Boot backend using the Docker profile
- Runs the Bruno E2E test suite via Bruno CLI

This ensures the API is validated end-to-end on every push to the `main` branch.

---

### Notes

- Manual and automated tests intentionally coexist:
  - Manual collections are ideal for exploration and onboarding
  - E2E collections guarantee functional integrity
- Authentication (JWT) is not yet implemented and will be integrated later
- Error handling (404 / 409) will be improved in future iterations

---

## Database & migrations

- Database: PostgreSQL (Dockerized)
- ORM: JPA / Hibernate
- Migrations: Flyway

Database schema is managed via versioned SQL migrations located in:

- backend/src/main/resources/db/migration

Flyway automatically runs migrations on application startup.

---

## Project status

This project is intentionally built incrementally.

Current focus:

- Backend API (Projects / Tasks)
- Clean architecture and best practices
- Readability for Java / Spring developers

Frontend, authentication and CI/CD will be added later.

---
