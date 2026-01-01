# springboot-rest-api-demo

[![License: MIT](https://img.shields.io/badge/license-MIT-green.svg)](https://github.com/manooweb/springboot-rest-api-demo/blob/main/LICENSE)

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

## API testing with Bruno

This repository contains a Bruno collection to test the backend REST API.

### Location

- bruno/backend

### Steps

1. Start PostgreSQL with Docker
2. Start the Spring Boot backend
3. Open Bruno
4. Open the collection located in bruno/backend
5. Run the requests in this order:
   - Create Project
   - List Projects
   - Get Project by id
   - Delete Project

The collection automatically stores the created project id and reuses it in subsequent requests.

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
