# P-HARNESS §2 · ECHO — the librarian's per-launch growth, measured before anything is designed

**Pane E, machine L, 2026-09-15 ~05:30–06:30.** Packet `exo_memory/loop/packet_harness_and_lib_2026-09-15.md` (1bc3299), §2.
**Read-only:** no code edited, no CLAUDE.md or intake written, nothing committed. Every figure below comes from one of
the scripts in `scratchpad/harness/` (§7), run over the two live transcripts on L and `C:\Consonance\data\persist.log`.
**No design is proposed.** §5 prices the alternatives the keeper and the prior art name, and stops there (F4).

    librarian  C:\Users\zackn\.claude\projects\C--Consonance-instances-librarian\0c0c0c0b-0000-4000-8000-00000000115b.jsonl   56,866,951 B · 18,609 records
    chair      C:\Users\zackn\.claude\projects\C--Consonance-instances-main\0c0c0c0a-0000-4000-8000-000000000a01.jsonl       276,234,540 B · 57,895 records

---

## 1 · THE NUMBER FIRST — per-launch growth

**How a launch was found.** Each resume of a seat writes one vendor record,
`attachment:instructions` with `"reason":"session_start"`, at the seat's first prompt after the resume. It marks every
launch on EITHER machine; L's `persist.log` has only L's.
- **Cross-checked against L's `resume pane=… confirm held` rows.** The markers land 10–188 s after them, the time to
  the first prompt:
  - librarian: resumes 00:20:17, 02:29:48, 05:12:57 → markers 00:20:46, 02:29:58, 05:13:08
  - chair: resumes 00:20:13, 02:32:45, 05:12:54 → markers 00:23:21, 02:34:45, 05:15:32 (all local time)
- The 09-12 markers and 05:41Z / 14:42Z / 14:45Z are launches on D. They are in the carried transcript and not in L's log.
- **BURST:** the records from the resume up to the seat's first reply, which is the growth with nothing typed.
- **PERIOD:** everything to the next launch's burst, work included.

    LIBRARIAN, last 12 launches (09-12 06:45Z .. 09-15 11:13Z)        node analyze.js lib.json librarian 12 · node totals.js …
      BURST per launch     322,852 – 480,444 B   mean 368,523    total 4,422,272
        of which           instructions 3,486,027 (78.8%) · file-history-snapshot 403,422 (9.1%) · everything else 532,823
      PERIOD per launch    378,944 – 3,673,490 B mean 1,384,321  total 16,611,846
        of which           instructions 4,090,433 (24.6%) · file-history-snapshot 4,261,567 (25.7%)

    CHAIR, last 12 launches (09-12 06:06Z .. 09-15 11:15Z)
      BURST per launch     411,900 – 492,161 B   mean 439,825    total 5,277,901
        of which           instructions 2,971,486 (56.3%) · file-history-snapshot 1,769,460 (33.5%) · else 536,955
      PERIOD per launch    490,576 – 6,278,852 B mean 1,678,220  total 20,138,634
        of which           instructions 3,232,090 (16.0%) · file-history-snapshot 10,060,155 (50.0%)

**The 05:12 resume, re-derived** (`node window.js <librarian> 1789470760 1789470900`). Burst **357,388 B**:
- the instructions record: 286,963
- the file-history snapshot: 45,018
- the skill listing: 17,691
- hooks: 5,526
- other: 2,190

**The librarian's 428,177 B did NOT re-derive.** My burst stops at the seat's first reply. Counting on through its
first own tool calls reaches 427,906 B after its seventh assistant record and 433,137 B after the next tool result, so
its figure most likely includes its own first turns. Its command is not in the packet, so I cannot say which cut it used.

**IN CONTEXT, NOT BYTES — the number "balloons" most likely means** (`node context.js <transcript> <label> 12`: input +
cache-creation + cache-read tokens on the last assistant record before each resume and the first after it):

    librarian   +55,827 to +59,049 tokens per resume   (10 of 12; the other 2 read across a zero-usage synthetic record)
    chair       +43,229 to +52,786 tokens per resume   (11 of 12; one +26,803)
    compaction  both seats compact at ~963k-999k tokens and land at ~96k-180k (last 6 each)

These fields cannot split the token delta between the intake and the skill listing, the hooks and the first message.
**No tokens-per-record figure is claimed.**

## 2 · WHAT THE BURST IS

**2.1 · The instructions record (vendor-written, per resume).** Its structure (`node inspect.js … attachment:instructions`):
- `attachment.files[]`: each instruction file with its full `content`, and
- `rendered[]`: the same content rendered, **a second full copy**.

That is why the record is about 2.02–2.03 × the intake's bytes. Measured ratios: librarian 3,486,027 / 1,722,300 =
2.0241; chair 2,971,486 / 1,463,452 = 2.0305.

**The copy began between 09-02 and 09-06.** Before it: librarian ~143 KB, chair ~93–103 KB, `rendered` 0. From 09-06:
~287 KB and ~243 KB. The records name vendor versions 2.1.270 and 2.1.272 now. I did not look up which version added
`rendered`.

Files carried, across all 33 / 37 records (`node paths.js <transcript>`):

    librarian   C:\Consonance\instances\librarian\CLAUDE.md [Project]  33x   129,459 – 141,941 B   <- the intake Consonance writes
                C:\Users\zackn\.claude\CLAUDE.md [User]                 8x   7,478 B
                C:\Users\nname\.claude\CLAUDE.md [User]                 3x   7,572 B (D's)
    chair       C:\Consonance\instances\main\CLAUDE.md [Project]       37x   91,525 – 120,442 B
                ~\.claude\CLAUDE.md [User]                           8x/2x   7,478 / 7,572 B
                ~\.claude\projects\C--Consonance-instances-main\memory\MEMORY.md [AutoMem]  413 – 808 B

**2.2 · The file-history snapshot (vendor-written, per prompt, and re-written at each resume).** One record per user
prompt, holding the WHOLE `trackedFileBackups` map: every file the session has ever written, about 290 B per entry
(`node snap.js <chair> 2`).
- **The chair:** 531 entries, 156,076 B, of which **220 entries (85,001 B) are the chair's own scratchpad files**.
  1,648 snapshot records = **114,574,171 B, 41% of its whole transcript.** Nothing in Consonance writes this record.
- **The librarian:** 29,578 – 45,018 B per snapshot, growing launch over launch.
- **This build names a switch:** `claude.exe` 2.1.272 contains `CLAUDE_CODE_DISABLE_FILE_CHECKPOINTING` (7 occurrences),
  `CLAUDE_CODE_ENABLE_SDK_FILE_CHECKPOINTING` (4) and `fileCheckpointingEnabled` (12)
  (`rg -a -o … claude.exe | sort | uniq -c`). **Its behaviour is untested,** and turning checkpointing off would presumably
  cost `/rewind`. Named so the design lap does not have to rediscover it; not proposed.

**2.3 · The intake itself — the code that writes it, and its parts** (`main.rs` at 1bc3299; sections measured on the
on-disk files written at 05:12 by splitting at top-level `# ` headings):

    LIBRARIAN  spawn_librarian (main.rs:7471) -> librarian_intake (:7319) = librarian_intake_head (:7331) + librarian_shelf (:7295)
               written to C:\Consonance\instances\librarian\CLAUDE.md at :7496, every launch, before --resume
      141,866 B  "# The Librarian tab" + LIBRARIAN.md brief    18,033
                 "# THE ROOM you are holding" + BOOT.md        65,011
                 "# YOUR OWN MAP" pointer (map/M.md)             609
                 "# THE SHELF"                                58,213   — 0 file(s) carried in full (0 of 138 bytes); 463 indexed by path
      bounded by LIBRARIAN_INTAKE_LIMIT = HARNESS_CLAUDE_MD_CHAR_CAP = 150,000 (:6833, :6853)

    CHAIR      spawn_main (main.rs:7506) -> main_intake (:6519) = header + BOOT.md + BUILDING.md; then THE PULSE (:7531) and night_table (:7545)
               written to C:\Consonance\instances\main\CLAUDE.md at :7553
      119,764 B  header 686 · BOOT.md 64,983 · BUILDING.md 53,919 · THE PULSE 176

**The librarian's shelf carries nothing today, and all 58,214 B of it is index.** The date window (rule (a),
`packet_lib_window_build`) and the byte window ((b), `librarian_window_registration_2026-09-01.md`) both choose which
bodies to carry. With a body budget of 138 B they carry none, so today they are inert and would save 0 B. The
self-limiting shelf (`packet_lib_cap`) is what put the budget there: floor = brief + BOOT + index, which fills the cap.

## 3 · WHAT CHANGES BETWEEN LAUNCHES

`node delta.js <transcript> <label> 12`. For each launch, the intake's lines that the previous launch's intake did not
contain, counted as a multiset (a moved line counts as unchanged, so this is a LOWER bound on a diff), and where they sit:

    LIBRARIAN   added per launch 531 – 4,390 B (1 – 47 lines) · last 12 total 22,255 B · byte-identical to previous: 0 of 12
                where: THE SHELF (index lines and the header's counts) and the YOUR OWN MAP pointer line (384–393 B)
    CHAIR       added per launch 154 – 842 B · last 12 total 3,025 B · byte-identical: 0 of 12
                where: THE PULSE, only (its time line, 154–163 B; plus the night table on 2 launches, 599 and 842 B)

**The intake is never byte-identical, so the vendor has never been observed skipping an unchanged one.** Across all 52
session_start records in the 6 transcripts on L that have them, the count of records identical to the one before is
0 (`node identical.js …`). (The `rg` listing named 6 files and not the chair's; the chair's pairs are the 12 in
`delta.js` above, also 0.) **So whether an unchanged CLAUDE.md would write no record at resume is UNMEASURED:** the
data holds no case where one was tried. Each seat's intake carries at least one line that changes every launch.

**The full intake is also re-injected after compactions, mostly within milliseconds** (`node ranges.js <transcript>`:
each reason-null instructions record's distance after the nearest earlier `compact_boundary`):
- **librarian:** each of its last 6 compactions is followed by a full re-injection. 5 came within 13 ms (09-02, 09-07,
  09-08, 09-11, 09-15), and one 33,436 ms after (09-14 11:21:45 → 11:22:19). Its 7th reason-null record
  (09-01 13:36) has no compaction before it in the file.
- **chair:** 3 within 7 ms (09-02, 09-08, 09-09); one 138,290 ms after (09-01 11:13); one 776,228 ms after (09-14 09:20).
  One more (09-01 09:48) is 2 days after the nearest compaction, and the 08-30 compaction has no re-injection for 2 days.

So the vendor re-reads the on-disk CLAUDE.md in full after a compaction, usually at once. The two stragglers and the
two with no compaction show a second trigger I did not identify. In the librarian's last 12 periods these records add
604,406 B of the 4,090,433 B of instructions (the 09-14 11:22 and 09-15 08:43 records, 302,457 + 301,949).

## 4 · WHAT THIS DOES AND DOES NOT ESTABLISH

- **ESTABLISHED:**
  - With nothing typed, a resume grows the librarian's transcript by a mean of 368,523 B, 78.8% of it the
    instructions record: a full copy of its 141 KB intake, written twice by the vendor.
  - It grows the chair's by 439,825 B, 56.3% instructions and 33.5% a vendor file-history snapshot.
  - In context, the librarian gains ~56–59k tokens per resume and the chair ~43–53k.
- **ESTABLISHED:**
  - Between launches the librarian's intake changes by 0.4–3.1% of its bytes (531–4,390 of ~141,800), and the chair's
    by one timestamp line.
  - The full record is written anyway.
- **NOT established:**
  - how many of the context tokens are the intake as opposed to the rest of the burst;
  - whether the vendor would skip an unchanged intake;
  - what `CLAUDE_CODE_DISABLE_FILE_CHECKPOINTING` does;
  - anything about D's transcripts beyond what the stick carried.
- **NOT established:** that transcript bytes are what the keeper experiences as the balloon. §1 gives both units
  because bytes and tokens are different surfaces, and I cannot tell from here which one "balloons" referred to.

## 5 · WHAT EACH ALTERNATIVE WOULD SAVE — measured bytes, no recommendation

Over the same last 12 launches per seat. Instructions records measured; a replacement's size estimated as (its bytes ×
the measured record/intake ratio) + 1,000 B per record for the fixed keys. The 1,000 B is an allowance, not a measurement.

    (A) THE KEEPER'S: the resume's CLAUDE.md carries only what changed since the last launch
        librarian  records ~57,045 B instead of 3,486,027  -> ~3,428,982 B saved (~285,749 per launch)   (22,255 B changed x 2.0241 + 12,000)
        chair      records ~18,142 B instead of 2,971,486  -> ~2,953,344 B saved (~246,112 per launch)   (3,025 B changed x 2.0305 + 12,000)
        does not touch: the file-history snapshot (librarian 403,422 B / chair 1,769,460 B of the bursts), the skill listing, hooks.
        CONSTRAINTS MEASURED, not solved:
          - the vendor re-reads the ON-DISK CLAUDE.md in full after a compaction, usually within milliseconds (§3). If
            the file on disk is a delta at that moment, the seat's post-compaction context holds the delta, not the room.
            The librarian's last 6 compactions fell 09-02, 09-07, 09-08, 09-11, 09-14 and 09-15, gaps of 1–5 days.
          - "since the last launch" has to be measured against what the RESUMED transcript last received. With the stick,
            that is often the other machine's intake (the 09-12 and 14:42Z launches are D's), not this machine's last
            CLAUDE.md.

    (B) MAKE THE INTAKE BYTE-IDENTICAL ACROSS LAUNCHES (move the per-launch lines out of CLAUDE.md), hoping the vendor
        then writes no record
        saving IF the vendor skips: the whole record, ~290,502 B (librarian) / ~247,624 B (chair) per launch.
        UNMEASURED whether it skips (§3: 0 identical cases in 52). And the librarian's changing lines are the shelf index
        and the map pointer, not one pulse, so they would all have to leave the file.

    (C) PRIOR ART — the date window (a), the byte window (b), the self-limiting cap, run-artifact exclusion, not
        re-delivering CLAUDE.global.md
        saving today: 0 B. The shelf carries 0 bodies with a 138 B budget (§2.3); these rules choose among bodies, and
        the exclusions are already applied at HEAD. The cap bounds the intake at ≤150,000 chars, and the intake sits
        at it. What remains is floor: brief 18,033 + BOOT 65,011 + map pointer 609 + index 58,213.

    (D) THE PARTS OF THE FLOOR, priced one at a time (per record, per launch, at ~2.02x; not proposals)
        BOOT (both seats)        65,011 B -> ~131,600 B of record per launch per seat
        shelf index (librarian)  58,213 B -> ~117,800 B
        BUILDING.md (chair)      53,919 B -> ~109,500 B
        LIBRARIAN.md brief       18,033 B -> ~36,500 B

    (E) THE VENDOR'S FILE-HISTORY SNAPSHOT (chair)
        1,769,460 B of the chair's 12 bursts (mean 147,455 per launch) and 10,060,155 B of its 12 periods; 114,574,171 B
        (41%) of its whole file. A build switch exists by name (§2.2). Its effect was not tested, and 220 of 531 tracked
        entries are the chair's scratchpad.

## 6 · CORRECTIONS AND INSTRUMENT FAULTS, MINE

- **My first window read the resume as starting at the instructions record.** It starts ~11 s earlier: two
  `hook_success` records and a `hook_additional_context` at the resume itself, then the rest at the first prompt. The
  burst in §1 starts at the resume.
- **`context.js`'s mean for the librarian (27,529) is wrong as a mean.** Two resumes sit across a zero-usage synthetic
  record (09-14 06:57Z "before 0"; 11:16Z "after 0"). §1 quotes the range of the 10 clean ones, not that mean.
- **An `rg -l` over `~/.claude/projects` listed 6 transcripts and not the chair's**, although the chair's file holds 31
  session_start records. I did not find out why. The chair's identical-pairs count comes from `delta.js`, not from that listing.
- **My first draft of §3 said the chair's re-injections sat "5 of 6 within 7 ms"** of a compaction. Re-run with
  `ranges.js`, only 3 do (the others lag 138 s and 776 s, and one is 2 days out). Corrected in §3 before sending.
- **The vantage DISAGREE on L052's +220** (really +226) arrived again with this dispatch. It is already corrected in two
  hand-backs; no action.

## 7 · THE INSTRUMENTS — all in `scratchpad/harness/`, read-only over the transcripts

    scan.js <transcript> <out.json>        every record [ts, bytes, shape]; the instructions records tabled
    analyze.js <scan.json> <label> [n]     per-launch BURST and PERIOD by category; writes <label>.launches.json
    totals.js <label> <launches> <delta>   sums over n launches and the (A) arithmetic
    delta.js <transcript> <label> [n]      intake lines added launch over launch, by section; compaction markers
    identical.js <transcripts...>          session_start records identical to the previous one
    context.js <transcript> <label> [n]    context tokens around each resume and compaction
    ranges.js <transcript>                 Project CLAUDE.md size range; each reason-null record's lag after a compaction
    window.js / inspect.js / paths.js / snap.js   the single-launch window, record outline, file paths, snapshot outline

**Not verified:** nothing on D; no resume of a scratch seat to test whether the vendor skips an unchanged CLAUDE.md
(the packet says write no CLAUDE.md, so I did not); no tokens-per-record split; the librarian's own 428,177 B cut.
