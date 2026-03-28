# tryfastapinotes

A small FastAPI notes API for learning layered backend structure, authentication, and testing.

## Current Status

- Stage 1 feature cleanup is complete for the current scope.
- Stage 2 authorization work is complete.
- Stage 3 automated test coverage is complete for the current scope.
- Stage 4 Alembic migration setup is complete for the current scope.
- Stage 5 note-list query improvements are complete for the current scope.
- Settings and environment cleanup now centralize the database URL in `app/settings.py`.
- Tests now build the test database through Alembic migrations instead of `create_all()`.
- The current test suite passes with `19 passed`.

## Current Direction

- public note reads
- authenticated note creation
- owner-only note update and delete
- JWT-based login

## Project Conventions

- routers handle request flow, auth, permissions, and HTTP errors
- `app/crud.py` handles database operations
- `app/schemas.py` defines request and response contracts
- new SQLAlchemy code should use 2.0 style query patterns
- tests are currently organized by area: users, notes, and note authorization
- once Alembic is introduced, test setup should strongly consider running migrations too so test schema matches real schema workflow

## SQLAlchemy Style

- prefer `select(...)` over new uses of legacy `db.query(...)`
- prefer `db.scalars(stmt).first()` for single-object lookups
- prefer `db.scalars(stmt).all()` for list reads

## Current Scope Completion

- note-list sorting is wired through the notes router and CRUD layer
- database configuration is read from `app/settings.py`
- test setup now recreates `test.db` and runs `alembic upgrade head`
- the current learning slice is complete and ready to be treated as a finished checkpoint

## Query Improvements

- `GET /notes/` supports optional `weather` filtering.
- `GET /notes/` supports pagination with `skip` and `limit`.
- `GET /notes/` supports `order_by=created_at`.
- Query construction stays in `app/crud.py`, while `app/routers/notes.py` only accepts and passes query parameters through.

## Migration Notes

- Alembic now manages schema history for the main app database.
- Alembic also drives test database setup through `tests/conftest.py`.
- The project has an initial baseline migration plus a follow-up migration adding `summary` to `notes`.
- The initial migration was corrected so a fresh database can be built from revision zero.
- Normal app startup no longer relies on `Base.metadata.create_all(...)`.
- Test startup no longer relies on `Base.metadata.create_all(...)` either.
- Common setup pitfalls encountered during learning:
  - leaving the default placeholder database URL in `alembic.ini`
  - forgetting to expose `Base.metadata` in `alembic/env.py`
  - removing `create_db_and_tables()` before removing its import from `app.main`
  - letting tests create tables directly from models can hide broken migration history
