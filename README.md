# springboot-rest-api-demo

[![Backend QA](https://github.com/manooweb/springboot-rest-api-demo/actions/workflows/backend.yml/badge.svg)](https://github.com/manooweb/springboot-rest-api-demo/actions/workflows/backend.yml)
[![Frontend QA](https://github.com/manooweb/springboot-rest-api-demo/actions/workflows/frontend.yml/badge.svg)](https://github.com/manooweb/springboot-rest-api-demo/actions/workflows/frontend.yml)
[![API E2E (Bruno)](https://github.com/manooweb/springboot-rest-api-demo/actions/workflows/api-e2e-bruno.yml/badge.svg)](https://github.com/manooweb/springboot-rest-api-demo/actions/workflows/api-e2e-bruno.yml)
[![Backend SonarQube](https://github.com/manooweb/springboot-rest-api-demo/actions/workflows/backend-sonarqube.yml/badge.svg)](https://github.com/manooweb/springboot-rest-api-demo/actions/workflows/backend-sonarqube.yml)
[![Frontend SonarQube](https://github.com/manooweb/springboot-rest-api-demo/actions/workflows/frontend-sonarqube.yml/badge.svg)](https://github.com/manooweb/springboot-rest-api-demo/actions/workflows/frontend-sonarqube.yml)
[![Deployment](https://github.com/manooweb/springboot-rest-api-demo/actions/workflows/deploy.yml/badge.svg)](https://github.com/manooweb/springboot-rest-api-demo/actions/workflows/deploy.yml)
[![License: MIT](https://img.shields.io/badge/license-MIT-green.svg)](https://github.com/manooweb/springboot-rest-api-demo/blob/main/LICENSE)

**Backend**

[![Backend Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=manooweb_springboot-rest-api-demo-backend&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=manooweb_springboot-rest-api-demo-backend)
[![Backend Coverage](https://sonarcloud.io/api/project_badges/measure?project=manooweb_springboot-rest-api-demo-backend&metric=coverage)](https://sonarcloud.io/summary/new_code?id=manooweb_springboot-rest-api-demo-backend)

**Frontend**

[![Frontend Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=manooweb_springboot-rest-api-demo-frontend&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=manooweb_springboot-rest-api-demo-frontend)
[![Frontend Coverage](https://sonarcloud.io/api/project_badges/measure?project=manooweb_springboot-rest-api-demo-frontend&metric=coverage)](https://sonarcloud.io/summary/new_code?id=manooweb_springboot-rest-api-demo-frontend)

---

## 🚀 Overview

**Fullstack demo project** built with a modern Java / Angular stack.

- **Backend**: Spring Boot 3 (Java 21), PostgreSQL, Flyway, Spring Security, JWT
- **Frontend**: Angular 20 + Angular Material (standalone components only)
- **API documentation**: OpenAPI / Swagger
- **API tests**: Bruno (manual + E2E in CI)

---

## 🌐 Live demo (production)

- Frontend: https://projects.manooweb.fr
- API: https://projects-api.manooweb.fr
- Swagger UI: https://projects-api.manooweb.fr/swagger-ui/index.html
- Healthcheck: https://projects-api.manooweb.fr/api/v1/health
- Demo account: `demo / demo`

Additional cloud deployments:

| Platform | Frontend | API |
| --- | --- | --- |
| AWS | https://sp-1daf84dd962046f19a9b3e11971c3b34.ecs.eu-west-3.on.aws | https://sp-7328faaeeaea4fd99620d217a37df837.ecs.eu-west-3.on.aws |
| GCP | https://spring-boot-api-demo-frontend-752012131551.europe-west1.run.app | https://springboot-rest-api-demo-752012131551.europe-west1.run.app |
| Azure | https://sb-rest-api-demo-frontend.mangocliff-83abab0c.francecentral.azurecontainerapps.io | https://springboot-rest-api-demo-backend.mangocliff-83abab0c.francecentral.azurecontainerapps.io |

---

## 📦 Public MVP release

The currently deployed public MVP corresponds to:

- **v0.21.0** — JWT cookie authentication and frontend session handling

Full release notes:
https://github.com/manooweb/springboot-rest-api-demo/releases/tag/v0.21.0

---

## ⚠️ Known limitations (MVP)

- Swagger UI is publicly accessible (intentional, demo purpose)
- Demo account (`demo / demo`) is shared
- No rate limiting or advanced security hardening yet

---

## 🧭 Backlog

- Project board: https://github.com/users/manooweb/projects/4/views/1

---

## 🏗️ Infrastructure (MVP)

- Hosting: **OVHcloud VPS (France – Strasbourg)**
- Reverse proxy: Traefik (HTTPS via Let's Encrypt)
- Frontend: Angular served via Nginx (Docker)
- Backend: Spring Boot (Docker)
- CI/CD: GitHub Actions (SSH deployment)
- Database: PostgreSQL (Docker)
- Migrations: Flyway


```mermaid
flowchart LR

  A[User Browser]

  subgraph "OVHcloud VPS (France - Strasbourg)"
    T["Traefik<br/>HTTPS + Let's Encrypt"]

    subgraph Frontend
      F["Angular App<br/>served by Nginx"]
    end

    subgraph Backend
      B["Spring Boot API"]
      DB[("PostgreSQL + Flyway")]
    end
  end

  A -->|HTTPS| T
  T -->|projects.manooweb.fr| F
  T -->|projects-api.manooweb.fr| B

  F -->|API calls| B
  B --> DB
```

---

## 📁 Repository structure

- `backend/` : Spring Boot REST API
- `frontend/` : Angular application
- `bruno/` : API test collections
- `docker-compose.yml` : PostgreSQL for local dev

---

## ⚙️ Quick start (fullstack)

### Prerequisites

- Java 21
- Node.js + npm
- Docker + Docker Compose

### 1) Start database

    docker compose up -d

### 2) Create local backend environment file

Copy the example file and fill in the expected values:

    cp backend/.env.example backend/.env

The backend loads `backend/.env` through Spring Boot config import in local runs.
Deployment environments should provide the same variables directly through the target platform.

### 3) Start backend

    cd backend
    ./mvnw spring-boot:run -Dspring-boot.run.arguments="--spring.profiles.active=dev --server.address=0.0.0.0"

### 4) Start frontend

    cd frontend
    npm install
    npm run start:devlan

The backend and frontend listen on `0.0.0.0` so they can be reached from another device on the local network.
For LAN tests, make sure `frontend/src/environments/environment.devlan.ts` points to the host machine IP.

---

## 🛑 Stop services

    docker compose down

Reset data:

    docker compose down -v

---

## 🔗 Useful URLs

### Frontend

- http://localhost:4200

### Backend

- Swagger: http://localhost:8080/swagger-ui.html
- OpenAPI: http://localhost:8080/v3/api-docs

---

## 🔐 Authentication (JWT)

### Backend

- `POST /api/v1/auth/login`
- Protected routes: `/api/v1/**`
- Header: `Authorization: Bearer <token>`

### Frontend

- Login page
- JWT stored client-side
- HTTP interceptor
- Route guard
- Logout clears token

---

## 🧪 API testing (Bruno)

- Collections: `bruno/backend`
- E2E: `bruno/backend/e2e`

Run locally:

    npm install
    npm run test:api

---

## 🧪 Backend tests

    cd backend
    ./mvnw test

---

## 🧪 Frontend tests

    cd frontend
    npm install
    npm test -- --watch=false --browsers=ChromeHeadless

---

## 🔍 Code quality

### SonarQube / SonarCloud

Sonar analysis for both backend and frontend is run only in CI via GitHub Actions and SonarCloud.

- Backend analysis: `.github/workflows/backend-sonarqube.yml`
- Frontend analysis: `.github/workflows/frontend-sonarqube.yml`

For local checks before push, use:

- backend: `cd backend && ./mvnw clean verify`
- frontend: `cd frontend && npm run qa`

### Formatting

#### Backend

Java code formatting is enforced using Spotless.

Verify formatting:

```bash
./backend/mvnw -f backend spotless:check
```

Fix formatting:

```bash
./backend/mvnw -f backend spotless:apply
```

#### Frontend

Frontend code formatting is enforced using prettier. Additional code quality rules are checked with ESLint.

Verify formatting and code quality rules:

```bash
cd frontend
npm run format:check && npm run lint
```

Fix formatting:

```bash
npm run format
```

---

## 🧠 Project philosophy

- Angular standalone components only
- Simple forms (intentional)
- Backend = source of truth
- No over-engineering
- Focus on clarity

---

## 🔮 Planned improvements

- UI/UX improvements
- Accessibility
- i18n
- Security hardening
- Performance optimizations
