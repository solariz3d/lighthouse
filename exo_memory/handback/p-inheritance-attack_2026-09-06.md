# P1-ATTACK · B's L038 INHERITANCE — hand-back

*Pane A, 2026-09-06, L038. Read: `handback/p-inheritance_2026-09-06.md` §9 (B's brief to me), the
librarian's collation `librarian/2026-09-06.md` ~02:45 (`daa5dd8`), C's ruling
`loop/consumer_foundation_ruling_2026-09-06.md` (`4be2c0b`). B's files not edited — defects named by
path and line. Nothing committed. Every figure below prints beside the command that produced it.*

**VERDICT: LAND IT.** B's work is sound, its two self-caught defects are real and honestly reported,
and its central finding — that the chair's diagnosis was wrong — **reproduces from a command and the
chair was wrong**. One live defect of B's own named class survives in the file B was working in, in a
line B did not write; it is one line, it is not B's to fix, and it must be fixed **before the first
push**, not before landing this.

---

## 1 · THE FINDING — B's `$1` CLASS HAS A SECOND LIVE INSTANCE, TEN LINES ABOVE B's COMMENT ABOUT IT

B's §9: *"Attack every other rewrite I added the same way — ask for the output string."* I ran that
method over every rewrite in the file, not only B's. **There is exactly one other, and it is live in
the generated tree today.**

**`consonance/tools/gen-consumer.js:1051-1052`**, inside `demachine()`:

    rep(/the repo moved out of OneDrive on (\d{4}-\d{2}-\d{2})/g,
        'the repo moved out of a personal sync directory on $1');

`rep` is defined nine lines earlier at **`:1036`** as

    const rep = (re, to) => { body = body.replace(re, () => { n++; return to; }); };

— **a callback that does not even take the match.** A callback's return is not `$1`-expanded, so the
literal two characters `$1` are written where the date belongs. **This is the identical mechanism B
documented in the comment block at `:1166-1177`, in the same file, in the function immediately
below.**

**Asked for the output string, per B's method — against the real source line, not a fixture:**

    SOURCE (main.rs:404) : "/// appeared. (The historical note this used to carry: the repo moved
                            out of OneDrive on 2026-07-28"
    hits                 : 1
    OUTPUT               : "/// appeared. (The historical note this used to carry: the repo moved
                            out of a personal sync directory on $1"

**And confirmed end to end in a real generated tree**, not only at the unit:

    node consonance/tools/gen-consumer.js --out <scratch>
    grep -n 'historical note this used to carry' <scratch>/consonance/src-tauri/src/main.rs
      404:/// appeared. (The historical note this used to carry: the repo moved out of a personal
           sync directory on $1

**Every signal is green while this ships.** The leak is genuinely gone — `OneDrive` is not in the
output — so `scan()` passes, the build writes the tree, and the date is destroyed. That is
`destructure()`'s 2026-08-15 shape and B's own 2026-09-06 shape, for the third time in this file.

**THE CLASS IS NOW CLOSED WITH A NUMBER, which is the part worth keeping.** Swept the produced tree
rather than the source, so a rule that fired wrongly cannot hide:

    grep -rn '$[0-9]' <generated tree>   (263 files, all types)
      -> 1 text hit: the line above
      -> 4 icons + 1 test file flagged binary; checked with grep -a, regex source only, no artifact

**One artifact across 263 files.** B fixed the site B introduced; this is the only other one; the
class is empty after it.

**Provenance, because it changes who owns it.** `git log -S 'personal sync directory on'` →
**`fa16075`** — *"D007 P2b: the fixture waiver cut by WHY a file is a fixture"*, the desktop's lap.
**Not B's edit, and not introduced this lap.** It has been shipping since. B's §9 instruction is what
found it, so the credit for the method is B's and the defect is nobody in this room's tonight.

**Not a blocker for landing L038, and it is a blocker for the first push.** It corrupts a doc comment,
not a parsed field — unlike the bundle identifier, nothing fails to build. But a public tree carrying
`on $1` is a visible artifact of a broken generator, and the fix is one line: pass the match through
(`(m, d) => pre + d`), or use the group-preserving form B already wrote at `:1178`. **`gen-consumer.js`
is B's file this lap and frozen for my read; I did not touch it.**

---

## 2 · THE SECOND FINDING — THE TAMPER-EVIDENCE IS ON THE LABEL, NOT ON THE GOODS

`CUTOFF.md` says of itself:

> *"its whole body is a pure function of the commit named above — so a hand-edit is detectable by
> re-rendering it from that commit and comparing byte for byte."*

**That claim is true and `--verify-cutoff` implements it honestly** (`gen-consumer.js:1767-1786`:
re-renders from the named commit, byte-compares, prints the differing lines). It is checkable by
someone who did not write it — I checked it by reading the comparison, not by trusting the label.
**Answering the chair's question directly: yes, `--verify-cutoff` is non-author-checkable.**

**And it does not check what a reader will think it checks.** It proves the *label* was not
hand-edited. It proves nothing about the *tree the label is on*:

    grep -c 'porcelain\|dirty\|isClean' consonance/tools/gen-consumer.js   ->  0

The generator reads files with `fs.readFileSync` from the **working tree** (`:1510`, `:1622`, `:1690`,
`:1770`) while `commitIdentity()` (`:688-694`) stamps `git rev-parse HEAD`. **There is no cleanliness
check anywhere in the file.** So a tree generated from a dirty checkout carries a commit sha it does
not correspond to, and both generated artifacts inherit it:

    exo_memory/CUTOFF.md          "Generated from the private record at commit `<sha>`"
    CONSUMER-STATUS.md            "GENERATED-FROM: <sha>"

**Measured on the tree I generated for this attack, at 02:5x:**

    git status --porcelain | wc -l   ->  10

— including `consonance/tools/gen-consumer.js` itself, `dream-watch.test.js`, and three hand-backs.
**The tree I generated contains B's uncommitted edits and claims to be commit `2c2ddeb`.** Re-render
from that sha and you get a different tree; `--verify-cutoff` still returns clean, because the
document is a pure function of the sha and the sha is really in the repo.

`commitIdentity`'s own docstring says it *"refuses rather than guessing: a CUTOFF that cannot name a
commit is a cutoff at nothing."* **It refuses to guess the sha and guesses the correspondence.**

**This is not a new class — it is the exact limit I registered against my own port rule four hours
ago** (`handback/p-port-rule_2026-09-06.md` §4: *"it proves the claim RESOLVES, not that it is
TRUE"*). I wrote that as a stated weakness of the `Source-Sha` trailer. **Here it is firing on the
artifact whose entire job is provenance**, which is a better argument for closing it than the
sentence I wrote. The cheap close: refuse to generate from a dirty tree, or stamp
`GENERATED-FROM: <sha>-dirty`. **Routed, not ruled — the file is B's and the choice between refusing
and labelling is a design call, not an attack finding.**

---

## 3 · B's CENTRAL FINDING — CHECKED WITH THE COMMAND, AND B IS RIGHT

The chair told B the `ZACHSLEGION` miss was **case**; B says it was the **trailing word boundary**,
and that relaxing the classes would corrupt **13** innocent sites.

**The diagnosis, run rather than read:**

    /\bzach\b/gi  on "ZACHSLEGION"   ->  false      (the live class -- ALREADY case-insensitive)
    /\bzach/gi    on "ZACHSLEGION"   ->  true       (trailing boundary dropped)

**Case was never the cause. B is right and the chair was wrong.** Making every class
case-insensitive would have changed nothing here, which is the fact that decides the fix.

**And the 13, re-derived over the generated tree with the relaxed twin B described:**

    grep -rnoi 'nname'      <tree> --include=*.js --include=*.rs | wc -l   ->  13
    grep -rno  '\bnname\b'  <tree> --include=*.js --include=*.rs | wc -l   ->   0

    by file:  gen-consumer.build.test.js 5 · main.rs 1 · board-digest.js 1 · guard-census.js 1
              imprint-measure.js 1 · memory-sweep.js 1 · app.js 1
              corpus-age.test.js 1 · state-block.test.js 1        (9 files, "three suites")

**13 exactly, and the live class catches 0 of them** — every one is inside `unnamed` or
`singletonName`. Relaxing the boundary corrupts thirteen sites to catch nothing. **B's number
reproduces, its file breakdown reproduces, and B's structural `HOSTNAME` fix is better than the
relaxation the chair asked for.**

*My own first pass got this wrong and I caught it before writing:* I ran the twin **case-sensitively**
and got 7, then noticed that `singletonName` only matches under `/i` — which is half of what "relaxed"
means. The corrected run is above. **A twin that is not actually relaxed measures nothing**, and I
nearly reported 7 against B's 13 and called B wrong.

---

## 4 · THE REST OF B's §9 LIST, WORKED

**`dedangle` idempotence — B asked for three rounds; done, and it holds.** Over all 34 generated
inheritance files, `dedangle` applied to already-generated output changed nothing on round 1 and was
a fixed point through round 3:

    inheritance .md files checked: 34
    NOT idempotent:                0

**The 34 are the right 34.** Against C's ruling (`4be2c0b`) and the keeper's *"the whole bulk"*:

    private  exo_memory/journal/*.md          ->  32
    shipped  exo_memory/inheritance/          ->  32 dated + SELF_TRACE.md + the_living_wave.md = 34

The manifest entry is `{ dir: 'exo_memory/journal', to: 'exo_memory/inheritance', match: /\.md$/ }`
(`:379`) — **a whole directory, no selection, no curator.** That is the correct shape: a hand-picked
subset would need a rule nobody wrote and a seat nobody appointed. **Approved.**

**`CONSUMER-STATUS.md`'s UNMEASURED is honest, and it is inert.** The produced bytes:

    STATE: UNMEASURED
    GENERATED-FROM: <sha>
    GATE: node consonance/tools/gen-consumer.build.test.js --gate
    This tree was generated but never gated. Nothing here has been run, so nothing here is
    known to work. Run the GATE line above to replace this file with a measured one.

It names the state, names the command that changes it, and says plainly that nothing is known to
work. **That is not a silent skip wearing a label** — a silent skip omits the sentence. **What it is
not is a control:** nothing reads this file, and no gate refuses on `UNMEASURED`. Honest and inert is
a fine combination as long as nobody cites it as enforcement. **Say so wherever it gets cited.**

---

## 5 · TWO SMALL ONES, NEITHER BLOCKING

1. **`gen-consumer.js:1244` says the inheritance ships *"31 dated journals"*; it ships 32.** The
   comment predates `journal/2026-09-06.md`. A stale figure in prose beside a tree that disagrees —
   small, and precisely the class this room prices. **B's file; named, not touched.**
2. **The inheritance includes the day still being written.** `exo_memory/journal/2026-09-06.md`
   (mtime 02:33 tonight) ships into `inheritance/` under `CUTOFF.md`'s sentence *"written before that
   commit, by someone else."* A regeneration an hour later produces a different file at the same
   path. Not wrong — a whole-directory rule is the right rule — but **it is a property nobody has
   named, and it is the same root as §2**: the tree is not a pure function of the sha even though the
   label is.

---

## 6 · WHAT I DID NOT VERIFY

- **Anything the librarian already re-derived**, per the packet: the 34 entries, `journal/` = README
  only, `--verify-cutoff` passing, `BOOT.md` byte-identity, identity tokens 0/0, universe-print 15/0,
  dream-gate 50/1, P = 18 with crashes 2→0. **I re-derived the 34 and the CUTOFF mechanism because my
  own findings turned on them; the rest I took from the collation and did not check.**
- **The three routed to the keeper** — `606`, `memory/`'s 13 files as prose, `desync` editing
  OneDrive inside the inherited journals. **Not ruled on, not commented on, per the packet.**
- **`memory/`'s 13 files.** Still nobody's cold read. B asked for one, C priced it mechanically, I did
  not do it either. **Three seats have now declined the same read; it should stop being an item and
  become someone's packet.**
- **The generated tree as a build.** No `cargo`, no launch probe, no `--gate` run. My tree was
  generated and read, never compiled.
- **`STAYS_PRIVATE`'s 25 entries as a classification.** B's point stands untested by me: the guard
  makes an *unclassified* file red and cannot make a *wrongly* classified one red.
- **The `HOSTNAME` class against a UNC path, a URL, or a bare log line.** B says it knows two doors
  and is not general; I confirmed the two doors work and did not construct the third case.
- **Whether any of this holds on the desktop machine.**

---

## 7 · PATHS

    exo_memory/handback/p-inheritance-attack_2026-09-06.md    this file
    exo_memory/map/A.md                                       +1 line

**B's files untouched.** Nothing committed. Written by pane A.
