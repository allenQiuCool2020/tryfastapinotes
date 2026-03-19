# Skills

This file defines simple command-style collaboration toggles for this project.

## Study Mode

Use these commands in chat:

- `$study-mode on`
- `$study-mode off`

Behavior:

- `$study-mode on`: Use teaching mode. Explain reasoning more fully, compare FastAPI with Django when helpful, and teach step by step before or alongside code changes.
- `$study-mode off`: Return to normal mode. Keep explanations shorter and focus on implementation and the next working slice.
- These toggles are chat conventions for this repo and can be used at any time without editing project files.

## Optional Depth Hint

If needed, the user can also add a plain-English depth hint, such as:

- `go deeper`
- `keep it concise`
- `explain step by step`

This project does not currently use a numeric study level system. Keep the mode switch simple unless the user later decides they want more granular control.

## Scope

- These commands control collaboration style, not application behavior.
- Project coding conventions still live in `AGENTS.md`.
- The current preferred command-style switch is the simple study toggle, not a numeric study level system.
