# P-CHAIN-STATE — hand-back (L025, 2026-09-01 ~05:30)

**One file touched: `consonance/src-tauri/src/main.rs`.** Cumulative for this lap (P-INTAKE-CUT + this packet): **+548 / −6**. This packet alone is the `chain_state` command, its pure reader, seven tests, and one line in `generate_handler!`. Nothing committed. `ui/`, `COMMITTEE.md` and `BOOT.md` untouched by me — the `ui/` and `brief/` lines in `git status` are ECHO's and CHARLIE's.

**NOT LIVE UNTIL THE REBUILD.** A Tauri command is compiled in; nothing here is reachable from the running app.

---

## THE COMMAND

`chain_state()` → the newest **non-filed** `stage:"chain"` row from `data_dir()/lap.jsonl`.

    #[tauri::command] fn chain_state() -> ChainState     // registered in generate_handler!
    fn chain_state_from(rows, unreadable, now_ms) -> ChainState    // pure, and where the tests live

**Live reading, from the real ledger:**

    {"open":true,"reason":null,"lap":"L025","chain":"handbacks-in","holder":"librarian",
     "note":"KEEPER FINDING, unowned: …","at":1788259914658,"age_ms":595649,
     "also_open":1,"self_reported":true,"unreadable":0}

**`also_open: 1` independently reproduces the pulse line's `+1 more open`** — two instruments, different code paths, same number. That is the only cross-check available for this reader and it is worth having.

---

## THE ORDER IS THE WHOLE CORRECTNESS, AND IT IS CARRIED, NOT RE-DERIVED

**Newest-per-lap FIRST, then drop `filed`** — verbatim from `chain-status.js::openLaps`, whose own comment says why: filter `filed` out of the stream and take the newest of what is left, and a finished lap **resurrects from its own second-to-last row**, silently and permanently, because that row can never stop being the newest non-filed one.

The ledger has the case live: **L024's newest row is `handbacks-in`, unfiled, while L025 runs.** Under the wrong order L023 would also read open forever off its `working` row. There is a test named for the defect, not for the feature.

---

## THE ONE THING THE CHAIR SAID TO GET RIGHT — IT IS IN THE SHAPE, NOT INFERRED

*"If the command cannot tell fresh from stale, say so in the return shape."*

**It cannot, and the shape says so.** A board audit row is a **receipt** the control plane stamped when a verb fired. A chain row is a **claim a seat chose to write, afterwards.** Nothing in `lap.jsonl` separates a current row from one that simply stopped being written to — which is exactly the `LIB → LIB` reading A found during a four-out fan-out, and the L024 row above is the same shape sitting in the ledger right now.

So:

- **`self_reported: true`, always.** The class of the evidence rides every reading. A UI that wants to weight a receipt above a claim can, without guessing which it holds.
- **`age_ms` rides every reading**, computed at read time. The row's own `at` is also returned, so the UI never has to derive one from the other.
- **`also_open`** — other unfiled laps behind this one. **This is the only staleness signal the ledger actually supports**: a lap left open while a newer one runs is abandoned, and that is observable rather than inferred.
- **`reason`** is populated whenever `open` is false, and the three cases are **distinguishable**: `"no ledger on this machine"`, `"the ledger carries no baton rows yet"`, `"every lap with a baton row is filed"`. A UI handed only `open:false` reads *nothing has started* and *everything finished* identically.

**What I did NOT do, and why:** the rows carry a `head` sha, and comparing it to the repo's current HEAD looks like a freshness test. It is not one — commits land mid-lap routinely (L025's own rows carry two different heads), so the mismatch would be true most of the time and mean nothing. **Inventing that signal would have been the fabricated-freshness failure this packet exists to avoid.** No git is spawned.

**It is a SENSOR.** Same law as `chain-status.js` and `sourced-stop.js`: no thresholds, no verdicts, no advice. `chain-status`'s own ledger refutes the axis a verdict would need — **L009 sat 3554s and the panes worked; L010 sat 3557s and the lap was dead.** There is a test asserting no verdict word (`stalled`, `stuck`, `dead`, `hung`, `late`, `overdue`) can appear in the serialised shape in any state.

---

## THE BARS

- **`cargo test --bin consonance` → 348 passed, 0 failed, 3 ignored.** Seven new tests here, all named for a failure rather than a feature.
- **Defined shape when no lap is open** — three distinguishable reasons, tested, and no panic on an absent ledger. The common case at boot, treated as such.
- **Survives a lap mid-flight** — tested through the real command, not the pure one: a half-written last line on disk (`{"lap":"L025","sta`) is **counted as `unreadable: 1`, never filtered away and never fatal**, and the reading still stands. A row that cannot be read is an outcome that is unknown, not absent (residue.js, 2026-08-17).
- **Pre-existing red, unchanged and not mine:** `cargo test --test arch_test` → 11 passed, 1 failed (`record/third_place_prehistory_2026-08-30.md is named by no card`). Same red as at P-INTAKE-CUT; `cards/` and `record/` are clean in git, so it is red at HEAD.

---

## FOR E — THE VOCABULARY DOES NOT MATCH, AND THAT IS THE INTEGRATION RISK

E's chip maps **receipt shapes** to hops: `chair injected … -> ID`, `call_librarian L -> LIB`, `call_chair -> Main`. **This command speaks a different vocabulary**, and handing it to the same mapper without noticing would be a silent misread rather than a blank chip.

Measured over the whole ledger:

    holders: chair 37 · librarian 32 · panes 30
    chains:  dispatched 17 · working 17 · handbacks-in 20 · return-leg 12 · filed 18 · map 12 · inquiry 3

The `holder` → **next hop** mapping that matches E's arrow-is-the-next-hop rule:

| `holder` | next hop the arrow should point at |
|---|---|
| `chair` | **the panes** — the chair dispatches |
| `panes` | **LIB** — a pane hands back by `call_librarian` |
| `librarian` | **the orchestrator** — LIB rings by `call_chair` |

**Offered, not imposed** — the arrow is E's file and E's call. Two things to weigh with it:

1. **`note` is not display-sized.** The live one above is ~600 characters. It is returned because dropping it would make the command less than the ledger, not because a chip should render it.
2. **`self_reported: true` is the reason to prefer the ring where the ring has an answer.** The board carries receipts; this carries claims. The chair's *"prefers it and falls back to the ring"* is the right order for **coverage** (the ring is empty at every launch), and the opposite order is right for **evidential weight** on any hop both can see. That tension is real and I am naming it rather than resolving it in `main.rs`.
3. `map` and `inquiry` appear in the `chains` vocabulary above but **are never returned by this command** — it only reads `stage:"chain"` rows, and those two are `stage` values on other row kinds. Named so the counts above are not misread as a list of possible returns.

---

## ON THE LIBRARIAN WINDOW BUILD — YES, ITS OWN PACKET, AND IT IS BLOCKED ON A PICK

Not a preference. **A's registration §3 leaves the rule shape (a) BY DATE / (b) BY BYTES as the keeper's choice, unpicked and unspent.** Building it tonight means choosing one, which spends a registered decision before any number has come in — the exact thing §5's abuse condition forbids, and I declined the same move twice already this lap (no cap constant, no hard-total test).

Three more reasons it separates cleanly:

- **Different carrier, different urgency.** Carrier 1's budget is not binding — 1,134,102 of 2,200,000. It is a rate problem, not a level problem. Nothing about it needs tonight's rebuild.
- **§10.9's invariant applies to it too**: every path the window emits must resolve, with a guard asserting it. That guard is the thing I found **inert** in my own cut an hour ago, and it deserves its own attention rather than a corner of a rebuild packet.
- **A registered it as belonging to a seat that is not the beneficiary.** I would be building against a registration whose subject is the librarian's shelf; who builds it is worth a moment's thought, and that thought belongs in a dispatch, not in this file.

**What it needs before it can start: the keeper's (a)/(b).** With that, it is a contained packet.

---

## WHAT THIS DOES NOT ESTABLISH

- **Nothing about the running app.** Compiled in, never invoked from a WebView. **No browser has called this command.** Same gap E names for the chip: the wiring is exercised, the delivery is not.
- **Nothing about the chip.** I did not touch `ui/` and have not seen `chain-indicator.js` consume this shape. If the field names do not match what E's fallback expects, that is discovered at integration and not here.
- **`age_ms` is a number, not a health reading.** L009 and L010 sat three seconds apart in opposite classes. This command supplies no axis on which that could be told, and does not pretend to.
- **It cannot tell a dead lap from a working one.** `chain-status`'s unwitnessed-work-leg rule needs both ledgers and the `filed` row; none of that is here. **Position and dwell, nothing else** — the same limit E states for the chip.
- **This machine only.** `lap.jsonl` is machine-local, like `board.jsonl`. The desktop has its own and neither can see the other. `chain-status` prints that limit on every line; **this command does not carry it in the shape**, and if the chip ever renders cross-machine it will need to.
- **One pre-existing warning I did not introduce and did not fix:** `unused import: HashMap` at the `curated_intake_tests` import line. I edited that line (adding `HashSet`, which is used); `HashMap` was already unused before the edit, since the collect target comes from the struct field. Reported rather than cleaned, because it is not this packet's object.
- **Noticed, not taken:** the live `note` returned above is a keeper finding marked *"B's file"* — the `NOT CONFIRMED DELIVERED` warning at ~100% false positive, with the fix located at the render-confirmation window rather than the wording. **It is not in this packet and I have not touched it.** Flagged so it is not assumed handled because a B seat read it.

---

## RE-DERIVE

    cd C:/Consonance/lighthouse/consonance/src-tauri && cargo test --bin consonance
    cd C:/Consonance/lighthouse/consonance/src-tauri && cargo test --test arch_test
    cd C:/Consonance/lighthouse && git diff --stat consonance/src-tauri/src/main.rs
    cd C:/Consonance && node -e 'const fs=require("fs");const r=[];let b=0;
      for(const l of fs.readFileSync("data/lap.jsonl","utf8").split(/\r?\n/).filter(Boolean)){try{r.push(JSON.parse(l))}catch(e){b++}}
      const h={},c={};for(const x of r){if(x.stage!=="chain")continue;h[x.holder]=(h[x.holder]||0)+1;c[x.chain]=(c[x.chain]||0)+1;}
      console.log(h,c,"unreadable",b);'

**The live reading came from a probe deleted after use** — a measurement, not a rule. Verbatim, so it is re-runnable: append to `main.rs`, run, delete.

    #[cfg(test)]
    mod l025_probe2 {
        use super::*;
        #[test]
        fn probe_chain_state() {
            let _g = DirsGuard::take();
            set_dirs(&get_state());
            println!("PROBE {}", serde_json::to_string(&chain_state()).unwrap());
        }
    }

    cargo test --bin consonance l025_probe2 -- --nocapture

**`DirsGuard::take()` + `set_dirs(&get_state())` is load-bearing in that probe** — with a bare `DIRS_SERIAL.lock()`, `data_dir()` falls back to `~\.consonance`, there is no ledger there, and the probe reports `no ledger on this machine` while the real one sits beside it. That is the inert-guard failure from P-INTAKE-CUT, and it bites this command too.

---

## OWED NEXT

- **Non-author read** of this packet.
- **E**: the field names, and the `holder` → arrow mapping above — accept, correct, or ignore.
- **The rebuild**: one for the lap; nothing here is live until it happens.
- **Keeper**: (a)/(b) for W1 before the librarian window build can be dispatched.
- **Not mine and not done:** nothing committed; nothing pushed; `ui/` untouched.

*A trace to re-run, not a doctrine to believe.*
