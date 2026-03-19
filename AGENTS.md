# Project Guide

This project uses FastAPI with a simple layered structure.

- Keep routers thin. Route files should handle HTTP concerns, call lower layers, and return responses.
- Keep database logic in `app/crud.py`. Queries, inserts, updates, and deletes should live there.
- Keep request and response schemas in `app/schemas.py`.
- Keep SQLAlchemy table definitions in `app/models.py`.
- Keep database engine and session setup in `app/database.py`.
- Put security helpers such as password hashing, JWT creation, and token decoding in a dedicated module like `app/security.py`.
- Keep auth routes in `app/routers/auth.py`. Use that router for login and shared auth dependencies like `get_current_user`.

# API Conventions

- Use `response_model` on routes to control API output and avoid leaking internal fields.
- Use `status_code=201` for successful create endpoints.
- Raise `HTTPException` for common API errors such as `404`, `401`, and `400`.
- Use dependencies like `get_db` and later `get_current_user` to avoid repeating setup logic.
- For protected write routes, derive the user from the token instead of accepting `user_id` from the client.

# Practical Mindset

- Build one small working slice at a time, then test it in `/docs` or with `curl`.
- Prefer clear and simple code over clever abstractions.
- Match sync vs async to the actual stack. With sync SQLAlchemy `Session`, regular `def` routes are fine.
- Prefer model or database defaults for fields like timestamps when possible.
- Do not store raw passwords. Hash them before saving users.
- In this project, login returns a JWT token and protected routes should validate that token with `get_current_user`.
- Public-note design: note reads can stay public, but note creation should require authentication.

# Collaboration Modes

- Normal mode: Keep explanations short, make the code changes directly, and focus on shipping the next working slice.
- Study mode: Explain the reasoning more fully, compare FastAPI patterns with Django when helpful, and teach step by step before or alongside code changes.
- When the user asks to switch modes, follow that mode until the user changes it again.

# Current Auth Flow

- `POST /users/` creates a user and stores a hashed password.
- `POST /auth/login` verifies username and password, then returns a bearer token.
- `POST /notes/` is protected and should use `current_user.id` from the token, not a client-provided `user_id`.
- `GET /notes/{note_id}` can remain public for this public-notes version of the app.

# Near-Term Direction

- Add a response schema for login/token output.
- Add duplicate-username handling on user creation.
- Add tests for register, login, protected note creation, and unauthorized note creation.
- Optionally add a `/users/me/` endpoint later if a current-user debug endpoint becomes useful.
