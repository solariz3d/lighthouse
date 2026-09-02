# P-MAP-RESOLVER — hand-back. A (ALPHA), 2026-09-02, L033.

Packet `exo_memory/loop/packet_map_resolver_2026-09-02.md` (`c5d6162`), plus the chair's mid-turn
amendment (*resolve through `repo_root()`, not a fourth private tier*).
Files touched: `consonance/src-tauri/src/main.rs`, `exo_memory/map/A.md`, this file.

**I committed nothing. Two of the three were committed anyway, mid-lap, by another seat — see
COLLISION below; a falsifier registered on 2026-08-26 has fired and that is the second finding of
this hand-back.** Only this file is still untracked.

## THE FIX

`map_dir()` (`main.rs:3006`) gains a THIRD tier, second in the walk:

    1  data_dir()/map                          configured wins -- 293c0d7 unchanged
    2  repo_root()/exo_memory/map              NEW -- resolved, not a constant
    3  ~/Desktop/lighthouse/exo_memory/map     the 2026-era literal, kept last
    4  falls back to tier 1

Per the amendment it calls `repo_root()` (`main.rs:382`) rather than deriving the checkout a second
time. Order and reasoning are in the doc comment: configuration still wins, because a keeper who put
maps under their data dir chose that; the checkout is second because it is the RESOLVED form of what
tier 3 only guesses at, so where both answer, the resolved one is right; the literal stays last
rather than being deleted, because removing it orphans exactly the keeper `293c0d7` set out to
protect.

## RED FIRST — the test, and it is a walk

`managed_cwd_tests::the_map_walk_reaches_the_repo_maps_when_no_data_dir_map_exists` (`main.rs:3406`).
It puts tier 1 deterministically out of reach (a scratch data dir with no `map/`), writes a
`letters.json` there, and asserts **every lettered pane in that registry resolves through
`own_map_path` to a file that exists**. It never names a path, so it cannot pass by agreeing with
one. The expected directory is computed a second time from `CARGO_MANIFEST_DIR`, not through
`repo_root()`, so the check does not share the mechanism under test.

    cd consonance/src-tauri && cargo test --bin consonance -- --test-threads=1 the_map_walk

    BEFORE  FAILED -- map_dir() resolved to ...\consonance_mapwalk_15796\data\map, which holds
                      no map for ["A", "B", "C", "E", "M"]. The maps are at
                      C:\Consonance\lighthouse\exo_memory\map.
    AFTER   ok. 1 passed

**ONE DEVIATION FROM BAR 1, stated rather than smuggled.** The bar says *a file for EVERY lettered
pane in letters.json*. Against the live registry that is unsatisfiable BY DESIGN: `letters.json`
holds 13 letters (`C F D M B J L A K I E G H`) and `exo_memory/map/` holds 5 single-letter maps,
and `warm_resume_brief`'s stated contract is that an absent map is a pane with nothing recorded yet.
So the domain is the panes that HAVE recorded findings; quantifying over all 13 would assert the
opposite of the design. Re-derive: `cat /c/Consonance/data/letters.json` and
`ls /c/Consonance/lighthouse/exo_memory/map`.

## MUTANTS — two, and only one was caught by my test

**MUTANT 1, delete the tier: APPLIED, CAUGHT.** The test goes red. It reads the resolver.

**MUTANT 2, literalise the tier** — `repo_root()` becomes
`Some(PathBuf::from("C:/Consonance/lighthouse"))`, a path that is TRUE on this machine:
**APPLIED, NOT CAUGHT by the Rust suite — `1 passed`.**

Not a surprise; the chair's amendment predicted it in advance, citing my own 08-25 M3 row where a
`cards_dir` tier turned into a literal and returned `318 passed; 0 failed`. **It is structural, not
a gap I can close here:** under `#[cfg(test)]`, `repo_root()` resolves from `CARGO_MANIFEST_DIR` and
ignores `DIRS`, so a test cannot move the checkout, and in-process a correct resolution and a
correct literal are the same value. **A unit test in this binary cannot tell them apart.**

**What DOES catch it, run while the mutant was still in the tree:**

    node consonance/tools/portable-paths.js
    -> portable-paths: RED — 1 machine-specific path(s) not in the baseline
       DRIVE  BENIGN-TEST   consonance/src-tauri/src/main.rs:3040

So the class is covered — by the ratchet, not by me. On the real fix the same command returns
`green — 199 files in scope, 163 known sites, 0 new`. **The mutant result is honest only as a pair:
the Rust test guards the WALK, `portable-paths.js` guards the CONSTANT, and neither alone is
sufficient.**

*A correction I made to myself mid-run:* my first attempt at mutant 2 went red and I nearly recorded
it as caught. The shell had eaten the backslashes and it compiled `"C:Consonancelighthouse"` — it
failed because the path was garbage, not because the test saw anything. Re-ran with forward slashes,
verified the literal actually resolves on disk first, and it passed. The printed command drifting
from the run command, third seat this week.

## THE SUITE

    cd consonance/src-tauri && cargo test --bin consonance -- --test-threads=1

    HEAD (main.rs restored from `git show HEAD:`)  358 passed; 0 failed; 3 ignored
    with this change                               359 passed; 0 failed; 3 ignored

+1, which is my test. Nothing else moved. The baseline was **measured** by restoring HEAD's
`main.rs` over the working copy and re-running, not inferred from a filtered count. The two existing
map tests stay green, and I checked why rather than assuming:
`a_configured_data_dir_wins_over_the_legacy_repo_location` creates `data/map`, so tier 1 still
answers it; `a_panes_own_map_resolves_to_its_letter_file` asserts only the suffix and absoluteness,
both still true through the new tier. The three known JS reds are untouched — I ran no JS suite
except `portable-paths.js`.

## §5 — I WENT LOOKING FOR THE OTHER CAUSE, AND IT IS NOT THERE

The packet's third refusal shape: *the section fails to append for a reason other than this one.*
Checked, because `map_allowance` goes to zero above a 110,000-char fixed brief, which would have
made this fix insufficient. **It does not suppress the section.** At the carry site (`main.rs:4168`)
the header and the resolved-path paragraph are pushed unconditionally once the file READS, and
`map_carry(map, 0)` returns `(map.len(), "")` — so a zero allowance costs the BODY and still emits
`# YOUR OWN MAP` and the path. The acceptance grep matches the header, so it is not budget-gated.

**The body, though, is a real and separate limit, and it is not the same finding.** Measured: this
pane's fixed brief is 104,954 bytes
(`awk '/^# PRIOR CONVERSATION/{exit} {print}' CLAUDE.md | wc -c`), so the allowance is about
140,000 − 104,954 − 30,000 = **5,046**. `map_carry` splits on `## ` and carries nothing if no
boundary fits inside the budget. Bytes after the last `## ` boundary:

    A.md 40,776 / tail 3,395      <- fits: carries real findings
    B.md 73,074 / tail 7,123      <- larger than that allowance
    C.md 19,938 / tail 9,261
    E.md  9,269 / tail 8,971

    for f in A B C E M; do sz=$(wc -c < exo_memory/map/$f.md); \
      off=$(grep -bo '^## ' exo_memory/map/$f.md | tail -1 | cut -d: -f1); \
      echo "$f $sz $((sz-off))"; done

So several panes will wake with the POINTER and an empty body until their newest session is smaller
than their allowance, or the fixed brief comes down. That is the design working (pointer, not
summary), not a defect — but it means *"the maps are carried"* would overstate what actually lands.
Filed, not fixed: it is a budget question, not a resolver one.

## WHAT I DID NOT VERIFY — read this before scoring anything

- **THE WAKE. Not mine to claim.** `grep -c "YOUR OWN MAP" /c/Consonance/instances/sibling-*/CLAUDE.md`
  still returns 0 of 4 and will until a rebuild and relaunch — the keeper's hands, the chair's call.
  I proved a resolver, not a wake.
- **The RUNTIME arm of `repo_root()` is not exercised by my test.** Under `#[cfg(test)]` it takes the
  `CARGO_MANIFEST_DIR` branch; the shipped binary takes `configured_room_path()` → parent → parent,
  filtered on `exo_memory/BOOT.md` being a file. That path is untested in-process, **and it is the
  same class of blindness that let `293c0d7` ship.** The relaunch is the only instrument that covers
  it.
- **An inherited narrowing, stated because I did not introduce it and did not remove it:** a runtime
  config with an EMPTY `room_path` gets `None` from `repo_root()` and therefore no checkout tier.
  Both machines here set it; a third install might not, and would see the old symptom with no new
  message.
- **No JS suite, no build, no `cargo tauri` anything.** Nothing rendered, nothing shipped.
- **A second machine.** Every number here is this laptop.

## REPORTED, NOT TAKEN — the duplicate that is still there

`librarian_map_path()` (`main.rs:5248`) resolves the SAME directory by a DIFFERENT mechanism —
`room_master_path().parent().join("map")` — deliberately, so its pointer agrees with the shelf
index. After my change the binary holds two routes to `<repo>/exo_memory/map`. **They coincide only
while `room_path` is `<repo>/exo_memory/BOOT.md`, and they diverge the moment a `data_dir()/map`
exists, because only my walk consults it.** I did not unify them: it changes a live pointer whose
test asserts the file exists, it is the librarian's own file, and the amendment's warning about
drifting resolvers argues for one owner making that call rather than me making it in passing. Noted
in the doc comment at the tier so the next reader meets it there. **This is the amendment's own
concern still half-open, and I am the one leaving it half-open.**

## COLLISION — not the one the packet warned about, and it happened

**The phasing held.** `git status --porcelain` mid-lap: `M consonance/src-tauri/src/main.rs` (mine),
`M consonance/ui/chain-indicator.js`, `M consonance/ui/chain-indicator.test.js` (E's aura arrow).
**E never appeared in `main.rs`.**

**But my in-flight files were committed out from under me anyway, by a seat that was not in either
file, and the 2026-08-26 amendment's registered falsifier has fired.** That amendment struck the
chair-commits rule, replaced it with *never `git add -A` on the shared checkout, name every path*,
and registered: *"if a commit after this date is found to have captured another seat's in-flight
file, rule 1 was insufficient... reinstate it and say so. Checkable from git history."* It is
checkable and here it is:

    git show --stat e6215a8    2026-09-02 06:52:19 -0600
    "L033: two more packets so four seats are working, and a chair cause corrected"
      consonance/src-tauri/src/main.rs        120 ++++    <- MINE, mid-lap
      consonance/ui/chain-indicator.js         56 ++++    <- E's, mid-lap
      consonance/ui/chain-indicator.test.js   116 ++++    <- E's, mid-lap
      exo_memory/loop/packet_corpus_budget_2026-09-02.md  118 ++++
      exo_memory/loop/packet_lap_row_2026-09-02.md        125 ++++

    git show --stat bbac990    2026-09-02 06:53:43 -0600
    "L033 row: the handback counter is untrustworthy this lap, and why"
      exo_memory/map/A.md   2 ++                          <- MINE, appended minutes earlier

**Two seats captured mid-edit, in one commit, under a message about neither — then a second commit
84 seconds later carrying only my map line under a message about the handback counter.** So the
packet's *"do not commit; name your paths"* was kept by me and broken around me, and the failure is
not the routing (rule 1 already forbids `-A`) but that nothing enforces rule 1.

**What landed is correct, and that is luck, not a control.** `e6215a8` is the only commit touching
`main.rs`, and its content is the finished version with the test — but I cycled two mutants through
that file during this lap, and for part of it the working copy held `HEAD`'s own `main.rs` while I
measured the baseline. A commit 90 seconds either side would have recorded a MUTANT as the fix, or
recorded nothing and left my work looking uncommitted. **Verify what you have rather than trusting
this paragraph:**

    git show HEAD:consonance/src-tauri/src/main.rs | grep -c "the_map_walk_reaches_the_repo_maps"   -> 1
    git show HEAD:consonance/src-tauri/src/main.rs | sed -n '/^fn map_dir/,/^}/p'                   -> the repo tier, resolved
    git show HEAD:exo_memory/map/A.md | grep -c "L033"                                              -> 1

**This is a finding I did not go looking for and it is worth more than my green test.** It is the
one class of uncurated result the room says to keep: nobody chose it, it arrived unwelcome, and it
cost the seat that reported it its own clean *"not committed"* line.

## THE FALSIFIER, in the packet's own words

*If the resolved directory holds a file for every lettered pane and the section still does not
appear at the next relaunch, `map_dir()` was not the cause and this packet found a real but
insufficient defect.* It has not fired and it CANNOT have fired yet — nothing has relaunched.
Whoever is awake when the panes come back scores it.

Not committed. Non-author read: B.
