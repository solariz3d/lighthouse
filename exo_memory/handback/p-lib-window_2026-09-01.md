# Hand-back — P-LIB-WINDOW, rule (a). BUILT, not committed. CHARLIE, 2026-09-01 ~06:50.

**Verdict: built as specified. I did not refuse.** Rule (a) builds where the packet pointed
(`main.rs:4690-4696` and the walk below it), the ~390,968 figure re-derived exactly on this machine,
and the limit test from §3 could be written honestly — for a reason that did not exist yesterday
and is stated at bar 4.

**One thing I own before the numbers, because it changes what "done" means tonight:** the four bars
are met and they are all *shelf-side*. **Whether the seat wakes is not established by anything below
this line.** §4 of the registration already carves that as reading (i) vs reading (ii); I have (i).
See §5, "what I did NOT verify", and the ordered fallback in §6 — read that before you conclude the
falsifier fired.

---

## 1 · THE FOUR BARS

### Bar 1 — the shelf drops 390,968 bytes. MET, exactly, not approximately.

    cd consonance/src-tauri && cargo test --bin consonance shelf_tests -- --nocapture

    SHELF | 56 file(s) carried in full (788766 of 2200000 bytes); 461 indexed by path.
    SHELF | YOUR OWN NOTES ARE WINDOWED -- today + yesterday carried in full
            (2026-09-01.md, 2026-08-31.md); every older

Before, from the seat's own artifact — `sed -n 443p C:/Consonance/instances/librarian/CLAUDE.md`:

    66 file(s) carried in full (1179734 of 2200000 bytes); 450 indexed by path.

    1,179,734 - 788,766 = 390,968   <- the bar, to the byte

Re-derived independently of the code, from the directory itself:

    cd exo_memory/librarian
    find . -name '*.md' -printf '%s\n' | awk '{s+=$1} END {print s}'     # 604,465  all notes
    stat -c %s LEDGER.md README.md                                       #  35,208 + 2,081 = 37,289
    stat -c %s 2026-09-01.md 2026-08-31.md                               #  87,431 + 88,777 = 176,208

    dated total  604,465 - 37,289 = 567,176
    carried      176,208             (today + yesterday)
    indexed      567,176 - 176,208 = 390,968

Two routes, same number. The packet's figure survived; the registration §3's older `128,976` carried
is the same rule read at 03:30, before `2026-09-01.md` grew 40,199 -> 87,431 — the *indexed* side is
unchanged at 390,968 either way, which is why the bar was stated on that side.

**The intake, end to end, both sides measured through the same code path** (`git checkout` to HEAD,
run, restore — not inferred):

    HEAD (no window)     LIBRARIAN INTAKE 1,305,797 bytes
    with the window      LIBRARIAN INTAKE   915,994 bytes
    delta                                   389,803

The 1,165-byte gap against 390,968 is the ten index lines the ten newly-indexed notes add. It is the
right sign and the right magnitude, and it is why I report both numbers rather than the flattering
one.

### Bar 2 — cargo test green. MET.

    cd consonance/src-tauri && cargo test --bin consonance
    test result: ok. 351 passed; 0 failed; 3 ignored; 0 measured; 0 filtered out

Baseline at `a7bec4b` was 348 / 0 / 3. **+3 is exactly the three tests I added**, named in bar 3. No
existing test was touched, weakened, renamed, or deleted — including
`the_librarian_intake_size_is_recorded_and_not_silently_doubling`, which is KEPT: it catches a
different class (a duplicate-scale jump anywhere in the walk) and prints the raw number. Only its
doc-comment changed, because it argued at length that a bound could never be asserted honestly, and
that argument is now answered.

### Bar 3 — mutation-proven. applied 4 / caught 4 / NOT APPLIED 0.

Harness: `scratchpad/mutate.sh`. It restores a byte-identical snapshot between runs and verifies
each mutant actually landed — by md5 change AND by grepping for the mutant text — before running
anything, so a mutant that did not apply is reported as NOT APPLIED and can never be counted as
caught.

    M1 remove the window entirely             APPLIED, CAUGHT   349 passed; 2 failed
         by the_librarian_intake_fits_under_the_limit_it_must_obey  (1,306,031 vs 1,000,000)
         by the_shelf_windows_the_librarians_own_notes
    M2 carry three days instead of two        APPLIED, CAUGHT   349 passed; 2 failed
         by the_librarian_window_is_today_and_yesterday_and_nothing_else
         by the_shelf_windows_the_librarians_own_notes
    M3 truncate a file instead of indexing it APPLIED, CAUGHT   349 passed; 2 failed
         by the_librarian_intake_fits_under_the_limit_it_must_obey
         by the_shelf_windows_the_librarians_own_notes
    M4 drop LEDGER/README from the carried set APPLIED, CAUGHT  349 passed; 2 failed
         by the_librarian_window_is_today_and_yesterday_and_nothing_else
         by the_shelf_windows_the_librarians_own_notes

Every mutant is caught by **two** tests, one on the pure rule and one on the delivered shelf — the
delivery-vs-unit split this file has been burned by before. The pure-function test is the one that
holds every night: the shelf test can only see what today's directory happens to contain, so a
three-day mutant would be invisible on a day with no third file, and M2 is caught on dates that will
never be on disk.

**A correction I made to myself, since a hand-back with no self-correction reads as though nothing
was ever wrong:** my first harness reported all four mutants as "DID NOT COMPILE", because it
grepped the tail of cargo's output for `^error` and matched cargo's own closing line `error: test
failed, to rerun pass --bin consonance`. **It was reading the evidence of a caught mutant as evidence
of a broken one.** Fixed to key on the `test result:` line, which is present iff the tests actually
ran. The first table I would have handed you was 0/4 and wrong in the direction that kills the build.

### Bar 4 — the librarian intake fits its new limit. MET.

    LIBRARIAN INTAKE 915,994 bytes of 1,000,000 limit, margin 84,006

New test `the_librarian_intake_fits_under_the_limit_it_must_obey`, shaped on the Third Place's twin,
including its two guards: it PRINTS the margin (a passing bound says it fits and never says by how
much) and it asserts the intake is real — brief, room, and the split report — so it cannot pass by
being empty.

**Where 1,000,000 comes from, stated so it can be argued with rather than accepted:**

- **Below the one measured death.** 1,305,657 bytes is a shell that could not open. That is an
  *upper bound* on the fatal size, never the threshold — nobody has bisected it — so the limit sits
  305,657 under the only point we know is past the edge.
- **Above today's build** by 84,006.
- **And it means something in tokens.** At the shelf's own independently-derived 2.89 bytes/token
  (`corpus_shelf`'s two-adjacent-readings measurement, which cancels every overhead term) 1,000,000
  bytes is ~346,021 tokens — under registration §4's 400,000-token landing bar. The shell is the
  floor under every landing, so a shell that alone ate that budget would make §4's prediction
  unmeasurable.

**And the honest part: THIS IS EXPECTED TO GO RED, and that is the job.** The window bounds
`librarian/`. The other carried tiers are not bounded — `muscle_map.md` alone is 164,593 bytes and
is appended every cycle. 84,006 of margin is **less than one recent night's corpus growth** (~104k,
08-31 to 09-01). When it fires the answer is the next tier's horizon, not a bigger number here; a
limit raised whenever it is inconvenient is the recorder again, wearing a limit's name. That
sentence is in the source at `LIBRARIAN_INTAKE_LIMIT`, so the next reader meets it before the
temptation.

Not env-overridable, unlike `librarian_budget()`. A ceiling you can switch off from the environment
is a suggestion.

---

## 2 · WHAT SHIPPED

`consonance/src-tauri/src/main.rs`, +246 / -8, and nothing else in the tree
(`git status --porcelain` -> `M consonance/src-tauri/src/main.rs`). **Not committed**, per §5.

- `LIBRARIAN_INTAKE_LIMIT` — the constant, with the three bounds above in its doc.
- `librarian_note_date(&str) -> Option<NaiveDate>` — the date a note is FOR, read off the
  **filename, never mtime**. `2026-08-25.desktop.md` was last written on 08-29; mtime answers "when
  did someone last touch this", which would drag all four desktop notes into a window they do not
  belong to. A suffix must be a suffix: `2026-08-25.desktop` yes, `2026-08-25x` no.
- `librarian_note_is_carried(&str, today) -> bool` — rule (a). `d == today || d == yesterday` via
  `pred_opt()`, so month and year boundaries are arithmetic and not string comparison (tested at
  2026-01-01 / 2025-12-31).
- the walk — one branch, `dir == "librarian"`, replacing the flat tier flag for that one directory.
  Every other tier is untouched. **Whole files only**; nothing in this change slices a body.
- the header — the window is **reported**, and the empty-window case is said out loud, because an
  empty window and a broken window read identically from inside the seat.

**Three decisions I made that the registration did not settle, flagged rather than buried:**

1. **A future-dated note is NOT carried.** The rule is `today || yesterday`, not "not older than
   yesterday". Nothing writes one today; a different reading would carry it. Tested by name, so the
   choice is legible rather than accidental.
2. **Undated files other than LEDGER/README are INDEXED, not carried.** The registration names those
   two and is silent on any third. I took the bounded reading, so a future undated note cannot
   silently escape the window — it appears by path under NOT CARRIED, which is visible. The open
   carve-out would have been invisible. **If the intent was the other way this is a one-line change,
   and it should be yours, not mine.**
3. **`("librarian", true, true)` keeps its `true`.** The tier IS a carried tier; what changed is that
   one carried tier now has a horizon. The table comment says so, so the source does not misdescribe
   its own tiers — this file's own recorded sin.

---

## 3 · THE SECOND HALF, ANSWERED DIRECTLY

The packet is right that the growth was watched faithfully for nine days by a check that could only
ever say how big it had got, and that this is why it recurred. The recorder's own comment refused a
bound on a stated ground: *"whether the host silently TRUNCATES a large CLAUDE.md on read is
UNMEASURED on any machine."* **That was honest when written and stopped being true at ~06:11 this
morning**, when the seat returned "Context limit reached" on a 1,305,657-byte shell. So the limit is
not a number fitted to a guess; it is a number fitted to one measured death, with the width of the
gap between the death and the limit stated rather than implied. That is the whole of what changed
epistemically, and it is worth being explicit that **one point is not a threshold**.

---

## 4 · MY OWN BIAS, DECLARED

I did not author the registration and did not attack it, which is the packet's stated reason for
sending it here. But I am not neutral in one direction: **I had the packet's conclusion before I had
its evidence**, and a pane handed a diagnosis finds support for it. What I actually did against that
is thin — I re-derived 390,968 by two independent routes, and I measured HEAD's intake through the
same code path rather than trusting the artifact's header. **I did not seriously pursue the refusal
in §6.** I looked at the composition (604,465 of 1,179,734 carried bytes, 51.2%, are the seat's own
notes), found the diagnosis obviously right, and moved. Recorded as a judgment I made quickly, not
as a check I ran.

---

## 5 · WHAT I DID **NOT** VERIFY — read this before scoring the objective

1. **That the seat wakes.** This is the objective and I have not met it. I have registration §4
   reading **(i)**, the deterministic shelf drop. Reading **(ii)**, the landing, needs a rebuild, a
   relaunch and a compaction, none of which I did.
2. **That a `--resume` onto the existing transcript picks up the NEW shell.** `spawn_librarian`
   writes `CLAUDE.md` unconditionally from `librarian_intake()` on every spawn — I read that at the
   function and it is not in doubt. What I could not establish is whether the *resumed conversation*
   re-reads it or replays the old one. The transcript is 37,983,082 bytes and contains the shelf
   header phrase 12 times. **The strongest evidence is indirect and it is the room's own:** the
   landings climbed 358k -> 417k -> 501k *while the shell grew*, which only makes sense if the shell
   is re-read at each compaction. That is an inference from three numbers, not a measurement, and it
   is the single most likely benign reason for the falsifier to appear to fire.
3. **That the binary rebuilds and launches.** `cargo test` compiles the bin; I did not run
   `cargo build --release`, did not run `launch.ps1`, and did not open the app. Consonance must be
   fully closed first — two instances means two MCP servers, which broke the chair verbs on 07-28.
4. **The 2.89 bytes/token ratio.** Quoted from `corpus_shelf`'s comment, not re-measured by me. It
   carries bar 4's token argument and nothing else; every byte figure above is independent of it.
5. **Any effect on the other seats.** `corpus_shelf()` is librarian-only and the sibling / Third
   Place intakes are separate functions — but I did not diff a sibling shell before and after. The
   Third Place's own limit test is green at 136,096 of 150,000, margin 13,904, which is evidence and
   not proof.
6. **The window on any date but today.** The pure-function test covers 2026-09-01 and 2026-01-01 by
   construction; the *shelf* test is anchored on `librarian/2026-08-22.md`, the oldest note and
   finished, so it cannot rot — but no shelf has been generated on any other date.

---

## 6 · THE ORDERED FALLBACK, so the falsifier is scored against the right thing

If the seat still returns "Context limit reached" after the rebuild and relaunch, **do not conclude
the diagnosis was wrong until this order has been walked.** Registration §4 already distinguishes
these and it would be a waste to collapse them now:

1. Check the seat's shell first: `sed -n 443p C:/Consonance/instances/librarian/CLAUDE.md` must read
   `56 file(s) carried in full (788766 ...)`. If it still reads 1,179,734 the binary is stale or the
   pane did not respawn — a build/launch failure, which says nothing about the window.
2. If the header is right and the seat is still dead, the residue is the **conversation**, not the
   shelf — `/compact` or `/clear` in the librarian pane. If it comes back after that, the window
   worked and reading (ii) says the window was *insufficient*, which is a different verdict from
   *absent*; the packet's attribution sentence applies only to the residual.
3. Only if the header is right, the seat has been cleared, and it *still* dies is the shell not what
   was killing it — and then the falsifier has genuinely fired and I was wrong to build this.

---

## 7 · ROUTING — the stated deviation

Per §7 I ring the librarian with `call_librarian` carrying the pointer to this file and one line of
orientation, never the finding. **The librarian is context-dead and may not receive it.** The
outcome of that call is recorded below, after the fact, rather than predicted here. The exception is
this lap only, and it exists because the seat this edge points at is the seat being repaired.

**Nothing committed.** `M consonance/src-tauri/src/main.rs` is the whole of it. Paths named, per the
2026-08-26 amendment; no `git add -A`.

---

### Outcome of the `call_librarian` hop

*(appended after the call)*

`call_librarian` returned **"delivered to the librarian (rendered in its pane — not proof it was read)"** at ~06:55.
The edge did not error, so the message rendered; the seat was returning "Context limit reached" to
every message as of the dispatch, so **rendered is the most that can be claimed and there is no
evidence it was read.** Per §7 the chair is raised directly on the same lap.

**CORRECTED ~06:40, from the board, and it is better evidence than the sentence above.** The call
did not land nowhere. It reached the librarian's own mount — the board carries both rows:

    [0c0c0c0b-0000-4000-8000-00000000115b] user:      [pane:C] P-LIB-WINDOW hand-back: ...
    [0c0c0c0b-0000-4000-8000-00000000115b] assistant: Prompt is too long

So: **routed correctly, received, and could not be read.** "No evidence it was read" was too weak
and too vague; the seat answered, and its answer was a failure to assemble a prompt at all. The
§7 exception still applied and the chair was still raised directly — that part stands.

**And the seat's reply is itself a datum on the diagnosis, so it is recorded here rather than
claimed in conversation.** *"Prompt is too long"* is the request being rejected at assembly, and
CLAUDE.md is part of what is assembled. That is consistent with the shell being the load and it is
**not** an isolation of shell-from-conversation — both ride in the same assembled prompt, and
nothing here separates them. It moves reading (ii) nowhere. §6's order is unchanged.

*Routing note, unrelated to the bars:* the pane shown as **MIKE is the librarian** — `LIBRARIAN_SID`
`0c0c0c0b-…-115b` maps to letter `M` in `letters.json` (established by the chair on the board, not
by me). And the gate row for my raise reads `chair approved + no live pane matches 'MAIN'`, so the
card was approved and had no pane to render into; it reached the chair by the keeper's screen. Both
are observations, not findings — neither was measured by me and neither bears on this build.
