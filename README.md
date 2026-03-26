# tryfastapinotes

A small FastAPI notes API for learning layered backend structure, authentication, and testing.

## Current Status

- Stage 1 feature cleanup is complete for the current scope.
- Stage 2 authorization work is complete.
- Stage 3 automated test coverage is complete for the current scope.
- Stage 4 Alembic migration setup is complete for the current scope.
- The current test suite passes with `16 passed`.

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

## SQLAlchemy Style

- prefer `select(...)` over new uses of legacy `db.query(...)`
- prefer `db.scalars(stmt).first()` for single-object lookups
- prefer `db.scalars(stmt).all()` for list reads

## Next Focus

- Stage 5 query improvements
- optional future cleanup of test setup if you want tests to run through migrations instead of `create_all()`

## Migration Notes

- Alembic now manages schema history for the main app database.
- The project has an initial baseline migration plus a follow-up migration adding `summary` to `notes`.
- Normal app startup no longer relies on `Base.metadata.create_all(...)`.
- Common setup pitfalls encountered during learning:
  - leaving the default placeholder database URL in `alembic.ini`
  - forgetting to expose `Base.metadata` in `alembic/env.py`
  - removing `create_db_and_tables()` before removing its import from `app.main`
