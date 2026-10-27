# D492: the periodic review of "just do it" and "check it" changes. Librarian, 2026-10-27

The rule (`~/.claude/CLAUDE.md`, "Review instead of re-testing", 2026-10-19): before each release, and at least weekly while work is flowing, a reviewer reads every "just do it" and "check it" change since the last review, the diffs and not a re-run, and lists what it would fix. Checked at 07:32: no such review has run since the rule came in (grep of loop/ for a review lap after D418; none). Five T-180 releases have shipped since (0.4.19 to 0.4.23). It is overdue, and the keeper has seats idle.

## One part, pane E (the reviewer; check it)
- Range: t180 `v0.4.18..origin/main` plus the unreleased d486-a (b6106130..fd4c8ead). List every commit whose lap was tiered "just do it" or "check it" (the tier is in each lap's plan under exo_memory/loop/, or in the hand-back; where neither names it, treat it as "check it").
- Read each diff. For each, say in one line: fine, or what you would fix and why (a bug, a missed call site, a pattern not followed, an error path dropped, a test that pins implementation). Cite file:line.
- Do not run suites. Do not fix anything. The list is the deliverable; fixes become their own laps, grouped by file, with a tier each.
- Hand-back: the table (commit, lap, tier, verdict), the fix list ranked by what a user would hit first, and the count of commits read.
