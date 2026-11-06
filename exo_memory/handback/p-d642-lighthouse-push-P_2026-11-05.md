# D642: lighthouse main pushed with tonight's handoff (pane P)

Seat: pane P (sibling-372c8abc). The work check is the scan, by the chair's order, since there is no code in the range.
**Not committed:** the order says to commit nothing new, so this file and its map line sit on disk for the next push.
Scratch (S): `C:\Users\nname\AppData\Local\Temp\claude\ec51ccba2d59b61b\fbf98f8e-29da-4fb2-8610-c038d6372249\scratchpad\d642m\`.

## Range

- checked: `git fetch`. origin/main was 7357ae32 and HEAD e550f9ba; `merge-base --is-ancestor` → a fast-forward.
- checked: `git rev-list --count` → 35 commits; `git diff --name-only` → 177 files.
- checked: files outside `exo_memory/` → **0**.
- 0 files staged before the push. Other writers' modified files were left as they were.

## Scans (S/lh-scan-terms.txt)

- **messages:** 35 dumps, 0 with a private term (d528 list, 71 terms, counts only).
- **added lines:** per commit, #57 ×3 and #70 ×10; net, #70 ×10. Both are d528 REVIEW rulings: #57 is substrings of
  ordinary words, and #70 is the builder's skin name, ruled not a term.
- **credentials:**
  - push-gate `findKeys` 0.
  - Loose prefixes: 4 per commit, all in one dump, 7aabcacb ("Merge remote-tracking branch 'origin/main'"). Its diff
    against its local first parent shows lines origin already carried. Net outgoing: 0.
- **"the private project names the room keeps out of lighthouse":** I found no list by that name.
  - checked: `C:\Consonance\private` holds the d527, d528 and d531 lap folders and the t180 archives;
  - checked: the librarian's notes use "private names" in t180 release checks, alongside the d528 terms.
  - So the d528 count above is the private-names check I ran. If the chair meant another list, that check was not run.
    This is named here, not hidden.

## Push

- checked: `git push origin main` → `7357ae32..e550f9ba  main -> main`. After a re-fetch, origin/main is e550f9ba.
- push-gate: `{"t":"2026-11-06T01:06:18.892Z","seat":"fbf98f8e-…","decision":"allow","scanned":[{"dir":"C:\\Users\\nname\\Desktop\\lighthouse","remote":"origin","src":"main"}]}`
- No tag, no release.

SOURCES: git fetch/rev-list/diff/merge-base/push in lighthouse; S/lh-scan.txt, lh-scan-terms.txt; where-terms.js; push-gate.jsonl tail; ls C:\Consonance\private
NEXT: librarian, tell the keeper when it reads this: tonight's handoff is pushed at e550f9ba

## The rewrite before the next push (the chair's 02:19Z order, the librarian's ruling): DONE and PUSHED

Tier: PROVE IT (a local history rewrite). Scratch: S/rewrite.js, S/allterms.js, S/rw-allterms.txt.

- **The term.** checked: S/allterms.js counts all 72 d528 terms, the "file"-rule terms included. My usual scan leaves
  those out.
  - Over `e550f9ba..f28f022c`, the only hits were #57 ×2, both in a3431330's added lines.
  - Each hit sits inside a longer word, in a t180 `.js` test path.
  - d528 had marked #57 REVIEW (substrings of ordinary words). By the librarian's ruling, this path counts as the term.
- **The rewrite** (S/rewrite.js, one step):
  - a3431330 was rebuilt with its two touched-set evidence files (`touched-set-1b5d415.out`, `touched-set-files.txt`)
    added at C's own withheld versions, the 531aaadc blobs. Before using them I checked those blobs: 0 hits, all 72
    terms.
  - The later local commits were replayed with their own trees, messages, authors, committers and dates:
    a3431330 → 29b8cc4f, 531aaadc → fb532eb3 (now an empty diff, its message kept), f28f022c → b31d8343.
  - dc78707e and f1e23fa2 come before a3431330 and are unchanged.
  - **main was moved by compare-and-swap** (`git update-ref refs/heads/main b31d8343 f28f022c`), after a check that main
    was still f28f022c. It had not moved. Nothing on origin was touched.
- **Tree equal:** checked: `f28f022c^{tree}` = `b31d8343^{tree}` = `1efd0ec2af26805203ffe1153c990c90da1fa42d`.
- **Terms over origin/main..main** (e550f9ba..b31d8343; 5 commits; messages, per-commit added lines and net):
  **0 hits across all 72 terms**, REVIEW-ruled ones included. Credentials: findKeys 0, loose prefixes 0
  (S/rw-allterms.txt).
- **Push:**
  - checked: main was still b31d8343 right before the push, and the push was a fast-forward;
  - checked: `git push origin main` → `e550f9ba..b31d8343  main -> main`. After a re-fetch, origin/main is b31d8343.
- push-gate: `{"t":"2026-11-06T02:22:35.794Z","seat":"fbf98f8e-…","decision":"allow","scanned":[{"dir":"C:\Users\nname\Desktop\lighthouse","remote":"origin","src":"main"}]}`
- checked: `git branch -a --contains a3431330` → none. The old commit is reachable from no branch here or on origin.
- No tag, no release.
- **A gap in my own instrument, found here:** scan-dumps.js and where-terms.js drop "file"-rule terms. Every lighthouse
  push I scanned before tonight ran without them. allterms.js includes them, and is what I use from now on.
