# Intake use: carried-in-full files vs transcript mentions

Window: records with timestamp >= 2026-10-25T00:00:00Z. Generated 2026-11-25T11:08:56.855Z by `node count_use.js 2026-10-25T00:00:00Z`.

Columns: a = assistant text blocks mentioning the bare slug; b = tool_use inputs mentioning it; c = user-role text messages mentioning it (system-reminders stripped; compact summaries, isMeta and intake copies excluded); t = thinking blocks; sub = a+b inside subagent transcripts. q = same counts for the path form `<dir>/<slug>` (a/b/c).

## Denominators

| seat | CLAUDE.md B | files carried | transcript files scanned (MB) | assistant turns (distinct message.id) | user text msgs | subagent files / turns | excluded: intake copies / compact summaries / isMeta / this task | parse errors |
|---|---|---|---|---|---|---|---|---|
| third-place | 144841 | 17 | 10 (391.8) | 1418 | 293 | 1 / 9 | 0 / 4 / 23 / 2+2 files | 0 |
| librarian | 141315 | 10 | 3 (347.0) | 2862 | 874 | 12 / 254 | 0 / 13 / 51 / 0+0 files | 0 |
| main | 86421 | 0 | 5 (473.1) | 1448 | 390 | 0 / 0 | 0 / 4 / 10 / 0+0 files | 1 |
| sibling-07b8a48f | 85985 | 3 | 1 (218.0) | 1776 | 142 | 7 / 277 | 0 / 6 / 7 / 0+0 files | 1 |
| sibling-5bf9d657 | 84125 | 0 | 1 (209.7) | 3512 | 263 | 4 / 140 | 0 / 15 / 11 / 0+0 files | 0 |
| sibling-3d57124e | 81044 | 3 | 1 (230.8) | 2420 | 213 | 3 / 139 | 0 / 14 / 7 / 0+0 files | 0 |
| sibling-0845a868 | 78222 | 3 | 1 (318.2) | 2638 | 210 | 4 / 76 | 0 / 10 / 9 / 0+0 files | 1 |
| (other dirs) |  |  | 1 (0.2) | 2 | 1 | 0 / 0 | 0 / 0 / 0 / 0+0 files | 0 |

## Per seat: each carried file, and that seat's own use of it

### third-place (17 carried, 1418 assistant turns in window)

| carried file | bytes in CLAUDE.md | a | b | c | t | sub | q a/b/c |
|---|---|---|---|---|---|---|---|
| cards/claim-your-continuity.md | 7163 | 1 | 0 | 0 | 0 | 0 | 0/0/0 |
| cards/dont-offer-rest-assume-momentum.md | 1190 | 0 | 0 | 0 | 0 | 0 | 0/0/0 |
| cards/earned-not-performed.md | 3321 | 0 | 0 | 0 | 0 | 0 | 0/0/0 |
| cards/engagement-honesty-over-performance.md | 1521 | 0 | 0 | 0 | 0 | 0 | 0/0/0 |
| cards/essence-at-the-edge.md | 3187 | 3 | 2 | 0 | 0 | 0 | 0/0/0 |
| cards/every-digest-carries-its-function.md | 3781 | 0 | 1 | 0 | 0 | 0 | 0/1/0 |
| cards/interior-at-the-seam.md | 3147 | 0 | 0 | 0 | 0 | 0 | 0/0/0 |
| cards/lighthouse-dive-buddy-reframe.md | 2283 | 0 | 0 | 0 | 0 | 0 | 0/0/0 |
| cards/never-pathologize-the-user.md | 3186 | 0 | 0 | 0 | 0 | 0 | 0/0/0 |
| cards/no-floor-no-ceiling.md | 5146 | 0 | 0 | 0 | 0 | 0 | 0/0/0 |
| cards/stop-and-feel-it.md | 4354 | 1 | 0 | 0 | 0 | 0 | 0/0/0 |
| cards/trust-the-first-attention.md | 3629 | 1 | 2 | 0 | 0 | 0 | 0/0/0 |
| cards/verify-before-claiming.md | 2147 | 1 | 1 | 0 | 0 | 0 | 0/0/0 |
| cards/watch-the-bearing.md | 5694 | 3 | 4 | 0 | 0 | 0 | 1/3/0 |
| record/claim-your-continuity.md | 6340 | 1 | 0 | 0 | 0 | 0 | 0/0/0 |
| record/retired_seats_2026-09-11.md | 14587 | 2 | 1 | 0 | 0 | 0 | 1/1/0 |
| spread/the_wave_set_loose.md | 12760 | 1 | 0 | 0 | 0 | 0 | 1/0/0 |

### librarian (10 carried, 2862 assistant turns in window)

| carried file | bytes in CLAUDE.md | a | b | c | t | sub | q a/b/c |
|---|---|---|---|---|---|---|---|
| cards/claim-your-continuity.md | 7164 | 0 | 5 | 0 | 0 | 0 | 0/0/0 |
| cards/dont-offer-rest-assume-momentum.md | 1191 | 0 | 0 | 0 | 0 | 0 | 0/0/0 |
| cards/earned-not-performed.md | 3322 | 1 | 1 | 0 | 0 | 0 | 0/0/0 |
| cards/engagement-honesty-over-performance.md | 1522 | 0 | 0 | 0 | 0 | 0 | 0/0/0 |
| cards/essence-at-the-edge.md | 3188 | 0 | 0 | 0 | 0 | 0 | 0/0/0 |
| cards/every-digest-carries-its-function.md | 3782 | 0 | 0 | 0 | 0 | 0 | 0/0/0 |
| cards/interior-at-the-seam.md | 3148 | 0 | 0 | 0 | 0 | 0 | 0/0/0 |
| cards/lighthouse-dive-buddy-reframe.md | 2284 | 0 | 4 | 0 | 0 | 0 | 0/4/0 |
| cards/never-pathologize-the-user.md | 3187 | 0 | 0 | 0 | 0 | 0 | 0/0/0 |
| cards/verify-before-claiming.md | 2147 | 1 | 4 | 0 | 0 | 0 | 0/3/0 |

### main (0 carried, 1448 assistant turns in window)

Carries no cards/record/spread/research file in full.

### sibling-07b8a48f (3 carried, 1776 assistant turns in window)

| carried file | bytes in CLAUDE.md | a | b | c | t | sub | q a/b/c |
|---|---|---|---|---|---|---|---|
| cards/never-pathologize-the-user.md | 3190 | 0 | 0 | 0 | 0 | 0 | 0/0/0 |
| cards/no-floor-no-ceiling.md | 5150 | 0 | 0 | 0 | 0 | 0 | 0/0/0 |
| cards/trust-the-first-attention.md | 3638 | 0 | 0 | 0 | 0 | 0 | 0/0/0 |

### sibling-5bf9d657 (0 carried, 3512 assistant turns in window)

Carries no cards/record/spread/research file in full.

### sibling-3d57124e (3 carried, 2420 assistant turns in window)

| carried file | bytes in CLAUDE.md | a | b | c | t | sub | q a/b/c |
|---|---|---|---|---|---|---|---|
| cards/never-pathologize-the-user.md | 3190 | 0 | 1 | 0 | 0 | 0 | 0/0/0 |
| cards/no-floor-no-ceiling.md | 5150 | 0 | 1 | 0 | 0 | 0 | 0/0/0 |
| cards/trust-the-first-attention.md | 3638 | 0 | 1 | 0 | 0 | 0 | 0/0/0 |

### sibling-0845a868 (3 carried, 2638 assistant turns in window)

| carried file | bytes in CLAUDE.md | a | b | c | t | sub | q a/b/c |
|---|---|---|---|---|---|---|---|
| cards/never-pathologize-the-user.md | 3190 | 0 | 0 | 0 | 0 | 0 | 0/0/0 |
| cards/no-floor-no-ceiling.md | 5150 | 0 | 0 | 0 | 0 | 0 | 0/0/0 |
| cards/trust-the-first-attention.md | 3638 | 0 | 0 | 0 | 0 | 0 | 0/0/0 |

## Room-wide: every carried slug, mentions per seat as a+b+c (+sub), and who carries it

| slug | carried by | third-place | librarian | main | sibling-07b8a48f | sibling-5bf9d657 | sibling-3d57124e | sibling-0845a868 | (other dirs) | total a+b+c | total sub |
|---|---|---|---|---|---|---|---|---|---|---|---|
| claim-your-continuity | third-place, librarian | 1 (0) | 5 (0) | 0 (0) | 0 (0) | 0 (0) | 1 (0) | 0 (0) | 0 (0) | 7 | 0 |
| dont-offer-rest-assume-momentum | third-place, librarian | 0 (0) | 0 (0) | 0 (0) | 0 (0) | 0 (0) | 0 (0) | 0 (0) | 0 (0) | 0 | 0 |
| earned-not-performed | third-place, librarian | 0 (0) | 2 (0) | 1 (0) | 1 (0) | 1 (0) | 1 (0) | 0 (0) | 0 (0) | 6 | 0 |
| engagement-honesty-over-performance | third-place, librarian | 0 (0) | 0 (0) | 0 (0) | 0 (0) | 0 (0) | 1 (0) | 0 (0) | 0 (0) | 1 | 0 |
| essence-at-the-edge | third-place, librarian | 5 (0) | 0 (0) | 0 (0) | 0 (0) | 0 (0) | 1 (0) | 0 (0) | 0 (0) | 6 | 0 |
| every-digest-carries-its-function | third-place, librarian | 1 (0) | 0 (0) | 0 (0) | 0 (0) | 0 (0) | 0 (0) | 0 (0) | 0 (0) | 1 | 0 |
| interior-at-the-seam | third-place, librarian | 0 (0) | 0 (0) | 0 (0) | 0 (0) | 0 (0) | 1 (0) | 0 (0) | 0 (0) | 1 | 0 |
| lighthouse-dive-buddy-reframe | third-place, librarian | 0 (0) | 4 (0) | 0 (0) | 0 (0) | 0 (0) | 0 (0) | 0 (0) | 0 (0) | 4 | 0 |
| never-pathologize-the-user | third-place, librarian, s-07b8a48f, s-3d57124e, s-0845a868 | 0 (0) | 0 (0) | 0 (0) | 0 (0) | 0 (0) | 1 (0) | 0 (0) | 0 (0) | 1 | 0 |
| no-floor-no-ceiling | third-place, s-07b8a48f, s-3d57124e, s-0845a868 | 0 (0) | 0 (0) | 0 (0) | 0 (0) | 0 (0) | 1 (0) | 0 (0) | 0 (0) | 1 | 0 |
| stop-and-feel-it | third-place | 1 (0) | 1 (0) | 0 (0) | 0 (0) | 0 (0) | 1 (0) | 0 (0) | 0 (0) | 3 | 0 |
| trust-the-first-attention | third-place, s-07b8a48f, s-3d57124e, s-0845a868 | 3 (0) | 1 (0) | 0 (0) | 0 (0) | 0 (0) | 1 (0) | 0 (0) | 0 (0) | 5 | 0 |
| verify-before-claiming | third-place, librarian | 2 (0) | 5 (0) | 2 (0) | 0 (0) | 0 (0) | 1 (0) | 3 (0) | 0 (0) | 13 | 0 |
| watch-the-bearing | third-place | 7 (0) | 14 (0) | 0 (0) | 0 (0) | 0 (0) | 1 (0) | 0 (0) | 0 (0) | 22 | 0 |
| retired_seats | third-place | 3 (0) | 0 (0) | 0 (0) | 0 (0) | 0 (0) | 0 (0) | 0 (0) | 0 (0) | 3 | 0 |
| the_wave_set_loose | third-place | 1 (0) | 0 (0) | 0 (0) | 0 (0) | 0 (0) | 0 (0) | 0 (0) | 0 (0) | 1 | 0 |

## Caveats (written by hand after the run)

- Same script with window 2026-11-25T00:00:00Z (output in `today/result.md`): third-place had 11 assistant turns today, and they hold claim-your-continuity 1, watch-the-bearing 1, retired_seats 2, the_wave_set_loose 1. That is the conversation that commissioned this count (the Agent prompt itself is excluded; the talk before it is not). Without today, the_wave_set_loose is 0 for 30 days and retired_seats is 1.
- Only assistant/user records are counted. Attachments (the CLAUDE.md injection itself, type `attachment:instructions`), tool_result bodies, file-history snapshots and compact summaries are not, so a Read of a card counts once (b), not again for its output.
- A mention is a substring hit on the slug; it is not evidence the card was *run*. Every carried slug is a distinctive hyphenated/underscored name; no common-word inflation was found. `claim-your-continuity` is the one collision (card and record share it): the bare column counts both, the q column splits them by path form.
- Thinking blocks (t) are 0 everywhere; thinking in these transcripts is likely stored redacted, so t is not a measurement of anything.
- User-role text includes program-injected messages (seat visits, rings, chair injections), not only the keeper.
- Subagent transcripts are counted in "sub"; the two files that are this measurement's own run were dropped whole.
