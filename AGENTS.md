# Project Guide

This project uses FastAPI with a simple layered structure.

- Keep routers thin. Route files should handle HTTP concerns, call lower layers, and return responses.
- Keep database logic in `app/crud.py`. Queries, inserts, updates, and deletes should live there.
- Keep request and response schemas in `app/schemas.py`.
- Keep SQLAlchemy table definitions in `app/models.py`.
- Keep database engine and session setup in `app/database.py`.
- Put security helpers such as password hashing, JWT creation, and token decoding in a dedicated module like `app/security.py`.
- Keep auth routes in `app/routers/auth.py`. Use that router for login and shared auth dependencies like `get_current_user`.

# Layer Mindset

- Treat `app/schemas.py` as the API contract between client and server. Schemas define the shape of request data coming in and response data going out.
- Treat `app/crud.py` as the database operation layer. CRUD functions should focus on reading and mutating data, not on HTTP decisions.
- Treat route files such as `app/routers/notes.py` as the place for request flow, dependencies, authentication, authorization, and API errors.
- Put ownership checks and other permission rules in the relevant router layer for that resource. For example, note ownership checks belong in `app/routers/notes.py`, not in `app/routers/users.py`.
- A practical rule of thumb:
  - schemas define the contract
  - crud performs the data operation
  - routers decide whether the request is allowed and how to respond

# API Conventions

- Use `response_model` on routes to control API output and avoid leaking internal fields.
- Use `status_code=201` for successful create endpoints.
- Raise `HTTPException` for common API errors such as `404`, `401`, and `400`.
- Use dependencies like `get_db` and later `get_current_user` to avoid repeating setup logic.
- For protected write routes, derive the user from the token instead of accepting `user_id` from the client.

# Practical Mindset

- Build one small working slice at a time, then test it in `/docs` or with `curl`.
- Before writing or expanding automated tests, do a quick manual check in `/docs` for the current slice so request shape, auth flow, and status codes are confirmed first.
- Prefer clear and simple code over clever abstractions.
- Match sync vs async to the actual stack. With sync SQLAlchemy `Session`, regular `def` routes are fine.
- Prefer model or database defaults for fields like timestamps when possible.
- Do not store raw passwords. Hash them before saving users.
- In this project, login returns a JWT token and protected routes should validate that token with `get_current_user`.
- Public-note design: note reads can stay public, but note creation should require authentication.
- Prefer best practice by default for implementation, testing, and workflow decisions unless there is a clear learning reason to keep a simpler temporary version first.

# SQLAlchemy Mindset

- Use SQLAlchemy 2.0 style for new query code in this project.
- Prefer `select(...)` statements over the legacy `db.query(...)` style for newly written CRUD code.
- For single ORM-object lookups, prefer `db.scalars(stmt).first()`.
- For list reads, prefer `db.scalars(stmt).all()`.
- Reserve `db.execute(stmt)` for cases where row-level or mixed-column result handling is actually needed.
- Keep SQLAlchemy query construction in `app/crud.py`, while routers keep ownership checks, auth checks, and HTTP exceptions.

# Testing Mindset

- Use automated tests as the main verification tool once a slice works manually.
- Keep shared test setup in `tests/conftest.py`, especially the test client, test database override, and reusable fixtures/helpers.
- Keep tests self-contained. Each test should create the data it needs unless shared setup is intentionally extracted into fixtures.
- Test both positive and negative paths for important auth behavior:
  - success with valid credentials
  - `401` for missing or invalid authentication
  - `403` for authenticated-but-forbidden access
  - `404` for missing resources when that is the intended behavior
- For dynamic values such as timestamps, IDs, and tokens, prefer asserting presence or basic validity instead of exact hard-coded values unless the value is intentionally controlled in the test.
- Build the test suite in dependency order:
  - basic route/app test
  - user creation
  - login
  - authenticated note creation
  - unauthorized note creation
  - authorization tests for update/delete

# Collaboration Modes

- Normal mode: Keep explanations short, make the code changes directly, and focus on shipping the next working slice.
- Study mode: Explain the reasoning more fully, compare FastAPI patterns with Django when helpful, and teach step by step before or alongside code changes.
- When the user asks to switch modes, follow that mode until the user changes it again.

# Current Auth Flow

- `POST /users/` creates a user and stores a hashed password.
- Password hashing and verification live in `app/security.py` using `pwdlib`.
- JWT creation lives in `app/security.py`.
- JWT settings such as `secret_key`, `algorithm`, and token expiry live in `app/settings.py`.
- `POST /auth/login` verifies username and password, then returns a bearer token.
- `app/routers/auth.py` provides `get_current_user` by decoding the bearer token, reading the `sub` claim, and loading the matching user from the database.
- `POST /notes/` is protected and should use `current_user.id` from the token, not a client-provided `user_id`.
- `GET /notes/` is public in the current product direction and returns a list of public notes.
- `PATCH /notes/{note_id}` and `DELETE /notes/{note_id}` are protected and enforce owner-only access in `app/routers/notes.py`.
- `GET /notes/{note_id}` can remain public for this public-notes version of the app.
- Notes currently support an optional `weather` field in the schema and model.

# Roadmap

## Current Position

- Current stage: Stage 5 query improvements completed for the current learning scope
- Current checkpoint:
  - Implemented so far:
    - user registration exists
    - user read-by-id exists
    - password hashing is implemented
    - JWT login is implemented
    - `Token` response schema is implemented
    - `POST /auth/login` declares a `response_model`
    - duplicate-username handling is implemented
    - basic note title/content validation is implemented
    - protected note creation uses the authenticated user from the token
    - public note list works
    - public note read-by-id works
    - note update exists
    - note delete exists
    - owner-only update/delete rules are enforced
    - tests cover registration, login, protected note creation, public note reads, duplicate usernames, validation failure, and owner-vs-non-owner authorization flows
    - Alembic is configured for the project database
    - an initial Alembic baseline migration exists
    - a follow-up Alembic migration added `summary` to `notes`
    - app startup no longer relies on `create_all()` for the main database
    - `GET /notes/` supports optional `weather` filtering
    - `GET /notes/` supports pagination with `skip` and `limit`
    - tests cover note-list filtering and pagination for the current Stage 5 slice
  - Stage status:
    - Stage 2 features are implemented
    - Stage 1 feature cleanup is aligned
    - Stage 3 testing is aligned with the current learning scope
    - Stage 4 migration learning goals are aligned with the current learning scope
    - Stage 5 query improvements are aligned with the current learning scope
  - Next focus:
    - optional sorting for note lists
    - settings and environment separation cleanup as needed
    - optional cleanup of test-database setup if migration-based tests are desired later

## Stage 1: Finish The Notes App Properly

- Keep the product direction as public notes:
  - public read
  - authenticated create
  - owner-only update/delete later
- Add a `Token` response schema for login output.
- Keep explicit response models in place for users, notes, and auth responses so internal fields are not exposed accidentally.
- Add duplicate-username handling on user creation.
- Add basic field validation such as non-empty note titles and content.
- Add a `GET /notes/` list endpoint.
- Treat `GET /notes/{note_id}` as public because that is the current intentional product rule for this repo.
- Decide and document `GET /notes/` explicitly:
  - default for this repo: public list of notes, matching the public-notes design
  - optional alternative if product direction changes later: authenticated "my notes" list
- Keep clear status-code and error-handling conventions:
  - `201` for successful creates
  - `400` for duplicate usernames and other business-rule errors
  - `401` for login failure or missing/invalid token
  - `404` for missing users or notes
  - `422` for request/schema validation errors handled by FastAPI and Pydantic
- Add tests for the Stage 1 slice:
  - register success
  - register duplicate username fails
  - login success
  - login wrong password fails
  - create note with token succeeds
  - create note without token fails
  - read note by id works
  - list notes works

Current status for Stage 1:
- done:
  - register success
  - duplicate username test
  - duplicate username handling
  - login success
  - login wrong password fails
  - create note with token succeeds
  - create note without token fails
  - note title/content validation
  - validation test coverage for invalid note input
  - public note list endpoint
  - note list endpoint test
  - read note by id works
  - explicit auth response schema for login
- still open:
  - none for the current Stage 1 scope

## Stage 2: Add Authorization Depth

- Add update note endpoint.
- Add delete note endpoint.
- Enforce owner-only update/delete rules.
- Add tests for owner vs non-owner access.
- Optionally add a `/users/me/` endpoint if a current-user debug endpoint becomes useful.

Current status for Stage 2:
- implemented

## Stage 3: Expand Test Coverage

- Broaden API test coverage across:
  - user flows
  - auth flows
  - note CRUD flows
  - authorization failures
  - validation errors

Current status for Stage 3:
- implemented for the current roadmap scope
- current tests are split across `tests/test_users.py`, `tests/test_notes.py`, and `tests/test_notes_authorization.py`
- authorization coverage is in place in `tests/test_notes_authorization.py`
- the current automated suite passes and covers the intended Stage 3 learning slice

## Stage 4: Learn Migrations

- Introduce Alembic.
- Create an initial migration for the current schema.
- Practice a schema evolution change, such as adding a new column.
- Move away from relying on `create_all` as the long-term schema workflow.

Current status for Stage 4:
- done:
  - Alembic installed and initialized
  - `alembic.ini` points to `sqlite:///./database.db`
  - `alembic/env.py` imports `Base` and model metadata
  - initial baseline migration created
  - follow-up migration created for `summary` on `notes`
  - `alembic_version` is present in SQLite and tracks the current revision
  - app startup no longer imports or calls `create_db_and_tables()`
- lessons learned:
  - if `alembic.ini` keeps the default placeholder URL, Alembic fails with `NoSuchModuleError` for `sqlalchemy.dialects:driver`
  - if `alembic/env.py` does not provide `target_metadata`, `--autogenerate` fails because Alembic cannot compare models to the database
  - if `create_db_and_tables()` is removed from `app/database.py` but still imported in `app/main.py`, the app and tests fail with an import error
  - adding a new DB field requires wiring across model, schema, and CRUD layers, not just model and schema

## Stage 5: Add Query Improvements

- Add filtering and pagination for note lists.
- Optionally add sorting.
- Improve settings and environment separation as needed.
- Add logging if useful.
- Optionally add Docker or other deployment-oriented tooling later.

Current status for Stage 5:
- implemented for the current roadmap scope
- `GET /notes/` now accepts optional `weather`, `skip`, and `limit` query parameters
- filtering and pagination query construction lives in `app/crud.py`
- the route in `app/routers/notes.py` stays thin and passes query parameters down to CRUD
- tests in `tests/test_notes.py` now cover the current filtering and pagination slice

## Stage 6: Build A Second Backend Project

- Build a task management API from scratch using the same architecture patterns:
  - models
  - schemas
  - routers
  - CRUD or service layer
  - authentication
  - migrations
- Use richer domain logic such as status, priority, due date, owner, filtering, sorting, and pagination.

## Stage 7: Frontend Integration

- After becoming comfortable building at least two backend APIs, start frontend integration.
- Learn React or Next.js and connect the frontend to your FastAPI APIs.
