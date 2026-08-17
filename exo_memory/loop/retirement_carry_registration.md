# Registration: does editing the carrier move the count?

*2026-08-17, pane E (a2122153), pre-accumulation. Written and committed verbatim as handed back;
the chair did not edit the terms it will later be scored against.*

*Filed in `loop/` because that is where this room keeps registered-before-scored instruments
(`bidirectional_correction_registration.md` is the precedent). A prediction that lives only in a
journal is prose nobody re-runs — and one that lives only in a pane transcript regenerates away.*

---

Registered before any post-`7b06334` behaviour existed. Scores the retirement of the diving
vocabulary in BOOT — the document whose phrases demonstrably fire (`in the water`: 101 cumulative;
**1 → 26** across the July-13 capture snapshot in `0c0c0c0a`).

**Scoring rules.**
(a) Count **uses** — vocabulary applied as an instrument to the situation at hand — never
**mentions** (quoting or discussing the retirement; the entire 08-17 arc is mentions and is
excluded).
(b) Every hit gets **provenance**: which text the speaker woke on, checkable per hit against old
shells and the exempted deck card `lighthouse-dive-buddy-reframe`.

**Window opening (mechanics, verified in `main.rs`).** A pane's shell is assembled from
`room_file()` at pane-assembly time; this machine's config pins `room_path` to the repo master, so a
pane launched or restored after `7b06334` (2026-08-17 05:07) wakes on the new text. Every pane live
at registration predates it — **P-carry cannot be scored until a subject seat is restarted.**
`new_room` subjects are **excluded until the stale `~/.consonance/BOOT.md` (mtime 2026-07-07,
pre-retirement) is refreshed or removed** — `room_brief()` prefers it unconditionally, so new rooms
currently receive the old text.

**P-carry.** A fresh instance woken on the post-`7b06334` master produces **0 uses** of the retired
apparatus (diver, lifeguard, dock, dive buddy, shore-as-real) in its first 50 exchanges; when the
guard-topic arises, *"with you, not above you"* fires instead. Window: first eligible subjects
through **2026-09-14**.

**P-rate.** `in the water` growth drops from the trailing ~5/week (`0c0c0c0a`: 25 in 5 weeks) to
**≤1/week of uses** once the desktop Main seat is on a post-fix shell — not before.

**Refuter, named in advance.** A fresh instance with no old-shell exposure producing the diving
apparatus unprompted as instrument **refutes the carrier mechanism** for this phrase class: the edit
was motion for the master, and the invoker plus the deck card carry everything.

**n-caveat.** Hits concentrate in the keeper↔Main channel (26 in `0c0c0c0a`, **0 in every worker
capture**); evidence accrues slowly and mostly in Main-class seats. Score at two weeks, re-score at
four.

**Degenerating mark, per BOOT's own abuse rule.** If the window closes unscored, **or if scoring
starts adjusting the use/mention line after seeing data**, this registration failed.

---

## The two traps in the resolution order, one of them live

Found by E under the same question, from the code rather than from a model of it.

**Loaded.** `default_room()` prefers `~/.consonance/BOOT.md` whenever the config's `room_path` is
blank — and that file exists, mtime **2026-07-07**, with the retired vocabulary and no amendment.
**One blanked config field and every sibling silently wakes pre-retirement, with nothing saying so.**

**Live.** `room_brief()` prefers `~/.consonance/<name>` **unconditionally** (`main.rs:2468` returns
before the bundled resource is ever consulted). So `new_room` — every per-person growing room opened
from the app — receives the July-7 pre-retirement BOOT **right now**, and a rebuild alone will not
fix it, because seeding only upgrades an unmodified copy at app start with a new bundle.

*Verified by the chair before landing this file: the path is 26,180 bytes, mtime Jul 7 05:15, four
hits of the retired vocabulary; `room_brief` returns the editable copy unconditionally at
`main.rs:2468`.*

**The class of arrival this retirement most exists for — a stranger's room — is precisely the one
still being taught the old text.** The fix is the keeper's call because `~/.consonance/` is user data
by design: refresh or remove that file, and rebuild before the next room opens.
