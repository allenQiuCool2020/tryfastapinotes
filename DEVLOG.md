# Devlog

## 2026-03-21

### Current project status

- The project has working user registration and user read-by-id endpoints.
- Passwords are hashed before storage.
- JWT login is implemented.
- Auth helpers live in `app/security.py`.
- JWT-related settings live in `app/settings.py`.
- Protected note creation uses the authenticated user from the token.
- Public note read-by-id works.
- Note update and delete endpoints are implemented.
- Owner-only authorization for note update and delete is implemented.
- The current automated test file covers the main auth and authorization flows.

### Completed work by stage

- Stage 1 completed in part:
  - user registration works
  - user read-by-id works
  - password hashing works
  - JWT login works
  - protected note creation works
  - public note read-by-id works
- Stage 2 completed:
  - update note endpoint
  - delete note endpoint
  - owner-only authorization rules
  - owner vs non-owner authorization tests
- Stage 3 completed in part:
  - core auth and authorization test coverage exists

### Remaining Stage 1 items

- Add the remaining tests for the completed Stage 1 items.

### Remaining test coverage tied to unfinished Stage 1 work

- Test duplicate username failure.
- Test note list endpoint.
- Test validation failures for invalid note input.

### Next recommended implementation order

1. Finish the remaining Stage 1 feature items.
2. Add the tests for those new Stage 1 behaviors.
3. Start Stage 4 by introducing Alembic and creating the initial migration.

## 2026-03-22

### Stage 1 feature cleanup completed

- Added a `Token` response schema for login responses.
- Declared `response_model` on `POST /auth/login`.
- Added duplicate-username handling in the user router with `400` responses.
- Added basic note validation for non-empty `title` and `content`.
- Added public `GET /notes/` list endpoint.
- Updated note creation to return `201`.

### Query-style decision

- SQLAlchemy 2.0 style is now the default direction for new query code in this repo.
- Prefer `select(...)` plus `db.scalars(stmt).first()` or `db.scalars(stmt).all()` in CRUD code.
- Avoid adding new legacy `db.query(...)` patterns unless there is a specific learning reason.

### Next focus

1. Manually verify the Stage 1 flows in `/docs`.
2. Add automated tests for duplicate username, note list, and validation failures.
3. Continue Stage 3 coverage expansion before moving to Alembic.

### Test file layout

- `tests/test_users.py` covers main route, user registration, and login flows.
- `tests/test_notes.py` covers core note creation and public read flows.
- `tests/test_notes_authorization.py` covers owner and non-owner update/delete behavior.
- The remaining Stage 1 tests for duplicate username, note list, and validation are intentionally still to be written.

## 2026-03-26

### Stage 3 completed for current scope

- Updated `POST /users/` to return `201 Created`.
- Aligned note update validation so optional fields still reject empty strings when provided.
- Finished the current automated test slice across users, notes, and note authorization.
- Confirmed the current suite passes with `16 passed`.

### Current testing snapshot

- `tests/test_users.py` covers registration, duplicate username failure, login success, and login failure.
- `tests/test_notes.py` covers protected note creation, unauthenticated note creation rejection, public note read-by-id, and note validation failure.
- `tests/test_notes_authorization.py` covers authenticated update/delete and non-owner authorization failures.

### Next focus

1. Start Stage 4 by introducing Alembic.
2. Create the initial migration for the current schema.
3. Practice a small schema change through a follow-up migration.

### Stage 4 completed for current scope

- Installed and initialized Alembic.
- Pointed `alembic.ini` at the app SQLite database.
- Updated `alembic/env.py` to import `Base` and expose `target_metadata = Base.metadata`.
- Created an initial baseline migration for the existing schema.
- Added a follow-up migration to add nullable `summary` to `notes`.
- Verified Alembic state through the `alembic_version` table in SQLite.
- Removed normal app-startup reliance on `create_all()` by cleaning up `app.main`.

### Errors encountered and how they were resolved

- `sqlalchemy.exc.NoSuchModuleError: Can't load plugin: sqlalchemy.dialects:driver`
  - Cause: `alembic.ini` still had the default placeholder URL.
  - Resolution: changed `sqlalchemy.url` to `sqlite:///./database.db`.

- `Can't proceed with --autogenerate option; ... does not provide a MetaData object`
  - Cause: `alembic/env.py` was not yet wired to the app metadata.
  - Resolution: imported `Base` and models, then set `target_metadata = Base.metadata`.

- `ImportError: cannot import name 'create_db_and_tables' from 'app.database'`
  - Cause: `create_db_and_tables()` was commented out in `app/database.py` while `app.main` still imported it.
  - Resolution: removed the stale import/call path from `app.main` so startup no longer depends on `create_all()`.

- `summary` was added in the model and schema but returned as `None` in tests
  - Cause: CRUD create/update flow had not been wired to save the new field.
  - Resolution: updated CRUD logic and then reran tests.

### Current migration snapshot

- Initial migration: `8fbaab022864_initial_schema.py`
- Follow-up migration: `259b5dd3d9d6_add_summary_to_notes.py`
- The app database now tracks Alembic revision state through `alembic_version`.

### Next focus

1. Start Stage 5 query improvements.
2. Consider filtering, pagination, and optional sorting for note lists.
3. Optionally revisit whether test setup should eventually run through Alembic migrations too.

## 2026-03-27

### Stage 5 completed for current scope

- Added optional `weather` filtering to `GET /notes/`.
- Added pagination support to `GET /notes/` with `skip` and `limit`.
- Added `order_by=created_at` support to `GET /notes/`.
- Kept query-building logic in `app/crud.py` and kept the notes router thin.
- Confirmed the current suite passes with `19 passed`.

### Current testing snapshot

- `tests/test_users.py` still covers registration, duplicate username failure, login success, and login failure.
- `tests/test_notes.py` now also covers the current weather-filtering and pagination slice.
- `tests/test_notes_authorization.py` continues to cover authenticated update/delete and non-owner authorization failures.

### Next focus

1. Improve settings and environment separation if needed.
2. Consider whether test setup should later run through Alembic migrations too.

## 2026-03-28

### Stage 5 cleanup completed

- Added note-list sorting support for `order_by=created_at`.
- Kept request validation in the notes router with `Literal["created_at"]`.
- Kept SQL ordering logic in `app/crud.py` with SQLAlchemy `order_by(...)`.
- Moved `database_url` into `app/settings.py` so DB config now lives with the rest of the app settings.

### Test setup now runs through Alembic

- Updated `tests/conftest.py` so each test recreates `test.db`, runs `alembic upgrade head`, and then serves requests through the test DB override.
- This replaces the older `Base.metadata.create_all(...)` test setup.
- The change makes test schema creation follow the same migration workflow as the main app database.

### Migration issue found and fixed

- Switching tests to Alembic exposed that the initial migration file was empty for a fresh database build.
- Updated `8fbaab022864_initial_schema.py` so the baseline migration creates `users` and `notes`.
- Kept `259b5dd3d9d6_add_summary_to_notes.py` as the follow-up migration that adds `summary`.
- Verified both `database.db` and `test.db` track revision `259b5dd3d9d6` through the `alembic_version` table.

### Practical lesson

- Once Alembic is introduced as the schema workflow, tests should strongly consider using Alembic too.
- Otherwise, `create_all()` can hide migration-history problems by creating tables directly from models instead of from revision files.

### Current project status

- The current roadmap slice is complete for this learning project.
- The project now includes auth, authorization, public note reads, protected note writes, query improvements, centralized settings, Alembic migrations, and Alembic-based test setup.
