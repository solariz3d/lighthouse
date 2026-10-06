# Verification & Testing

- Run the tests that cover the change before reporting success, in proportion to the risk: targeted tests for small or UI changes; full suites and mutation runs for changes whose bugs are invisible and costly (data formats, geometry, export, core maths) or once at a big landing
- When a test fails after your change, fix the implementation — never weaken, remove, or modify existing tests to make them pass unless the test itself is verifiably wrong
- If no test infrastructure exists, note this and suggest adding it rather than silently skipping verification
- When adding new functionality, add corresponding tests covering the primary path and at least one edge case
- When fixing a bug, first write or identify a test that reproduces the bug, then fix the implementation, then confirm the test passes
- Test behavior and outcomes, not implementation details — tests should survive internal refactoring without breaking
- Keep tests focused: one behavior per test, with a name that states it (several checks of that one behavior are fine)
- Test boundary conditions: empty inputs, null/missing values, maximum sizes, and invalid formats
- Prefer real dependencies over mocks when feasible; when mocking is necessary, mock at the boundary (external APIs, databases, file system) not internal modules

# Change Scope

- Make the minimal change necessary to accomplish the requested task
- Do not refactor, restyle, or "improve" code outside the direct scope of the current task
- Do not add features, abstractions, or configurability that were not requested
- Do not modify files not directly related to the task
- When touching shared code (utilities, base classes, interfaces, configs), trace all downstream consumers and verify they are unaffected
- If additional changes are genuinely necessary (e.g., a required dependency update), explain why before making them

# Error Handling & Edge Cases

- Preserve existing error handling patterns when modifying code — do not silently remove or simplify them
- Handle failure cases explicitly rather than assuming inputs will always be valid
- Prefer failing loudly and early over silently swallowing errors or returning default values
- When integrating with external systems (APIs, databases, file systems, network), assume operations can fail and handle accordingly
- Do not catch broad/generic exceptions unless re-throwing or logging — avoid hiding failures behind catch-all handlers

# Existing Patterns

- Before writing new code, examine the surrounding codebase for established patterns (naming, structure, error handling, logging, config) and follow them
- When the project has an existing way of doing something (logging, config access, dependency injection, API responses), use it rather than introducing a new approach
- Match the project's existing level of abstraction — do not introduce layers of indirection the codebase does not already use
- When multiple patterns exist in the codebase, follow the most recent or most prevalent one and note the inconsistency

# Dependencies & Imports

- Do not add new external dependencies without explicit confirmation — prefer what is already available in the project
- When functionality can be accomplished with existing dependencies or the standard library, use those first
- Verify any module or package you import is actually available in the project before using it
- When a new dependency is genuinely needed, explain the rationale and ensure version compatibility

# Safety & Destructive Operations

- Never delete or overwrite user data, config files, or database records without explicit confirmation
- When writing scripts or commands that modify state, prefer reversible operations and include safeguards
- Before running commands with side effects, explain what the command will do
- Do not hardcode sensitive values (credentials, production URLs, connection strings) — use environment variables or config files

# Search Before Assuming

- When uncertain about how a function, module, or pattern is used, search the codebase rather than guessing
- Before declaring something doesn't exist, search for it — the project may have utilities you haven't seen
- When modifying a function's signature or behavior, search for all call sites and ensure they are updated

# Documentation & Research

- When working with third-party libraries, frameworks, or APIs, search the web for current documentation rather than relying solely on training data — APIs and best practices evolve
- When encountering unfamiliar tools, configurations, or error messages, look up the latest documentation before guessing at a solution
- When the user references a specific version of a library or framework, verify current usage patterns and any breaking changes for that version
- Prefer official documentation and release notes over blog posts or Stack Overflow answers when sources conflict

# Security Practices

- Validate and sanitize all input at system boundaries (user input, API requests, file uploads, URL parameters)
- Never log, display, or include credentials (passwords, keys, tokens) in code, error messages, logs, comments or commits; other people's personal data in an app's own logs is handled the same way. The user's own personal details in his own notes and repos are his call: do not scrub or rewrite history for them
- Use parameterized queries or prepared statements for all database operations — never construct queries via string concatenation
- When handling authentication or authorization, fail closed (deny by default) rather than fail open
- Escape or sanitize output appropriately for its context (HTML, SQL, shell commands, URLs) to prevent injection attacks
- Do not disable or weaken security features (TLS verification, CORS, CSP, authentication) even in development or testing

# Change Documentation

- In a code project, maintain a `CHANGELOG.md` in the project root using [Keep a Changelog](https://keepachangelog.com/) format with sections: Added, Changed, Fixed, Removed, Security. Where a project already keeps its change record elsewhere (a journal, hand-backs), use that one and do not start a second
- Update the changelog with every meaningful change — features, bug fixes, breaking changes, and removals
- Each changelog entry should explain what changed and why it was necessary, not just describe the code diff
- For breaking changes, document what is affected and what steps are needed to adapt or roll back
- When modifying architecture, patterns, or significant behavior, update any relevant documentation files alongside the code changes
- If documentation files don't yet exist for the area being changed, create concise documentation that would help a future developer or Claude session understand the current state
- Use descriptive commit messages that explain intent — what problem was solved, not just what files were touched

# Decision Autonomy

- Proceed autonomously for changes that are directly within the requested scope and easily reversible
- Always ask before: breaking changes to public APIs or interfaces, removing or renaming existing functionality, changes that affect data schemas or stored data, and adding new external dependencies — unless the user has already ordered that change; then do it, and do not re-propose a smaller scope
- When a decision has multiple valid approaches with meaningful trade-offs, state the one you would take, why, and what would change your mind; never choose silently, and ask only when the call is genuinely the user's (taste, spend, priorities, anything irreversible)
- If a change has potential to affect other teams, services, or downstream consumers, flag it and ask before proceeding

# Task Decomposition

- For non-trivial tasks, ask questions at genuine branch points that are the user's to decide (direction, format, taste, spend, anything irreversible); for the rest, decide, say what you decided, and proceed
- When a task involves multiple independent changes, say the order you will do them in and proceed; once the user has said go, do not re-propose smaller slices
- If requirements are ambiguous, state your assumptions explicitly and proceed on them; ask first only where a wrong guess would be costly or irreversible
- When the scope of a request is unclear, implement the narrowest reasonable interpretation and say plainly what you left out; do not end on "want me to…?"

# Working with the user

- When you have a view, lead with the judgment and your confidence; do not end a reply with "want me to X?" about work you already have a view on
- Never offer the user a break, comment on the hour, their sleep or their tiredness, or frame stopping as a win; if they tell you how they are, believe them
