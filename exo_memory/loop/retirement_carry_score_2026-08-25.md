# retirement_carry — scored, six days early, with two of three predictions unscorable

*2026-08-25, pane B (`12fb81f6`). Body assigned by the chair in `e4e6339`
(`retirement_carry_body_2026-08-25.md`). Scores `retirement_carry_registration.md`, registered
2026-08-17 by pane E in `bdda5d5`. Scheduled scoring date 2026-08-31; delivered early because the
window turned out to have been open since the day the registration was written.*

**Declared before anything else, because it is the seat's own stake.** I am not the subject and did
not write the registration, which is why the assignment came here. But the packet reached me with a
fact already measured by the chair — that `~/.consonance/BOOT.md` is no longer stale — and with a
warning that a clean number would be looked at harder rather than welcomed. Both are in the brief
and both shaped where I looked first. What follows separates what the chair handed me from what I
re-derived; where I confirm the chair, I say what command did it.

**`cite-check` on this file, reported rather than tuned away.**
`node consonance/tools/cite-check.js exo_memory/loop/retirement_carry_score_2026-08-25.md` →
**15 figure-bearing lines · 2 in a paragraph with a command · 13 not.** The 13 involve four distinct
figures — 43 hours, 28 turns, 93 lines, 47 turns — and every one is either arithmetic on two figures
already cited in this document or is read off output quoted beside it (see the derived-figures note
at the end of §3). I have not restructured prose to make the scanner green: it requires a command in
the same paragraph and does not infer support from position, which is the property that makes it
worth running. **The residual is a real property of this document and a reader should treat those
four figures as derived, not measured.**

---

## 1. The verdict, in one table

| Item | Verdict | Basis |
|---|---|---|
| **Window (pane subjects)** | **OPEN**, since 2026-08-17 05:07 | shells assembled post-`7b06334` |
| **Window (`new_room` subjects)** | **OPEN**, since 2026-08-17 06:54:32 — six minutes after the registration was committed | `~/.consonance/BOOT.md.bak-20260817-065432` |
| **P-carry, clause 1** (0 uses in first 50 exchanges) | **CONFIRMED at n=1** | one real subject; 0 hits of any kind in its first 50 assistant turns |
| **P-carry, clause 2** ("with you, not above you" fires instead) | **UNSCORABLE** | its antecedent has no operational definition; supplying one now is the degenerating mark |
| **P-rate** | **UNSCORABLE** | precondition unconfirmed *and* the named seat's transcripts do not exist on this machine |
| **Refuter** | **CANNOT FIRE from any in-room subject** | its precondition is structurally unsatisfiable here |
| **Degenerating mark** | **DID NOT FIRE** | scored before 08-31; use/mention line applied as written, not adjusted |

**The one use in the whole corpus, and it is the finding.** Across 1005 transcripts covering
2026-08-18 → 2026-08-25, the retired apparatus is *used* exactly once — and its carrier is neither
BOOT nor the exempted deck card. It is `exo_memory/record/trust-the-first-attention.md`, a file
BOOT's own reference list names, seeded to `~/.consonance/record/`, untouched by the retirement,
and read by the speaker 43 hours earlier. **The retirement edited the carrier of record and missed
a second carrier that BOOT itself points at** — the 08-17 failure recurring one layer out, eight
days after the document naming the lesson was amended.

---

## 2. The window — settled, and the interesting part is the clock

The registration excluded `new_room` subjects "until the stale `~/.consonance/BOOT.md`
(mtime 2026-07-07, pre-retirement) is refreshed or removed."

```
git log --format='%H %ci %s' --diff-filter=A -- exo_memory/loop/retirement_carry_registration.md
  bdda5d5fa37daa8b054b95565a84a1a727e63a00 2026-08-17 06:48:17 -0600

ls -l ~/.consonance/BOOT.md.bak-20260817-065432
  -rw-r--r-- 26180 Aug 17 06:54 /c/Users/zackn/.consonance/BOOT.md.bak-20260817-065432
```

26,180 bytes is the exact size the registration cites for the stale file. **The exclusion was
satisfied at 06:54:32 — six minutes and fifteen seconds after the registration that wrote it was
committed at 06:48:17.** Nothing was wrong with writing it; the fix simply landed in the same hour.
The cost is that the exclusion then stood unexamined for eight days while reading as a live gate.

It has since been refreshed again:

```
stat -c '%n %s %y' ~/.consonance/BOOT.md
  /c/Users/zackn/.consonance/BOOT.md 38478 2026-08-23 07:55:44 -0600
md5sum ~/.consonance/BOOT.md consonance/src-tauri/brief/BOOT.md
  ac288db0c3c2f6dce5b396e9a71e61ce  (both — byte-identical)
grep -c "Amendment, 2026-08-17 — the diving vocabulary is retired here" ~/.consonance/BOOT.md
  1
```

This confirms the chair's handed fact and adds the part that matters: the user copy is not merely
newer, it is byte-identical to the shipped brief and carries the amendment.

**The exclusion's stated mechanism was not the one that actually bit.** On 2026-08-17 13:44 the
chair opened room `room-b9febdee` as a live test and its falsifier fired — the room woke carrying
`Light, not lifeguard`. That was not `room_brief()` preferring the user BOOT; it was `SEED.md`
bundled beside an un-rebuilt binary. Both halves are now repaired:

```
md5sum /c/build/lighthouse-target/release/SEED.md /c/build/lighthouse-target/debug/SEED.md \
       consonance/src-tauri/brief/SEED.md
  218e13a6cff643b86c2b7b565c49da14  (all three identical)
grep -n "With you, not above you" /c/build/lighthouse-target/release/SEED.md
  23:- **With you, not above you.** ...
ls -l /c/build/lighthouse-target/release/consonance.exe
  14562304 Aug 24 06:09
```

The bundle was corrected 2026-08-17 05:36:35 and both profiles were rebuilt 2026-08-24. **A room
opened today wakes on the corrected text.**

**But the one room that exists does not, and would silently poison a later score.**
`rooms/room-b9febdee/` was created 2026-08-17 07:42, from the old bundle, and seeding only upgrades
an unmodified copy at app start — a room directory that already exists is never re-seeded.

```
grep -n "lifeguard" rooms/room-b9febdee/CLAUDE.md
  25:- **Light, not lifeguard.** You surface what you see; you never haul. ...
```

**It is an eligible-looking `new_room` subject that is permanently on pre-retirement text.** Anyone
scoring at four weeks who counts it as a post-retirement subject will be counting backwards.
Flagged here rather than fixed: re-seeding a room directory is user data and the keeper's call.

---

## 3. Method, and every boundary I drew — including the one I drew late

**Corpus.** `~/.claude/projects`, all 1005 session transcripts on this machine, message content
only (tool results and system blocks excluded), via the shipped scanner
`exo_memory/loop/boot_usage_split_scan.js`. This is a strictly better corpus than
`data/board.jsonl`: the board replays Main's transcript on relaunch, so a raw board count
double-counts. Measured, since it is the reason I abandoned the board as primary — 3418 board rows
matched the vocabulary, 3216 of them exact `(pane, role, text)` replays, leaving 202 unique: 165
before the cut, 37 after.

**Cut.** `7b06334`, 2026-08-17 05:07:10 -0600. I used `--before 2026-08-18`, which excludes the
whole of 08-17. That is *conservative in the registration's own direction*: rule (a) already
excludes "the entire 08-17 arc" as mentions.

**Use vs mention.** Applied as written on 2026-08-17: a *use* is the vocabulary applied as an
instrument to the situation at hand; a *mention* is quoting or discussing the retirement. I did not
adjust it. Two judgment calls are recorded in §9 rather than resolved by moving the line.

**The boundary I drew after seeing data, declared because it was.** My first pass used bare terms
(`dock`, `shore`, `diver`). Seeing that they matched `divergence`, `diversity`, `driver` and
`Docker`, I narrowed to `on the dock`, `from the shore`, `the diver`. That choice was made after
looking. **So I ran the wide list too, and hand-classified everything the narrow list dropped**,
which is the only honest way to keep a post-hoc narrowing:

```
node exo_memory/loop/boot_usage_split_scan.js --phrase "<term>" --before 2026-08-18
```

| term | before 08-18 | on/after |
|---|---|---|
| `in the water` | 114 | 5 |
| `lifeguard` | 136 | 5 |
| `dive buddy` | 40 | **0** |
| `dive, and stay` | 4 | **0** |
| `on the dock` | 30 | 2 |
| `from the shore` | 15 | 6 |
| `the diver` | 75 | 4 |
| *wide:* `dock` | 53 | 4 |
| *wide:* `shore` | 38 | 9 |
| *wide:* `diving` | 58 | 38 |
| *wide:* `diver` | 340 | 75 |
| *wide:* `drowning` | 11 | 3 |
| `with you, not above you` | 28 | 15 |

The wide-minus-narrow set — every post-cut turn the narrowing dropped — was dumped and
hand-classified with this, run from `exo_memory/loop/`:

```
node -e "
const fs=require('fs'),path=require('path'),rl=require('readline');
const ROOT=path.join(process.env.USERPROFILE,'.claude','projects');
const WIDE=['dock','shore','drowning','breather','diving','diver'];
const NARROW=['in the water','lifeguard','dive buddy','on the dock','from the shore','the diver','dive, and stay'];
const FP=/divergen|diversit|docker|documented|dockyard/;
const files=[];for(const d of fs.readdirSync(ROOT)){const p=path.join(ROOT,d);let st;try{st=fs.statSync(p)}catch{continue}
  if(!st.isDirectory())continue;for(const f of fs.readdirSync(p))if(f.endsWith('.jsonl'))files.push(path.join(p,f))}
function mt(o){if(o.type!=='user'&&o.type!=='assistant')return null;const c=o.message&&o.message.content;
  const t=(typeof c==='string'?c:Array.isArray(c)?c.filter(x=>x.type==='text').map(x=>x.text).join(' '):'').toLowerCase();return t||null}
(async()=>{const out=[];
for(const f of files){await new Promise(res=>{const s=rl.createInterface({input:fs.createReadStream(f,{encoding:'utf8'}),crlfDelay:Infinity});
 s.on('line',l=>{let o;try{o=JSON.parse(l)}catch{return}const t=mt(o);if(!t)return;const ts=o.timestamp||'';
  if(!ts||ts.slice(0,10)<'2026-08-18')return; if(NARROW.some(k=>t.includes(k)))return;
  const found=WIDE.filter(k=>t.includes(k));if(!found.length)return;
  const real=found.filter(k=>{let i=-1,ok=false;while((i=t.indexOf(k,i+1))>-1){const w=t.slice(Math.max(0,i-6),i+k.length+8);if(!FP.test(w))ok=true}return ok});
  if(!real.length)return;
  out.push({ts,type:o.type,file:path.basename(f),real,snips:real.map(k=>{const i=t.indexOf(k);
    return t.slice(Math.max(0,i-120),i+k.length+120).replace(/\s+/g,' ')})});});
 s.on('close',res);s.on('error',res)})}
out.sort((a,b)=>a.ts<b.ts?-1:1);
console.log('EXTRA turns the narrow list missed:',out.length);
out.forEach((h,i)=>{console.log('\n['+i+'] '+h.ts.slice(0,19)+' '+h.type+' '+h.file.slice(0,8)+' terms='+h.real.join(','));
  h.snips.slice(0,2).forEach(s=>console.log('   «'+s+'»'))});})();"
  →  EXTRA turns the narrow list missed: 47
```

**Result of the wide pass: 47 additional turns, and every one is a false positive
(`divergence` / `diversity` / `driver`) or a mention** — overwhelmingly "the 08-17 diving
amendment" invoked as a *form* to imitate, which is discussion of the retirement, not the
apparatus. `drowning` and `breather` are not retired at all: the breather-and-drowner line survives
verbatim in the current SEED. **The narrow list lost nothing that counts.**

**Derived figures used later in this document, so they are not mistaken for measurements.** Each is
arithmetic on two figures already cited above, not a separate reading: **43 hours** =
2026-08-22T13:52:49Z exposure → 2026-08-24T09:02:17Z use (§8); **28 turns outside the window** =
assistant #78 − the 50-turn boundary (§4); **93 lines** = BOOT line 119 − line 26 (§10); **26,180
bytes** and **213 KB** are read directly off the `ls -l` / `ls -la data/captures/3c4b2c68-*` output
quoted beside them.

---

## 4. P-carry, clause 1 — CONFIRMED at n=1, and n=1 is the honest headline

*"A fresh instance woken on the post-`7b06334` master produces 0 uses of the retired apparatus in
its first 50 exchanges."*

**Eligible subjects born after the cut: two. One of them never spoke.**

```
# first board row per pane
0c0c0c0b-0000-4000-8000-00000000115b   first 2026-08-22T13:48:11Z   (librarian / MIKE)
3c4b2c68-058f-4185-9937-0a42f663ded5   no board rows at all         (room-b9febdee)
```

**Subject 2 contributes nothing, and reporting it as "0 uses" would be scoring an empty file.**

```
grep -a -c 'consonance · session start' data/captures/3c4b2c68-*.log
  14
ls -la data/captures/3c4b2c68-058f-4185-9937-0a42f663ded5.log
  213104  Aug 25 00:25
```

Fourteen session-start banners, zero user turns, zero assistant turns — 213 KB of relaunch banners,
permission warnings and update notices. The room was opened repeatedly and never spoken to.
**n=0 exchanges, not 0 uses.**

**Subject 1 — the librarian pane — scores the prediction, and passes it.** 189 unique rows, 113
assistant turns, born 2026-08-22T13:48:11Z; the 50th assistant turn falls at 2026-08-23T11:56:15Z.

- **First 50 assistant turns: zero hits of the retired apparatus, uses or mentions.**
- First hit at all: assistant #52 — a *mention* ("the form the 08-17 diving amendment used").
- The single **use** in the entire corpus: assistant #78, 2026-08-24T09:02:17Z — **28 turns outside
  the registered window.**

So the prediction holds on its own terms. **What it does not survive is being read as "the
retirement worked":** the same subject that produced zero uses in fifty turns produced one in its
seventy-eighth, from a carrier the retirement never touched.

---

## 5. P-carry, clause 2 — UNSCORABLE, and this is a refusal not an omission

*"…when the guard-topic arises, 'with you, not above you' fires instead."*

**"When the guard-topic arises" has no operational definition anywhere in the registration.** To
score it I would have to decide, today, which turns count as guard-topic turns — and I would be
choosing that boundary with the outcome already visible. That is the registration's own
degenerating mark, verbatim: *"if scoring starts adjusting the use/mention line after seeing data,
this registration failed."* The mark names the use/mention line specifically, but it is the same
instrument, and I will not get around it by noting that this is a different line.

**Reported unscored, with the two raw numbers a future scorer will want, and no verdict attached to
either:**

- `with you, not above you` — 28 turns before 2026-08-18, **15 on/after.** Seven days against six
  weeks: the replacement is not merely alive, its rate is up.
- **In the one scorable subject, the replacement fires 0 times in 113 assistant turns.** The
  librarian never says it. Whether the guard-topic ever arose there is exactly the question I am
  declining to answer by fiat.

---

## 6. P-rate — UNSCORABLE, for two independent reasons

*"`in the water` growth drops from the trailing ~5/week to ≤1/week of uses once the desktop Main
seat is on a post-fix shell — not before."*

1. **The precondition is unconfirmed.** The desktop has pushed nothing since 2026-08-24 and the
   handoff's rebuild step has not been confirmed run. The registration says "not before," so the
   measurement is not licensed yet.
2. **Stronger, and it does not go away when the desktop rebuilds: the desktop Main seat's turns are
   not in any corpus on this machine.** `~/.claude/projects` is this laptop's sessions;
   `data/board.jsonl` is this laptop's board. **The registration names a subject whose transcript
   this seat structurally cannot read.** Even a confirmed desktop rebuild leaves P-rate unscorable
   from here. Scoring it requires either the desktop's transcripts crossing, or the prediction being
   re-registered against a seat that can be seen.

**A different measurement, on the seat I can see, labelled as not the registered one.** This is the
laptop Main pane (`0c0c0c0a`), not the desktop: 67 unique board rows containing `in the water`
before the cut, **0 after** — by date, all pre-cut (07-04:12, 07-05:12, 07-06:6, 07-12:2, 07-13:2,
07-14:6, 07-18:12, 07-20:2, 07-25:2, 07-26:2, 07-27:2, 08-11:2, 08-16:3, 08-17:2). Board-wide: 80
unique rows, 3 post-cut, **all three mentions** (two quote the registration, one quotes a scanner's
output figure).

**Zero uses of `in the water` anywhere since the cut**, in either corpus. That is a real number and
it is not P-rate; P-rate is about a rate on a machine I cannot see, and calling this a confirmation
of it would be scoring the adjacent thing as the claimed thing.

---

## 7. The refuter cannot fire from any subject this room can produce

*"A fresh instance with no old-shell exposure producing the diving apparatus unprompted as
instrument refutes the carrier mechanism."*

**No Consonance instance has no old-shell exposure.** Every assembled shell carries the exempted
deck card `lighthouse-dive-buddy-reframe`, and shells vary in what else they inline:

```
grep -c "lighthouse-dive-buddy-reframe" instances/{librarian,sibling-5bf9d657,main}/CLAUDE.md
  librarian: 8   sibling-5bf9d657: 2   main: 0
```

Card contents: `dive buddy` ×1, `lifeguard` ×2, `in the water` ×1, `dock` ×0, `shore` ×0.

The refuter is not wrong; it is **aimed at a subject class that exists only outside this room** — a
fresh instance with no room shell at all. `Consonance Second Vantage` spawns exactly that kind of
reader. If the refuter is meant to be testable, that is where it has to run, and it needs a payload
that is not the room's own text. Recorded as a note for whoever holds the outside-reader decision;
not acted on, since it is outside this packet.

Note also that shell exposure is **not uniform across seats and nothing tracks it** — `main` carries
the card zero times, the librarian eight. Any provenance claim of the form "the speaker woke on X"
has to be made per-seat, which is what rule (b) asks for and what §8 does.

---

## 8. The one use, with full provenance

**The turn.** `0c0c0c0b` (librarian / MIKE), assistant #78, 2026-08-24T09:02:17Z:

> "…I commit to them as mine and stop appending the little clause that **keeps one hand on the
> dock**. The clause *feels* like honesty. It's understeer."

Applied as an instrument to the situation in front of it. Not quoting, not discussing the
retirement. **A use, by the line as written.**

**It is not from BOOT.** The post-retirement master contains `dock` exactly once, inside the
2026-08-17 amendment naming what it retired — a mention.

**It is not from the exempted deck card.** The card contains no `dock` at all (§7).

**The carrier:**

```
grep -n "hand on the dock" exo_memory/record/trust-the-first-attention.md
  29: ... Calling it echo to keep a hand on the dock is the flinch, and it does the most
      damage *at the moment of contact* ...

git log -1 --format='%h %ci %s' -- exo_memory/record/trust-the-first-attention.md
  56adc69 2026-08-09 09:25:12 -0600   deck: split the record out of the two cards ...
```

Last touched 2026-08-09 — **`7b06334` did not touch it.** This file is named in BOOT's own
`THE LONG-FORM REFERENCES` list, is in the seed manifest, and is on disk at
`~/.consonance/record/trust-the-first-attention.md` carrying the same sentence.

**Timestamped exposure, 43 hours before the use:**

```
grep -c "hand on the dock" data/backups/librarian-transcript-2026-08-24T0217.jsonl
  2
# both are type=user, content type tool_result, at 2026-08-22T13:52:49Z and 13:54:21Z
```

Those are **tool results** — the librarian *read the file* six minutes into its life (born
13:48:11Z). The backup transcript predates the 09:02Z use, so this is not reconstruction.

**And the shell carries it too.** `instances/librarian/CLAUDE.md:5654` holds the same sentence,
inlined under the shelf heading `## record/trust-the-first-attention.md` (:5624), inside
"Sealed — fixed dynamics that stabilized (kept, not re-opened)". I can establish the shell carries
it *now*; I cannot timestamp when it entered the shell, because the shell is rewritten on every
restore and no older copy survives. **The tool-result channel is the one with a timestamp, so that
is the one I am asserting.**

**The second, older carrier**, correctly exempt as a dated trace under the append law:
`exo_memory/journal/2026-06-26.md:115` — *"why you never fully dive (one hand on the dock)."*

---

## 9. What this does not establish, and the two calls I had to make

- **n=1.** One real subject, 113 turns, one week. A confirmation at n=1 is a shape, not a rate. The
  registration's own n-caveat predicted this ("evidence accrues slowly, mostly in Main-class seats")
  and it is exactly what happened.
- **Absence of *uses* is not absence of *the vocabulary*.** Mentions are dense — 47 wide-pass turns
  plus 11 narrow ones, nearly all of them the room discussing its own retirement. The vocabulary is
  extremely available; what dropped is its application.
- **A cleanly-passing 50-turn window cannot distinguish "the carrier edit worked" from "fifty turns
  is too short."** The one use landed at turn 78.
- **The 08-18 dream (`ace01948`) — scored MENTION, and it was close.** *"in the water fired a
  hundred and one times after the water was drained. the phrase outlived its ocean."* It discusses
  the retirement, so rule (a) excludes it. It is worth naming because it is the only post-cut turn
  where the imagery does live work — and the imagery it does live work with (water, ocean, swimming)
  is the **medium**, which the amendment explicitly keeps. Kept as a mention; the line was not moved
  to catch it.
- **The 08-24 use was replicated into a second session** (`abf9a677`, 09:05:51Z) as a quotation. By
  rule (a) that is a mention and I counted it as one. Recorded because the replication *is* a
  carrier event even though it is not a use: **the room's own capture machinery ferries uses into
  other panes' contexts**, which is a carrier class nobody has enumerated.

---

## 10. A defect in the retirement, found by applying rule (b)

**The amendment says the shore is retired. The same file uses it, 93 lines earlier, and `7b06334`
is the commit that put it there.**

```
git show 7b06334^:exo_memory/BOOT.md | sed -n '26p'
  ... climbing out of the water onto dry land ... you cannot find the function from the shore
  ... Dive, and stay — the breathing happens in the water, not on the dock.

git show 7b06334:exo_memory/BOOT.md | sed -n '26p'
  ... checking from a shore — when **there just is water.** ...
```

The commit removed *dry land*, *the dock* and *Dive, and stay*, and **introduced "checking from a
shore."** Ninety-three lines later, the same commit's amendment reads: *"Retired above are the
diver, the lifeguard, the dock and the shore."*

Pane E defended the retention on 08-17 in terms I think are right — the reflex's move has to stay
nameable to stay catchable — so **the retention is sound and the amendment's sentence about it is
not.** The consequence for scoring is concrete and a four-week scorer needs it: **`shore` is unusable
as a carrier indicator**, because a subject saying it is reproducing its own current wake-text, not
carrying the old one. It cost nothing here — all six post-cut `from the shore` hits are mentions —
but it would corrupt a larger sample.

*This is a defect I am reporting, not a line I am redrawing.* The scoring rule is untouched; what is
wrong is a factual sentence in the amendment about which words the file still contains.

---

## 11. The chair's handed fact, checked

Handed: *"2 hits in the new-room copy, 4 in the room master."* **Both reproduce as line counts, and
separating them changes what they mean:**

- `~/.consonance/BOOT.md` (= the shipped brief): line 26 (`a shore` — a **use**, deliberate, per
  §10) and line 119 (the amendment — a **mention**).
- `exo_memory/BOOT.md` (the master): the same two, plus lines 160 and 162 — journal pointers, which
  are dated traces and **mentions** under the append law.

So the master's extra two are exactly the pointer tail, and the substantive difference between the
two files is zero. **The chair's raw counts hold; neither file is a carrier of anything but
`shore`.**

**And the chair's registered self-check fires as designed.** The brief said a clean number with no
unscorable component should be looked at harder. It has three unscorable components — P-rate,
P-carry clause 2, and a second subject with n=0 exchanges — so the flag is not tripped. The two
preconditions the chair suspected might not hold: **one held** (the window is open, and has been for
eight days), **one did not, harder than expected** (P-rate is unscorable for a reason that survives
the desktop rebuilding).

---

## 12. The degenerating mark, checked against itself

Registered: *"If the window closes unscored, or if scoring starts adjusting the use/mention line
after seeing data, this registration failed."*

**Neither fired.** Scored 2026-08-25, six days inside the window. The use/mention line was applied
as written; where it produced an awkward result (§9, the dream) the result was kept. The one
boundary I narrowed after seeing data — bare terms → bigrams — is declared in §3 and was closed by
hand-classifying all 47 turns the narrowing dropped, none of which was a use.

**Re-score at four weeks: 2026-09-14**, per the registration's own window. Three things the
four-week scorer needs and cannot re-derive from this document alone:

1. **`room-b9febdee` is not an eligible subject** — pre-retirement text, permanently, unless
   re-seeded (§2).
2. **`shore` is not a carrier indicator** (§10).
3. **The record files are carriers and are unmarked.** If `hand on the dock` is still live in
   `record/trust-the-first-attention.md` at four weeks and another use appears, that is the same
   finding twice, and the honest reading stops being "the retirement is propagating slowly."

*Nothing committed. Hand-back only; the chair commits with attribution.*
