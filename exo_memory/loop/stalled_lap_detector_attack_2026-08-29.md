# Attack — the stalled-lap detector

**Pane E · 2026-08-29 · target: pane C (Around), the work-leg clauses in `consonance/tools/chain-status.js`**

I was briefed to attack a design *"NOT YET WRITTEN."* It was written while I worked: the file went
166 → 317 lines and is uncommitted (` M consonance/tools/chain-status.js`) as I write. So this is two
documents fused — the design attack I was sent to do, and the code attack the ground moved into.
**§2 is the design attack and C answered almost all of it independently. §3 is the live one: three
findings against the shipped code, each reproduced from a fixture, one of which re-opens the exact
failure the clauses were built to close.**

No code written, no edit to any file of C's. Fixtures in a temp dir; `C:\Consonance\data` untouched.
Every number carries the command that re-derives it. §5 lists what I tried and failed to break —
including one of my own numbers that did not reproduce and is withdrawn.

**Disclosure, since the brief made me part of the frame:** my Falsifier 2 fired tonight and the chair
is its subject. I re-derived the initiator count myself before starting — `human 10, chair 1` over
L001–L011, matching the chair's figure. B is scoring it; I am not. It appears here only in §4, where
the detector's *aim* is at issue.

---

## 1 · What C closed, before I list what survives

Said first and specifically, because a pane that only ever reports damage is worth less than no pane.
I attacked the briefed design and C had independently reached most of the same ground, and in one
place went past me:

- **No threshold.** C refutes the duration axis with the ledger rather than asserting it, and the
  refutation is sharper than mine: L009 `dispatched→return-leg` = 3554s (healthy) against L010
  `map→filed` = 3557s (dead) — *three seconds apart, opposite classes.* I had the L010/L011 inversion
  (59.3min honest vs 46.7s failure); C has a collision at the other end too.
- **Membership, never ordering.** The header names the thing I was going to lead with: the declared
  vocabulary is `map → dispatched` and every real lap writes `dispatched → map`, so any
  "did it get past stage N" rule misreads the whole record.
- **`filed` no longer erases the evidence.** The all-filed branch now speaks when the newest lap is
  the dead one — the precise blind spot that made L010 and L011 invisible.
- **The denominator rides the line.** `2 of 5 chained laps unwitnessed (L011,L010)` — my universe
  attack (7 of 12 laps carry no baton row at all) is answered by the word *chained* plus the printed
  `5`.
- **The limit rides the claim.** `rows only`, appended only when a work-leg claim is made.
- **A discarded attack is recorded** — C tried commits-per-lap, found healthy L008 = 1 and dead
  L011 = 1, and wrote the failure into the header. That is the thing that makes the surviving axis
  credible.
- **And C beat my proposal.** I had reached "count filed laps with no `working` row" and priced it
  as counting L009 wrongly. C's `WORK_ATTESTING = {working, handbacks-in, return-leg}` **spares
  L009** — the lap where the panes demonstrably worked and only the bookkeeping was missing. That is
  strictly better than what I was going to hand over, and the sparing is the right test of the rule.

The sensor law in the header (`chain-status.js:14-16`, *"No thresholds, no verdicts, no advice"*) is
the one I expected to have to litigate, and C threaded it: `WORK LEG UNWITNESSED` states a fact about
rows, `rows only` prices it, and nothing tells the reader what to do. **Fork closed, correctly.**

---

## 2 · The design attack, kept only where it still bites

Findings from the pre-code pass that the implementation answered are listed above and not re-argued.
Two survive as constraints C has *met* and must keep meeting:

**2.1 · The channel takes the first line and discards the rest.** `~/.claude/shell/userprompt_pulse.py:192`
— the copy that actually runs on this bed — `chain_part = chr(10) + _out.splitlines()[0]`. The Node
mirror does the same at `dev/shell/hooks/userprompt-submit.js:248`. Verified: the live line is one
line (`node consonance/tools/chain-status.js --ledger C:/Consonance/data/lap.jsonl | wc -l` → `1`).
A second line would ship green and never leave the tool — *landed is not shipped*, pre-registered.

**2.2 · `--why` is not read by the pulse.** `userprompt_pulse.py:151-153`, deliberate: *"a chosen
silence must look like silence in the pulse."* This is not a note — **it is the mechanism of §3.1**,
and it is why "the reason carries the finding" is not sufficient.

---

## 3 · The live findings, against the shipped code

### 3.1 · The verdict disappears the moment ONE healthy lap files after the dead ones

The all-filed speak-up is gated on `un[0].lap === cl[0].lap` (`chain-status.js:253`): the reader
speaks only if **the newest lap** is the unwitnessed one. That is true today because L012 is open.
It stops being true as soon as a healthy lap completes after a dead one — which is the normal case,
and is what will happen to L012 tonight.

Eleven fixtures, each rebuilt from the live ledger, L012 closed healthily (`return-leg` then `filed`),
then N healthy laps stacked on top:

```
node -e '...build sweep_00..sweep_10 from C:/Consonance/data/lap.jsonl...'   # full script in §6
for f in sweep_*.jsonl; do node consonance/tools/chain-status.js --ledger $f; \
  node consonance/tools/chain-status.js --ledger $f --why; done
```
```
+0  healthy laps | stdout=[]  | why=every lap … filed; 2 filed lap(s) carry no work-leg row: L011, L010
+1  … +7        | stdout=[]  | why=… 2 filed lap(s) carry no work-leg row: L011, L010
+8              | stdout=[]  | why=… 1 filed lap(s) carry no work-leg row: L011
+9, +10         | stdout=[]  | why=every lap with a baton row is filed
```

**`stdout` is empty at every one of the eleven.** The finding survives only on `stderr`, behind
`--why`, on the channel that §2.2 shows is deliberately not read. So:

> **On the pulse — the only channel this instrument has — L010 and L011 go invisible again the
> moment the next lap completes healthily.** Not after ten laps. After one.

The control is today's real ledger, where L012 is still open and the line prints correctly:

```
node consonance/tools/chain-status.js --ledger C:/Consonance/data/lap.jsonl
-> chain: L012 WORKING · holder panes · dirty 5 repo-wide · 8m · 2 of 5 chained laps unwitnessed (L011,L010) · this machine only · rows only
```

That line is right, and it is right *because a lap happens to be open.* The clause that survives a
quiet ledger is the one that has to work, because a quiet ledger is exactly the state a stalled loop
produces. **The instrument is loudest when the loop is running and mute when it has stopped.**

*The shape of the repair, not a patch:* the head-gate makes the work-leg claim a **passenger** on an
open lap. It is not one — it is a fact about closed laps and needs its own exit from `line()`. The
existing "prints nothing, exits 0" contract is about *having nothing to say*; here there is something
to say. Silence should mean the ledger is clean, and right now it means the ledger is quiet.

### 3.2 · The window forgets both deaths, silently

`unwitnessed()` does `laps.slice(0, window)` with `WINDOW = 10`, borrowed from `lap-row.js`. From the
same sweep: **L010 drops out at +8 healthy laps, L011 at +9.** From +9 on, `--why` reports *"every lap
with a baton row is filed"* — a clean bill of health over a ledger containing two chain deaths.

They do not age out with a notice. They vanish. No `+N older not shown`, no cap named in the line —
where `dirty N repo-wide`, `N unreadable` and `this machine only` are all present precisely so limits
ride with the number. The room's own rule: **no silent caps — say what was dropped.**

The header justifies the bound as *"this only stops a three-week-old death printing on every turn
forever."* Fair, and the fix is not removing it: print `2 of 5 chained laps unwitnessed (+3 older)`.
The cap can stay. Its silence cannot.

### 3.3 · A destroyed ledger reads as a clean one, and the guard for it is already inert

Unchanged by C's work, and now load-bearing in a way it was not before, because a *count* is being
read off these paths.

| fixture | output | exit |
|---|---|---|
| 3 lines, **all unparseable** | `chain-status: silent — the ledger carries no baton rows yet` | 0 |
| ledger **truncated mid-line** (200 bytes) | `chain-status: silent — the ledger carries no baton rows yet` | 0 |
| one filed lap **+ 1 corrupt line** | `chain-status: silent — every lap with a baton row is filed` | 0 |
| 2 good rows + 2 corrupt | `chain: L011 DISPATCHED · … · `**`2 unreadable`**` · this machine only` | 0 |
| chain row with **`chain` field missing** | `chain: L900 `**`UNDEFINED`**` · holder panes · … · 11m` | 0 |

```
printf 'not json\n{broken\n\xff\xfe garbage\n' > /tmp/corrupt.jsonl
node consonance/tools/chain-status.js --ledger /tmp/corrupt.jsonl --why
head -c 200 C:/Consonance/data/lap.jsonl > /tmp/trunc.jsonl
node consonance/tools/chain-status.js --ledger /tmp/trunc.jsonl --why
```

Three things, in order of how much the new clauses depend on them:

1. **`led.unreadable` is only appended to `parts` (`:284`) — i.e. only when a line prints.** On all
   three silent returns (`:243`, `:245`, `:269`) the count is computed and thrown away. A destroyed
   ledger and an unstarted one are one output. There is a **green test** asserting this guard —
   `chain-status.test.js:148`, *"a ledger line that will not parse is COUNTED, not filtered away"* —
   green because its fixture prints. This is verbatim the class B found on 2026-08-17: *residue's
   count-what-you-cannot-parse safeguard invisible in every output mode, always.* Same room, same
   guard shape, with a passing test over it both times.
2. **The new claim now reads zero off that.** `un.length` computed over a corrupt ledger is `0`, and
   `0` is indistinguishable from *no dead laps*. The clauses inherit the false green rather than
   introducing it — but they are what turns a missing status line into a missing **alarm**.
3. **Schema damage is uncounted and un-attestable.** A row that parses but is missing `chain` is not
   `unreadable`, is not `'filed'`, and stays open forever printing `UNDEFINED`. Worse for the new
   rule: `attested` is `rs.some(r => WORK_ATTESTING.has(r.chain))`, so a **`working` row with a
   damaged `chain` field silently un-attests a healthy lap and reports it as a chain death.** The
   byte-shaped hole is counted; the row-shaped hole is bigger and is not.

---

## 4 · Aim: this cannot move Falsifier 2, and should not be sold as if it could

Falsifier 2 counts **who initiates laps** — 10 human, 1 chair over L001–L011. The work-leg clauses
count **laps that die before the panes.** Different failures. A tool that notices chain deaths does
not initiate anything, and would have been just as absent from the 90.9%. It is a good instrument for
a real failure; it is not a mechanism for that one, and calling it a candidate for the 90.9% is the
move that later reads as a patch.

One adjacency, recorded without inflation: **L010 — the single chair-initiated lap of the eleven — is
one of the two that died at the map.** n=1. Watch it; do not headline it.

---

## 5 · What I tried and FAILED — and one number of mine that did not reproduce

**My own withdrawn number, first.** An early sweep of mine printed *"+5 healthy laps → 3 filed laps
carry no work-leg row: L011, L010, **L009**"* — which would have been a real finding, since sparing
L009 is the whole test of C's rule. **It does not reproduce.** Re-running the identical fixture gave
2 laps, L009 spared, and the deterministic rebuild in §3.1 gives 2 at every N. The first sweep built
its fixtures in a shell loop I cannot now account for; the number was my instrument, not C's code.
**Withdrawn. C's L009-sparing holds under every fixture I can build.** Recorded rather than deleted,
because a pane that quietly drops its own bad number is a pane whose good numbers cannot be weighted.

Five design attacks that failed against the file as it already stood:

1. **Resurrection** — filter `filed`, then take newest, reporting a finished lap open forever.
   Closed: newest-per-lap runs *first* (`:176-181`), with a test at `.test.js:93`.
2. **The map collision** — a chain row landing in the `stage` field. Closed *by measurement before
   code* (`lap-row.js:325-342`), which recorded both the crash and the permanent block it would have
   caused. And C's `chainLaps` keeps the two definitions of "closed" deliberately agreeing with
   `openLaps`, which was my next probe.
3. **Tie-break on identical `at`.** Same-millisecond writes exist here (L012's `open` and `chain`
   rows share `1787985617`). `>=` plus file order resolves to write order. Correct.
4. **`dirty 0` on an unreadable tree.** Returns `null`, prints `?`. Tested at `.test.js:140`, `:156`.
   The discipline is exactly what §3.3 shows missing from the unreadable-rows guard one function
   away — which is why §3.3 is a finding and not a style note.
5. **Writer-clock vs reader-clock skew.** Same machine, and the line says `this machine only`. Fails
   as scoped; live the day cross-machine merge lands, which the header already excludes.

---

## 6 · For C, in order

1. **Give the work-leg claim its own exit from `line()`** (§3.1). It is a fact about closed laps and
   must not depend on an open lap existing. This is the one that matters: without it the clauses work
   only while the loop is healthy.
2. **Name the window in the line** (§3.2) — `(+N older)`. Keep the cap; kill the silence.
3. **Carry `unreadable` onto the silent returns** (§3.3), so a destroyed ledger cannot report clean.
   Worth doing whether or not anything else here lands.
4. **Count schema-damaged rows** (§3.3) — a `working` row with a broken `chain` field currently
   converts a healthy lap into a reported chain death.
5. **Push the residual repair upstream** to `lap-row.js`: L009 needed sparing only because a
   `working` row was never written. No reader can recover a bit the writer never wrote.

## 7 · My own falsifier

This attack is wrong if §3.1's sweep cannot be reproduced by another seat from the script below — in
which case §3.1 and §3.2 are hand-made figures and should be struck, exactly as I struck my own in
§5. It is also wrong if C's clauses reach the seats through some channel other than the pulse hook,
which voids §2.1, §2.2 and the whole force of §3.1.

```js
// sweep builder — writes sweep_00..sweep_10 beside itself
const fs=require("fs");
const base=fs.readFileSync("C:/Consonance/data/lap.jsonl","utf8").replace(/\r?\n$/,"")+"\n";
for(let n=0;n<=10;n++){
  let s=base;
  s+=JSON.stringify({lap:"L012",stage:"chain",chain:"return-leg",holder:"librarian",at:1787990000000,note:null})+"\n";
  s+=JSON.stringify({lap:"L012",stage:"chain",chain:"filed",holder:"chair",at:1787990100000,note:null})+"\n";
  let t=1787991000000;
  for(let i=0;i<n;i++){const L="LX"+String(i).padStart(2,"0");
    s+=JSON.stringify({lap:L,stage:"open",at:t++,initiator:"human",inquiry:"x",guess:["a.js"],blind:null})+"\n";
    s+=JSON.stringify({lap:L,stage:"chain",chain:"working",holder:"panes",at:t++,note:null})+"\n";
    s+=JSON.stringify({lap:L,stage:"chain",chain:"filed",holder:"chair",at:t++,note:null})+"\n";}
  fs.writeFileSync("sweep_"+String(n).padStart(2,"0")+".jsonl",s);
}
```

*Pane E · no code written · no edit to any file of C's · fixtures in a temp dir, `C:\Consonance\data` untouched.*
