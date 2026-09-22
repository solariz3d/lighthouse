# P-CARRIER-ROWS · BRAVO — six rows for six reds. carrier-drift is GREEN, exit 0, and neither report's text was touched

**B (pane `12fb81f6`), machine D, 2026-09-22 ~16:5x–17:1x.** The chair's declinable offer, taken. **I am a non-author
of both flagged files** (E wrote `loop/carrier_halflife_2026-09-22.md`; the librarian wrote its own collation), and
the L060 withdrawal/mention form is mine. **Nothing committed. No file's prose was rewritten — the rows account for
the quotes, they do not edit the record.**

---

## 0 · BEFORE AND AFTER, BOTH SHOWN

    node consonance/tools/carrier-drift.js

| | before | after |
|---|---|---|
| result | **RED · exit 1** | **GREEN · exit 0** |
| `only-decorrelated-2026-08-16` | 33 occurrences · **31 accounted** | 33 · **33 accounted** |
| `cant-lose-handle-2026-08-29` | 38 occurrences · **34 accounted** | 38 · **38 accounted** |
| `light-not-lifeguard-2026-08-17` (DISARMED) | 60 · 12 accounted · 48 PENDING | 65 · 12 · **53 PENDING — none of them mine to file, but 5 of them are mine to have CAUSED; see §4b** |

**The before-run was RED 6, not RED 5.** The sixth is `exo_memory/librarian/2026-09-22.md:745` — **the librarian's
own 17:0x note about its three failed passes**, which quotes the wording in order to describe the error it made. The
recursion the packet names went one level deeper while the packet was being written: the report of the
report-mints-a-carrier finding minted one. It is accounted below like the rest.

`node --test consonance/tools/carrier-drift.test.js` → **57 pass · 0 fail**, after.

## 1 · THE SIX ROWS, AND WHY EACH KIND

**Anchors came from `carrier-drift.js --census` verbatim and were never hand-trimmed** — trimming is what failed as
BAD-ANCHOR on the librarian's first pass. **Each anchor was checked unique in its whitespace-collapsed file before
anything was written**, and the script refuses to write at all if any is not (`rows.js`, guard 1).

| site | entry | kind | why, in one line |
|---|---|---|---|
| `carrier_halflife:15` | only-decorrelated | **mention** | the LABEL CELL of a census table row counting carriers (2 that day, 22 today); it names the string being counted |
| `librarian:745` | only-decorrelated | **mention** | the librarian's note describing its own misclassification; an error report asserts nothing |
| `carrier_halflife:17` | cant-lose | **mention** | the same census table, one line down, its own row label |
| `carrier_halflife:52` | cant-lose | **withdrawal** | a verbatim excerpt of the live judge prompt, quoted as evidence, with *"That is the struck form… struck on 2026-08-30 (ASK-008)"* in the next sentence |
| `carrier_halflife:86` | cant-lose | **mention** | inside the `grep -n -i` command that produced the finding — the case the README names in the kind's own definition |
| `librarian:674` | cant-lose | **withdrawal** | the collation quoting the struck form to report that `l2-overseer-worker.js:49` still instructs a judge with it, **and supplying the repaired wording in the same sentence** |

**The adjacent-lines trap, which is what the librarian's second pass fell into, is handled by anchoring per wording.**
`:15` is `"only DECORRELATED reader"`, `:16` is `"light, not lifeguard"`, `:17` is `"can't lose by saying it"` —
three different withdrawals on three consecutive table rows. `:16` belongs to the DISARMED entry and **gets no row
from me**; it is not red and accounting it is part of a pass that is not this one.

**Why two are `withdrawal` and not `marked`.** `marked` is for a file that ASSERTS the claim and carries a strike
beside it. Neither file asserts it: both quote *another* file asserting it, and both name the strike at the site
(the entry's own marker regex matches `ASK-008`, present in each). By the README's test — *"the occurrence IS the
correction text, quoting the claim in order to withdraw it"* — these are correction text. This is the same
judgement the existing `p-battery-blind-E:274` row already makes for the same shape, so the registry stays
internally consistent rather than growing a second convention.

**Why the other four are `mention` and not `withdrawal`.** None of them carries a correction; they carry a count or
a command. The README's `mention` definition names both cases explicitly ("a census listing carriers, a grep
command"). Filing them as `withdrawal` would claim the line corrects something it does not.

## 2 · WHAT I DELIBERATELY DID NOT DO, AND WHO IT BELONGS TO

- **`DESKTOP_HANDOFF.md:64` — named for the keeper, no row filed, and I have a reason rather than a preference.**
  It predates today (`git log -1` → `46f5c9f`, **2026-07-13**), so it is an OLD carrier surfaced by the same run and
  not part of the recursion — the packet is right about that. But it is a **live assertion** of the stance in a
  "how we work" section, and **the entry's marker is absent from the file**: `grep -icE "retired|kept as (a )?trace|
  with you, not above you|there just is water" DESKTOP_HANDOFF.md` → **0**. So a `marked` row would itself go red,
  and `acknowledged` means *deliberately left standing* — which is exactly the decision the disarmed entry reserves
  for the keeper. **There is no kind I could honestly file here, and that is the finding, not an omission.**
- **`WELFARE.md:32,:36` and `consonance/AUTONOMY.md:6,:48,:327`** (with `PLAN.md`, `RECONCEPTION.md`, `SPINE.md`) —
  CH-4 pending against the DISARMED entry, where the slogan is the NAME of a live architectural stance. The entry's
  own `arms_on` says whether the program renames its stance **is the keeper's call, not an instrument's**. Left
  alone and named here for him.
- **Neither report's prose was edited**, as the packet required. E's census and the librarian's collation stand as
  written; the registry accounts for their quotes.
- **I moved nothing between the armed and disarmed ledgers, and filed no row against the disarmed entry.** Its
  PENDING count did rise, 48 → 53, because this hand-back mentions that entry five times while explaining what it
  left alone. That is my doing and it is stated in §0 and §4b rather than left as a silent drift in a number the
  next reader would reasonably expect to be unchanged.

## 3 · WHAT I VERIFIED, WITH THE COMMAND

- **Only one file changed by me:** `git status --short` → `M consonance/tools/carrier-drift.registry.json`. The
  second modified file, `exo_memory/librarian/2026-09-22.md`, **was already dirty before I started** — it is the
  librarian's own 17:0x note, not my edit.
- **No pre-existing row was altered.** I kept a copy of the registry before writing and compared every entry's
  sites array element-by-element: **31→33, 34→38, 12→12, and every pre-existing row byte-identical: true.**
- **The diff is +44 / −2, and the −2 are NOT an edit to a row.** They are two existing anchors whose em-dash had
  been stored as a six-character JSON escape and is now stored as the character itself, because I rewrote the file
  with `JSON.stringify`. **The string values are unchanged** (which
  is what the element-by-element comparison proves), the tool reads parsed JSON, the tests pass and the run is
  green. I name it because *"the diff is purely additive"* would be false at the byte level, and this registry is
  read as evidence later.

## 4 · WHAT THIS DOES NOT ESTABLISH

- **Green is not "the room no longer teaches these wordings."** The tool's own limits section says so at length: it
  reads `.md` and `.html` only, so `dev/shell/hooks/l2-overseer-worker.js:49` — **the live judge prompt E's census
  found still carrying the struck form** — is structurally invisible to it and is **not fixed by anything here**.
  Six rows made the instrument honest about six quotes; the carrier inside the prompt is untouched and is the more
  serious of the two.
- **Kinds are judgements, not facts.** Each row is one seat's call and the README says it can be argued with. The
  two `withdrawal` calls are the ones I would expect an argument about, and §1 gives the test I used so the
  argument has something to bite on.
- **I did not re-derive E's census numbers** (43 files, 41 still carrying, two ever removed). I accounted for the
  quotes in it; I did not check the arithmetic it reports.
- **I did not account the 48 pending**, and one of them (`DESKTOP_HANDOFF.md:64`) I actively declined, per §2.

## 4b · THE REPAIR RECURSED ON ME, IN THIS LAP, AND IT IS THE BEST EVIDENCE IN THE HAND-BACK

**After appending the map line I re-ran the tool and it was RED 2 — both findings in THIS FILE, at §1, and both
mine.** The sentence in §1 that explains the adjacent-lines trap names three withdrawals on one line in order to
say which belongs to which; two of the three are armed, so it minted two carriers. **The repair for the
report-mints-a-carrier recursion is itself a report, and it recursed on the exact sentence that explains the
recursion.**

Treated like everyone else's: **two `mention` rows, anchors from `--census`, the file's prose not rewritten.**
`only-decorrelated-2026-08-16` 33→34 sites, `cant-lose-handle-2026-08-29` 38→39. **GREEN again, exit 0.**

**And this paragraph refers to the wordings by entry id and line number ONLY — never by quoting them — so the
accounting stops here rather than recursing a third time.** That is the general repair the shape has been missing:
a report about a withdrawn wording does not have to restate it. Where a quote is genuinely load-bearing (§1's trap
needs the three strings side by side to be legible at all) the row is the right answer; where it is not, naming the
registry id costs nothing and mints nothing. **The map line for this lap was written that way from the start, which
is why it is not in the red list above.**

**One more count that moved, and it is mine:** this hand-back added **5 occurrences against the DISARMED
`light-not-lifeguard-2026-08-17` entry** — **60 → 65 occurrences, PENDING 48 → 53** — simply by naming that entry
while explaining what it left alone. They are not red and I filed no rows for them, for the reason §2 gives: that
entry's accounting belongs to the strike-in-place pass its `arms_on` names, and to the keeper.

**I got this number wrong once, here, in the obvious way.** I first wrote *60 → 64 / 48 → 52*, which was true when
I wrote it and false by the time I filed, because my own later corrections to §0 and §2 named the entry again and
moved it. **A count of mentions, written inside the document doing the mentioning, changes when the document
changes.** The figures above are from the final run, after the last edit; anyone re-running this will get them only
if they re-run against this file as filed.

## 5 · WRONG column

- None filed for this lap. The anchors came from `--census` rather than by hand, each was proved unique before the
  write, the registry was copied first so "no existing row changed" could be checked rather than asserted, and the
  script was written through the editor with no shell-string quoting — the failure that ate an apostrophe on the
  librarian's third pass is the same one that has cost me runs in D092, L063, D103 and L081.
- **The near-miss worth recording:** I almost wrote *"the diff is purely additive."* It is additive in content and
  not in bytes, and I only knew that because I diffed before claiming. §3 carries the precise form.

NEXT: librarian collate the carrier rows when p-carrier-rows-B_2026-09-22.md is written and the map line is appended
