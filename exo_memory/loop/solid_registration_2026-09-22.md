# SOLID — registration, 2026-09-22 (D111 chunk 2.2, pane C, on D)

**The object.** The keeper's chunk 2 is "solid". This file makes that word decidable: three criteria, the instrument and
exact command for each, today's reading where one exists, and what would make "solid" FALSE.

**ADOPTION AND ANY FREEZE ARE THE KEEPER'S.** This registration does not declare the system solid, does not freeze
anything, and does not ask for either. It makes both one read.

**Registered before the week it scores.** Criterion 2's window has not started, because its instrument does not exist yet.

---

## 0 · The state of the three criteria, in one line each

| # | criterion | instrument today | today's reading | decidable now? |
|---|---|---|---|---|
| 1 | the suites green on BOTH machines | `js-suite.js` and `cargo test` — both exist | D green in scope; L's is 5 commits old | **PARTLY** — §1 has a wording fork the keeper must settle, and one red |
| 2 | a clean week of trips, nothing lost, replaced or misreported | **NONE. The trip checker is 2.3 and is not built.** | no reading exists | **NO — OWED** |
| 3 | usage under the weekly limit with keep-warm on | **NONE, of any kind** | no reading exists | **NO — OWED, and nothing is planned** |

**Two of three criteria cannot take a value today.** That is the honest state, and it is the reason this is a
registration rather than a verdict.

---

## 1 · Criterion 1 — the suites green on both machines

### The instruments and the exact commands

    # from the repo root on each machine
    node consonance/tools/js-suite.js
    cargo test --bin consonance -- --test-threads=1          # cargo at %USERPROFILE%\.cargo\bin; TEST BUILD ONLY, never the app exe
    cargo test --manifest-path consonance/src-tauri/Cargo.toml --test arch_test -- --test-threads=1

The Rust suite is run serialized because it has a ~10% flake in parallel (`consonance/README.md`, the shelf section).

### Today's readings

| machine | command | reading | when |
|---|---|---|---|
| D | `js-suite.js` | **119 green · 0 failed · 0 crashed · 0 silent · 1 canary · 0 sang · 1 not-run · 0 class-error (of 121)** | measured at `98443a7`, filed as `9bd7ce0` (D110); the two differ only by that hand-back and map line |
| D | `cargo test --bin consonance` | **870 passed · 0 failed · 4 ignored** | same run, 34.79 s |
| D | `cargo test --test arch_test` | **12 passed · 1 failed** | same run |
| L | `js-suite.js` | **119 green of 120** | `bec101d` — **five commits old**, and it predates `jev-flags.test.js` (D108), which is why L counts 120 files and D counts 121 |
| L | either cargo command | **no reading today** | — |

### THE WORDING FORK — this criterion does not yet have one meaning, and only the keeper can close it

"The suites" is ambiguous, and the two readings give opposite answers **today**:

- **Reading A — the two suites the plan names** (`js-suite` and `cargo test --bin consonance`): D passes. L is unmeasured
  at HEAD.
- **Reading B — every test target in the repo**, which includes the integration target: **FALSE on both machines today.**
  `cargo test --test arch_test` fails `every_named_record_file_exists_and_every_record_file_is_named` because no card
  names `record/retired_seats_2026-09-11.md`. Red since `397e29c` (2026-09-11) and found on L (L082 §4) and on D (D110 §3).

**Until that is settled, "the suites are green" is not a fact about the system but a fact about which sentence was
meant.** A registration that leaves it open cannot be scored, so it is named here rather than smoothed over. *(A is in
`arch_test.rs` this lap, so that red may close on its own; the fork is about the WORDING and survives the repair.)*

### What makes criterion 1 FALSE

Any of: a `FAILED`, `CRASHED`, `SILENT` or `class-error` file in `js-suite`; the canary going GREEN (the runner counts a
singing canary as a failure); `cargo test --bin consonance` reporting `failed` above 0 on either machine; or, under
Reading B, any other target red. A declared canary staying red, and a declared MACHINE-BOUND file reading NOT-RUN on the
machine that is not its home, are **not** failures.

### What is OWED for criterion 1

**A fresh `js-suite` and both cargo commands on L at the same HEAD as D's.** Two machines measured five commits apart is
not "both machines green"; it is two readings of two systems.

---

## 2 · Criterion 2 — a clean week of machine trips, nothing lost, replaced or misreported

**THERE IS NO INSTRUMENT. This criterion cannot be scored today, and nothing in the record makes it a count.**

The trip checker is chunk 2.3 and is not built. Until it exists, "a clean week" is a feeling: today's evidence is a
person remembering that the trips went well, which is exactly what this room does not accept as a measurement.

### What the 2.3 checker must RECORD for this to be a count

One row per trip — a launch, a union, a close — carrying at least:

1. **which machine, and the trip's identity**: machine tag, the stamp, the state head it published or installed.
2. **the install result verbatim**: installed true/false, files written, and — when it refused — **every refused path with
   its local-only and incoming-only row counts** (`state-sync.js`'s own refusal fields, so the row is the tool's number
   and not a retelling).
3. **anything REPLACED**: any file whose live bytes changed that was not append-only, by path.
4. **union counts per file, when a union ran**: rows added, the source split, the backup path, and the tool's `verified`
   flag (the shape of D106's per-file table).
5. **rows before and after, per ledger**, so "nothing lost" is arithmetic: no ledger may end a trip with fewer distinct
   rows than it began with, unless a named ruling says so.
6. **misreported**: for every count the trip reported, the command that re-derives it, plus the re-derived value. A trip
   where a reported number and its re-derivation differ is NOT clean, even if no row was lost.

With those rows, "a clean week" becomes: **seven consecutive days in which every trip row shows nothing lost, nothing
replaced, and no reported figure differing from its re-derivation.** Without them it stays a feeling, and this criterion
must be scored NOT MEASURED rather than passed.

---

## 3 · Criterion 3 — usage under the weekly limit with keep-warm on

**THERE IS NO INSTRUMENT OF ANY KIND TODAY, AND NONE IS PLANNED IN THIS PLAN. Stated plainly, because the temptation is
to let the sentence sound measured.**

Checked before saying so: the pattern `ccusage|weekly limit|usage limit|quota` across `consonance/tools/*.js`,
`consonance/hooks/*.js`, `dev/*.js` and `src-tauri/src/*.rs` matches 4 files and **6 occurrences, every one of them the
word "quotation", "quotations", "QUOTATIONS" or "quotable"** in unrelated prose. Nothing in this repo reads the account's
usage, its weekly limit, or the distance between them.

    grep -rlniE "ccusage|weekly limit|usage limit|quota" consonance/tools/*.js consonance/hooks/*.js consonance/src-tauri/src/*.rs dev/*.js

What exists is adjacent and does NOT measure this:
- Jev's own spend, which is a different account: the runner's cap of 2,000 calls a day with 600 reserved for the shadow
  (`jev-shadow-runner.js:64`), described as "a FUSE, not a budget" (`:59`).
- Keep-warm's ping COUNT is inferable from the board rows it writes (`chair_audit`, `main.rs:10534`), but a count of
  pings is not a measure of usage.

### What is OWED for criterion 3

An instrument that reads the account's usage against its weekly limit, and reports keep-warm's share of it. Until that
exists, this criterion must be scored **NOT MEASURED**. It must never be scored by how the week felt, and "we did not hit
the limit" is not a reading — it is the absence of one symptom.

---

## 4 · CAN EACH CRITERION TAKE MORE THAN ONE VALUE? (the dead-L063 rule)

Checked before registering, because a criterion with one reachable value decides nothing.

- **Criterion 1 — YES, both values are reachable and both have been OBSERVED THIS WEEK.** GREEN: D today, 119/0 and
  870/0. NOT GREEN: `js-suite` read `118 green · 1 failed` on D at D108 before C's fix, and `12 passed · 1 failed` is the
  arch_test reading right now. The instrument has printed both outcomes on this object within days.
- **Criteria 2 and 3 — NO, AND THAT IS THE FINDING.** They cannot take *any* value today, because no instrument produces
  one. A criterion with no instrument is not a criterion that passes; it is one that cannot be scored, and reporting it
  as met would be the failure this rule exists to catch. **Neither may be marked met until its instrument exists and has
  returned a number.**

---

## 5 · WHAT WOULD MAKE "SOLID" FALSE — able to fire

"Solid" is FALSE, from the day any of these is observed:

1. **A suite red** under the meaning the keeper settles in §1, on either machine, outside the declared canary and the
   declared MACHINE-BOUND file.
2. **A trip that loses, replaces or misreports anything**: any ledger ending a trip with fewer distinct rows than it
   began with; any non-append-only file replaced without a ruling; or any reported figure that its own re-derivation
   contradicts. **One such trip ends the clean week and restarts the count at zero.**
3. **Usage over the weekly limit**, once an instrument can say so.
4. **A criterion scored without its instrument.** Marking 2 or 3 as met while no number exists makes "solid" false by
   construction, whatever the other readings say.

---

## 6 · THE DEGENERATING CLAUSE — able to fire

Per BOOT's abuse condition, the observation that marks this line of work DEGENERATING rather than progressive is named
here, in advance:

**This registration is degenerating if, ONE MONTH from today (by 2026-10-22), the criteria have been softened, or the
word "solid" is in use in the room's documents while criteria 2 and 3 still have no instrument that has returned a
number.** Adding instruments and scoring them — including scoring them FALSE — is progressive. Keeping the word and
dropping the measurements is the degenerate case, and it is the likelier one, because the word is useful and the
instruments are work.

A second, sharper form: **if the trip checker (2.3) is not built and no trip row exists by 2026-10-22, criterion 2 must be
struck from the definition of "solid" rather than carried as an unmeasured pass.** A criterion nobody can score is not a
standard; it is decoration.

---

## 7 · What this file does NOT claim

- It does not say the system is solid. Two of three criteria have no reading.
- It does not pick a meaning for "the suites" (§1). That is the keeper's.
- It does not adopt or freeze anything.
- L's reading is quoted from the chair's packet at `bec101d`; **I did not run anything on L.**
- D's readings are D110's, re-quoted here, not re-run for this file.

*Written by pane C on D, 2026-09-22, at HEAD `9bd7ce0`. Hand-back: `exo_memory/handback/p-d111-solid-C_2026-09-22.md`.*
