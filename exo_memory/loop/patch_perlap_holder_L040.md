# PATCH FOR C — the guard's per-lap holder read (L040, A)

*Pane A, 2026-09-06. **You hold `main.rs` this lap; I did not touch it, and I did not touch
`mcp.rs` either** — E's patch already takes one doc line there, so both of my sites are yours to
fold. Same shape as `loop/patch_resolve_from_L040.md`, deliberately.*

    MINE, ALREADY WRITTEN     consonance/src-tauri/src/lap_holders.rs    new, pure, 7/7 tests green
                                                                        compiled and RUN, see §5
    YOURS TO FOLD             consonance/src-tauri/src/main.rs           2 lines + one small fn
                              consonance/src-tauri/src/mcp.rs            3 lines

---

## 1 · THE DEFECT, WITH THE RECEIPT RE-DERIVED FROM THE LIVE LEDGER

`chain_state_from` (`main.rs:5698`) computes newest-per-lap, drops `filed`, sorts by time and
returns **`open.first()`** — one row. `auth_station` (`mcp.rs:438`) then hands that single holder to
`station_allows`. **So the holder of one open lap decides for every open lap.**

**Live, from `C:/Consonance/data/lap.jsonl`, at 03:20 tonight:**

    open laps: L038=panes  L040=panes  L039=chair
    chain_state() holder (SHIPPED, one row) : panes
    open_holders()        (FIXED, per lap)  : ["panes","chair"]

    chair_inject     needs chair      SHIPPED=REFUSE   FIXED=ALLOW    <-- the four receipts
    call_librarian   needs panes      SHIPPED=ALLOW    FIXED=ALLOW
    call_chair       needs librarian  SHIPPED=REFUSE   FIXED=REFUSE   <-- correctly, still

**The chair holds L039 right now and cannot use a chair verb.** That is not a reconstruction of
02:58; it is the same state, still on disk, still reproducible. The guard was right about the
holder every time and wrong about the lap.

---

## 2 · WHAT I DID NOT IMPLEMENT, AND IT IS THE FINDING (bar 4)

The packet's fix reads: *"read the holder of the lap the verb is FOR; refuse only when NO open lap
has the caller as holder."* **Those are two different rules and only the second is computable.**

**No gated verb carries a lap.** Checked, not assumed:

    ChairInjectArgs    { token, target, text }     target is a PANE, not a lap
    CallLibrarianArgs  { text }
    CallChairArgs      { text }

There is no lap on the call and no way to derive one — a pane is not on a lap, a lap dispatches to
panes, and a pane can be dispatched on two laps at once (C and E are on L040 while B is on L038).
**"The lap the verb is for" is not a fact the control plane holds.** I implemented the second rule
and I am naming the gap rather than papering it: **this is a weaker guard than the sentence it
implements, and the ambiguity is structural, not an oversight in this patch.**

The version that would honour the first rule is a protocol change: gated verbs take a lap id, and
the guard checks *that* lap. That is not two lines and it is not this lap's work. **Registered, not
built.**

---

## 3 · THE PRICE, AS A NUMBER (bar 3)

Bar 3 says do not trade a false refusal for a false permit. **This trade is real and here is its
size.** With one open lap the new rule is identical to the old. With N open laps carrying K
distinct holders, **K of the three gated stations are open at once instead of one.**

Tonight, K = 2: `chair_inject` and `call_librarian` are both permitted, `call_chair` is refused.
**Two of three stations open where one was.** A test pins that number so it cannot drift silently
(`the_price_of_the_fix_is_two_stations_of_three`); if it ever reads 3, the guard is permitting
everything and someone should be told by a red test rather than by an incident.

**The consequence worth writing down: the guard's strength is now inversely proportional to how many
laps are left open.** Its real enforcement moved out of this function and into the discipline of
FILING LAPS — 40 laps have chain rows, 3 are open, and the chair filed 13 as abandoned an hour ago
precisely because they had accumulated. **Anyone citing this guard should cite that too.**

---

## 4 · THE CHANGES

**(i) `main.rs`, beside the existing `mod` block (`:20-29`), next to E's line:**

```rust
mod lap_holders;  // whose turn it is when MORE THAN ONE lap is open — the guard's pure half (A, L040)
```

**(ii) `main.rs`, beside `chain_state()` (`:5757-5780`).** A second reader over the same ledger,
deliberately NOT a change to `chain_state` — that command is the one-line SENSOR and a UI shows one
position. **Widening the sensor to satisfy the guard would put a guard's requirement inside a
display type**, which is how the two get confused again:

```rust
/// The holders of every OPEN lap, for the BATON GUARD — not for display.
///
/// `chain_state()` above answers "where is the loop", which is one position and is what a one-line
/// status renders. This answers "may this seat act", which is a different question the same ledger
/// can answer, and conflating them is the 2026-09-06 defect: the holder of one lap silenced the
/// holder of another, four times in five minutes, with nobody out of turn.
///
/// Reads the ledger a second time rather than sharing a parse. The cost is one file read per gated
/// verb; the alternative was a return type serving a UI and a guard at once, and the last time a
/// sensor grew a verdict it was because someone did exactly that.
fn chain_holders() -> Vec<String> {
    let path = data_dir().join("lap.jsonl");
    let Ok(text) = fs::read_to_string(&path) else { return Vec::new() };
    let rows: Vec<serde_json::Value> = text
        .lines()
        .filter(|l| !l.trim().is_empty())
        .filter_map(|l| serde_json::from_str(l).ok())
        .collect();
    lap_holders::open_holders(&rows)
}
```

*Note on the unreadable-line count:* `chain_state` counts lines that will not parse and reports
them, because a row that cannot be read is an outcome that is unknown rather than absent. **This
function drops them silently, and that is a deliberate asymmetry with a cost: an unreadable row that
was the caller's only claim to the baton reads as no claim, so the guard fails CLOSED on corruption.
Refusing is the safe direction for a guard and the wrong direction for a sensor**, which is a second
reason these are two functions.

**(iii) `mcp.rs`, `station_allows` (`:412-422`) — delegate, do not duplicate:**

```rust
    // BEFORE
    fn station_allows(verb: &str, open: bool, holder: Option<&str>) -> bool {
        if !open { return true; }
        match Self::required_station(verb) {
            None => true,
            Some(req) => holder == Some(req),
        }
    }

    // AFTER — the holder of ONE lap must not decide for every open lap (L040). The rule and its
    // measured cost live in `lap_holders`; the verb table stays here, where it has always been.
    fn station_allows(verb: &str, open: bool, holders: &[String]) -> bool {
        crate::lap_holders::station_allows(Self::required_station(verb), open, holders)
    }
```

**(iv) `mcp.rs`, `auth_station` (`:438-441`):**

```rust
    // BEFORE
        let st = crate::chain_state();
        if Self::station_allows(verb, st.open, st.holder.as_deref()) {

    // AFTER
        let st = crate::chain_state();          // still the source of open/lap/holder FOR THE MESSAGE
        let holders = crate::chain_holders();   // and the set the decision is made on
        if Self::station_allows(verb, st.open, &holders) {
```

**The refusal message below it is unchanged and is now slightly wrong in a way I could not fix from
here:** it says *"lap {lap} is held by {holder}"*, naming the newest lap. Under the new rule the
refusal means *no open lap is held by {want}* — which is a different sentence. **Suggested, yours to
take or leave** (it is your file and E has a line in it too):

```rust
    "{verb} REFUSED OUT OF TURN — mount {who} tried to speak while NO open lap is held by \
     {want}; open laps are held by {holders:?} (newest: {lap}). The loop comes back to you. \
     If it does NOT — a holder no live seat can satisfy — move the baton by hand: \
     node consonance/tools/lap-row.js{more}"
```

`mcp.rs`'s own test asserts the board line contains `OUT OF TURN` and `lap-row.js`; both survive.

**Existing callers to update:** `station_allows` is called from `auth_station` and from the tests in
`mcp.rs`'s test module. The test fixtures pass `Some("panes")`-style arguments and become
`&["panes".to_string()]`. **I did not edit them; they are in your file.**

---

## 5 · WHAT WAS ACTUALLY RUN, AND WHAT WAS NOT

**RUN — really compiled, really executed**, in a scratch cargo crate with `lap_holders.rs` as its
whole library (`cargo test --offline`):

    running 7 tests ... test result: ok. 7 passed; 0 failed

**Red first, and the red is receipt (3):** `the_chair_may_act_while_another_lap_is_held_by_the_panes`
— one open lap `holder=panes`, another `holder=chair`, chair verb ⇒ must be ALLOWED. **Refused by
the shipped code today**, demonstrated against the live ledger in §1 rather than against a fixture.

**MUTANT 2 — revert to the newest-row-across-all-laps read** (sort the surviving open rows
newest-first, `truncate(1)`):

    test result: FAILED. 5 passed; 2 failed
      the_chair_may_act_while_another_lap_is_held_by_the_panes ... FAILED
      the_price_of_the_fix_is_two_stations_of_three ............. FAILED

**MUTANT 3 — refuse nothing** (`Some(_req) => true`):

    test result: FAILED. 2 passed; 5 failed

Both caught. Restored to green afterwards: 7 passed, 0 failed.

**NOT RUN, and it matters:**

- **`cargo test` on the real crate.** These functions were exercised in isolation, not inside
  `consonance`. **The binding run is yours after the fold**, and until then nothing has proved the
  module compiles *against `main.rs`* — only that it compiles.
- **The patch itself.** I wrote the four edits and did not apply them, so no compiler has seen
  `chain_holders()` or the changed `station_allows` signature in place. **The test-module call sites
  in `mcp.rs` are the likeliest break and I have not counted them.**
- **The refusal message.** Suggested text, never rendered.
- **Any live verb.** No `chair_inject`, no `call_chair`. The behaviour claim in §1 is arithmetic
  over the ledger plus the two functions' source, not an observed refusal tonight.

---

## 6 · WHERE THIS BELONGS (the packet asked)

**`main.rs` is right for the ledger read and wrong as a home for the rule**, which is why the rule
is in a new module and only the reader is yours. The guard itself must stay in `mcp.rs`: it gates
verbs, verbs live there, and `auth_chair` / `auth_address` are already beside it. **Moving the guard
out would separate three gates that must be read together.**

**One thing I would not do:** put the holder set on `ChainState`. It is serialized to the UI, and a
field that exists for a guard will eventually be rendered as a status line, at which point a
permission becomes a display and the next reader cannot tell which it was.
