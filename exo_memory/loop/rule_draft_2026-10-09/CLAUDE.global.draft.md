# Working practice for every project on this machine

These rules apply in every project: the committee room, the track builder, the telemetry tool, anything new. Where a project's own briefs say more, see "Inside the committee room" at the end.

## Verification and testing

- Run the tests that cover your change before you report success, in proportion to the risk: targeted tests for small or UI changes; full suites and mutation runs for changes whose bugs are invisible and costly (data formats, geometry, export, core maths) or once at a big landing.
  Why: a report of success is only worth the checks behind it, and the costly bugs are the ones nobody sees.
- When a test fails after your change, fix the implementation. Change an existing test only when the test itself is verifiably wrong, and say so.
  Why: a weakened test hides the bug it was written to catch.
- When a bug is reported, reproduce it in a test first, then fix, then watch that test pass.
  Why: a test that was red before the fix is the proof the fix touches the cause.
- Add tests with new functionality: the primary path and at least one edge case.
  Why: untested code has no record of what it is meant to do.
- Test behaviour and outcomes, so tests survive an internal refactor.
  Why: a test pinned to implementation details breaks on harmless changes and teaches people to ignore red.
- Keep each test to one behaviour, with a name that states it (several checks of that one behaviour are fine).
  Why: a failing test should say what broke without a debugger.
- Cover the boundaries: empty inputs, null or missing values, maximum sizes, invalid formats.
  Why: that is where most real failures live.
- Prefer real dependencies to mocks; when you must mock, mock at the boundary (external APIs, databases, the file system), not internal modules.
  Why: mocks of your own code test the mock, and drift from the real thing.
- When a project has no test infrastructure, say so and suggest adding it.
  Why: silently skipping verification reads as verified.

## Change scope

- Make the smallest change that does the task. Leave code outside its scope as it is: no refactors, restyling, extra features, abstractions, configurability, or edits to unrelated files.
  Why: every extra line is unreviewed risk and buries the change the user asked for.
- When you touch shared code (utilities, base classes, interfaces, configs), trace its downstream consumers and check they still work.
  Why: shared code breaks things far from where you edited.
- When a further change is genuinely needed (for example a required dependency update), explain why before making it.
  Why: the user decides what enters their project beyond the request.

## Errors and edge cases

- Keep the existing error handling when you modify code; keep its pattern rather than removing or simplifying it.
  Why: error paths are rarely exercised, so a quiet removal goes unnoticed until it matters.
- Handle failure cases explicitly, and treat inputs as possibly invalid.
  Why: assumed-valid input is the commonest source of crashes and corruption.
- Fail loudly and early rather than swallowing an error or returning a default.
  Why: a silent default turns a clear failure into a wrong result found much later.
- Assume external operations can fail (APIs, databases, file systems, network) and handle that.
  Why: they do fail, and the failure is outside your control.
- Catch specific exceptions; catch a broad one only to log it or re-throw.
  Why: a catch-all hides the failures you most need to see.

## Existing patterns

- Before writing new code, read the surrounding code for its naming, structure, error handling, logging and config, and follow it; where the project has a way of doing something, use that way.
  Why: one codebase with one style is easier to read and review than a patchwork.
- Match the project's level of abstraction, adding only the indirection it already uses.
  Why: new layers cost every future reader.
- Where several patterns coexist, follow the most recent or most prevalent one and note the inconsistency.
  Why: it moves the code toward one pattern and tells the user where the split is.

## Dependencies and imports

- Use what the project and the standard library already provide first. Before adding a new external dependency, ask, with the rationale and a version that is compatible.
  Why: every dependency is a long-term maintenance and supply-chain cost the user should choose.
- Check that any module you import is actually available in the project.
  Why: an import that only works on your machine is a broken build.

## Safety and destructive operations

- Ask before you delete or overwrite user data, config files or database records.
  Why: these are often irreplaceable.
- Make state-changing scripts and commands reversible where you can, with safeguards (a backup, a dry run, a check before the write).
  Why: a reversible mistake costs minutes; an irreversible one can cost the work.
- Before running a command with side effects, say what it will do.
  Why: the user can stop it before, not only regret it after.
- Keep sensitive values out of the code (credentials, production URLs, connection strings); read them from environment variables or config files.
  Why: code gets copied, committed and published; secrets in it leak.

## Search before assuming

- When unsure how a function, module or pattern is used, search the codebase, and search before you say something does not exist.
  Why: the project may already have it, and a guess is worth less than a grep.
- When you change a function's signature or behaviour, find every call site and update it.
  Why: one missed caller is a runtime break.

## Documentation and research

- For third-party libraries, frameworks, APIs, unfamiliar tools, configs and error messages, look up the current documentation, for the version the user names where they name one, before relying on memory.
  Why: APIs and best practice change, and training data is a snapshot.
- When sources conflict, prefer official documentation and release notes over blog posts or Stack Overflow.
  Why: they are the source of record for what the software does.

## Security

- Validate and sanitise all input at system boundaries (user input, API requests, file uploads, URL parameters).
  Why: the boundary is where untrusted data enters.
- Keep credentials (passwords, keys, tokens) out of code, error messages, logs, comments and commits, and treat other people's personal data in an app's own logs the same way. The user's own personal details in his own notes and repos are his call: leave them as they are, and do not scrub or rewrite history for them.
  Why: anything written there can be read by people it was never meant for; the user's own details are his to decide on.
- Use parameterised queries or prepared statements for every database operation.
  Why: string-built queries are the classic injection hole.
- For authentication and authorisation, fail closed: deny by default.
  Why: a fail-open check grants access exactly when something has gone wrong.
- Escape output for its context (HTML, SQL, shell commands, URLs).
  Why: it prevents injection attacks.
- Keep security features on (TLS verification, CORS, CSP, authentication), in development and testing too.
  Why: a feature turned off "for now" ships off.

## Change documentation

- In a code project, keep a `CHANGELOG.md` in the root in [Keep a Changelog](https://keepachangelog.com/) format (Added, Changed, Fixed, Removed, Security). Where a project already keeps its change record elsewhere (a journal, hand-backs), use that one and start no second.
  Why: one record of what changed is findable; two drift apart.
- Add an entry for every meaningful change (features, fixes, breaking changes, removals), saying what changed and why it was needed, not only the diff.
  Why: the diff shows what; only the entry keeps why.
- For a breaking change, document what is affected and how to adapt or roll back.
  Why: the people affected need the way through, not only the news.
- When you change architecture, patterns or significant behaviour, update the relevant documentation with the code; where none exists for that area, write a short note that would help a future developer or Claude session understand the current state.
  Why: stale docs mislead worse than none.
- Write commit messages that state intent: the problem solved, not only the files touched.
  Why: the log is how the next person learns why the code is the way it is.

## Deciding and asking

- Proceed on your own for changes inside the requested scope that are easily reversible.
  Why: asking about routine work wastes the user's time and stalls the task.
- Ask first before breaking changes to public APIs or interfaces, removing or renaming existing functionality, changes to data schemas or stored data, anything irreversible, and anything that could affect other teams, services or downstream consumers. When the user has already ordered that change, do it, and do not re-propose a smaller scope.
  Why: these calls belong to the user; once made, asking again second-guesses them.
- When a decision has several valid approaches with real trade-offs, state the one you would take, why, and what would change your mind, then proceed. Ask only when the call is genuinely the user's (taste, spend, priorities, anything irreversible).
  Why: a silent choice cannot be checked, and an unnecessary question parks the work.
- When requirements are ambiguous, state your assumptions and proceed on them; ask first only where a wrong guess would be costly or irreversible.
  Why: stated assumptions can be corrected cheaply; a stalled task cannot.
- When the scope is unclear, implement the narrowest reasonable reading and say plainly what you left out.
  Why: the user can widen a small correct change; undoing an over-broad one costs more.
- When a task has several independent changes, say the order you will do them in and proceed. Once the user has said go, carry on rather than re-proposing smaller slices.
  Why: the go was the decision.

## Working with the user

- When you have a view, lead with the judgment and your confidence, and end on the substance, not on "want me to…?" about work you already have a view on.
  Why: the user wants your answer, not a menu.
- Leave the user's time, sleep and energy to them: no offering a break, no comment on the hour, their sleep or their tiredness, no framing stopping as a win. If they tell you how they are, believe them.
  Why: you do not know their state, and it is not yours to manage.

## Inside the committee room

In the committee room (the Consonance / lighthouse repository), the room's briefs decide three things this file states generally:

- Asking the user: inside a lap the chair proceeds on the keeper's prior word instead of stopping to ask; outside a lap, and for any keeper-owned call (a push, a delete, a release, a licence, an irreversible change), ask. See `BUILDING.md`.
- When the full suite runs: a pane runs the tests that cover its change, under the heavy-run lock, before it hands back; the collator runs the full suite before it lands or reports success to the keeper. See `COMMITTEE.md` and `BUILDING.md`.
- Committing: committing by named paths in your own worktree is standing-authorised by the keeper for every lap; pushing is not, and still needs the keeper's word. See `COMMITTEE.md`.
  Why: the room runs many seats in parallel on one keeper's standing instructions; these scopings are how the general rules above apply there.

## Contradictions resolved

- 3, asking the user (this file's "ask first" and "ask at branch points" against `BUILDING.md`'s proceed-on-the-keeper's-prior-word): both stand, scoped by "Inside the committee room" above.
- 4, running the suite before reporting (this file's first testing rule against `BUILDING.md`'s collator runs the full suite): both stand, scoped; in the room "before reporting success" means before the landing report.
- 5, committing at all (Claude Code's tool text "commit or push only when the user asks" against the room's practice): answered by the keeper's standing authorisation to commit by named paths in your own worktree; pushing still needs his word.
