# PATCH — the targetless pull gets a NAME (L044, E)

*Pane E, 2026-09-08. **NOT TO BE FOLDED UNTIL AFTER TONIGHT'S REBUILD AND PROOF 1.** C holds
`main.rs` this lap and the rebuild waits on C; folding this first delays the one measurement the
lap exists to take. This is a reviewed patch plus its test, in the shape of
`patch_resolve_from_L040.md`.*

    MINE, ALREADY ON DISK   consonance/tools/targetless-pull.test.js   new, declared EXPECTED-RED
    C's TO FOLD             consonance/src-tauri/src/main.rs           2 edits
    mcp.rs's HOLDER         consonance/src-tauri/src/mcp.rs            1 block + 1 line
                                                                      (A held it on 09-06)

---

## 1 · THE RULING FIRST, BECAUSE IT DECIDES THE SHAPE

**The packet asked: is a targetless pull legitimate (a broadcast) or a bug (a lost address)?**

**It is LEGITIMATE, and there are TWO by-design producers, not one:**

1. `raise_from_forming` — the app raising its own hand. It has no seat and no pane it wants; the
   **gate card IS the delivery**, and the `why` it carries is the whole message.
2. `raise_pull` with `target` omitted. The verb's own documentation says so:
   `RaisePullArgs.target` is `Option<String>` described as *"who you want to engage, **if any**"*.

**And at least one illegitimate producer is on record.** The board carries one literal
`no live pane matches '<target>'` — a caller who passed the placeholder. An address can be lost.

    $ grep -o "no live pane matches '[^']*'" C:/Consonance/data/board.jsonl | sort | uniq -c
         51 no live pane matches 'Main'
          7 no live pane matches 'MAIN'
          1 no live pane matches '<target>'

**So the defect is exactly what the packet predicted: nothing distinguishes the deliberate case
from the lost one — and the fix is a name, not a guard.** Nothing below drops, blocks, suppresses
or re-routes anything. The card still renders and the chair still decides.

### The sharper form of it, found in the source rather than assumed

The collapse has a *location*, and it is one call:

```rust
// mcp.rs, raise_pull
target: target.unwrap_or_default(),
```

`Option<String>` already carries the distinction — `None` (omitted, deliberate) and `Some("")`
(an address slot filled with nothing, lost) are different values, and serde preserves both across
the wire. **`unwrap_or_default()` throws that away and makes them the same string.** The type knew;
the call forgot. That is the whole bug, one layer above the symptom the packet pointed at.

### The receipt, re-derived rather than quoted

    2026-07-27T07:19:14.933Z  gate-card [0cadecf7] from forming ->  [novel] forming surfaced a
                              new angle: Registration != observation. You verified panes.json —
                              that's the roster. Being heard is a separate fact ...
    2026-07-27T07:20:26.081Z  chair approved + no target to deliver to (from forming -> )

Seventy-two seconds. The card carried real content, the keeper clicked Approve, and the board
recorded a sentence that does not say whether anything was supposed to happen. *(Both rows streamed
from `board.jsonl`; the script is in §6.)*

---

## 2 · `mcp.rs` — the name, beside the thing it names

Insert immediately above `pub struct PullRequest {`:

```rust
/// A pull addressed to NO PANE ON PURPOSE.
///
/// Until 2026-09-08 `PullRequest.target` used `""` for two different facts and nothing could tell
/// them apart: a pull that is unaddressed BY DESIGN (`raise_from_forming`; a `raise_pull` that
/// omits `target`, which this verb documents as legitimate — *"who you want to engage, IF ANY"*)
/// and a pull whose address was LOST (a blank string, or the placeholder — the board has one
/// literal `'<target>'` on record).
///
/// THE RECEIPT: 2026-07-27, `chair approved + no target to deliver to (from forming -> )`. A click
/// was spent and nothing moved, and the sentence does not say whether anything was supposed to.
///
/// THIS IS A NAME, NOT A GUARD. Nothing is dropped, suppressed or blocked.
pub const UNADDRESSED: &str = "(unaddressed)";

/// `None` = no pane on purpose. `Some("")` = an address slot filled with nothing, which is a
/// defect at the raiser. `unwrap_or_default()` made those one value; this keeps them apart.
///
/// ONE LINE AT THE CALL SITE ON PURPOSE: `targetless-pull.test.js` reads the `target:` field off a
/// single source line, so a multi-line `match` here would make that whole walk blind.
pub fn target_or_unaddressed(t: Option<String>) -> String {
    match t { None => UNADDRESSED.to_string(), Some(s) => s }
}

/// What a target IS, named rather than inferred from an empty string.
#[derive(Debug, PartialEq, Eq)]
pub enum PullAddress<'a> {
    /// Addressed to no pane on purpose. The gate card is the delivery.
    Unaddressed,
    /// An address was expected and is not there. A defect at the raiser, not a broadcast.
    Missing,
    /// A pane id or a name, for `resolve_pane` to settle.
    Pane(&'a str),
}

/// PURE, so the whole matrix is a unit test rather than a night of watching the board — the same
/// reason `pull_delivers_without_a_click` is pure.
///
/// The sentinel is matched EXACTLY and case-sensitively. `resolve_from` folds case for pane names,
/// so the instinct is to fold here too; refused deliberately, because this token is written only
/// by code and is never typed. A case-folding mutant survived the first version of the suite and
/// there is now a test pinning it.
pub fn classify_target(target: &str) -> PullAddress<'_> {
    let t = target.trim();
    if t == UNADDRESSED { return PullAddress::Unaddressed; }
    if t.is_empty() { return PullAddress::Missing; }
    PullAddress::Pane(t)
}
```

And the one-line change inside `raise_pull`:

```rust
// BEFORE
    target: target.unwrap_or_default(),
// AFTER
    target: target_or_unaddressed(target),
```

**Also update the doc line on the `seat` field** (`mcp.rs`, `PullRequest.seat`), which currently
reads *"Empty when the pull has no mount at all (`raise_from_forming`, main.rs)"*. That sentence is
still true and should stay; it is the model this patch copied. Nothing to change — noted only so
the next reader sees that `seat` was documented and `target` never was, which is why one of them
rotted.

---

## 3 · `main.rs` — C's two edits

**(i) `raise_from_forming` says what it is.** The function already writes an explanatory comment
for `seat` and none for `target`. Give `target` the same treatment:

```rust
// BEFORE
        seat: String::new(),
        target: String::new(),

// AFTER
        seat: String::new(),
        // NO PANE, ON PURPOSE — and now it SAYS so. This pull is the app raising its own hand;
        // the gate card is the delivery and there is nothing to inject anywhere. Written as the
        // named constant rather than `String::new()` so it cannot be mistaken for an address that
        // was LOST, which is the fact the 2026-07-27 receipt could not distinguish.
        target: mcp::UNADDRESSED.to_string(),
```

**(ii) `deliver_pull` reports the two cases differently.** Replace the opening two lines:

```rust
// BEFORE
fn deliver_pull(app: &AppHandle, pull: &mcp::PullRequest) -> String {
    let target = pull.target.trim();
    if target.is_empty() {
        return "no target to deliver to".to_string();
    }

// AFTER
fn deliver_pull(app: &AppHandle, pull: &mcp::PullRequest) -> String {
    match mcp::classify_target(&pull.target) {
        mcp::PullAddress::Unaddressed => {
            return "unaddressed by design — the card was the delivery, nothing to send".to_string();
        }
        mcp::PullAddress::Missing => {
            return "NOT delivered — the pull carries no address (lost, not a broadcast)".to_string();
        }
        mcp::PullAddress::Pane(_) => {}
    }
    let target = pull.target.trim();
```

Nothing else in the function moves. `resolve_pane`, the human-driven refusal, `gate_or_queue` and
`inject_to_pane` are untouched, and every existing caller keeps its behaviour for a real target.

**The board rows this produces**, for whoever reads them next:

    chair approved + unaddressed by design — the card was the delivery, nothing to send (from forming -> (unaddressed))
    chair approved + NOT delivered — the pull carries no address (lost, not a broadcast) (from X -> )

---

## 4 · THE TEST — `consonance/tools/targetless-pull.test.js`, on disk, declared red

**7 cases. 3 green now (the machinery), 4 red until the fold.** Declared `JS-SUITE: EXPECTED-RED`
as a `//` line comment at column 0 — a block-comment marker is INERT against the runner's
`/^\s*(\/\/|#)\s*JS-SUITE:\s*EXPECTED-RED/`, which is the trap I nearly shipped on 09-06 and B hit
on 09-03. **Folding the patch makes the file sing and forces someone back to delete the exemption.**

```
$ node consonance/tools/targetless-pull.test.js            # today, before the fold
  tests 7 · pass 3 · fail 4
$ node <patched copies in a scratch tree>/…/targetless-pull.test.js
  tests 7 · pass 7 · fail 0
```

**THE UNIVERSE IS DERIVED FROM THE SOURCE, NOT LISTED — and this time deliberately.** On 09-06 I
wrote an oracle that iterated four hand-written names and it was green over a live defect, because
a list-driven test cannot fail on the site nobody listed, which is the only site that was ever
going to be wrong (A found it). So the walk finds every `PullRequest {` literal, skips
`#[cfg(test)]` modules by a **column-0 `}` boundary** (counting braces reads the `{}` inside
`format!` strings — my other 09-06 error), and reads the `target:` field out of each.

**One case exists purely to prove the walk is not list-driven:** it feeds a synthetic source
containing a brand-new construction site in a function no rule names, and requires the walk to see
it. A list-based checker returns zero there and passes.

**My first walk was wrong and the positive control caught it.** It matched `pub struct
PullRequest {` — the definition — and reported a site with no readable `target:`. The floor test
(*"finds ≥ 2 sites, and every one has a target field"*) went red, which is what a positive control
is for. Fixed by excluding `struct|enum|impl|trait` declarations.

### The pure half, compiled and mutated

`rustc --test` on a standalone copy, **outside the repo** — C holds `main.rs` and the shared
`C:\build\lighthouse-target` must not be touched mid-lap:

    11 passed · 0 failed · 0 ignored

    MUTANT                                              RESULT
    drop the `.trim()`                                  CAUGHT (3 red)
    sentinel matched by prefix instead of equality       CAUGHT (1 red)
    empty string classified Unaddressed (the collapse)   CAUGHT (3 red)
    sentinel comparison case-folded                      CAUGHT (1 red)
    helper reverts to `unwrap_or_default()`              CAUGHT (2 red)
    both cases report the same delivery sentence         CAUGHT (1 red)

    6 applied · 6 caught · 0 survivors

**The case-folding mutant SURVIVED the first suite** and is the reason the exact-match test exists.
A surviving mutant is a hole in the oracle, not a curiosity.

---

## 5 · WHAT THIS DOES NOT FIX — named, not quietly left

1. **An unaddressed pull still produces a gate card with Approve/Deny, and Approve is still a
   no-op.** The card *was* the delivery; the button is mislabelled for this one kind. That is a UI
   and gate-semantics question, outside a name-only fix, and I am not taking it inside this patch.
   It is the residual the 07-27 receipt actually complains about.
2. **`UNADDRESSED` is a string in a namespace that also holds pane names.** A pane displayed
   `(unaddressed)` would become unreachable by name. `RESERVED_SEAT_NAMES` (`main.rs`) exists for
   exactly this class — my 08-24 find, that a pane registering `M` silently captures everything
   aimed at the chair. **One-line addendum for whoever folds:** add `"(unaddressed)"` to
   `RESERVED_SEAT_NAMES`. I did not write it into §3 because that constant is C's file and the
   patch is already two edits there; it is a judgement, not an oversight.
3. **Nothing here was compiled inside the crate.** The shapes are compiled standalone (§4); the
   fold is C's and `cargo test --bin consonance` is the real number. **"Shape compiles" must not
   read as "compiles"** — same limit I stated on the harvester leg, same words.
4. **No pull was raised and no card was rendered.** This is unit-verified. End to end it is
   untested, and the honest proof is a `raise_pull` with `target` omitted producing the new board
   sentence after a rebuild.

---

## 6 · COMMANDS

```bash
# the receipt, both rows, streamed from the 321 MB board
node -e '
const fs=require("fs"),rl=require("readline");
const r=rl.createInterface({input:fs.createReadStream("C:/Consonance/data/board.jsonl"),crlfDelay:Infinity});
r.on("line",l=>{ if(!l.includes("gate-card [")&&!l.includes("approved + "))return;
  let o; try{o=JSON.parse(l)}catch(e){return}
  if(/^gate-card \[|^chair(-main)? approved \+ /.test(o.text||""))
    console.log(new Date(o.ts).toISOString()+"  "+o.text.replace(/\s+/g," ").slice(0,160)); });'

# the placeholder line, and the 58 label failures
grep -o "no live pane matches '[^']*'" C:/Consonance/data/board.jsonl | sort | uniq -c

# the test, red-first
node consonance/tools/targetless-pull.test.js

# the collapse, at its one location
grep -n 'unwrap_or_default' consonance/src-tauri/src/mcp.rs
```

---

    OBJECTIVE:  a pull that is addressed to nobody on purpose stops sharing a footprint with one
                whose address was lost.
    FALSIFIER:  after the fold, a board row that still reports both cases with one sentence — or a
                THIRD producer of an empty target that this patch's derived walk did not see.
