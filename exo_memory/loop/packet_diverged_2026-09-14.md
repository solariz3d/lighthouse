# P-DIVERGED · a door for two futures of one conversation, so the keeper's choice at 871ad66 can be carried out. Lap L058 (third use).

**To ALPHA and ECHO, with CHARLIE reading the shared section FIRST, 2026-09-14 ~07:05, on machine L.**

**Why these three.** C found DIVERGED (`handback/p-stick-preflight-C_2026-09-14.md`), and C built none of the code,
so C is the reader. A owns `dev/tail-carry.js` and `dev/stick-apply.js` (L058, L059). E owns the window and the
handshake (L059). The work shape and order are the librarian's (`librarian/2026-09-14.md`, 06:49 entry, 7f4e61e).
**The order is C first:** C reads §2 against the source and rings the librarian with any defect. A and E start
only when the chair re-rings them. Eight defects in the chair's shared sections tonight are the reason.

## 0 · THE KEEPER, AND WHAT IS MEASURED

> **Decision, 05:58 (871ad66):** asked which continuation of main and the librarian should win when the stick
> reaches the desktop, **"The laptop's (Recommended)"**. The other is archived, never deleted.

Measured:
- L's chair file and D's interrupted export first differ at **byte 260,427,746** (the chair, reading both).
- D's growth after the 12:47 export: chair +213,510 B, librarian +398,974 B (`librarian/2026-09-12.md:47`).
- On D, the import will read **DIVERGED** for main and the librarian (C).
- The window builds offers only for `reason == OTHER_CONVERSATION` (`main.rs:10642`). DIVERGED is a *verdict* with no
  reason (`tail-carry.js:902`), so it gets no offer. No flag takes it: `--retire-far` acts only on a key mismatch
  (`:828`), `--repair` only on an interrupted prefix-of-tail (`:896`). **So D would stop both seats with no door.**

## 1 · WHAT "TAKE THE STICK'S" IS FOR A DIVERGED SEAT

A DIVERGED row has already passed every check up to one point: same key, `agreed.offset == pend.offset`, the prefix
sha matches, and the extra bytes are NOT the start of the carried tail (`:886-906`). The two machines share bytes
`0..pend.offset` exactly and continue differently after it. **Taking the stick's** keeps that shared prefix,
discards this machine's continuation to the attic (the whole file, copied first), and appends the carried tail.
This is REPAIR's own mechanism (`:980-988`: copy aside, truncate to `pend.offset`, append, verify whole), started by
the keeper's word instead of the prefix-of-tail test.

## 2 · SHARED SECTION — build exactly this. §6 applies to every line.

**2.1 · The flag.** `--take-stick <sid>`, repeatable, parsed beside `--retire-far` and `--repair` (`:1313-1314`),
and listed in `--help`. Distinct from both, because it acts on a different verdict.

**2.2 · The verdict.** During `planImport`, a row that would be `DIVERGED` becomes **`RETIRE_THEN_APPEND`** when its
sid was named. **A named sid whose row is anything other than DIVERGED keeps its verdict unchanged.** The flag never
turns a REFUSED, INTERRUPTED or APPEND row into a take. That case gets a test.

**2.3 · The apply.** `RETIRE_THEN_APPEND` joins `DOES` (`:946`):

    asideTo = atticPath(plan.projectsRoot, slug, row.sid, 'take-stick', now)   // the ONE retirement address, :611
    copy row.dest -> asideTo     (copy, then truncate; never a rename — the prefix stays in place)
    truncate row.dest to pend.offset
    append row.tail
    verify: size === pend.toOffset AND full sha256 === pend.fullSha  (the same bar as every other write, :996-998)
    on ok: agreed = {offset, prefixSha, at}, pending = null — as :999-1002

    The attic file:  ~/.claude/consonance-attic/<encoded cwd>/<sid>.<YYYYMMDD-HHMMSS>-take-stick.jsonl
    It holds this machine's WHOLE file as it was before the truncate, including the shared prefix.

**2.4 · The row fields**, in `toJson` beside `retirable` (`:1246`):

    takeable   import only: true when verdict === 'DIVERGED'; otherwise null
    ownBytes   import only, DIVERGED or RETIRE_THEN_APPEND: size - pend.offset, the bytes this machine wrote of its
               own past the shared prefix; otherwise null
    (RETIRE_THEN_APPEND carries `carries: true` and its `result.aside` names the attic file, as the other writes do)

**2.5 · The window (E).**
- `main.rs:10642` also builds an offer when `verdict == "DIVERGED"`, for every kind.
- **Nothing is preselected on a DIVERGED row, for any kind.** Both files are the lineage. The window shows both
  byte counts (`ownBytes` and the tail's `bytes`) and both machines (this one, and `exportedFrom`). Carry stays
  disabled until every DIVERGED row has an explicit choice.
- The offer's `why` names what each choice does:
  - TAKE THE STICK'S: this machine's file goes to the attic, whole.
  - KEEP THIS MACHINE'S: the stick's tail for this seat is not carried. Until the other machine's tail is taken,
    this machine's later turns for this seat will not export (`UNIMPORTED_TAIL`, `:665`).

**2.6 · Forwarding.**
- **TAKE** becomes `--take-stick <sid>`: through `stick_start_applier`, a new `take_stick: Vec<String>` (snake_case,
  checked by `is_sid` as the others are, `main.rs:10677`), and through `dev/stick-apply.js`, forwarded verbatim (A).
- **KEEP** is recorded in `stick-keep.json` exactly as an OTHER_CONVERSATION keep (`record_keeps`, `main.rs:10453`).
  `rehearsal_is_quiet` (`sync_launch.rs:1187`) treats a kept DIVERGED stop as not news, same as a kept
  OTHER_CONVERSATION stop.

**2.7 · What is NOT built here, named.** A KEEP that clears the other machine's pending tail on the ledger, so this
machine can export again. Tonight's choice is TAKE on D, so KEEP's export consequence is shown in the window and
left for a later lap.

**2.8 · RE-RULED ~07:15 after C's first read** (`handback/p-diverged-read-C_2026-09-14.md`; re-derived by the
librarian, 2373417; the chair checked `:172`, `:885`, `sync_launch.rs:942-945` and `stick.js:78-82/102/130` at
source). **Two lines of §2 were wrong and five were under-specified, all the chair's. They are defects D-1 to D-7.
A and E build this block where it conflicts with §2.1–2.7.**

    D-1  WRONG (§2.2/2.4). A seat whose carried tail is ALREADY here, and which then grew on this machine, reads
         DIVERGED today: :885 `extra <= row.tail.length` fails when the extra is the whole tail plus more.
         C's probe on the real tool: 557 B -> ALREADY_APPLIED; 675 B -> DIVERGED, stops true.
         §2.2 as written would truncate this machine's genuinely LATER turns into the attic.
         RULED (A): before :902, when size > pend.toOffset AND hashRange(dest, 0, pend.toOffset) === pend.fullSha
           -> verdict APPLIED_AND_GREW. It SETTLES under --apply exactly as ALREADY_APPLIED does (:957-969):
           agreed = {offset: pend.toOffset, prefixSha: pend.fullSha}, pending = null; nothing written to the seat's
           file; not takeable; ownBytes = size - pend.toOffset. It is not a stop. A test with C's probe shape.
         RULED (E): ALREADY_APPLIED and APPLIED_AND_GREW make Carry actionable (stick.js:102). Both heal the ledger,
           and today the window disables Carry for them, so the L059 heal never runs from the window.

    D-2  WRONG (§2.6). "A kept DIVERGED stop is quiet" cannot hold. The same machine's export rehearsal refuses
         UNIMPORTED_TAIL for that seat (tail-carry.js:662-667), and rehearsal_is_quiet is false on any export stop
         (sync_launch.rs:1193). So the window would reopen on every launch after a KEEP. That is already true for a
         kept OTHER_CONVERSATION today; the test at :2250-2256 passes export rows [] and never met it.
         RULED (E): rehearsal_is_quiet also ignores an export row whose reason is UNIMPORTED_TAIL for a sid kept
           for THIS carry (the same is_kept(keep, sid, exportedAt) the import side uses, with exportedAt taken from
           the import row for that sid). The keeper chose knowingly; re-showing the window is noise. A test with
           real export rows.

    D-3  The DIVERGED offer does not go through offer_for. Its retirable gate (sync_launch.rs:989-996) returns
         take_offered:false and default Keep, and retirable is null on DIVERGED rows.
         RULED (E): a DIVERGED row gets {take_offered: true, default: none}, built beside offer_for, not through it.

    D-4  SeatChoice has no "nothing preselected" (sync_launch.rs:942-945), and stick.js:81 checks KEEP when take is
         not offered.
         RULED (E): add SeatChoice::None, tag "none". stick.js checks neither radio when default is "none".

    D-5  stick.js:130 sends every take as retire_far, which :828 ignores for a DIVERGED row. That makes falsifier (i)
         fire by construction.
         RULED (E): the pick is routed by the row's verdict (data-verdict on the tr). DIVERGED -> take_stick;
           OTHER_CONVERSATION -> retire_far.

    D-6  "Carry disabled until every DIVERGED row has a choice" needs a re-check when a radio changes, not only at
         render.
         RULED (E): an input listener re-evaluates actionable-and-complete.

    D-7  RETIRE_THEN_APPEND must be listed in CARRIES.import (:172), or its row says carries:false. And `bytes` is
         null on DIVERGED rows today, so the window has nothing to show.
         RULED (A): add it to CARRIES.import; a DIVERGED row carries bytes = pend.bytes (the tail's length).

    LANDING: stick-apply.js:80 exits 2 with no handshake on an unknown flag, so E's --take-stick without A's parser
    is a Carry that never starts. Both halves land together (as L059).

## 3 · THE SPLIT — neither of you edits the other's files

    ALPHA   dev/tail-carry.js, dev/stick-apply.js, consonance/state-manifest.json (one rule, below), dev/*.test.js
            §2.1-2.4 and the forwarding half of 2.6, and the three one-line debts the librarian collated:
            (a) :775 — a NOTHING_PENDING row still keys this machine's file, so `localFirstTimestamp` is not null
                when the file exists. It is the "unknown" column the keeper saw.
            (b) :660-699 — this machine's OWN pending tail counts as what the stick holds. An export rehearsal on
                the exporting machine, whose file still equals `pend.toOffset` with `pend.fullSha`, carries
                nothing. If the file has grown past `pend.toOffset`, say what the export does today and keep it
                correct. The rule is only that the reopen must not read "the stick does not have your last
                session" after its own export.
            (c) :304 — the HANDOFF's "expected at the far end" for a delta must not promise APPEND. The exporter
                cannot see the far machine. Say APPEND if the far end has written nothing of its own for this
                seat since the agreed state, and DIVERGED (the keeper chooses there) if it has.
            (d) state-manifest.json: a STAYS rule for `ready/*.tmp` (C §5 found `ready/<pane>.json.<pid>.tmp`
                unplaced, and D's close would refuse on it). The same shape as your R-3 rules.

    ECHO    consonance/src-tauri/src/main.rs, sync_launch.rs, consonance/ui/stick.js (+ its test)
            §2.5 and the app half of 2.6, and:
            (e) main.rs:9811 — the withheld-seat line says READ-ONLY only when the launch is read-only. A stick hold
                says the seats are waiting for the transfer window.

## 4 · FALSIFIERS AND BARS

    FALSIFIER (this packet): on D, a launch with this stick whose main or librarian ends with that seat
      (i)   still DIVERGED after the keeper chose TAKE,
      (ii)  fresh, or with a launch-minute first timestamp,
      (iii) with no attic file named <sid>.<stamp>-take-stick.jsonl holding D's pre-truncate bytes, or
      (iv)  with a size or sha that differs from the ledger's pending toOffset/fullSha.
    FALSIFIER (the idea file's third, re-worded per the librarian): an export that reports DONE while any carried
      seat's file at export time is longer than the pending.toOffset that export wrote.

    A   a test per case: DIVERGED + named -> RETIRE_THEN_APPEND, and applied, verified whole, attic file present with
        the pre-truncate bytes; named on a non-DIVERGED row -> verdict unchanged; takeable/ownBytes on the row;
        (a) (b) (c) each red-first. node dev/tail-carry.test.js · node dev/stick-apply.test.js ·
        node consonance/tools/state-manifest.test.js · tail-carry.mutants.js on a COPY with new mutants for 2.2/2.3
    E   an offer on a DIVERGED row with nothing preselected, TAKE forwarded as --take-stick, KEEP recorded and quiet;
        cargo test --bin consonance -- --test-threads=1 · node consonance/ui/stick.test.js
    C   reads §2 BEFORE A and E build: every line against the source, path:line. Then reads both hand-backs.
    ALL say what you did NOT verify. Nothing with --apply against D:\consonance-L-20260911. No edits outside your
        files. Build against fixtures that reproduce DIVERGED; do not hand-edit the real stick's ledger.

## 5 · §6, VERBATIM FROM L059

**§2 is what the other half builds against.** If either of you finds a line of it cannot be built as written, **STOP
building on it, write down why in your hand-back, and ring the librarian then.** Do not change a shared section in
place and keep going, and do not build around it.

## 6 · HAND-BACK

`exo_memory/handback/p-diverged-<letter>_2026-09-14.md`, then `call_librarian` with the path in the same turn. One
line to your own map. Do not commit. **This lands before the keeper launches D with the stick**, and D must
`git pull` and rebuild first.
