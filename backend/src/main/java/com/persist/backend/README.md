# PERSIST Backend

Spring Boot + MySQL backend for PERSIST.

## Setup

1. Install Java 21+, Maven, MySQL.
2. Create the database: `mysql -u root -e "CREATE DATABASE persist_db;"`
3. Copy `.env.example` to `.env` and set `DB_PASSWORD` if your local MySQL root user has one (leave blank otherwise).
4. Run: `./mvnw spring-boot:run`
5. Server starts on `http://localhost:8080`

## API Overview

See the root `README.md` for the full endpoint list.

## Running Tests

```
./mvnw test
```