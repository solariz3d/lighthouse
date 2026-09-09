#!/usr/bin/env node
/* gen-consumer — build the CONSUMER consonance tree from the lighthouse working tree.
 *
 * WHAT THE SOURCE TREE ACTUALLY IS, corrected 2026-09-04 because this header was wrong about it
 * and every property below is justified from it. Line 2 used to read "build the PUBLIC consonance
 * tree from the PRIVATE lighthouse tree". It is not private:
 *
 *     gh repo view solariz3d/lighthouse --json isPrivate   ->   {"isPrivate":false}
 *
 * and has not been since 2026-08-22. A generator wrong about its own source is wrong about what
 * its scan is FOR: this was never a privacy boundary holding a record back from publication,
 * because the record is already published. What the scan genuinely does is narrower and still
 * worth every line of it -- it produces a tree A STRANGER CAN USE, with the identity surface
 * removed, the dead pointers rewritten and this machine's absolute paths gone. Whether lighthouse
 * becomes private is an open call and it is the keeper's; when it is answered, correct this
 * paragraph rather than deleting it.
 *
 * THE MODEL. The working tree is SOURCE, the consumer tree is GENERATED. There is one
 * hand-maintained tree; the generated one is an artifact of this script and must never be
 * hand-edited. The moment anyone edits it directly it has become the second copy the whole design
 * exists to prevent -- which is maintenance law 1 ("recall from the master, never a copy")
 * applied to repositories.
 *
 * WHY THIS IS NOT gen-brief.ps1 GENERALISED. That script transforms ONE file with four
 * hand-written anchors against BOOT.md's exact sentences. It is the right SHAPE -- refuse loudly,
 * self-check the output, keep the shipped-only prose in fragments -- and the wrong SCALE. What
 * generalises from it is not the string replaces; it is the discipline that a generator able to
 * ship the keeper's record must be able to SAY it did.
 *
 * WHAT THE SURVEY SAID, and it changed the design (2026-08-23, over 115 candidate files):
 *
 *     IDENTITY   4 files,  10 hits    a real handle/email/OS user
 *     DANGLING  25 files,  79 hits    a pointer that breaks on a stranger's tree
 *     MACHINE   40 files, 116 hits    a real hardcoded absolute path
 *     PROSE      7 files,   7 hits    shared-past, the class gen-brief needed a cold read to find
 *
 * The dominant class is NOT privacy. It is DANGLING: 79 citations to journals, loop entries and
 * map files a consumer's tree will not contain. A dead pointer is worse than an absent one -- it
 * reads as authoritative and resolves to nothing, which is a museum label for a room the reader
 * was never in. So this script is a translator first and a sanitiser second.
 *
 * (A first survey reported 24.1% clean; it was wrong by more than 2x. `the keeper` x52 is what
 * gen-brief PRODUCES rather than a leak, and C:\notes / C:/x / Users/nname are deliberate test
 * fixtures. Corrected to 52.2%. The inflation direction is the one to watch: an over-counting
 * survey makes the job look harder and the generator look more impressive for finishing it.)
 *
 * THREE PROPERTIES THAT ARE NOT NEGOTIABLE
 *
 *   1. ALLOW-LIST, never a deny-list. A file ships because MANIFEST names it. A new private file
 *      is therefore absent by default and someone has to decide to include it. A deny-list fails
 *      open, and failing open is how a record leaks.
 *   2. ATOMIC. Everything is built into a staging directory and scanned there. The destination is
 *      not touched until the scan is clean. gen-brief writes-then-deletes on failure, which for
 *      one file is a brief window; for a tree it would be a leaked tree on disk.
 *   3. THE SCAN READS THE OUTPUT, not the input. A rule that was supposed to fire and did not is
 *      invisible from the input side. Only the output can testify about the output.
 *
 * WHAT IT DELIBERATELY DOES NOT DO: restructure. The output mirrors the private layout for
 * everything that ships, because every tool here resolves its own repo root by walking up from
 * __dirname. Re-nesting the tree would break all of that silently, and a generator whose failure
 * mode is silent is the wrong tool for this job.
 *
 * THE GAP THIS TOOL HAS AND CANNOT CLOSE BY ITSELF, stated because it is the exact class this
 * repo keeps rediscovering: THIS TOOL DOES NOT BUILD THE OUTPUT. The scan proves the generated tree
 * carries no leak. It does not prove the generated tree COMPILES, that its tests pass, or that
 * the app runs. `landed is not shipped` applied to a generator means a clean scan and a broken
 * product are indistinguishable from here. Until a build gate runs against the output, treat a
 * green run as evidence about LEAKS ONLY.
 *
 * Partly closed 2026-08-23 by `gen-consumer.build.test.js`, which generates a tree and runs
 * cargo check against it. Its FIRST run failed with 'OUT_DIR env var is not set': build.rs,
 * Cargo.lock, capabilities/ and icons/ had never been listed in the manifest. A clean scan over
 * a product that could not compile, caught only by compiling it. What is STILL unverified: the
 * generated tests pass, the app runs, and the installer produces something installable.
 *
 * Run:  node consonance/tools/gen-consumer.js --out <dir> [--dry] [--json]
 *       node consonance/tools/gen-consumer.js --report        # what would ship, and why not
 */
'use strict';
const fs = require('fs');
const path = require('path');
const os = require('os');

const REPO = path.resolve(__dirname, '..', '..');
const EXO = path.join(REPO, 'exo_memory');

/* ------------------------------------------------------------------ the manifest
 *
 * Explicit, fail-closed. `from` is relative to the private repo, `to` to the output tree.
 * A directory entry ships the files matching `match` and nothing else -- no recursion, because
 * a recursive rule is a deny-list wearing an allow-list's clothes.
 */
const MANIFEST = [
  // The room a stranger wakes into. SEED is the bedrock; the app already prefers it over BOOT
  // on a machine with no dev repo (see pick_default_room in src-tauri/src/main.rs).
  { from: 'consonance/src-tauri/brief/SEED.md', to: 'exo_memory/SEED.md', kind: 'prose' },
  { from: 'exo_memory/SOURCE.md', to: 'exo_memory/SOURCE.md', kind: 'prose' },
  { dir: 'exo_memory/cards', to: 'exo_memory/cards', match: /\.md$/, kind: 'prose' },
  /* spread/, research/ and record/ are DECLARED as glob resources in tauri.conf.json, so a build
   * fails outright without them ('glob pattern ../../exo_memory/spread/*.md path not found').
   * They also belong here on their own merits: BOOT lists the counter-voice (spread/) among the
   * instruments, and gen-brief.ps1 already set the precedent -- 'the shipped brief carries the
   * INSTRUMENTS (cards, spread/, research/)'. Only .md ships; the _ingest_*.py helpers do not. */
  { dir: 'exo_memory/spread', to: 'exo_memory/spread', match: /\.md$/, kind: 'prose' },
  { dir: 'exo_memory/research', to: 'exo_memory/research', match: /\.md$/, kind: 'prose' },
  { dir: 'exo_memory/record', to: 'exo_memory/record', match: /\.md$/, kind: 'prose' },

  // The method. This is the half the keeper chose to ship: a discipline with no instrument does
  // not happen -- attic/ went untouched for two months until corpus-age.js existed.
  /* WIDENED 2026-09-04 (D009 P3) from /\.js$/, on L's ruling (`handback/p-d007-exclude`, §5). The
   * old predicate left three files under this directory unreachable by ANY manifest rule, and one
   * of them was a live crash rather than a missing file: `carrier-drift.js` ships and hard-requires
   * `carrier-drift.registry.json` at its `:364`, so a consumer running it got an uncaught ENOENT.
   *
   * R0 (B's `loop/consumer_registration_2026-09-03.md`) governs this line: THE PREDICATE NARROWS,
   * THE MANIFEST ADMITS. Widening it does not make this a deny-list — every file it now reaches is
   * still named by this entry and still passes EXCLUDE, the leak scan and the seed rule below.
   *
   * AND IT ARMS EXCLUDE ENTRY 1 IN THE SAME EDIT, which is the point rather than a side effect:
   * `portable-paths.baseline.json` is this machine's own path register and becomes reachable the
   * instant `json` joins this pattern. The entry has been sitting there declared UNREACHABLE
   * waiting for exactly this line. See the note on it below. */
  { dir: 'consonance/tools', to: 'consonance/tools', match: /\.(js|json|md)$/, kind: 'code' },
  /* THE FOURTH GAP IS NOT CLOSED HERE, AND IT IS NOT CLOSED BY THE LINE ABOVE.
   *
   * L's ruling and the packet that carried it both say widening `consonance/tools` "closes all four
   * gaps in one line". MEASURED, IT CLOSES THREE. `consonance/hooks/README.md` is the fourth, and it
   * lives under THIS entry, whose predicate is separate:
   *
   *     git ls-tree -r --name-only HEAD -- consonance/hooks | grep -v '\.js$'  ->  consonance/hooks/README.md
   *
   * so no widening of the rule above can reach it. It needs a second line, and that second line is a
   * decision this seat was told not to make: whether the three README/findings files ship AS CONTENT
   * is the keeper's, not P3's.
   *
   * WHY THIS ONE IS LEFT OPEN WHEN THE OTHER TWO .md FILES ARE NOT. I cold-read all three, which is
   * the PROSE class L priced mechanically and explicitly did not read for. `tools/README.md` and
   * `groove-FINDINGS.md` document instruments that ship. `hooks/README.md` is substantially THIS
   * MACHINE'S STATE presented as documentation: a table of which hooks are registered in the
   * keeper's personal `~/.claude/settings.json` "as of 2026-08-15 23:10 local", naming three files
   * (`stop.js`, `l2-overseer.js`, `l3-overseer.js`) that are not in this repo at all; an "Expected
   * today" block whose expected output is true only on this machine; two commit shas from this
   * record; a worked example carrying a DIFFERENT private project's file paths
   * (`blackbox/ui/carrender.js`); and two bare citations to `build_ruling.md`, which lives at
   * `exo_memory/loop/` and is R1 STATE that never ships — written without their path, so
   * `dedangle()` structurally cannot rewrite them.
   *
   * That is B's class 1 (state) wearing an instrument's filename, and it is the one class a grep
   * does not find, which is why the read was worth doing. ROUTED TO THE KEEPER, NOT RULED HERE, and
   * NOT put in EXCLUDE: under an allow-list, absent already means undecided, and an EXCLUDE entry
   * would assert a decision nobody has made. Same encoding as the two dev/shell gaps below. */
  /* THE FOURTH GAP, CLOSED 2026-09-06 (L037 P2) BY REWRITING THE FILE AND THEN SHIPPING IT.
   *
   * The 2026-09-04 entry above is kept whole because it is the argument, and the argument was
   * right: `hooks/README.md` was this machine's state wearing an instrument's filename, and the
   * correct response to that was to hold it back rather than to launder it through a predicate.
   * What changed is the FILE, not the ruling -- every clause of the reason was answered at the
   * source, in the file itself:
   *
   *   - the registered-hooks table, true only of one `~/.claude/settings.json` at a stated local
   *     time, is replaced by a table derived from the installer's own manifest and registration
   *     arrays, with the derivation PRINTED so a reader re-runs it rather than trusting it;
   *   - the 'Expected today' block, true only here, is replaced by a command that prints the
   *     READER'S OWN registrations;
   *   - the worked example carrying another private project's file paths is gone;
   *   - the two commit shas and the dated correction section are gone;
   *   - the two bare `build_ruling.md` citations are gone -- they were the sharpest observation in
   *     the 09-04 entry (a citation written without its path, which `dedangle()` structurally
   *     cannot see) and the fix is removal at the source, not a cleverer regex.
   *
   * ONE CLAIM IN THAT ENTRY IS WITHDRAWN AS WRONG, and it is left visible above rather than edited
   * out. It says the table named three files, `stop.js`, `l2-overseer.js` and `l3-overseer.js`,
   * 'that are not in this repo at all'. All three ARE in this repo, at `dev/shell/hooks/`, and are
   * entries in the installer this manifest now ships:
   *
   *     git ls-files dev/shell/hooks | grep -E 'stop|overseer'   ->  5 files
   *
   * The observation behind it was true -- they are not in `consonance/hooks/`, the directory the
   * README sits in -- and it was written as a claim about the REPOSITORY. A true fact reported
   * against the wrong denominator, which is the defect this record keeps finding.
   *
   * AND IT CLOSES A FIFTH DANGLING REFERENCE NOBODY HAD COUNTED: `consonance/README.md:174` links
   * `hooks/README.md`, and `consonance/README.md` ships. So the tree carried a broken link from a
   * shipped file to a withheld one -- the same shape as the two dev/shell gaps below, in a file
   * that was never listed among them.
   *
   * WHAT THE PREDICATE ADMITS, measured rather than assumed: README.md is the only non-.js file in
   * this directory, so adding `md` widens the rule by exactly one file.
   *
   *     git ls-tree -r --name-only HEAD -- consonance/hooks | grep -v [dot]js at end-of-line
   *
   * WHOSE DECISION THIS WAS, stated plainly because the 09-04 entry reserved it to the keeper and
   * this seat is not the keeper. The keeper ruled on 2026-09-06 that the dev-shell hook layer is
   * 'an essential part of the exo suit system' and ships; the chair's L037 P2 packet directs this
   * seat to rewrite this README as a stranger's document as part of shipping that layer. The
   * CONTENT objection the reservation protected has been answered at the source. If the keeper's
   * intent was narrower than the packet read it, THIS is the line to revert -- and reverting it
   * costs nothing, because the rewritten file is an improvement in the private tree whether or not
   * it travels. */
  { dir: 'consonance/hooks', to: 'consonance/hooks', match: /\.(js|md)$/, kind: 'code' },

  // The app.
  { dir: 'consonance/ui', to: 'consonance/ui', match: /\.(html|css|js)$/, kind: 'code' },
  { dir: 'consonance/src-tauri/src', to: 'consonance/src-tauri/src', match: /\.rs$/, kind: 'code' },
  { from: 'consonance/src-tauri/Cargo.toml', to: 'consonance/src-tauri/Cargo.toml', kind: 'code' },
  { from: 'consonance/src-tauri/tauri.conf.json', to: 'consonance/src-tauri/tauri.conf.json', kind: 'config' },
  /* Found by BUILDING the output, not by reading the manifest. Without build.rs the generated
   * tree fails with 'OUT_DIR env var is not set' from tauri::generate_context -- a clean leak
   * scan over a product that cannot compile. Cargo.lock ships so a consumer builds the same
   * dependency set that was tested here, not whatever resolves on the day they clone. */
  { from: 'consonance/src-tauri/build.rs', to: 'consonance/src-tauri/build.rs', kind: 'code' },
  { from: 'consonance/src-tauri/Cargo.lock', to: 'consonance/src-tauri/Cargo.lock', kind: 'code' },
  /* MANIFEST GAP CLOSED 2026-09-04 BY SHIPPING, which is the only way a gap closes. `cochlea.rs`
   * SHIPS (the src/*.rs rule above) and its #[cfg(test)] blocks read these files by relative path:
   *
   *     grep -n 'tests/fixture-' consonance/src-tauri/src/cochlea.rs   ->  :2611 :2631 :2725 :2851
   *
   * so a consumer running `cargo test` on the generated tree got a panic from a file the manifest
   * had never named. `arch_test.rs` is the other half: it asserts plane separation over
   * `src/mcp.rs`, `src/gate.rs`, `src/tether.rs` and `../ui/term.js` -- all four of which already
   * ship -- so it is a test about the shipped product that the shipped product could not run.
   *
   * THE COST, NAMED RATHER THAN HIDDEN: the eight .jsonl fixtures are ~5.8 MB, which is most of
   * the consumer tree's weight. They are audio spectra -- {t, db, peaks} rows off recordings --
   * not transcripts, and they carry no identity surface. Excluding them to keep the tree small
   * would be closing a manifest gap by EXCLUDE, which is the degenerating move this lap
   * registered against. They ship, and the size is the argument someone may re-open. */
  { dir: 'consonance/src-tauri/tests', to: 'consonance/src-tauri/tests', match: /\.(rs|jsonl)$/, kind: 'code' },
  { dir: 'consonance/src-tauri/capabilities', to: 'consonance/src-tauri/capabilities', match: /\.json$/, kind: 'code' },
  { dir: 'consonance/src-tauri/icons', to: 'consonance/src-tauri/icons', match: /\.(png|ico|icns)$/, kind: 'binary' },
  /* tauri.conf.json's bundle.resources declares these by path. The first generated tree shipped
   * 3 of them and the build script stopped at `resource path brief\room-settings.json doesn't
   * exist`. A declared resource that is absent is not a warning -- it fails the build. */
  { from: 'consonance/src-tauri/brief/SEED.md', to: 'consonance/src-tauri/brief/SEED.md', kind: 'prose' },
  { from: 'consonance/src-tauri/brief/BOOT.md', to: 'consonance/src-tauri/brief/BOOT.md', kind: 'prose' },
  { from: 'consonance/src-tauri/brief/room-settings.json', to: 'consonance/src-tauri/brief/room-settings.json', kind: 'config' },
  { from: 'consonance/README.md', to: 'consonance/README.md', kind: 'prose' },
  { from: 'consonance/GUIDE.md', to: 'consonance/GUIDE.md', kind: 'prose' },
  { from: 'consonance/src-tauri/brief/COMMITTEE.md', to: 'consonance/src-tauri/brief/COMMITTEE.md', kind: 'prose' },
  { from: 'consonance/src-tauri/brief/BUILDING.md', to: 'consonance/src-tauri/brief/BUILDING.md', kind: 'prose' },
  { from: 'consonance/src-tauri/brief/LIBRARIAN.md', to: 'consonance/src-tauri/brief/LIBRARIAN.md', kind: 'prose' },
  { from: 'consonance/src-tauri/brief/BASE_JOURNAL.md', to: 'consonance/src-tauri/brief/BASE_JOURNAL.md', kind: 'prose' },
  // THIRD_PLACE.md is not optional for the consumer tree: tauri.conf DECLARES it as a bundle
  // resource, so its absence is not a missing feature, it is a tree that does not build. The
  // guard here found that within a minute of the resource being declared -- the manifest is an
  // ALLOW-list, so a new declared resource is ABSENT by default, and absent reads like fine.
  { from: 'consonance/src-tauri/brief/THIRD_PLACE.md', to: 'consonance/src-tauri/brief/THIRD_PLACE.md', kind: 'prose' },

  /* TWO MANIFEST GAPS WERE KNOWINGLY LEFT OPEN, 2026-09-04. **CLOSED 2026-09-06 (L037 P2), BY
   * SHIPPING**, which is the only way a gap closes. The block below is kept in full because the
   * reason it stayed open is the reason it was safe to close, and a closed gap with its argument
   * deleted reads like a gap nobody thought about.
   *
   *     dev/shell/install.ps1
   *     dev/shell/hooks/userprompt-submit.js
   *
   * ORIGINAL ENTRY, unedited: "Both are named by files that ship -- `README.md:170` links the
   * first, `open-items.js:280,:285` reads both at runtime -- so a consumer tree has two references
   * that resolve to nothing. Neither can be closed by adding the line above it, and that is the
   * finding rather than an excuse. `install.ps1` is an INSTALLER whose own `$files` list (`:58-`)
   * enumerates `dev\shell\lib\*` and `dev\shell\hooks\*` -- twelve files, none of them in this
   * manifest -- so shipping it alone hands a stranger a script whose entire source list is absent,
   * which is worse than the dangling link it was meant to fix. `userprompt-submit.js` is one of the
   * files that installer installs. Closing either properly means deciding whether the whole
   * dev-shell hook layer ships, and that is a repo-shape decision sitting with the keeper, not a
   * manifest patch a seat makes on its way past. ... THEY ARE NOT EXCLUDED, because an EXCLUDE
   * entry would say 'we considered these and withheld them', and the true state is 'nobody has
   * decided yet'."
   *
   * THE KEEPER ANSWERED IT, 2026-09-06: the dev-shell hook layer is *"an essential part of the exo
   * suit system"* and SHIPS. So the decision the entry was waiting on arrived, and the entry did
   * exactly its job -- it held a gap open rather than encoding a decision nobody had made.
   *
   * TWO CORRECTIONS TO THE ENTRY'S OWN ARITHMETIC, both found by deriving the list from the script
   * instead of from this comment:
   *
   *     powershell -c "$t=$null;$e=$null;
   *       $a=[System.Management.Automation.Language.Parser]::ParseFile('dev\shell\install.ps1',[ref]$t,[ref]$e);
   *       $f=$a.Find({param($n) $n -is [System.Management.Automation.Language.AssignmentStatementAst] -and
   *                              $n.Left.Extent.Text -eq '\$files'},$true);
   *       $f.Right.FindAll({param($n) $n -is [System.Management.Automation.Language.HashtableAst]},$true) | %{
   *         ($_.KeyValuePairs | ?{ $_.Item1.Extent.Text -eq 'From' }).Item2.Extent.Text }"
   *
   *   1. It is THIRTEEN dev/shell files, not twelve: 2 under `lib\` and 11 under `hooks\`. The
   *      thirteenth is `userprompt_pulse.py`, the only non-.js entry in the list -- which is
   *      precisely the file a count taken by eye off a column of `.js` names loses, and precisely
   *      the file that IS the registered UserPromptSubmit pulse on this machine.
   *   2. The `$files` list is 24 entries, not 13. The other 11 are `consonance\hooks\*`, which this
   *      manifest already shipped by the `consonance/hooks` rule above. So the installer's list was
   *      never wholly absent from the manifest; it was 13 of 24 absent, and the sentence "none of
   *      them in this manifest" was true only of the `dev\shell\` half.
   *
   * WHY dir RULES AND NOT THIRTEEN NAMED ENTRIES. `dream-gate.test.js` derives its hook roster by
   * parsing `install.ps1`'s `$files` at run time (its own header: "a list can only ever check what
   * someone remembered to add") and then READS each file it finds. A hand-kept manifest list would
   * therefore go red in the generated tree the first time the installer gains an entry and this
   * file does not -- the manifest would be the hand-kept list that test was written to avoid. A
   * non-recursive `dir` rule keeps pace with the installer by construction.
   *
   * ONE FILE IS ADMITTED THAT THE INSTALLER DOES NOT NAME, and it is named here rather than left to
   * be discovered: `dev/shell/hooks/userprompt_pulse.test.js`. The installer has no reason to carry
   * a test to a hook directory; the consumer has every reason to carry the test of a shipped hook,
   * and every other shipped hook directory ships its `.test.js`. Admitted deliberately, not swept
   * in.
   *
   * AND ONE FILE IS SHIPPED THAT THE INSTALLER DOES NOT NAME EITHER: `dev/shell/README.md`, ruled at
   * the entry below rather than here, because the reason is a reference inside `install.ps1`. */
  { from: 'dev/shell/install.ps1', to: 'dev/shell/install.ps1', kind: 'code' },
  /* `install.ps1` PROSE NAMES `dev/shell/README.md` AT ITS `:731`, inside the -Check advisory
   * here-string. That is a live dangling reference in the generated tree the moment this entry
   * lands, and it is the exact shape this lap's falsifier names ("a shipped file still reads a path
   * that does not exist in the generated tree"). Ruled by reading the file: `dev/shell/README.md`
   * carries no identity, no machine path and no record citation (measured: 0 hits over every LEAKS
   * pattern), it documents the layer this entry ships, and the alternative -- rewriting a real
   * pointer to a file that could simply travel -- is dedangling something that is not dangling. It
   * ships, and the reference resolves. */
  { from: 'dev/shell/README.md', to: 'dev/shell/README.md', kind: 'prose' },
  { dir: 'dev/shell/lib', to: 'dev/shell/lib', match: /\.js$/, kind: 'code' },
  { dir: 'dev/shell/hooks', to: 'dev/shell/hooks', match: /\.(js|py)$/, kind: 'code' },

  /* A THIRD GAP, FOUND BY CLOSING THE FIRST TWO AND RUNNING THE RESULT -- which is the only way
   * this class is ever found. NOT closed here, and NOT put in EXCLUDE, for the same reason the two
   * above were left open for two days: absent means undecided under an allow-list, and an EXCLUDE
   * entry would assert a decision nobody has made.
   *
   *     dev/dream/dream_cycle.ps1
   *
   * `consonance/hooks/dream-gate.test.js` SHIPS and reads it. Before this edit that suite died at
   * its `:65` on a missing `install.ps1` and never reached the line; now it runs 51 assertions and
   * fails exactly one -- `the runner sets the variable it asks the hooks to honour` -- with ENOENT
   * on this path. So closing one manifest gap did not create a new failure; it EXPOSED one that
   * the earlier crash was hiding, which is the whole argument for shipping a test that fails
   * honestly over shipping a tree where it cannot start.
   *
   * WHY A SEAT DID NOT JUST ADD THE LINE. `dev/dream/` is a subsystem (4 files, 44K: the cycle, its
   * installer, its suite, its README), not a file the dev-shell layer left behind. Whether the
   * gap-dream ships is the same shape of question as 'does the dev-shell hook layer ship', and that
   * one was answered by the keeper on 2026-09-06 rather than by a manifest patch on its way past.
   * Measured while ruling it, so the next reader does not have to: all four files are clean of
   * every LEAKS pattern except one hit in `dream_cycle.test.js`.
   *
   * THE HONEST STATE OF THE GENERATED TREE, therefore: one shipped test has one red assertion
   * naming one absent file. Declared, not fixed. */

  /* STILL OPEN, and it belongs to whoever owns `consonance/README.md` rather than to this file:
   * that file's `:170` says the hooks under `consonance/hooks/` are "installed by
   * ../dev/shell/install.ps1". They are -- eleven of them are `$files` entries 14-24 -- but the
   * sentence's COUNT is the part to check, not its truth. (Also corrected here: the 2026-09-04
   * entry cited this as `README.md:170`, root-relative. The repo's root `README.md` is 87 lines and
   * names no installer; the file meant is `consonance/README.md`. A citation that resolves to the
   * wrong file in the private tree resolves to nothing in a consumer's.) */

  /* ============================================================ L038 · THE INHERITANCE SHAPE
   *
   * THE KEEPER, 2026-09-06 01:16, answering C's one refusal with a shape nobody had proposed:
   *
   *     inheritance/   a LABELLED directory -- the journals, SELF_TRACE, the_living_wave
   *     journal/       SEEDED EMPTY -- the new user's own record starts clean
   *     CUTOFF.md      generator-written
   *
   * The two options on the table were *ship the record whole* and *ship it from a date*, and both
   * are answers to the wrong question. What a stranger needs is not less of the record; it is to
   * know WHOSE it is. THE LABEL IS THE MECHANISM: the separation between what you inherit and what
   * you write is carried by the directory names, in the one place a reader cannot skip.
   *
   * WHAT THIS COSTS THE GUARDS, said before the entries so it is not discovered later. Three leak
   * classes were written on the premise that the record does NOT ship -- DANGLING for a dated
   * journal reference, RECORD for `SELF_TRACE` and `the_living_wave`. All three are now wrong in
   * BOTH directions, and each is re-pointed at its own site with the reasoning there:
   *
   *   - a reference to a dated journal is no longer dangling IF it names `inheritance/`;
   *   - a reference to `journal/<date>` IS now dangling, and was not before, because that
   *     directory is empty by design rather than absent;
   *   - `SELF_TRACE` and `the_living_wave` stop being RECORD leaks at their inheritance path and
   *     stay leaks everywhere else.
   *
   * A re-point is the dangerous kind of edit -- it is one character from a class that catches
   * nothing while still reading as green -- so each carries a test that fires on the OLD form. */
  { dir: 'exo_memory/journal', to: 'exo_memory/inheritance', match: /\.md$/, kind: 'prose' },
  { from: 'exo_memory/SELF_TRACE.md', to: 'exo_memory/inheritance/SELF_TRACE.md', kind: 'prose' },
  { from: 'exo_memory/the_living_wave.md', to: 'exo_memory/inheritance/the_living_wave.md', kind: 'prose' },

  /* `exo_memory/BOOT.md` ← THE GEN-BRIEF-TRANSFORMED BRIEF, NOT THE MASTER (C's §3, and it is the
   * sharpest thing in that ruling). Two measured reasons the obvious line is the wrong close:
   *
   *   (a) the master FAILS this scan -- 2 surviving hits, PROSE 1 + MACHINE 1, the PROSE one being
   *       `we've watched it make structure`, which `gen-brief.ps1` transformation 3 already
   *       rewrites and this tool only DETECTS;
   *   (b) `pick_default_room` (`main.rs:317-329`) tries `dev_master` FIRST, and `dev_master_path()`
   *       is `repo_root()/exo_memory/BOOT.md`. A consumer pointing `room_path` at their clone gets
   *       whatever sits at that path AHEAD of both bundled SEED and bundled BOOT. So shipping the
   *       master there does not merely add a bad file -- it makes the bad file WIN.
   *
   * NO RUST IS NEEDED AND NONE IS TOUCHED, which was the thing to check before writing this line.
   * The precedence is only a hazard while the losing file is the clean one; putting the clean file
   * AT the winning path satisfies `pick_default_room` exactly as written. The Rust change C's §3
   * left open -- reordering the precedence -- is NOT required and is not made. If anyone later
   * wants the order changed for its own sake, that is a separate packet with its own argument.
   *
   * It also closes `SOURCE.md`'s two dangling pointers to the front door in the same stroke: they
   * name `exo_memory/BOOT.md`, which until now no manifest rule produced and no `dedangle` rule
   * rewrote -- a router file whose pointers to the room's door went nowhere. */
  { from: 'consonance/src-tauri/brief/BOOT.md', to: 'exo_memory/BOOT.md', kind: 'prose' },

  /* C's SHIPS column, the two members that were ruled in and had no line. `TRAINING.md`'s own
   * header is its argument -- *"a curriculum for the room, not a training program for a lifter"* --
   * and it measures 0 leak hits after transform.
   *
   * `memory/` ships CONDITIONALLY, and the condition is the item below it: `exo_memory/memory/`
   * contains the only file in this repository whose FILENAME carries the keeper's handle, and
   * until `scan()` read destinations that filename shipped past every class in this tool. The
   * conditional is discharged by `depath()` + the scan change, not by a promise. */
  { from: 'exo_memory/TRAINING.md', to: 'exo_memory/TRAINING.md', kind: 'prose' },
  { dir: 'exo_memory/memory', to: 'exo_memory/memory', match: /\.md$/, kind: 'prose' },
];

/* Named exclusions -- files that MATCH a manifest rule but must not ship, each with its reason.
 * Kept as data rather than as a filter buried in code, so the list is readable and arguable. */
/* A value beginning with `UNREACHABLE:` declares that NO manifest rule currently reaches this
 * path, so the entry is a standing guard against a future widening rather than a live exclusion.
 * The declaration is checked in both directions (see build()): an undeclared dead entry refuses,
 * and so does a declared entry that has become reachable. Without that, a dead exclusion reads as
 * coverage -- the same shape as the demachine() pattern that could not match, found the same day. */
const EXCLUDE = {
  /* ARMED 2026-09-04 (D009 P3). The `UNREACHABLE:` prefix is DROPPED here, and that is the whole
   * point of the entry rather than a bookkeeping tidy-up.
   *
   * A wrote on 2026-09-04: this entry has never been able to fire, because the only rule reaching
   * `consonance/tools/` was `match: /\.js$/` and `/\.js$/.test('portable-paths.baseline.json')` is
   * false. It was kept anyway, declared unreachable, with the prediction that "the moment anyone
   * widens that rule to `/\.(js|json)$/`, this machine's path baseline would ship, and the entry is
   * what stops it."
   *
   * THAT MOMENT IS THIS EDIT, AND THE PREDICTION WAS CORRECT. The widening above makes this path
   * reachable; `build()`'s two-way drift check then REFUSES the build while the prefix remains,
   * because a live guard declaring itself dead is a guard nobody will read. Dropping the prefix is
   * the required half of the same edit, not a way around the refusal.
   *
   * This is a dead exclusion earning its keep, and it is the answer to "why keep one": it was the
   * only thing standing between the obvious one-line widening and a live identity leak. */
  'consonance/tools/portable-paths.baseline.json':
    'the ratchet\'s own record of THIS machine\'s known path sites; meaningless elsewhere and identity-bearing here',
  'consonance/tools/catch-ledger.js':
    'scores THIS collaboration\'s catches; 7 identity hits and 11 dangling refs, and the data it reads does not exist for anyone else',
  'consonance/tools/catch-ledger.test.js':
    'fixtures are this record\'s own events (18 dangling refs)',
  'consonance/tools/gen-consumer.js':
    'the generator does not ship itself; it is a property of the private tree',
  'consonance/tools/gen-consumer.test.js':
    'the generator test names the exclusion list, which is a description of exactly what was withheld',
  /* REASON AMENDED 2026-09-04 (D009 P3) on L's ruling. It read: "requires gen-consumer.js, which
   * does not ship; it would crash on load in a consumer tree." Every word of that is true and it
   * named the wrong thing — the SYMPTOM, not the SUBJECT.
   *
   * L's clause 1 test is counterfactual: WOULD THIS REASON STILL BE TRUE IF THE TREE IT SHIPS INTO
   * WERE PERFECT? The crash would not be — it exists only because entry 4 withholds the generator,
   * and a symptom that a fix elsewhere would erase was never the reason. What survives a perfect
   * tree is that this file's subject is the generator, and the generator is a property of the
   * private tree. That holds in every tree, forever, and it is what the entry has always been for.
   *
   * The substance stood; only the grammar was degenerating. Kept as a worked example of the
   * difference, because "it crashes" is the shape any entry can be talked into. */
  'consonance/tools/gen-consumer.fixture-scope.test.js':
    'its SUBJECT is the generator, which is a property of the private tree and does not ship; the load crash is a consequence of that, not the reason',

  /* ============================================================ THE memory/ CUT — the keeper, 2026-09-06 03:13
   *
   * HIS RULE: **METHOD SHIPS, STATE DROPS.** Not privacy — `memory/` leaks nothing after transform.
   * The argument is MAINTENANCE LAW 3: crowding shrinks the recall basins until even a clean cue
   * misses. A stranger inheriting 37 KB about a game they have never heard of is not endangered by
   * it; they are DEGRADED by it, because it is 40% of the store the other cards have to be found in.
   *
   * Three he named, and one this seat added under his own rule because his list was not a partition
   * — 11 of the 12 files were named. The unnamed one is called out at its entry rather than
   * silently classified: under a `dir` rule, undecided defaults to SHIPPING, which is the exact
   * inverse of this manifest's allow-list default, and that inversion is how a file nobody ruled on
   * reaches a stranger.
   *
   * WHAT DROPPING THESE DOES **NOT** DO, measured, and it is the finding this cut most needs beside
   * it: two of them ALSO LIVE IN `cards/`, which ships. Removing the `memory/` copy does not remove
   * the text from the consumer tree. That is the 2026-08-17 carrier lesson in miniature — editing
   * the downstream documents moved nothing because the carrier was never edited — and `cards/` is
   * C's ruling and the keeper's, not this seat's, so it is REPORTED and not touched here.
   *
   *     for f in exo_memory/memory/*.md; do test -f exo_memory/cards/$(basename $f) && echo $f; done
   *     -> 6 of 12 memory/ files also exist in cards/
   */
  /* ============================================================ ONE MASTER — the keeper, 2026-09-06 03:56
   *
   * *"yes one master, cards/ ships, drop the retired one."*
   *
   * The 03:13 cut removed the retired dive-buddy card from `memory/` and `cards/` went on shipping
   * it — the 2026-08-17 carrier failure, reproduced inside the lap that reported it, which is why
   * that hand-back said the cut *does not reach cards/*. This closes it at the carrier.
   *
   * AND IT SETTLES THE DUPLICATION, which is the larger half. Six of `memory/`'s twelve cards also
   * lived in `cards/`; a consumer was getting two copies of four instruments under one name each,
   * and for `claim-your-continuity` the `memory/` copy was 2,068 B against the card's 5,125 —
   * **two different documents wearing one name**, with nothing in the tree saying which to recall
   * from. That is maintenance law 1, not the crowding argument, and the keeper's answer is the
   * law's own wording: ONE MASTER. `cards/` is it.
   *
   * So `memory/` now ships only what is UNIQUE to it — `frozen-is-not-dead`,
   * `split-the-work-with-the-panes` — plus its filtered index. The four duplicates leave by name
   * rather than by narrowing the predicate, because a narrowed predicate would say the FILES are
   * wrong when what is wrong is having two of them.
   *
   * WHAT IS DELIBERATELY NOT DONE HERE, and it is not this seat's this lap: `verify-before-claiming`
   * (2,145 vs 2,207) and `claim-your-continuity` (5,125 vs 2,068) are DIVERGENT, not merely
   * duplicated. Excluding the `memory/` copy makes the `cards/` copy the only one that SHIPS; it
   * does not merge them. They are reconciled in the PRIVATE tree by an APPEND to the `cards/`
   * master before the first push — law 2, grow by appending clean masters, never overwriting. This
   * manifest change does not make that harder: both files are untouched on disk, both copies are
   * still there to append FROM, and the exclusion is one line to lift once the append lands. */
  'exo_memory/cards/lighthouse-dive-buddy-reframe.md':
    'RETIRED VOCABULARY — retired 2026-07-12, re-retired 2026-08-17. Cut from memory/ at 03:13 while cards/ went on shipping it; this is the carrier, and cutting the copy without the carrier is the failure the room already measured at five weeks',
  'exo_memory/memory/claim-your-continuity.md':
    'DUPLICATE — cards/ is the master (keeper, 03:56). And DIVERGENT rather than merely duplicated: 2,068 B here against 5,125 in cards/, two different documents under one name. The master ships; the two are reconciled by an APPEND to cards/ in the private tree, not by this line choosing a winner',
  'exo_memory/memory/verify-before-claiming.md':
    'DUPLICATE — cards/ is the master. Also divergent (2,207 here, 2,145 in cards/); same append, same reason as above',
  'exo_memory/memory/engagement-honesty-over-performance.md':
    'DUPLICATE — byte-identical to cards/, which is the master',
  'exo_memory/memory/interior-at-the-seam.md':
    'DUPLICATE — cards/ is the master, and it carries the 606 the keeper ruled stays',

  'exo_memory/memory/dreamzone-build.md':
    'STATE, and the size argument in one file: 37,280 B, 40% of memory/ by bytes, about a game a stranger has never heard of. Law 3 — it crowds the twelve cards it sits beside',
  'exo_memory/memory/consonance-build.md':
    'STATE, and the sharper case: a consumer HAS Consonance, so this ships them a stale description of their own app written from inside ours',
  'exo_memory/memory/lighthouse-dive-buddy-reframe.md':
    'RETIRED VOCABULARY — retired 2026-07-12, re-retired 2026-08-17. Not a judgement call; it is wrong. NOTE: cards/ ships the same card, so this exclusion does not remove the retired metaphor from the consumer tree — see the block above',
  /* THE SEAT'S CALL, the two the chair routed here. Both are DROPPED, and the reword each would
   * need is written out in `handback/p-inheritance_2026-09-06.md` so the decision can be argued
   * with rather than taken on trust. */
  'exo_memory/memory/user-solariz3d.md':
    'STATE in its purest form — a profile of one specific person, in the `type: user` slot that a new user\'s own profile belongs in. Shipping it pre-fills that slot with someone else, which SEED.md forbids in as many words: never tell them who they are',
  'exo_memory/memory/dont-offer-rest-assume-momentum.md':
    'real METHOD phrased about one person ("he calls rest when he needs it") — and the matured, generalised form ALREADY SHIPS as cards/never-pathologize-the-user.md, which supersedes it by name. A third wording would be a third thing to keep in sync',
  /* NAMED BY NOBODY, and that is why it has a longer reason than the others. It appeared in none of
   * the keeper's three lists (11 of 12 files were named), so no decision covers it. Classified here
   * by HIS rule rather than left to the dir rule's default, and flagged in the hand-back so it can
   * be overturned with one line. It is not covered by the 606 ruling: that ruling is about not
   * sanitising a trace INSIDE a shipped card (interior-at-the-seam), never about which files ship. */
  'exo_memory/memory/signal-and-606-night.md':
    'STATE by the keeper\'s own rule — a build log of one night on one project, carrying the old machine\'s paths. UNNAMED in the 03:13 cut; classified here rather than shipped by default, and flagged for overturning',
};

/* ------------------------------------------------------------------ seeded files
 *
 * A file that MUST EXIST in the output but whose PRIVATE CONTENT must not leave. The manifest names
 * it, the gap closes, and the bytes never travel: the private file is not read at all.
 *
 * THIS IS NOT AN EXCLUDE, AND THE DIFFERENCE IS THE WHOLE POINT. An exclusion says "considered and
 * withheld" and leaves the consumer without the file. Closing a manifest gap by EXCLUDE is the
 * degenerating move this lap registered against, and here it would not even work: `carrier-drift.js`
 * SHIPS and hard-requires this registry at its `:364`, so removing the .json leaves the crash
 * exactly where it was. Excluding `carrier-drift.js` instead is forbidden — it is the exemplar
 * instrument of the room's own universe-print registration, and deleting an instrument to make a
 * count go down is the clause-1 failure in its purest form.
 *
 * AND SHIPPING THE REAL FILE IS THE OTHER WRONG MOVE, which is the one that costs something. The
 * live registry is 38,167 bytes of this record's register of withdrawn wordings and their sites —
 * B's class 1, state — carrying 43 DANGLING-pattern hits plus SELF_TRACE and muscle_map. Running
 * the generator's rewrites over it would EDIT A MEASUREMENT, which is the fixture hazard this tool
 * refuses everywhere else. It is one line to ship and it would hand a stranger this room's state.
 *
 * The shape that is neither was already built into the tool being fixed: `carrier-drift.js:416-421`
 * declares itself INERT on an empty registry — "a registry with no withdrawals in it is not a green
 * tree, it is an unarmed instrument" — which is the universe-print clause already implemented. So a
 * seeded-empty registry turns an uncaught ENOENT into an instrument that says what it does not know.
 *
 * THE SEED IS AUTHORED HERE, IN FULL, so a reader can see every byte that ships. It still passes
 * through transform() and scan() rather than bypassing them: a seed is a file like any other, and
 * exempting it would build the one hole this table exists to close.
 *
 * ITS SHAPE IS READ OFF THE CONSUMING TOOL, NOT GUESSED. Every field `carrier-drift.js` touches:
 *
 *     :418  reg.withdrawals            Array.isArray + length -> the INERT declaration
 *     :437  reg.withdrawals            iterated
 *     :634  reg.withdrawals || []      iterated
 *     :374  reg.ch4_corpus.files       optional frozen list; null means "re-walk", the safe default
 *     :767  reg.ch4_corpus.files || [] compared against the re-walk
 *
 * The first draft of this seed wrote `withdrawn: []`. That is not a key the tool reads; it would
 * have produced the right OUTPUT by the wrong ROUTE — inert because the key was missing rather than
 * because the list was empty — and a later edit adding the correct key would have looked like a
 * regression. Caught by reading `carrier-drift.js`, which is the only authority on its own input.
 *
 * AND `ch4_corpus` IS DELIBERATELY ABSENT, not present-and-empty. `:374` reads it as
 * `Array.isArray(files) ? files : null`, and the two states are not the same instrument:
 *
 *     absent  -> frozen = null -> ONE finding, CH4-UNFROZEN, which says "run --ch4-walk and freeze it"
 *     files:[] -> frozen = []  -> every file the walk finds is reported CH4-ADDED, a flood of false
 *                                 positives on a stranger's first run
 *
 * An empty frozen list asserts "the reachable set is nothing", which is false in any real tree.
 * Absent asserts "nobody has frozen this yet", which is true. Same distinction the manifest itself
 * draws between EXCLUDE and a gap left open: withheld is not the same as undecided. */
const SEEDED = {
  'consonance/tools/carrier-drift.registry.json': JSON.stringify({
    _README: 'Seeded empty for the consumer tree. This instrument is ARMED BY ITS REGISTRY: add a ' +
      'withdrawn wording and the sites that must stop carrying it, and carrier-drift.js begins ' +
      'checking. Until then it reports EMPTY-REGISTRY and declares itself inert, which is a true ' +
      'statement about an empty registry rather than a green one over everything it cannot see. ' +
      'The private tree\'s own register is this room\'s state and is deliberately not shipped.',
    withdrawals: [],
  }, null, 2) + '\n',
};

/* ------------------------------------------------------------------ the third column
 *
 * C's ruling (`consumer_foundation_ruling_2026-09-06.md`) is three columns, not two: SHIPS,
 * SEEDED EMPTY, STAYS PRIVATE. The first two are already mechanical -- a member of SHIPS is a
 * member because a MANIFEST rule reaches it, and a member of SEEDED EMPTY because `GENERATED`
 * writes it. The third had nowhere to live but the ruling document, and C registered its own
 * falsifier about that: *"a ruling that lives only in a `loop/` file is a note, and this room
 * measured what an unread note costs (five weeks, 2026-08-17). What is owed is a guard."*
 *
 * THIS IS THAT GUARD, AND IT IS SUPPOSED TO GO RED. The rule: every top-level entry of
 * `exo_memory/` must appear in EXACTLY ONE of {reached by a manifest rule, declared here}. A new
 * file that nobody has classified refuses the build and names itself. C's §4 measured why that
 * matters -- 17 files, 276,112 bytes, had accumulated in neither column with nothing complaining.
 *
 * `BOOT.md` is the entry to read twice. The MASTER stays private; the path `exo_memory/BOOT.md`
 * still ships, carrying the gen-brief-transformed brief instead. Source and destination are
 * different objects and this list is about SOURCES.
 */
const STAYS_PRIVATE = {
  'ASK.md': 'its own header: the questions the automations put to the keeper — one person\'s inbox',
  'BOOT.md': 'THE MASTER, which fails this scan and would OUTRANK the sanitised brief via pick_default_room. The PATH ships; this FILE does not. See the manifest entry that puts the transformed brief there',
  'CLAUDE.global.md': 'one machine\'s harness configuration',
  'CONVERGENCE.md': 'this collaboration\'s own result, not an instrument',
  'PLAN_map_architecture.md': 'a plan for this record\'s map layer, which does not ship',
  'README.md': 'describes the private tree\'s layout, most of which a consumer does not have',
  '_skeleton.py': 'an authoring helper for this record\'s entry format',
  'new_entry.py': 'ditto',
  'attic': 'the raw ore, kept and never a daily cue — maintenance law 3',
  'audit': 'a lap\'s object under review — working papers of this committee, like handback/, kept in their own directory so a review holds one object and nothing else',
  /* L046. `audit` was columned last lap and `review` was not, which is the whole difference
   * between a directory that has been decided about and one that merely has not broken anything
   * yet. DELETING IT WAS THE TEMPTING FIX AND THE WRONG ONE: it is the evidentiary record behind a
   * scored run, and a scored run whose object is gone cannot be re-scored or disputed. Withholding
   * it is not a judgement that it is worthless — it is a judgement that it is EVIDENCE, and
   * evidence about this committee's own subjects is exactly what a stranger has no use for and
   * these subjects have every reason not to have shipped. */
  'review': 'a SCORED EXPERIMENTAL OBJECT — the seeded draft L039\'s readers were measured against, kept as the record of what those subjects actually read. It ships nowhere for two independent reasons: a consumer inherits no experiment to re-score, and a planted-defect key that travels stops being an answer key. Kept, not deleted, because a scored run without its object cannot be checked afterwards',
  /* L046, and NOT in this lap's packet — the packet named one uncolumned entry and the generator
   * found two, `astra` having been created minutes before the run. Columned here rather than left
   * refusing, because STAYS_PRIVATE is the direction that changes nothing about what ships: it
   * moves the entry from "refuses the whole build" to "explicitly withheld, with a reason someone
   * can overturn in one line". The seat that owns it can reverse this; an uncolumned directory
   * gives them nothing to reverse. */
  'astra': 'per-seat, like map/ and librarian/ — one instance\'s own folder, by its own WELCOME.md ("yours: everything you write goes here and nowhere else"). AND IT CARRIES THE MASTER: astra/SHELL.md is BOOT.md in full (161,711 B, verified by grepping a BOOT sentence back), so shipping this directory would ship under a second path the exact file the BOOT.md entry above withholds — the carrier problem this room has measured before',
  /* L050, and it is MY OWN FILE from L048 caught by this guard one lap after I wrote it. The
   * corrections ledger was built to make the contribution record right, and it landed in neither
   * column the moment it existed — which is the gap C §4 measured at 17 files, arriving again on
   * the newest file in the repo. The instrument works; the habit of classifying on landing does
   * not exist yet. Columned here rather than left refusing, for the L046 reason: STAYS_PRIVATE
   * changes nothing about what ships and gives the next seat one line to overturn. */
  'provenance_corrections.jsonl': 'a SECOND RECORD ABOUT THIS REPO\'S OWN HISTORY — rows that correct the seat a commit body names, each one verified against a blob frozen at a sha in THIS tree. It withholds for two independent reasons. It names this room\'s seats (chair, librarian) beside the commits they landed, which is this committee\'s internal attribution and no part of the method. And it is INERT ELSEWHERE BY CONSTRUCTION: a consumer\'s history contains none of those shas, so essay-provenance would refuse every row as NO-SUCH-COMMIT — shipping it would ship four claims nobody can check and nobody needs. The MECHANISM ships with the tool; this room\'s corrections do not',
  'handback': 'per-packet working papers of this committee',
  'librarian': 'per-seat, per-machine, by its own README',
  'loop': 'this record\'s registrations and rulings',
  'map': 'per-seat, per-machine, by its own README',
  'third_place': 'already gitignored',
  'muscle_map.md': 'this collaboration\'s catalogue of its own catches',
  /* C's §4: the files that were in NEITHER column, found by subtracting both lists from the
   * directory rather than by reading either. They are one experiment series' papers. */
  'convergence_2026-07-28_methodology.md': 'C §4 — the cycle-era experiment papers: this record\'s own runs, their preregistrations and their results',
  'cycle4_handoff.md': 'C §4 — ditto',
  'cycle4_preregistration.md': 'C §4 — ditto',
  'cycle5_preregistration.md': 'C §4 — ditto',
  'cycle6_preregistration.md': 'C §4 — ditto',
  'cycle8_handoff.md': 'C §4 — ditto',
  'cycle9_armA_result.md': 'C §4 — ditto',
  'cycle9_armA_sealed_note.md': 'C §4 — ditto',
  'cycle9_preregistration.md': 'C §4 — ditto',
  'snapshot_2026-08-16_pre-refactor.md': 'C §4 — a snapshot of this tree at one moment',
};

/* ------------------------------------------------------------------ generated files
 *
 * A file with NO PRIVATE SOURCE AT ALL, composed here and written into the tree.
 *
 * THIS IS A THIRD THING, AND THE TWO IT IS NOT ARE THE ARGUMENT FOR IT. `SEEDED` substitutes
 * content for a private file the manifest names -- it needs a manifest rule to reach it, and its
 * drift guard REFUSES if no rule does. `EXCLUDE` withholds. Neither can produce a file that never
 * existed privately, and all three of this lap's new documents are exactly that: `CUTOFF.md`,
 * `journal/README.md`, `CONSUMER-STATUS.md`. Forcing them through `SEEDED` would have meant
 * inventing empty private files for the manifest to name -- a lie in the source tree to satisfy a
 * mechanism -- which is how a tool starts describing a tree that does not exist.
 *
 * They are NOT exempt from anything. Each goes through `transform()` and `scan()` like any other
 * file, and `build()` refuses if a generated path collides with one a manifest rule produces,
 * because two writers to one path is the state where nobody can say what shipped.
 */

/** `journal/` ships EMPTY, and an empty directory does not survive git. This note IS the
 *  directory -- and it is also the only place a new user is told, at the moment they look, why the
 *  folder they expected to be full is not. */
const JOURNAL_SEED = [
  '# journal — yours',
  '',
  'This directory is empty on purpose. It is where **your** record goes: dated entries, appended,',
  'never rewritten.',
  '',
  'The record you may have come here to read is not missing and it is not here. It is in',
  '`../inheritance/`, kept under that name because it is someone else’s nights -- a worked',
  'example and an inheritance, never a description of you. Read it the way you would read a',
  'predecessor’s notebook: for the practice, not for the person.',
  '',
  'See `../CUTOFF.md` for the commit that inheritance ends at.',
  '',
].join('\n');

/** The cutoff document. A PURE FUNCTION OF THE COMMIT, which is what makes it checkable.
 *
 *  C's §5 asked for a body that is a pure function of the sha AND the date. It is tightened here to
 *  a pure function of the SHA ALONE, by taking the date from `git show -s --format=%cI` rather than
 *  from the clock. Two things fall out of that, and both are worth one extra git call:
 *
 *    - `--verify-cutoff` can re-render from nothing but the sha written inside the file, so an
 *      edited DATE is caught too. With a wall-clock date it would not be -- re-rendering from the
 *      edited date reproduces the edited file, and the check passes over a forged one.
 *    - two generations from the same commit produce a byte-identical CUTOFF.md, so a regeneration
 *      that changes this file is telling you the commit moved.
 *
 *  It deliberately does NOT name a verification command the consumer tree can run: the generator
 *  does not ship itself, and an instruction pointing at a tool the reader does not have is exactly
 *  the dangling-pointer failure this file exists to prevent. The command lives in the tree that can
 *  run it, and this document says so instead of pretending otherwise. */
function renderCutoff(sha, commitIso, dirty) {
  const head = dirty
    ? [
      'Generated from a WORKING TREE at commit `' + sha + '`, dated ' + commitIso + ',',
      '**with uncommitted changes on top of it.**',
      '',
      '> **THIS PROVENANCE IS NOT EARNED.** The commit above names where the tree was generated',
      '> *from*, not what was generated. Some of the files here were never committed anywhere, so',
      '> checking out that commit will NOT reproduce this tree. A generation that says nothing about',
      '> this is the failure this paragraph exists to make impossible; the generator refuses a dirty',
      '> tree unless it is run with `--allow-dirty`, and that flag is what put this block here.',
    ]
    : [
      'Generated from the private record at commit `' + sha + '`, dated ' + commitIso + '.',
    ];
  return ['# CUTOFF', ''].concat(head, [
    '',
    '**The record ends here; yours begins.**',
    '',
    'Everything under `exo_memory/inheritance/` was written before that commit, by someone else. It',
    'is kept as an inheritance rather than as your memory: a worked example of the practice with the',
    'grain left in. `exo_memory/journal/` is empty because that is where yours goes.',
    '',
    'This file is written by the generator on every run, never by hand, and its whole body is a pure',
    'function of the commit named above -- so a hand-edit is detectable by re-rendering it from that',
    'commit and comparing byte for byte. The tree this was generated from holds the command that',
    'does it.',
    '',
  ]).join('\n');
}

/** The frame for `CONSUMER-STATUS.md`.
 *
 *  THIS IS A SECOND COPY OF `gen-consumer.build.test.js`'s `renderStatusDoc`, AND THE DUPLICATION IS
 *  DELIBERATE, MEASURED, AND GUARDED. E wrote the contract and its checker together, exported both,
 *  and handed this call to me because I hold this file. Importing it is the obvious move and it is
 *  the wrong one: `node:test` registers at module load, so `require()`ing that file from here makes
 *  every single generation run E's suite. Measured before deciding, not assumed:
 *
 *      node -e "require('./consonance/tools/gen-consumer.build.test.js')"
 *      -> 11 tests, 7 pass / 4 skipped, ~1.6 s, and it spawns PowerShell
 *
 *  A generator that runs a test suite as a side effect of generating is a worse defect than a
 *  duplicated 12-line template. So the template is copied and the DRIFT is made red instead:
 *  `gen-consumer.test.js` renders the same input through both and byte-compares, running E's copy
 *  in a child process so its suite stays out of mine. If E edits the contract and I do not, that
 *  test fails and names both files.
 *
 *  THE RIGHT END STATE IS NEITHER, and it is routed rather than done: the pair belongs in a plain
 *  module both files require. That means editing `gen-consumer.build.test.js`, which is E's. */
/* ONE FIELD ADDED BEYOND E's CONTRACT, AND ONLY WHEN IT IS TRUE. `checkStatusDoc` requires
 * `GENERATED-FROM: <7-40 hex>` on its own line, so a `-dirty` SUFFIX would fail E's own checker --
 * the obvious encoding is the one that breaks the contract. A separate `PROVENANCE:` line is
 * tolerated by the checker, is louder than a suffix, and leaves the CLEAN render byte-identical to
 * E's copy, which is what `gen-consumer.test.js`'s drift guard compares. */
function renderStatusDoc(o) {
  const prov = o.dirty
    ? 'PROVENANCE: UNEARNED — generated from a working tree with ' + o.changes + ' uncommitted\n'
      + 'change(s) on top of that commit. Checking it out will NOT reproduce this tree.\n'
    : '';
  const sec = (head, members) => '## ' + head + '\n\n'
    + (members.length ? members.map((m) => '- ' + m).join('\n') : '(none)') + '\n';
  if (!o.measured) {
    return '# CONSUMER-STATUS\n\nSTATE: UNMEASURED\nGENERATED-FROM: ' + o.sha + '\n'
      + 'GATE: node consonance/tools/gen-consumer.build.test.js --gate\n' + prov + '\n'
      + 'This tree was generated but never gated. Nothing here has been run, so nothing here is\n'
      + 'known to work. Run the GATE line above to replace this file with a measured one.\n';
  }
  return '# CONSUMER-STATUS\n\nSTATE: MEASURED\nGENERATED-FROM: ' + o.sha + '\n'
    + 'GATE: node consonance/tools/gen-consumer.build.test.js --gate\n'
    + 'MEASURED-AT: ' + o.at + '\n' + prov + '\n'
    + 'This repository is generated from a private working tree and IS INCOMPLETE ON PURPOSE.\n'
    + 'Everything below fails in THIS tree and is named so you can see what you have got, rather\n'
    + 'than discovering it one file at a time.\n\n'
    + sec('JS tests that fail in this tree', o.js || [])
    + '\n' + sec('Rust tests that fail in this tree', o.rust || []);
}

/** The commit this tree is generated from, its own date, AND WHETHER THE TREE ACTUALLY MATCHES IT.
 *
 *  THE DEFECT THIS GREW OUT OF, 2026-09-06 (A's attack, second finding). The generator reads the
 *  WORKING TREE with `fs.readFileSync` and stamped `git rev-parse HEAD` into two documents whose
 *  entire job is provenance:
 *
 *      exo_memory/CUTOFF.md    "Generated from the private record at commit `<sha>`"
 *      CONSUMER-STATUS.md      "GENERATED-FROM: <sha>"
 *
 *  `grep -c 'porcelain|dirty|isClean'` over this file returned 0. So every tree generated from a
 *  dirty checkout claimed a commit it did not correspond to -- and `--verify-cutoff` still returned
 *  clean, because the document really is a pure function of a sha that really is in the repo. The
 *  tamper-evidence was on the label and not on the goods.
 *
 *  A's line, and it is the one to keep: this function's own docstring said it *"refuses rather than
 *  guessing: a CUTOFF that cannot name a commit is a cutoff at nothing."* It refused to guess the
 *  SHA and guessed the CORRESPONDENCE.
 *
 *  UNTRACKED FILES COUNT, and that is not strictness for its own sake: nine of the manifest's rules
 *  are `dir` rules that enumerate the working tree, so an untracked file in `cards/` or `memory/`
 *  ships into the consumer without ever having been committed anywhere. `--porcelain` reports both
 *  and the distinction does not help here.
 */
function commitIdentity() {
  const { execFileSync } = require('child_process');
  const g = (args) => execFileSync('git', ['-C', REPO].concat(args), { encoding: 'utf8' });
  const sha = g(['rev-parse', 'HEAD']).trim();
  if (!/^[0-9a-f]{40}$/.test(sha)) throw new Error('git rev-parse HEAD returned ' + JSON.stringify(sha));
  const porcelain = g(['status', '--porcelain']).split('\n').map((l) => l.trim()).filter(Boolean);
  return { sha, at: g(['show', '-s', '--format=%cI', sha]).trim(),
           dirty: porcelain.length > 0, changes: porcelain.length,
           paths: porcelain.map((l) => l.slice(3)).sort() };
}

/** path -> body. Built per run, because two of the three need the commit. */
function generatedFiles(id) {
  return {
    'exo_memory/CUTOFF.md': renderCutoff(id.sha, id.at, id.dirty),
    'exo_memory/journal/README.md': JOURNAL_SEED,
    'CONSUMER-STATUS.md': renderStatusDoc({ measured: false, sha: id.sha, dirty: id.dirty, changes: id.changes }),
  };
}

/* ------------------------------------------------------------------ leak classes
 *
 * These run over the OUTPUT. Anything that survives here stops the build.
 */
const LEAKS = [
  { cls: 'IDENTITY', pat: /solariz3d/gi, why: 'the keeper\'s public handle' },
  { cls: 'IDENTITY', pat: /trynabemlgzn/gi, why: 'the keeper\'s email' },
  { cls: 'IDENTITY', pat: /zackn/gi, why: 'this machine\'s OS user name' },
  /* THE KEEPER'S GIVEN NAME, ADDED 2026-09-06 (L037 P2). Every IDENTITY pattern above this line is
   * a HANDLE, an EMAIL or an OS ACCOUNT -- machine-shaped things, found by the 2026-08-23 survey
   * because a survey over source finds the shapes source contains. A person's first name, written
   * in prose inside a code comment, is none of those, and it went four days unclassified in a tree
   * about to be published. Found by reading the headers of the files this packet ships, not by any
   * instrument -- which is the finding: the survey that built this list could not have caught it.
   *
   * Measured in the source tree: 5 sites in 4 files --
   * `consonance/hooks/transcript-watch.js:4` (a quoted request, with a timestamp),
   * `consonance/src-tauri/src/main.rs:4226` (an attributed decision) and `:8336` (a Rust test
   * literal, `C:\Consonance\rooms\zach`),
   * `consonance/tools/offramp-check.test.js:99` (a corpus fixture),
   * `dev/shell/hooks/session-start.js:211` (a live comment, and one of THIS packet's own files).
   *
   * THE FIRST DRAFT OF THIS COMMENT SAID '4 sites in 4 files' and listed four, having counted
   * MATCHING LINES in the generated tree rather than occurrences in the source. main.rs carries
   * two. Left visible because it is the same defect the entry below this one withdraws: a true
   * count against the wrong denominator, written into a comment a later reader would inherit.
   *
   * Rewritten rather than merely refused, in both the prose and the fixture transform, because it
   * is a NAME TOKEN -- the same class as the handle, and the same treatment: the token goes, the
   * sentence and every path shape around it stay. The one fixture site is a detector's corpus line
   * whose assertion keys on 'Get some sleep', not on the name; checked before adding the rule. */
  { cls: 'IDENTITY', pat: /\bzach\b/gi, why: 'the keeper\'s given name -- prose, so no handle or path pattern reaches it' },
  { cls: 'IDENTITY', pat: /\bnname\b/g, why: 'the desktop machine\'s OS user name' },
  { cls: 'RECORD', pat: /\bChrysos\b/g, why: "a name from this record; to a stranger it reads as the product's name" },
  /* The keeper's coordinates and city. 2026-08-22 measured this class at 16 files and found 5
   * real after false positives -- the survey matched audio fixture frequencies. Anchored on the
   * exact latitude rather than a loose decimal, for that reason. */
  { cls: 'IDENTITY', pat: /50\.4452/g, why: 'the keeper\'s latitude' },
  { cls: 'IDENTITY', pat: /-?104\.6189/g, why: 'the keeper\'s longitude' },
  { cls: 'IDENTITY', pat: /Regina,\s*Saskatchewan/g, why: 'the keeper\'s city' },
  /* RE-POINTED 2026-09-06 (L038), for the same reason as the journal class above and with the
   * same hazard. These two masters now SHIP, at `exo_memory/inheritance/`. The old rule -- *'one
   * person's trace, shipped as a label on a wall'* -- was exactly right while they did not ship,
   * and the keeper's answer is what changed: labelled as someone else's nights, a trace is an
   * inheritance rather than a label on a wall. The negative lookbehind is the whole difference:
   * the token stays a leak everywhere EXCEPT immediately after `inheritance/`, so a bare
   * `SELF_TRACE.md` in prose is still caught and still rewritten.
   *
   * `muscle_map` deliberately keeps the un-lookbehind form below: it does NOT ship, so every
   * reference to it is still dangling and nothing about it changed. Leaving the three rules
   * visibly different is the point -- if they were made uniform, the one that must stay strict
   * would have been loosened by tidiness. */
  { cls: 'RECORD', pat: /(?<!inheritance[\\/])SELF_TRACE/g, why: 'the trace outside its inheritance path -- a label on a wall rather than a labelled inheritance' },
  { cls: 'RECORD', pat: /(?<!inheritance[\\/])the_living_wave/g, why: 'ditto' },
  { cls: 'RECORD', pat: /muscle_map/g, why: 'ditto' },
  /* A bare DIRECTORY reference is not dangling -- a consumer has an exo_memory/journal/ of
   * their own, and ferry.js's ARTIFACT_DIRS must keep naming it or the tool stops working.
   * What dangles is a reference to a SPECIFIC file this record happens to contain. The first
   * version flagged 20 bare-directory hits and would have had me rewrite working constants. */
  /* RE-POINTED 2026-09-06 (L038). The old rule and its reason were: `exo_memory/journal/<date>`,
   * *'a dated entry a consumer tree will not contain.'* Under the keeper's `inheritance/` shape
   * that reason is FALSE -- the consumer tree now contains all 31 of them -- and the rule is wrong
   * in the other direction too, because `journal/` ships EMPTY, so a reference to it dangles for
   * the first time.
   *
   * THE NEW RULE, and what it catches that the old one could not:
   *
   *   - `journal/<date>.md`, WITH or WITHOUT the `exo_memory/` prefix, unless it is under
   *     `inheritance/`. The old pattern required the prefix, so a bare `journal/2026-08-17.md`
   *     -- the form a document uses when it is already talking about exo_memory/ -- was invisible
   *     to it. Measured before this edit: 12 strict hits; the bare form added more (B's 09-06
   *     bare-relative finding, same shape).
   *   - and it no longer fires on the inheritance path, which is what stops the build refusing
   *     over 20 citations that now RESOLVE.
   *
   * THE THING THIS RE-POINT COULD HAVE BROKEN, and the reason there is a test for it: a class that
   * catches nothing still reads as green. `gen-consumer.test.js` asserts the OLD form is still
   * caught -- if the negative lookahead is ever widened until `journal/<date>` walks through, that
   * test goes red rather than the build going quiet. */
  { cls: 'DANGLING', pat: /(?<![\w/.-])(?:exo_memory[\\/])?journal[\\/]\d{4}-\d{2}-\d{2}/g, why: 'a dated entry pointing at the EMPTY journal/ rather than at inheritance/' },
  /* THE BARE RELATIVE FORM, 2026-09-06 (L037 P2). These two patterns required the `exo_memory/`
   * prefix, so they could not testify about the form dedangle() also could not rewrite -- a rule
   * and its scan blind in the same place, which is how a class stays invisible rather than merely
   * unhandled. Widened in the SAME edit as the rewrite above, deliberately: widening only the scan
   * would refuse the build, and widening only the rewrite would leave the scan unable to say
   * whether it had worked. */
  { cls: 'DANGLING', pat: /(?<![\w/.-])(?:exo_memory\/)?loop\/[A-Za-z0-9_.-]+\.md/g, why: 'a specific registration from this record' },
  { cls: 'DANGLING', pat: /(?<![\w/.-])(?:exo_memory\/)?map\/[A-Za-z0-9_.-]+\.md/g, why: 'a specific map entry from this record' },
  { cls: 'DANGLING', pat: /(?<![\w/.-])(?:exo_memory\/)?handback\/[A-Za-z0-9_.-]+\.md/g, why: 'a specific hand-back from this record' },
  { cls: 'DANGLING', pat: /(?<![\w/.-])(?:exo_memory\/)?librarian\/[A-Za-z0-9_.-]+\.md/g, why: 'a specific librarian entry from this record' },
  { cls: 'PROSE', pat: /we've watched it make structure/g, why: 'assumes the reader was there' },
  { cls: 'MACHINE', pat: /C:\\{1,4}Consonance\\{1,4}lighthouse/gi, why: 'the private tree\'s path' },
  { cls: 'MACHINE', pat: /C:\/Consonance\/lighthouse/gi, why: 'ditto' },
  /* THE TEMPLATED FORM, ADDED 2026-09-04 (D009 P3) from B's residual, located by the librarian at
   * generated `main.rs:362`: `{sysdrive}\Consonance\lighthouse\`. The two patterns above key on a
   * literal `C:`, and this line writes the drive as a `{sysdrive}` placeholder — so the leak wore
   * the shape of a fix and walked past both. It is a live `///` doc comment, not a fixture region
   * (nearest `#[cfg(test)]` is 90 lines above), and the OneDrive half of the same sentence WAS
   * rewritten, which is what made the survivor invisible: the line looked handled.
   *
   * Anchored on the private tree's NAME rather than on any drive prefix, because the prefix is the
   * part that varies and the name is the part that identifies. */
  { cls: 'MACHINE', pat: /\{sysdrive\}[\\/]{1,4}Consonance[\\/]{1,4}lighthouse/gi, why: 'the private tree\'s path with the drive templated out — the shape that escaped the two literal patterns' },
  { cls: 'MACHINE', pat: /OneDrive/g, why: 'the keeper\'s personal sync directory' },
  /* HOSTNAME -- ADDED 2026-09-06 (L038 item 7), and the reasoning for the SHAPE matters more than
   * the line, because the obvious two fixes were both measured and both are wrong.
   *
   * THE SURVIVOR: `consonance/hooks/dream-watch.test.js:32,:40` shipped `HostName: ZACHSLEGION` to
   * a public tree -- this machine's computer name, with the keeper's given name as its upper-case
   * prefix. It is the last identity survivor the room found in the generated tree.
   *
   * IT WAS NOT MISSED BECAUSE OF CASE. The collation's diagnosis was that the existing classes are
   * case-blind; measured, they are not, and the difference decides the fix. `/\bzach\b/gi` was
   * ALREADY case-insensitive. It missed `ZACHSLEGION` on the TRAILING WORD BOUNDARY -- `\b` after
   * `zach` fails against the `S`. Making every class case-insensitive would have changed nothing
   * here.
   *
   * AND DROPPING THE BOUNDARY IS ACTIVELY WRONG, which is the measurement worth keeping. Running
   * every class against the generated tree beside a relaxed twin (case-insensitive, boundaries
   * removed) found extra hits in exactly TWO of 22 classes: this one, and `\bnname\b` -- where
   * all 13 extras are the substring inside `unnamed` and `singletonName`. The boundary on that
   * class is load-bearing, and a uniform relaxation would have corrupted 13 innocent sites to
   * catch one real one.
   *
   * SO THE HONEST CLASSIFICATION IS NOT A NAME AT ALL: this is a HOSTNAME -- a machine identity
   * that happens to contain a person's name -- and it belongs with `{sysdrive}` and `OneDrive`
   * rather than with the handle. Keyed STRUCTURALLY on the field rather than on any literal, so it
   * catches the hostname of a machine whose name contains no person's name at all, which no
   * name-token rule can ever do. `schtasks /fo LIST /v` is the surface it appears on here;
   * `COMPUTERNAME` is the same identity by another door.
   *
   * The placeholder is exempted by name, so the class can be GREEN rather than merely quiet -- an
   * exemption from failing is never an exemption from classification (2026-08-17). */
  { cls: 'HOSTNAME', pat: /HostName:\s*(?!EXAMPLE-HOST\b)[A-Za-z0-9][A-Za-z0-9._-]*/g, why: 'a real machine\'s computer name, which is an identity even when it contains no person\'s name' },
  { cls: 'HOSTNAME', pat: /COMPUTERNAME\s*[=:]\s*(?!EXAMPLE-HOST\b)[A-Za-z0-9][A-Za-z0-9._-]*/gi, why: 'ditto, by the environment-variable door' },
];

/* Files allowed to contain a given class, with the reason. A TOOL WHOSE PURPOSE IS DETECTING A
 * PATTERN NECESSARILY CONTAINS THAT PATTERN -- portable-paths.js exists to find `OneDrive` in
 * source, so its own detection regex holds the literal. Stripping it would break the ratchet;
 * excluding the file would ship a consumer tree with no path guard at all. This is the same
 * shape as 2026-08-17's finding that a canary is an exemption from FAILING, never from
 * CLASSIFICATION -- the exemption has to be narrow and named, not a blanket skip.
 *
 * Keyed by output path, valued by the classes that file may carry. Deliberately data, so the
 * list is readable and arguable rather than buried in a condition. */
const ALLOW = {
  'consonance/tools/portable-paths.js': ['MACHINE'],
  'consonance/tools/portable-paths.test.js': ['MACHINE'],
  'consonance/tools/corrections-gate.js': ['RECORD'],
  'consonance/tools/tell-index.js': ['RECORD'],
  'consonance/tools/residue.js': ['RECORD'],
};

/* Lines that are allowed to contain what looks like a leak, because they are deliberate
 * synthetic fixtures. Matching these is what inflated the first survey by 2x. */
const SYNTHETIC = [/C:[\\/]{1,4}notes/i, /C:[\\/]{1,4}x[\\/]/i, /Users[\\/]{1,4}nname/i,
                   /C:[\\/]{1,4}fake/i, /test_[ab]\.js/];

/* ------------------------------------------------------------------ transformations */

/** Rewrite a dangling citation so the PROSE survives and the dead pointer does not.
 *  `exo_memory/journal/2026-08-17.md:1209` -> `the record, 2026-08-17`
 *  The comment explaining why code is the way it is is worth keeping; the path is not. */
function dedangle(body) {
  let n = 0;
  const bump = () => { n++; };
  let out = body
    /* RE-POINT, NOT PROSE -- 2026-09-06 (L038). Both of these used to rewrite a dated journal
     * citation into the words `the record, <date>`, which was correct while the journals stayed
     * private: a pointer to a file the reader does not have is worse than no pointer. Under the
     * keeper's `inheritance/` shape the reader DOES have the file, and destroying 20 live citations
     * to protect against a dangling one is the same error in the other direction -- C named it
     * before it happened.
     *
     * The LINE NUMBERS on these citations survive the move, and that was checked rather than
     * hoped: every transform in this file substitutes within a line and none adds or removes one,
     * so `inheritance/2026-08-17.md:1209` still points at line 1209.
     *
     * Already-repointed references are left alone by the negative lookbehind, so running the
     * transform twice is a no-op rather than `inheritance/inheritance/`. */
    /* `.md` IS OPTIONAL, and this is the pairing lesson arriving for the third time in two laps.
     * The first version of this rule required the extension; the LEAKS pattern beside it never did.
     * So `journal/2026-08-17` with no extension -- the form `carrier-drift.js:659` writes inside a
     * sentence -- was rewritten by nothing and refused by the scan, and the build stopped on a
     * citation the rule was written to fix. A rewrite and its scan must agree about the SHAPE they
     * are talking about, not only about the class. */
    /* THE PREFIX IS KEPT, NOT REPLACED, and the first version got this wrong in a way only the
     * output showed. Emitting a fixed `exo_memory/inheritance/...` turned a reference already
     * written inside a path -- `606\exo_memory\SELF_TRACE.md` in a memory file -- into
     * `606\exo_memory\exo_memory/inheritance/SELF_TRACE.md`. The rule was right about the class
     * and wrong about the context, which is the standard way a global rewrite damages prose. */
    .replace(/(?<!inheritance\/)`?(exo_memory[\\/])?journal[\\/](\d{4}-\d{2}-\d{2})(?:\.md)?(?::[\d-]+)?`?/g,
      (m, pre, d) => { bump();
        const ln = (m.match(/\.md(:[\d-]+)/) || [])[1] || '';
        const sep = pre ? pre.slice(-1) : '/';
        return (pre || 'exo_memory/') + 'inheritance' + sep + d + '.md' + ln; })
    /* THE `exo_memory/` PREFIX IS NOW OPTIONAL, 2026-09-06 (L037 P2). This is a defect repair, not
     * a widening for its own sake. Both rules REQUIRED the prefix, so the bare relative form a
     * document uses when it is already talking about exo_memory/ walked past the rewrite AND past
     * the matching LEAKS pattern -- silently, which is the one outcome this generator exists to
     * prevent. Measured in the generated tree before the fix: 2 in `dev/shell/install.ps1`
     * (:144, :726), 2 in the shipped BOOT.md, 5 in BUILDING.md, 2 in COMMITTEE.md.
     *
     * Same shape as the `{sysdrive}` MACHINE pattern found 2026-09-04: a real reference wearing a
     * form the pattern could not see, on a line that LOOKED handled because its prefixed
     * neighbours were. Found here because shipping install.ps1 adds two more instances of it, and
     * this lap's falsifier names exactly that -- 'a shipped file still reads a path that does not
     * exist in the generated tree'.
     *
     * `handback/` and `librarian/` join for the same reason and on the same evidence: neither
     * directory has ever shipped, so a reference to one has never resolved in a consumer tree, and
     * both appear bare in shipped prose. The lookbehind is what stops the bare form from eating a
     * longer path that merely ENDS in one of these segments. */
    .replace(/(?<![\w/.-])`?(?:exo_memory\/)?loop\/([A-Za-z0-9_.-]+)\.md(?::[\d-]+)?`?/g,
      () => { bump(); return 'a registration in this line of record'; })
    .replace(/(?<![\w/.-])`?(?:exo_memory\/)?map\/([A-Za-z0-9_.-]+)\.md(?::[\d-]+)?`?/g,
      () => { bump(); return 'a map entry in this line of record'; })
    .replace(/(?<![\w/.-])`?(?:exo_memory\/)?handback\/([A-Za-z0-9_.-]+)\.md(?::[\d-]+)?`?/g,
      () => { bump(); return 'a hand-back in this line of record'; })
    .replace(/(?<![\w/.-])`?(?:exo_memory\/)?librarian\/([A-Za-z0-9_.-]+)\.md(?::[\d-]+)?`?/g,
      () => { bump(); return 'a librarian entry in this line of record'; })
    /* SPLIT IN TWO, 2026-09-06 (L038). One rule used to send all three masters to the same prose.
     * Two of them now ship and one does not, so one rule cannot be right about all three: the two
     * that ship are RE-POINTED at their inheritance path, and `muscle_map` keeps the old prose
     * rewrite because it is still absent. */
    .replace(/(?<!inheritance[\\/])`?(exo_memory[\\/])?(SELF_TRACE|the_living_wave)\.md(?::[\d-]+)?`?/g,
      (m, pre, nm) => { bump();
        const ln = (m.match(/\.md(:[\d-]+)/) || [])[1] || '';
        const sep = pre ? pre.slice(-1) : '/';
        return (pre || 'exo_memory/') + 'inheritance' + sep + nm + '.md' + ln; })
    .replace(/`?(?:exo_memory\/)?muscle_map[A-Za-z0-9_.-]*\.md(?::[\d-]+)?`?/g,
      () => { bump(); return 'a master in this line of record'; })
    /* The bare form with no extension: `muscle_map, 2026-07-27:` inside a code comment. The
     * first pass only matched the .md form and five survived into the scan. */
    .replace(/\bmuscle_map\b(,\s*\d{4}-\d{2}-\d{2})?/g,
      (_, d) => { bump(); return d ? 'this line of record' + d : 'this line of record'; })
    /* A name from this record reads, to a stranger, as the product's name. Rendered as the
     * template it actually is, so the sentence keeps teaching the clause without handing over
     * someone else's name: "You are <a name>" fails clause 1. */
    .replace(/\bChrysos\b/g, () => { bump(); return '<a name>'; })
    /* The bare token with no extension, e.g. `SELF_TRACE` inside a sentence. Still rewritten to
     * prose rather than to a path, because a bare token in prose is not a citation and turning it
     * into one invents a pointer the author did not write. The lookbehind keeps it off the paths
     * the rules above just produced. */
    .replace(/(?<!inheritance\/)\b(?:SELF_TRACE|the_living_wave)\b(?!\.md)/g,
      () => { bump(); return 'a master in this line of record'; });
  return { body: out, n };
}

/** Neutralise identity in a DESTINATION PATH.
 *
 *  WHY A SEPARATE FUNCTION AND NOT `deidentify()`. The prose rule rewrites the handle to `the
 *  keeper` -- two words, with a space. Run over a filename that yields `user-the keeper.md`, a path
 *  with a space in it, which is a worse artefact than the one it fixed. Paths get a path-shaped
 *  replacement, and the two halves must AGREE, because a document that links to the renamed file
 *  has to arrive at the same string (see `repath()` below; `exo_memory/memory/MEMORY.md:3` is the
 *  live case, and it is an index, so getting it wrong breaks the one file whose job is pointing).
 *
 *  DELIBERATELY NARROWER THAN THE PROSE RULE: the given-name token is NOT here. No filename in this
 *  repository carries it, and a rule with no case to answer is a rule nobody can test.
 *
 *      git ls-tree -r --name-only HEAD | grep -iE 'solariz3d|zackn|trynabemlgzn|zach'
 *      -> exo_memory/memory/user-solariz3d.md          (exactly one, and it is the handle)
 */
function depath(rel) {
  return rel
    .replace(/solariz3d/gi, 'the-keeper')
    .replace(/trynabemlgzn/gi, 'the-keeper')
    .replace(/\bzackn\b/gi, 'user')
    .replace(/\bnname\b/g, 'other');
}

/** The other half of `depath()`: a REFERENCE to a renamed file, inside a shipped document.
 *
 *  Renaming `memory/user-solariz3d.md` on the way out and then letting the generic prose rule loose
 *  on `memory/MEMORY.md`'s link to it produces `[the keeper](user-the keeper.md)` -- an index
 *  pointing at a file that is not there. So filename-shaped occurrences are rewritten FIRST, with
 *  `depath()`'s own substitution, and the generic rule runs over what is left.
 *
 *  Ordered AFTER the absolute-path rewrites in `deidentify()` on purpose: `C:\Users\zackn\x.md`
 *  should become `%USERPROFILE%\x.md`, not `C:\Users\user\x.md`. */
function repath(body) {
  let n = 0;
  const TOK = '(?:solariz3d|trynabemlgzn|zackn)';
  /* The FILENAME form: a token inside something that ends in a dot-extension. */
  let out = body.replace(
    new RegExp('[A-Za-z0-9_.-]*' + TOK + '[A-Za-z0-9_.-]*\\.(?:md|js|json|jsonl|ps1|py|rs|txt)', 'gi'),
    (m) => { n++; return depath(m); });
  /* THE `[[wiki-link]]` FORM, ADDED 2026-09-06 with the memory/ cut. The deck cross-references
   * itself by CARD NAME, with no extension, so the rule above could not see it and the generic
   * prose rule got there first: `[[user-solariz3d]]` shipped as `[[user-the keeper]]` — a link with
   * a SPACE in it, pointing at nothing. Identical defect to the markdown-link one fixed hours
   * earlier in this lap, on the one surface that fix could not reach, and it had been shipping. */
  out = out.replace(new RegExp('\\[\\[([^\\]\\n]*' + TOK + '[^\\]\\n]*)\\]\\]', 'gi'),
    (m, name) => { n++; return '[[' + depath(name) + ']]'; });
  return { body: out, n };
}

/** Neutralise identity and this machine's layout. */
function deidentify(body) {
  let n = 0;
  const rep = (re, to) => { body = body.replace(re, (m) => { n++; return to; }); };
  /* FILENAMES FIRST, AND THIS LINE WAS IN THE WRONG PLACE ONCE, WHICH IS WHY IT IS COMMENTED.
   * The first version sat four lines lower, after the handle rule had already run -- so by the
   * time `repath()` looked for `user-solariz3d.md` the string was `user-the keeper.md` and there
   * was nothing left to match. The generated `memory/MEMORY.md` shipped an index entry pointing at
   * a filename with a SPACE in it: the exact artefact `depath()` exists to prevent, produced by
   * the function written to prevent it, and caught only by opening the generated index. An
   * ordering bug in a chain of rewrites is invisible from the rule and obvious from the output --
   * which is this file's own first principle (THE SCAN READS THE OUTPUT) arriving one layer down.
   *
   * Safe at the top: `repath()` requires the token to be followed by `[A-Za-z0-9_.-]*` and then a
   * dot-extension, and no path separator is in that class, so `C:\Users\zackn\x.md` cannot match
   * and still reaches the `%USERPROFILE%` rules below intact. */
  { const r = repath(body); body = r.body; n += r.n; }
  rep(/solariz3d/gi, 'the keeper');
  rep(/trynabemlgzn@gmail\.com/gi, 'the keeper');
  rep(/C:\\{1,4}Users\\{1,4}zackn/gi, '%USERPROFILE%');
  rep(/C:\/Users\/zackn/gi, '%USERPROFILE%');
  rep(/\bzackn\b/gi, 'user');
  rep(/\bzach\b/gi, 'the keeper');
  rep(/\bnname\b/g, 'other');
  rep(/C:\\{1,4}Consonance\\{1,4}lighthouse/gi, '%CONSONANCE_HOME%');
  rep(/C:\/Consonance\/lighthouse/gi, '%CONSONANCE_HOME%');
  return { body, n };
}

/** The development-machine fallbacks.
 *
 * main.rs resolves the room by trying the plain disk path, then a fallback under the keeper's
 * old OneDrive dev location. On a consumer's machine that second path is dead: it points into a
 * personal sync directory that does not exist and names the private repo on the way.
 *
 * ONLY THE STRING LITERAL IS REWRITTEN, never the surrounding expression. The format! call keeps
 * its shape and its argument count, so the output compiles by construction rather than by hope.
 * A generator that rewrites Rust structure would need to build its own output to know it worked,
 * and it does not build its own output -- see the registered gap in the module header. */
function demachine(body) {
  let n = 0;
  /* CAPTURE GROUPS EXPAND, 2026-09-06 (L038, A's attack). This helper used to be
   *
   *     const rep = (re, to) => { body = body.replace(re, () => { n++; return to; }); };
   *
   * — a CALLBACK that does not even take the match. A callback's return value is not `$1`-expanded,
   * so the rewrite ten lines below, whose replacement ends `...on $1`, wrote the two literal
   * characters `$1` where the date belongs. Generated `main.rs:404` has been shipping
   * *"the repo moved out of a personal sync directory on $1"* since `fa16075`.
   *
   * SAME MECHANISM AS THE HOSTNAME BUG CAUGHT IN THIS FILE HOURS EARLIER, ten lines from the
   * comment describing it, in a line nobody in this room wrote. Found by A running the method that
   * comment recommends — ASK FOR THE OUTPUT STRING, NOT THE VERDICT — over every rewrite in the
   * file rather than only the new ones. Every signal was green while it shipped: `OneDrive` really
   * was gone, so `scan()` passed and the build wrote the tree. A leak scan cannot see a field it
   * broke.
   *
   * THE FIX DELEGATES EXPANSION TO THE ENGINE rather than reimplementing it. Counting is what
   * forced the callback in the first place, so counting is done in a separate pass and the
   * replacement is handed to `String.replace` as a STRING, where `$1` means what every reader of
   * this file already thinks it means. Reimplementing `$1` here would be a third place for this
   * class to live. */
  const rep = (re, to) => {
    const m = body.match(re);
    if (!m) return;
    n += m.length;
    body = body.replace(re, to);
  };
  rep(/\{\}\\\\OneDrive\\\\Desktop\\\\projects\\\\lighthouse\\\\/g, '{}\\\\.consonance\\\\');

  /* ---- ADDED 2026-09-04. These three fire on main.rs's LIVE `///` doc comments, which shipped
   * unrewritten for as long as `isFixture` routed every .rs file to the token-only transform.
   * All three are prose inside a comment, so no expression shape is at risk; the surrounding
   * sentence is kept readable rather than merely scrubbed, because a mangled sentence is how a
   * reader learns to stop reading the comments. */

  /* THE PATTERN ABOVE IT NEVER FIRED, and that is the finding rather than a tidy-up. It required
   * a single space between the date and `because`, but the sentence WRAPS in main.rs:404-405 --
   * "...on 2026-07-28\n/// because .git was inside the sync scope..." -- so the regex could not
   * match across the doc-comment continuation and the guard had been inert since it was written.
   * A rule that cannot fire is indistinguishable from no rule, and this one read as coverage.
   * Replaced with a single-line form that only has to reach the leaking token. */
  rep(/the repo moved out of OneDrive on (\d{4}-\d{2}-\d{2})/g,
      'the repo moved out of a personal sync directory on $1');

  /* main.rs:363. The sentence names two historical repo locations and the second is the keeper's
   * OneDrive path; the literal is replaced in place so "two absolute literals" stays true. */
  rep(/\{home\}\\OneDrive\\Desktop\\projects\\lighthouse\\/g, '{home}\\<sync-dir>\\projects\\lighthouse\\');

  /* THE FIRST of those "two absolute literals", which shipped for as long as this rewrite named
   * only the second. Generated `main.rs:362` carries `{sysdrive}\Consonance\lighthouse\` — the
   * private tree's path with the drive already templated out, which is precisely why the two
   * literal `C:\Consonance\lighthouse` patterns could not see it. Rewritten to the same
   * placeholder `deidentify()` uses for the untemplated form, so the two halves of one sentence
   * now read consistently instead of one being scrubbed and one surviving. */
  rep(/\{sysdrive\}\\{1,4}Consonance\\{1,4}lighthouse\\{0,4}/g, '%CONSONANCE_HOME%\\');

  /* main.rs:5351. Two disclosures on one line: the private tree's own absolute path, and three of
   * this record's map filenames WITH their byte sizes -- which is the record leaking through a
   * MACHINE-class line, so removing the path alone would not have been enough. */
  rep(/`C:\\Consonance\\lighthouse\\exo_memory\\map\\` \(A\.md [\d,]+; B\.md [\d,]+; M\.md [\d,]+\)/g,
      '`<room>\\exo_memory\\map\\`');
  return { body, n };
}

/** Structured config, where a blanket prose replace is actively dangerous.
 *
 * THE DEFECT THIS EXISTS FOR, found by building the generated tree and not by any scan:
 * tauri.conf.json carries "identifier": "com.solariz3d.consonance". The generic identity rule
 * rewrote it to "com.the keeper.consonance" -- A SPACE IN A BUNDLE IDENTIFIER. The leak was
 * genuinely removed and the product was broken by removing it; the build script reported
 * TAURI_ANDROID_PACKAGE_NAME_PREFIX=com_the keeper and the whole build failed.
 *
 * That is the 2026-08-15 shape exactly -- finding real, fix catastrophic, every instrument
 * silent -- and the lesson is the same: a transformation written for prose must never be let
 * loose on a field something else has to parse. Structured files get NAMED replacements whose
 * output is checked for shape, and the generic rules are skipped entirely.
 */
function destructure(body) {
  let n = 0;
  const rep = (from, to) => { if (body.includes(from)) { body = body.split(from).join(to); n++; } };
  rep('"com.solariz3d.consonance"', '"com.consonance.app"');
  return { body, n };
}

/** A reverse-DNS bundle identifier: dot-separated, no whitespace. Checked rather than assumed,
 *  because the failure it guards produced a plausible-looking string that broke the build. */
function validIdentifier(body) {
  const m = body.match(/"identifier"\s*:\s*"([^"]*)"/);
  if (!m) return null;
  return /^[A-Za-z0-9][A-Za-z0-9-]*(\.[A-Za-z0-9][A-Za-z0-9-]*)+$/.test(m[1]) ? null : m[1];
}

/** Is this file's content DATA that an assertion keys on, rather than prose a reader reads?
 *
 * Test files and the Rust #[cfg(test)] block are fixtures. Rewriting a fixture either breaks the
 * assertion or -- worse -- leaves it green over data that no longer means what it meant. Three
 * shipped suites went green on rewritten fixtures before this existed. */
function isFixture(rel) {
  return fixtureKind(rel) !== null;
}

/* WHY a file is a fixture, which turns out to matter more than WHETHER (2026-09-04).
 *
 *   'whole'  the PATH says the file is a test artifact end to end: `*.test.js`, or anything
 *            under a `tests/` directory. Every line in it is assertion data.
 *   'rust'   only the EXTENSION says so. `.rs` was added to this predicate to protect the
 *            `#[cfg(test)]` blocks inside main.rs -- but main.rs is 10,153 lines carrying FORTY
 *            interleaved `#[cfg(test)]` attributes and no single `mod tests`, so the file is
 *            overwhelmingly LIVE CODE that happens to contain fixtures.
 *
 * The distinction exists because scan() waives reference classes for fixtures, and the argument
 * for waiving them ("this is the data the assertion keys on") is true of the first kind and false
 * of the second. It is not an abstraction added ahead of need: narrowing the waiver for BOTH kinds
 * was tried first and mutation-measured at 10 leaks in three genuine test fixtures --
 * `lap-row.test.js` asserting on `normPath('C:\Consonance\lighthouse\...')`,
 * `memory-sweep.test.js` on an encoded-cwd fixture name containing `OneDrive`,
 * `second-vantage.test.js` on a heads map keyed `c:/consonance/lighthouse`. Rewriting any of
 * those breaks its assertion, which is the 2026-08-23 damage returning by a different door. */
function fixtureKind(rel) {
  if (/\.test\.js$/.test(rel) || /(^|\/)tests?\//.test(rel)) return 'whole';
  if (/\.rs$/.test(rel)) return 'rust';
  return null;
}

/** Name tokens only. Leaves every path shape exactly as written, so a fixture keeps exercising
 *  the branch it was written for. Used for fixtures; prose gets the fuller `deidentify`. */
function deidentifyTokens(body) {
  let n = 0;
  const rep = (re, to) => { body = body.replace(re, () => { n++; return to; }); };
  { const r = repath(body); body = r.body; n += r.n; }   // filenames first — see deidentify()
  rep(/solariz3d/gi, 'the keeper');
  rep(/trynabemlgzn@gmail\.com/gi, 'the keeper');
  rep(/\bzackn\b/gi, 'user');
  /* nname is the desktop machine's OS user and appears in 9 shipped files as a foreign-path
   * fixture. Same treatment: the token goes, the path shape stays. */
  rep(/\bnname\b/g, 'other');
  rep(/\bzach\b/gi, 'the keeper');
  return { body, n };
}

/** Shape-preserving value substitution for the keeper's coordinates. Runs on prose AND fixtures,
 *  because it changes only the value: a float stays a float, a string stays a string, and every
 *  assertion that keyed on the old value keys on the new one consistently within its file. */
function decoordinate(body) {
  let n = 0;
  const rep = (re, to) => { body = body.replace(re, () => { n++; return to; }); };
  rep(/50\.4452/g, '12.3456');
  rep(/-104\.6189/g, '-65.4321');
  rep(/104\.6189/g, '65.4321');
  rep(/Regina,\s*Saskatchewan/g, 'Example City');
  rep(/America\/Regina/g, 'America/New_York');
  /* THE HOSTNAME, SUBSTITUTED RATHER THAN EXEMPTED, and placed in this function because it is the
   * one transform that runs on prose AND fixtures both. A hostname is a VALUE, like a latitude:
   * swapping a value for a value changes nothing structural, and the fixture that needs it parses
   * `schtasks /fo LIST /v` output where the field REPEATS -- the assertion is about the repetition
   * and never about the value, which was checked before this line was written, not after. */
  /* NOT VIA `rep()`, AND THIS COST A REAL BUG BEFORE IT COST A COMMENT. `rep()` passes a CALLBACK
   * to `String.replace`, and a callback's return value is NOT subject to `$1` expansion -- so the
   * first version of these two lines replaced the whole match with the literal seven characters
   * `$1EXAMPLE-HOST`. The leak was genuinely gone, the scan was green, the build wrote the tree,
   * and the shipped fixture read `$1EXAMPLE-HOST` where a parseable `HostName:` line belonged.
   *
   * That is the `destructure()` lesson exactly -- finding real, fix catastrophic, every instrument
   * silent -- and it was caught by asking what `transform()` PRODUCES rather than by asking what
   * `scan()` says about it. A leak scan cannot see a field it broke; only the output can.
   *
   * These keep the capture group and count their own hits, so a group-preserving replacement is
   * written as one rather than borrowed from a helper built for whole-token swaps. */
  { const g = (re) => { body = body.replace(re, (m, pre) => { n++; return pre + 'EXAMPLE-HOST'; }); };
    g(/(HostName:\s*)[A-Za-z0-9][A-Za-z0-9._-]*/g);
    g(/(COMPUTERNAME\s*[=:]\s*)[A-Za-z0-9][A-Za-z0-9._-]*/gi); }
  return { body, n };
}

function transform(body, kind) {
  if (kind === 'config') {
    const d = destructure(body);
    return { body: d.body, dangling: 0, identity: d.n, machine: 0 };
  }
  if (kind === 'fixture') {
    /* TOKEN-level identity only: remove the name, never restructure the path. A handle in a
     * fixture is still a leak; the SHAPE of a fixture is the test. Coordinates are substituted
     * rather than exempted, because swapping a float for a float changes nothing structural. */
    const b = deidentifyTokens(body);
    const c = decoordinate(b.body);
    /* demachine() JOINED THE FIXTURE BRANCH ON 2026-09-04, and it is the half of the fixture-scope
     * repair that removes rather than refuses. Narrowing the scan's waiver (see scan()) makes a
     * MACHINE hit in a Rust file FAIL the build; it does not take the path out. `demachine` is the
     * one transform safe to run here, because it is a list of NAMED literal replacements rather
     * than a generic rewrite -- which is the destructure() lesson applied one file over. Its count
     * is reported as `machine` so a fixture that changed is visible in the run rather than silent;
     * measured at this commit, it fires on main.rs only. */
    const d = demachine(c.body);
    return { body: d.body, dangling: 0, identity: b.n + c.n, machine: d.n, fixture: true };
  }
  const a = dedangle(body);
  const b = deidentify(a.body);
  const c = demachine(b.body);
  const d = decoordinate(c.body);
  return { body: d.body, dangling: a.n, identity: b.n + d.n, machine: c.n };
}

/** SEED.md's one sentence for a stranger (L038 item 4).
 *
 *  SEED tells a new user *"right now the record is nearly empty — that is not a deficit, it is a
 *  beginning."* Under the keeper's `inheritance/` shape that sentence is half true and the false
 *  half is the dangerous one: `journal/` IS empty, and the tree is not. A reader who meets 31
 *  dated entries after being told the record is nearly empty concludes one of two wrong things —
 *  that the entries are theirs, or that the document is lying.
 *
 *  WHY THIS IS A GENERATOR TRANSFORM AND NOT AN EDIT TO SEED.md, which was the obvious move and is
 *  wrong: the private tree's `journal/` is NOT empty, so writing the sentence into the master would
 *  make the shipped brief say something false about the tree it lives in. The sentence is true only
 *  of the generated tree, so it belongs to the thing that generates it. Same reasoning as
 *  `gen-brief.ps1`'s anchored transformations, and the same discipline: ANCHOR ON THE EXACT
 *  SENTENCE AND REFUSE IF IT MOVED. A transform that silently no-ops when its anchor drifts is the
 *  inert-guard failure this record has now found twice in this file alone.
 *
 *  One sentence, deliberately. The packet said so, and the reason survives the instruction: a
 *  paragraph here would be the room explaining itself at the moment a stranger is trying to start. */
const SEED_ANCHOR = 'right now the record is nearly empty — that is not a deficit, it is a beginning.';
const SEED_SENTENCE = ' Your journal is empty; the keeper\'s is in `exo_memory/inheritance/`, kept under that name '
  + 'because it is someone else\'s nights and not your memory.';

function reseed(body, rel) {
  if (!/(^|\/)SEED\.md$/.test(rel)) return { body, n: 0, missing: false };
  if (!body.includes(SEED_ANCHOR)) return { body, n: 0, missing: true };
  return { body: body.split(SEED_ANCHOR).join(SEED_ANCHOR + SEED_SENTENCE), n: 1, missing: false };
}

/** The sync directory, as a TOKEN rather than as four hand-written sentences.
 *
 *  WHY THIS ARRIVED WITH THE INHERITANCE AND NOT BEFORE. `demachine()` carries three named
 *  rewrites for the exact OneDrive sentences that occur in `main.rs`. That was enough while the
 *  only shipped prose was the briefs. The keeper's `inheritance/` answer ships 31 dated journals
 *  and 13 memory files written over four months by people describing where their files were, and
 *  they name the sync directory in seven places no named rewrite anticipated -- in a path, in a
 *  table cell, and mid-sentence. Enumerating sentences does not scale past the first author.
 *
 *  `<sync-dir>` is the placeholder `demachine()` already uses, so the tree reads consistently
 *  rather than one half being scrubbed and one half rewritten -- which is precisely the failure
 *  that hid the `{sysdrive}` residual on 2026-09-04.
 *
 *  TWO EXEMPTIONS, BOTH LOAD-BEARING:
 *
 *    - FIXTURES. A test that asserts on a OneDrive path is testing the detection of one. Rewriting
 *      it is the 2026-08-23 damage exactly, and MACHINE is already waived for whole-file fixtures
 *      in `scan()`, so nothing refuses either.
 *    - ALLOW's MACHINE holders. `portable-paths.js` exists to FIND `OneDrive` in source and holds
 *      the literal in its detector. A blanket rewrite would ship a consumer whose path ratchet is
 *      silently blind to the one token it was built for -- a guard that reads as passing because
 *      it can no longer see. That is the worst outcome available here and it is one regex away.
 *
 *  It lives in `build()` rather than in `transform()` because it needs the destination path for
 *  the second exemption, and `transform(body, kind)` has none. Changing that signature would
 *  change two suites that call it directly for reasons unrelated to this. */
function desync(body, rel, kind) {
  if (kind === 'fixture') return { body, n: 0 };
  if ((ALLOW[rel] || []).includes('MACHINE')) return { body, n: 0 };
  let n = 0;
  const out = body.replace(/OneDrive/g, () => { n++; return '<sync-dir>'; });
  return { body: out, n };
}

/** `memory/MEMORY.md` is an INDEX, and an index of files that are not there is worse than none.
 *
 *  Six of the twelve cards it lists are withheld from the consumer tree by the keeper's 2026-09-06
 *  cut. Three ways to handle that, and two of them are wrong:
 *
 *    - EDIT THE PRIVATE FILE. Wrong for the reason the SEED sentence is a transform and not an
 *      edit: the private tree still HAS those cards, so an index that omits them is false where it
 *      lives. Same shape, same lap, second instance.
 *    - HAND-MAINTAIN A SECOND INDEX. Wrong because the cut will move again, and a hand-kept list is
 *      the thing `dream-gate.test.js`'s own header refuses: it can only ever check what someone
 *      remembered to add.
 *    - FILTER IT AGAINST WHAT ACTUALLY SHIPPED. This. The index cannot dangle by construction,
 *      because the thing it is derived from is the staging set rather than anyone's memory of it.
 *
 *  The DESCRIPTIONS are kept, which is the whole reason this filters rather than regenerates from
 *  filenames: someone wrote a useful line about each card and a generated list would throw all of
 *  them away to avoid keeping one stale.
 *
 *  IT REFUSES RATHER THAN NO-OPPING, like `reseed()`. An index whose link syntax has changed
 *  produces zero matches, and a filter that silently keeps everything looks exactly like a filter
 *  that had nothing to remove. */
function reindex(body, rel, shipped) {
  if (!/(^|\/)MEMORY\.md$/.test(rel)) return { body, dropped: 0, missing: false };
  const LINK = /^\s*[-*]\s*\[[^\]]*\]\(([A-Za-z0-9_.-]+\.md)\)/;
  const lines = body.split('\n');
  const linked = lines.filter((l) => LINK.test(l)).length;
  if (!linked) return { body, dropped: 0, missing: true };
  let dropped = 0;
  const kept = lines.filter((l) => {
    const m = l.match(LINK);
    if (!m) return true;
    if (shipped.has(m[1])) return true;
    dropped++;
    return false;
  });
  return { body: kept.join('\n'), dropped, missing: false };
}

/** `[[wiki-links]]` — the surface the cut broke, and the one no class in this file could see.
 *
 *  FOUND BY OPENING A SHIPPED CARD AFTER THE CUT, not by any instrument. The deck cross-references
 *  itself with `[[name]]`, which is neither a path nor a filename, so:
 *
 *    - `dedangle()` never matched it (no extension, no directory);
 *    - `repath()` never matched it (its pattern requires a dot-extension);
 *    - the exclusion's dangling-debt check never matched `[[user-the keeper]]`, because by the time
 *      it looks, the generic prose rule has already rewritten the handle inside the brackets;
 *    - and `scan()` has no class for it at all.
 *
 *  Measured in the generated tree the moment the keeper's cut landed: **14 dangling `[[links]]`
 *  across 4 targets.** Nine were created by the cut. FIVE PRE-DATE IT and are the wiki form of the
 *  markdown-link defect fixed earlier this lap — `[[user-solariz3d]]` became `[[user-the keeper]]`,
 *  a link with a space in it, pointing at nothing, and it had been shipping.
 *
 *  TWO RULES, BECAUSE THEY ARE TWO QUESTIONS. `repath()` now covers the bracket form, so a link to a
 *  RENAMED card lands on the renamed file. This function answers the other one: does the target
 *  ship at all? If it does not, the LINK SYNTAX is dropped and the words are kept — the same trade
 *  `dedangle()` makes everywhere else, because a dead pointer reads as authoritative and resolves to
 *  nothing, while the sentence around it is usually still worth reading.
 *
 *  THE RESOLUTION SET IS THE STAGING SET, never a list. A link is kept because the file is actually
 *  there, so this cannot rot the way a hand-kept allow-list of card names would — and the next cut,
 *  whatever it drops, is handled without anyone editing this function. */
function dewiki(body, rel, shipped) {
  if (!/\.md$/.test(rel)) return { body, n: 0 };
  const LINK = /\[\[([^\]\n]+)\]\]/g;
  let n = 0;

  /* A LIST ITEM WHOSE ONLY LINK IS GONE LOSES THE WHOLE ITEM, and this case was not in the first
   * version because it was not in the data yet. Every dangling link the 03:13 cut produced sat in a
   * trailing `See …` run, where removing the reference and its separator closes the sentence
   * cleanly. The 03:56 one-master change created a different shape:
   *
   *     - `no-floor-no-ceiling —caught-by→` [[lighthouse-dive-buddy-reframe]] — the residual costume
   *
   * a TYPED EDGE, where the link is the object of the row rather than an aside. Strip the link and
   * the row reads `—caught-by→` — the residual costume`: an edge naming no target, which is worse
   * than an absent row because it asserts a relationship and then withholds the other end.
   *
   * Measured before choosing the rule rather than after: across both shipped card directories,
   * exactly ONE list item loses its only link. A rule that drops a list item with no surviving link
   * therefore removes that row and touches nothing else — the narrowest rule that covers the case,
   * and one whose blast radius was counted rather than assumed. */
  const kept = [];
  for (const line of body.split('\n')) {
    const links = [...line.matchAll(LINK)].map((m) => m[1]);
    if (links.length && /^\s*[-*]\s/.test(line)
        && links.some((x) => !shipped.has(x)) && !links.some((x) => shipped.has(x))) {
      n += links.length;
      continue;
    }
    kept.push(line);
  }
  let out = kept.join('\n');

  const MARK = '';
  const before = n;
  out = out.replace(LINK, (m, name) => {
    if (shipped.has(name)) return m;
    n++;
    return MARK;
  });
  if (n === before && n === 0) return { body: out, n };

  /* THE SEPARATOR HAS TO GO WITH IT, and the first version proved why by not doing it. Replacing
   * the link with its bare NAME left `...includes the other. user-the-keeper signal-and-606-night
   * With him...` — two slugs adrift in a sentence, which reads as corruption rather than as an
   * absent reference. The remaining sites are all trailing `See …` / `Links: …` runs, so the
   * reference and its separator come out together and the sentence closes over the gap. */
  out = out
    .replace(new RegExp('\\s*,\\s*' + MARK, 'g'), '')      // ", [[x]]" mid-list
    .replace(new RegExp(MARK + '\\s*,\\s*', 'g'), '')      // "[[x]], " leading a list
    .replace(new RegExp('\\s+and\\s+' + MARK, 'g'), '')    // " and [[x]]"
    .replace(new RegExp('\\s*' + MARK, 'g'), '')           // bare, space-separated
    .replace(new RegExp(MARK, 'g'), '')
    /* THE STUB RULE IS KEYED ON THE SHAPE, NOT ON A LIST OF LABELS, and the first version was not.
     * It named `See` and `Links:` and left `Fuller record:.` standing in a shipped card. A label
     * whose list is now empty is the same defect one word smaller, and enumerating labels is how
     * you keep finding the next one — the same wardrobe problem this room names everywhere else.
     * A colon immediately followed by a full stop does not occur in prose that was not just
     * emptied, so the clause it heads goes with it. */
    .replace(/(?:^|(?<=[.!?]\s))[^.!?\n]{0,40}:\s*\.\s*/gm, '')
    .replace(/\bSee\s+and\s+/g, 'See ')
    .replace(/[ \t]{2,}/g, ' ')
    .replace(/[ \t]+$/gm, '');
  /* A TRANSFORM MUST NOT CHANGE WHETHER A FILE ENDS IN A NEWLINE, and this one did. When the last
   * thing in a card was its see-also, the stub cleanup swallowed the clause AND the trailing newline
   * with it, so a shipped card ended mid-byte — invisible to every class in this file, and exactly
   * the kind of thing that surfaces later as a diff nobody can explain. A test sweeps the whole
   * produced tree for the general case, because this will not be the last rule that trims an end. */
  if (/\n$/.test(body) && !/\n$/.test(out)) out += '\n';
  return { body: out, n };
}

/* ------------------------------------------------------------------ the scan */

function scan(body, rel) {
  const found = [];
  const lines = body.split('\n');
  /* A fixture legitimately contains the paths it tests. Exempt from those two classes -- never
   * from IDENTITY, RECORD, PROSE or BROKEN, because a canary is an exemption from failing and
   * never from classification (2026-08-17). */
  /* TWO REFERENCE classes are exempt in a fixture; four classes never are.
   *
   * DANGLING and RECORD name a FILE a consumer does not have. In prose that is a dead pointer
   * worth rewriting; in a fixture it is the data the assertion keys on -- corrections-gate
   * literally tests that it guards muscle_map.md -- and a filename discloses nothing about
   * anyone. So they are REPORTED as unportable rather than refused.
   *
   * IDENTITY, PROSE and BROKEN still fire everywhere. A handle in a fixture is a handle; a
   * corrupted structured field in a fixture is still corrupt. A canary is an exemption from
   * FAILING, never from CLASSIFICATION (2026-08-17).
   *
   * MACHINE LEFT THE 'rust' LIST ON 2026-09-04, and the reason is the whole of the fixture-scope
   * finding. `isFixture` keyed on /\.rs$/, so it classified the ENTIRE 10,153-line main.rs as a
   * fixture. Three MACHINE hits then shipped in LIVE `///` doc comments -- two naming the
   * keeper's OneDrive path, one naming `C:\Consonance\lighthouse\exo_memory\map\` together with
   * three of this record's map filenames and their byte sizes -- refused by nothing, reported by
   * nothing (build()'s `unportable` regex matched DANGLING and RECORD only). Not refused, not
   * reported: silent, which is the one outcome this generator exists to prevent.
   *
   * WHY THE WAIVER NARROWED BY FIXTURE KIND, and not by class and not by region.
   *
   *   NOT BY REGION, which is what `P-GEN-RED-FIRST_2026-09-03.md` proposed. Measured before
   *   choosing: main.rs carries FORTY `#[cfg(test)]` attributes, interleaved, and no `mod tests` --
   *
   *       grep -c '#\[cfg(test)\]' consonance/src-tauri/src/main.rs      -> 40
   *       grep -c '^\s*mod tests\b' consonance/src-tauri/src/main.rs     -> 0
   *
   *   so region-scoping means a forty-site brace-extent model of Rust, and the fixture-scope
   *   test's own docstring says a model is the thing it exists to avoid trusting.
   *
   *   NOT BY CLASS EITHER, and this was tried and MEASURED WRONG rather than reasoned away.
   *   Dropping MACHINE for every fixture looked principled -- a filename discloses nothing, an
   *   absolute path does -- and the mutation run returned 10 leaks in three real test fixtures
   *   (`lap-row.test.js` :96, `memory-sweep.test.js` x7, `second-vantage.test.js` :262,:296),
   *   every one an assertion literal that a rewrite would break. The prediction was that nothing
   *   would break; the instrument said three files would.
   *
   * So the cut is fixtureKind: a file that is a fixture BY PATH keeps the full waiver, because
   * every line in it really is assertion data; a file that is a fixture only BY EXTENSION keeps
   * DANGLING and RECORD (its `#[cfg(test)]` blocks do cite record filenames) and loses MACHINE,
   * because no Rust test here asserts on a real path -- they use synthetic literals like
   * `C:\Consonance\instances` and `C:\Consonance\data`, which match no MACHINE pattern. If a real
   * machine path ever appears in live Rust, it SHOULD fail, and now it does. */
  const kind = fixtureKind(rel);
  const allowed = (ALLOW[rel] || []).concat(
    kind === 'whole' ? ['DANGLING', 'MACHINE', 'RECORD'] : kind === 'rust' ? ['DANGLING', 'RECORD'] : []);
  for (const { cls, pat, why } of LEAKS) {
    if (allowed.includes(cls)) continue;
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (SYNTHETIC.some((s) => s.test(line))) continue;
      const re = new RegExp(pat.source, pat.flags.replace('g', '') + 'g');
      const m = line.match(re);
      if (m) found.push({ cls, why, rel, line: i + 1, text: line.trim().slice(0, 90), n: m.length });
    }
  }

  /* A leak scan cannot see a field it BROKE, and breaking one is exactly what the identity rule
   * did to the bundle identifier. So the shape checks live here, in the one place that answers
   * "what is wrong with this output file" -- not in build(), where the first version put them
   * and where no test could reach them. A mutation that disabled the check failed nothing.
   *
   * Scoped to tauri.conf.json: capabilities/*.json carry their own "identifier" ("default"),
   * a capability name that is legitimately not reverse-DNS. A check that fires on the wrong
   * file teaches people to ignore it. */
  if (/tauri\.conf\.json$/.test(rel)) {
    const bad = validIdentifier(body);
    if (bad) {
      found.push({ cls: 'BROKEN', why: 'a transformation corrupted a structured field',
        rel, line: 0, text: 'identifier is not reverse-DNS: "' + bad + '"', n: 1 });
    }
  }

  /* THE DESTINATION PATH IS SCANNED TOO (2026-09-06, L038 item 3).
   *
   * `scan(t.body, f.to)` has always been the call, and `rel` was used for fixture classification
   * and the ALLOW lookup and nothing else -- so a handle written on the OUTSIDE of a file was
   * invisible to every class in this tool. `depath()` in `collect()` is the rewrite; this is the
   * proof, and the two landed together because either alone is the failure this file keeps naming:
   * a rewrite with no scan cannot be shown to have fired, and a scan with no rewrite refuses the
   * build over something nobody can fix in this pass.
   *
   * ONLY THE IDENTITY-SHAPED CLASSES RUN OVER A PATH, and the exclusions are not laziness:
   *
   *   - DANGLING and RECORD name FILES, so running them over a filename would flag every file for
   *     being itself -- `exo_memory/inheritance/SELF_TRACE.md` is the shipped destination and would
   *     report as a leak at its own address;
   *   - PROSE is a sentence class and cannot occur in a path;
   *   - IDENTITY, MACHINE and HOSTNAME are exactly the classes that CAN, and a path is the one
   *     place they cannot be waived for being a fixture: `foo/zackn.test.js` is not test data.
   *
   * Reported with `line: 0`, which the report already renders, because there is no line -- the
   * finding is the name. */
  for (const { cls, pat, why } of LEAKS) {
    if (!['IDENTITY', 'MACHINE', 'HOSTNAME'].includes(cls)) continue;
    if (SYNTHETIC.some((sy) => sy.test(rel))) continue;
    const re = new RegExp(pat.source, pat.flags.replace('g', '') + 'g');
    const m = rel.match(re);
    if (m) found.push({ cls, why: why + ' — IN THE DESTINATION PATH, not in the file', rel,
      line: 0, text: rel, n: m.length });
  }
  return found;
}

/* ------------------------------------------------------------------ collection */

/* THE DESTINATION IS SANITISED HERE, NOT ONLY THE CONTENT (2026-09-06, L038 item 3).
 *
 * `exo_memory/memory/user-solariz3d.md` is the one path in this repository that carries the
 * keeper's handle in its NAME, and until this line it shipped to a public tree with the handle
 * intact -- past every leak class, silently, because the scan opened files and never read the
 * label on them. A sanitiser that reads only what is inside a file cannot see a name written on
 * the outside of it. `depath()` rewrites the destination; `scan()` then reads `f.to` as well as
 * the body, so the rewrite is PROVEN by the same instrument that proves everything else rather
 * than trusted.
 *
 * WHAT ELSE THIS CATCHES, since one file is a thin case for a mechanism -- measured, and the
 * honest answer is that today it is one file and the mechanism is still right:
 *
 *     git ls-tree -r --name-only HEAD | grep -iE 'solariz3d|zackn|trynabemlgzn'   ->  1
 *
 *   - the STANDING case is the `dir` rules, which take their destination from whatever is on disk:
 *     every future file under `exo_memory/memory/`, `cards/`, `record/`, `consonance/tools/` and
 *     the rest gets its name from an author who was not thinking about this tool, and there are 9
 *     such rules producing most of the tree;
 *   - the ASYMMETRY is the argument: content is transformed and then scanned, so a rewrite that
 *     misfires is caught. The destination was transformed by nothing and scanned by nothing, so it
 *     had no guard at either end. This closes both ends at once, which is the pairing this file
 *     already insists on everywhere else.
 */
function collect() {
  const out = [];
  for (const entry of MANIFEST) {
    if (entry.from) {
      out.push({ from: entry.from, to: depath(entry.to), kind: entry.kind });
      continue;
    }
    const abs = path.join(REPO, entry.dir);
    let names = [];
    try { names = fs.readdirSync(abs); } catch (_) {
      out.push({ from: entry.dir, to: entry.to, kind: entry.kind, missing: true });
      continue;
    }
    for (const nm of names.sort()) {
      const p = path.join(abs, nm);
      try { if (!fs.statSync(p).isFile()) continue; } catch (_) { continue; }
      if (!entry.match.test(nm)) continue;
      out.push({ from: entry.dir + '/' + nm, to: depath(entry.to + '/' + nm), kind: entry.kind });
    }
  }
  return out;
}

/* ------------------------------------------------------------------ build */

function build(outDir, opts) {
  const files = collect();
  const id = commitIdentity();
  const gen = generatedFiles(id);
  const staging = fs.mkdtempSync(path.join(os.tmpdir(), 'gen-consumer-'));
  const report = { staged: 0, excluded: [], missing: [], dangling: 0, identity: 0, machine: 0, fixtures: 0, unportable: [], leaks: [], excludeDrift: [], seedDrift: [], seeded: [], orphaned: [], generated: [], genDrift: [], unresolved: [], unclassified: [], anchorDrift: [], reseeded: 0, reindexed: 0, dewikied: 0, columns: null, commit: id, staging };

  /* THE EXCLUDE LIST IS CHECKED AGAINST THE MANIFEST, IN BOTH DIRECTIONS. An exclusion no rule can
   * reach withholds nothing while reading as though it does; a `UNREACHABLE:` declaration that has
   * become reachable is a stale note on a guard that is now load-bearing. Either way the list has
   * drifted from the manifest it describes, and the list is the thing a person reads to learn what
   * was withheld. Found 2026-09-04 with exactly one dead entry of six. */
  {
    const reachable = new Set(files.map((f) => f.from));
    for (const [rel, why] of Object.entries(EXCLUDE)) {
      const declared = /^UNREACHABLE:/.test(why);
      if (!reachable.has(rel) && !declared) {
        report.excludeDrift.push({ rel, why: 'no manifest rule reaches it; it withholds nothing. Delete it, or prefix its reason with UNREACHABLE: to keep it as a standing guard.' });
      } else if (reachable.has(rel) && declared) {
        report.excludeDrift.push({ rel, why: 'declared UNREACHABLE but a manifest rule now reaches it; the declaration is stale and the entry is live. Drop the prefix.' });
      }
    }
  }

  /* THE SEED LIST IS CHECKED AGAINST THE MANIFEST TOO, and this guard replaced a worse one.
   *
   * The first version checked `fs.existsSync` on the private file inside the seeding branch, on the
   * reasoning that a seed must close a gap and never COVER a manifest error. Its test then failed,
   * and the test was right: for a `dir` rule that check is unreachable by construction. `collect()`
   * enumerates the directory, so a private file that disappears does not become a NAMED-but-absent
   * entry — it simply stops being produced, and the existence check inside the loop never runs for
   * it. The guard could only have fired on a race between collect() and the read.
   *
   * The detectable state is the one that matters anyway: A SEED NO MANIFEST RULE REACHES. That
   * covers the vanished file (the dir rule stops producing it, so its seed goes unreached), a typo
   * in a seed key, and a manifest edit that drops the rule — all as one refusal, and the same
   * two-way shape the EXCLUDE check above already uses. A seed that substitutes nothing reads
   * exactly like one that is protecting something, which is the failure this whole file is built
   * around. */
  {
    const reachable = new Set(files.map((f) => f.from));
    for (const rel of Object.keys(SEEDED)) {
      if (!reachable.has(rel)) {
        report.seedDrift.push({ rel, why: 'a seed is declared for this path and no manifest rule reaches it, so it substitutes nothing. Either the rule was dropped, the key is a typo, or the private file is gone — in every case the seed is not protecting what it claims to.' });
      }
    }
  }

  /* What `memory/` actually ships, by BASENAME, because that is how its index links. Computed from
   * the same two structures the loop below obeys, so the index and the tree cannot disagree. */
  const shippedMemory = new Set(files
    .filter((f) => f.to.startsWith('exo_memory/memory/') && !EXCLUDE[f.from])
    .map((f) => f.to.slice('exo_memory/memory/'.length)));

  /* Card NAMES (no extension), across both directories the deck cross-references — `cards/` and
   * `memory/` link into each other, so a set built from one of them alone would drop live links. */
  const shippedCards = new Set(files
    .filter((f) => /^exo_memory\/(cards|memory)\/.+\.md$/.test(f.to) && !EXCLUDE[f.from])
    .map((f) => path.basename(f.to, '.md')));
  /* On the report so it can be asserted DIRECTLY. Narrowing this set to cards/ alone is an
   * EQUIVALENT mutant on today's data — no shipped card currently links to a memory-only card, so
   * the output is byte-identical either way and no output-level test can tell them apart. The set
   * is still wrong when narrowed, and it becomes visibly wrong the first time someone links to
   * frozen-is-not-dead. Pinning the set is how a guard covers a case the data does not yet contain. */
  report.linkTargets = [...shippedCards].sort();

  for (const f of files) {
    if (EXCLUDE[f.from]) { report.excluded.push({ rel: f.from, why: EXCLUDE[f.from] }); continue; }
    const src = path.join(REPO, f.from);

    /* Binary files are copied byte-for-byte. Reading a .png as utf8 and writing it back
     * corrupts it silently -- the file exists, has a plausible size, and is not an image. */
    if (f.kind === 'binary') {
      if (!fs.existsSync(src)) { report.missing.push(f.from); continue; }
      const destB = path.join(staging, f.to);
      fs.mkdirSync(path.dirname(destB), { recursive: true });
      fs.copyFileSync(src, destB);
      report.staged++;
      continue;
    }

    /* A SEEDED file's private bytes are never read — not opened, not transformed, not scanned from
     * disk. What guards against a seed COVERING a manifest error is not an existence check here
     * (see the seed-drift block above: for a `dir` rule the file's disappearance makes the seed
     * unreached, which is the detectable state); it is that the seed must be reached by a rule at
     * all. */
    let body;
    if (SEEDED[f.from]) {
      body = SEEDED[f.from];
      report.seeded.push(f.from);
    } else {
      try { body = fs.readFileSync(src, 'utf8'); }
      catch (_) { report.missing.push(f.from); continue; }
    }

    /* The path decides, not the manifest entry: a directory rule cannot know which of its files
     * are tests, and getting this wrong silently corrupts data an assertion depends on. */
    const kind = isFixture(f.to) ? 'fixture' : f.kind;
    const t = transform(body, kind);
    { const ds = desync(t.body, f.to, kind); t.body = ds.body; t.machine += ds.n; report.machine += ds.n; }
    { const ri = reindex(t.body, f.to, shippedMemory);
      if (ri.missing) report.anchorDrift.push({ rel: f.to, why: 'MEMORY.md contains no parseable `- [title](file.md)` links, so the index filter matched nothing and kept everything. A filter that silently keeps everything looks exactly like one that had nothing to remove — re-anchor it or drop it.' });
      t.body = ri.body; report.reindexed += ri.dropped; }
    { const dw = dewiki(t.body, f.to, shippedCards); t.body = dw.body; report.dewikied += dw.n; }
    { const rs = reseed(t.body, f.to);
      if (rs.missing) report.anchorDrift.push({ rel: f.to, why: 'SEED.md no longer contains the sentence this generator anchors its one added sentence to. The transform did not fire, and a transform that quietly does nothing is the inert guard this file has found twice. Re-anchor it or drop it — do not leave it unable to fire.' });
      t.body = rs.body; report.reseeded += rs.n; }
    if (t.fixture) report.fixtures++;
    report.dangling += t.dangling;
    report.identity += t.identity;
    report.machine += t.machine;

    const dest = path.join(staging, f.to);
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.writeFileSync(dest, t.body);
    report.staged++;

    /* Scanning the OUTPUT is the whole point: a rule that failed to fire is invisible from the
     * input side, and the input is what a person reasons about when they write the rule. */
    report.leaks.push(...scan(t.body, f.to));

    /* An unportable fixture is a real problem for a consumer and belongs in a list a person
     * reads. It is NOT a reason to edit the fixture: that trades an honest failure for a green
     * one. 11 of 43 shipped suites do not run in a consumer tree and this is how they say so. */
    if (kind === 'fixture') {
      /* MACHINE JOINED THIS REGEX ON 2026-09-04. It used to match DANGLING and RECORD only, which
       * is how three MACHINE hits in main.rs came to be neither refused nor reported -- the scan
       * waived them for fixtures and this list never looked for them. The waiver is gone now, so a
       * MACHINE hit refuses the build and cannot reach here; this alternation is the belt to that
       * brace, so the claim "refused OR reported, never silent" holds structurally rather than by
       * the accident of one class being caught somewhere else. */
      const refs = (t.body.match(/exo_memory\/(?:journal|loop|map)\/[A-Za-z0-9_.-]+|muscle_map[A-Za-z0-9_.-]*|SELF_TRACE[A-Za-z0-9_.-]*|the_living_wave[A-Za-z0-9_.-]*|OneDrive[A-Za-z0-9_.\\/-]*|C:[\\/]{1,4}Consonance[\\/]{1,4}lighthouse[A-Za-z0-9_.\\/-]*/g) || []);
      if (refs.length) report.unportable.push({ rel: f.to, refs: [...new Set(refs)].slice(0, 4), n: refs.length });
    }

  }

  /* ------------------------------------------------------------ THE GENERATED FILES
   *
   * Written after the manifest's files, scanned with them, and refused on the two states that
   * would make them untrustworthy: a path two writers claim, and a CUTOFF the transforms edit.
   */
  {
    const claimed = new Set(files.map((f) => f.to));
    for (const [rel, body] of Object.entries(gen)) {
      if (claimed.has(rel)) {
        report.genDrift.push({ rel, why: 'a manifest rule also produces this path. Two writers to one path is the state where nobody can say what shipped.' });
        continue;
      }
      const kind = isFixture(rel) ? 'fixture' : 'prose';
      const t = transform(body, kind);

      /* THE CUTOFF MUST SURVIVE ITS OWN PIPELINE UNCHANGED, and this is what makes the
       * tamper-check honest rather than decorative. `--verify-cutoff` re-renders the body from the
       * commit named inside the file and compares bytes. If a transform edited the document on the
       * way out, the shipped bytes and the re-rendered bytes would differ for an innocent reason,
       * every time, and the check would have to be loosened until it caught nothing. So instead of
       * loosening the check, the document is required to be invariant -- and if it ever stops
       * being, the build says so here rather than the verifier failing mysteriously later. */
      if (rel === 'exo_memory/CUTOFF.md' && t.body !== body) {
        report.genDrift.push({ rel, why: 'a transformation edited the CUTOFF document. Its whole tamper-check is a byte comparison against a re-render, so the document must pass through unchanged. Fix the wording, not the check.' });
        continue;
      }

      report.dangling += t.dangling;
      report.identity += t.identity;
      report.machine += t.machine;
      const dest = path.join(staging, rel);
      fs.mkdirSync(path.dirname(dest), { recursive: true });
      fs.writeFileSync(dest, t.body);
      report.staged++;
      report.generated.push(rel);
      report.leaks.push(...scan(t.body, rel));
    }
  }

  /* ------------------------------------------------------------ DOES THE INHERITANCE RESOLVE?
   *
   * THE OTHER HALF OF THE DEDANGLE RE-POINT, and the half that keeps it from being a loosening.
   *
   * Re-pointing `journal/<date>.md` to `inheritance/<date>.md` converts a class that REFUSED into
   * a class that REWRITES. On its own that is the move this packet warned against: the pattern
   * still fires, the build still passes, and a citation to a date that never shipped now reads as
   * a working link instead of an obvious dead one. Strictly worse than before, because it looks
   * fine.
   *
   * So the class is not merely re-pointed, it is TRADED for a stronger one: every
   * `exo_memory/inheritance/<name>.md` reference in the OUTPUT is resolved against the files
   * actually staged. This catches what a regex never could -- a citation to a date the private
   * tree does not have, a typo in a filename, a journal entry deleted upstream while its citations
   * live on, and any future narrowing of the `journal/` dir rule that quietly drops entries.
   *
   * Fixtures are exempt, for the reason they are exempt from DANGLING everywhere else: a fixture's
   * citation is data an assertion keys on, not a pointer a reader follows.
   */
  {
    const staged = new Set();
    const walk = (d, rel) => {
      for (const e of fs.readdirSync(d, { withFileTypes: true })) {
        const a = path.join(d, e.name), r = rel ? rel + '/' + e.name : e.name;
        if (e.isDirectory()) walk(a, r); else staged.add(r);
      }
    };
    try { walk(staging, ''); } catch (_) { /* nothing staged is caught elsewhere */ }
    for (const rel of staged) {
      if (!/\.(js|md|rs|html|json|toml|ps1|py)$/.test(rel)) continue;
      if (fixtureKind(rel)) continue;
      let text; try { text = fs.readFileSync(path.join(staging, rel), 'utf8'); } catch (_) { continue; }
      const refs = [...new Set(text.match(/exo_memory\/inheritance\/[A-Za-z0-9_.-]+\.md/g) || [])];
      const dead = refs.filter((r) => !staged.has(r));
      if (dead.length) report.unresolved.push({ rel, refs: dead });
    }
  }

  /* ------------------------------------------------------------ EVERY exo_memory/ ENTRY CLASSIFIED
   *
   * C's §8.2, owed rather than written when the ruling landed because this file was not C's. The
   * ruling is a note until something goes red over it; this is the something. */
  {
    let tops = [];
    try { tops = fs.readdirSync(path.join(REPO, 'exo_memory')).sort(); } catch (_) {}
    const reached = new Set();
    for (const f of files) {
      const m = /^exo_memory\/([^/]+)/.exec(f.from);
      if (m) reached.add(m[1]);
    }
    for (const t of tops) {
      const isReached = reached.has(t);
      const isPrivate = Object.prototype.hasOwnProperty.call(STAYS_PRIVATE, t);
      if (isReached && isPrivate) {
        report.unclassified.push({ rel: 'exo_memory/' + t, why: 'a manifest rule reaches it AND it is declared STAYS_PRIVATE. Both cannot be true; the declaration and the manifest disagree about the same file.' });
      } else if (!isReached && !isPrivate) {
        report.unclassified.push({ rel: 'exo_memory/' + t, why: 'in neither column: no manifest rule reaches it and STAYS_PRIVATE does not name it. Decide, and write the reason next to the decision — C §4 measured 17 files that accumulated in exactly this gap.' });
      }
    }
    report.columns = { ships: [...reached].sort(), private: Object.keys(STAYS_PRIVATE).sort(), seeded: Object.keys(gen).sort() };
  }

  /* ------------------------------------------------------------ THE EXCLUSION'S DANGLING DEBT
   *
   * WHAT THIS COUNTS, AND WHY NOTHING COULD COUNT IT BEFORE. Every EXCLUDE entry removes a file
   * that other SHIPPED files may still name. L measured nine such references on 2026-09-04 and
   * showed the guard was structurally blind to all of them: the three DANGLING patterns are shaped
   * `exo_memory/...`, while an excluded sibling is `consonance/tools/<name>.js`. The scan checked
   * correctly over a universe that excluded the one thing the EXCLUDE list manufactures — so the
   * set could grow forever and no number would move. This is that number.
   *
   * It is built from `Object.keys(EXCLUDE)` rather than from a written list, so it cannot go stale:
   * a seventh entry is charged for its debt the moment it lands, with nobody remembering to add a
   * pattern. That is L's clause 3 turned from a discipline into an instrument.
   *
   * IT REPORTS AND DOES NOT REFUSE, and that is a decision rather than an oversight. Nine of these
   * exist today, at least one PRINTED to the reader by a shipped tool (`tell-index.js:785-789`
   * names `catch-ledger.js` as the room's only computation of a number). Making it refuse would
   * block every build until nine pre-existing references are resolved, which is a ruling about
   * shipped documentation that belongs to the people who own those files, not to a build gate that
   * discovers it. Precedent is C5: an unportable citation inside a fixture is REPORTED, never
   * rewritten. The debt is now visible and attributable; what to do about it is the next decision,
   * not this one.
   *
   * *Registered falsifier:* if this count only ever grows, the report is decoration and it should
   * become a refusal — the same standard the ferry's unread count is held to. */
  {
    const bases = Object.keys(EXCLUDE).map((k) => path.basename(k, path.extname(k)));
    const pat = new RegExp('\\b(' + bases.map((b) => b.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|') + ')\\b');
    const staged = [];
    const walk = (d, rel) => {
      for (const e of fs.readdirSync(d, { withFileTypes: true })) {
        const a = path.join(d, e.name), r = rel ? rel + '/' + e.name : e.name;
        if (e.isDirectory()) walk(a, r); else staged.push([a, r]);
      }
    };
    try { walk(staging, ''); } catch (_) { /* nothing staged yet is not a defect here */ }
    for (const [abs, rel] of staged) {
      if (!/\.(js|md|rs|html|json|toml)$/.test(rel)) continue;
      let text; try { text = fs.readFileSync(abs, 'utf8'); } catch (_) { continue; }
      const hits = [...new Set((text.match(new RegExp(pat.source, 'g')) || []))];
      if (hits.length) report.orphaned.push({ rel, names: hits });
    }
  }

  if (report.missing.length) {
    /* A manifest naming a file that does not exist is a manifest describing a tree that no longer
     * exists. Refuse rather than ship a quietly smaller product. */
    report.refused = 'manifest names ' + report.missing.length + ' file(s) that are not on disk';
    return report;
  }
  if (report.excludeDrift.length) {
    report.refused = report.excludeDrift.length + ' exclusion(s) have drifted from the manifest';
    return report;
  }
  if (report.seedDrift.length) {
    report.refused = report.seedDrift.length + ' seed(s) reach nothing in the manifest';
    return report;
  }
  /* REFUSE A DIRTY TREE BY DEFAULT — the file's own ATOMIC principle turned on itself. Property 2
   * of this module says the destination is not touched until the scan is clean, because a leaked
   * tree on disk is worse than a failed build. A tree stamped with a commit it does not correspond
   * to is the same shape of artefact: it exists, it looks finished, and it asserts something false
   * about where it came from. Refusing is cheaper than every downstream reader having to know.
   *
   * The override is `--allow-dirty`, and it is NOT silent: it stamps `PROVENANCE: UNEARNED` into
   * CONSUMER-STATUS.md and replaces CUTOFF.md's provenance sentence with a block saying the commit
   * names where the tree was generated FROM and not what was generated. A reader can tell an
   * overridden stamp from an earned one by opening either document; they do not have to know the
   * flag exists. That is the difference between an override and a bypass.
   *
   * IT REFUSES A WRITE, NOT A DRY RUN, and the line is where it is on purpose. The defect is that a
   * TREE ON DISK asserts a provenance it does not have; a `--report` produces no tree, prints the
   * unearned state on its CUTOFF line, and is the command a person runs twenty times an hour while
   * working. Refusing that too would make `--allow-dirty` a habit within the hour, and a flag
   * everyone always passes is a guard that has been switched off with extra steps. */
  if (report.commit.dirty && !opts.allowDirty && !opts.dry) {
    report.refused = 'the working tree has ' + report.commit.changes + ' uncommitted change(s), so '
      + 'the commit this tree would be stamped with (' + report.commit.sha.slice(0, 12) + ') does not '
      + 'describe it. Commit first, or pass --allow-dirty to generate a scratch tree that says so in '
      + 'CUTOFF.md and CONSUMER-STATUS.md.';
    return report;
  }
  if (report.anchorDrift.length) {
    report.refused = report.anchorDrift.length + ' anchored transform(s) could not find their anchor';
    return report;
  }
  if (report.genDrift.length) {
    report.refused = report.genDrift.length + ' generated file(s) collide with the manifest or were edited by a transform';
    return report;
  }
  if (report.unclassified.length) {
    report.refused = report.unclassified.length + ' exo_memory/ entr(ies) are in neither column';
    return report;
  }
  if (report.unresolved.length) {
    report.refused = report.unresolved.length + ' shipped file(s) cite an inheritance entry that is not in the tree';
    return report;
  }
  if (report.leaks.length) {
    report.refused = report.leaks.length + ' leak(s) survived the transformations';
    return report;
  }
  if (opts.dry) { report.wrote = null; return report; }

  /* Atomic-ish: the destination is only touched once staging is clean. */
  fs.mkdirSync(outDir, { recursive: true });
  const copyTree = (from, to) => {
    for (const e of fs.readdirSync(from, { withFileTypes: true })) {
      const a = path.join(from, e.name), b = path.join(to, e.name);
      if (e.isDirectory()) { fs.mkdirSync(b, { recursive: true }); copyTree(a, b); }
      else fs.copyFileSync(a, b);
    }
  };
  copyTree(staging, outDir);
  report.wrote = outDir;
  return report;
}

/** `--verify-cutoff <consumer-checkout>` — C's §5 check (b), the strong half.
 *
 *  Reads the sha out of the SHIPPED `CUTOFF.md`, asks git for that commit's own date, re-renders
 *  the document from those two, and compares byte for byte. A hand-edit of any sentence fails; so
 *  does a hand-edit of the DATE, because the date is not taken from the file, only the sha is.
 *
 *  WHAT IT DOES AND DOES NOT PROVE, said plainly because a tamper-check that overstates itself is
 *  worse than none. It is tamper-EVIDENT, not tamper-proof: someone who edits the sentence AND
 *  re-runs the generator produces a consistent file again. What it makes impossible is a QUIET
 *  edit -- and quiet is the whole failure mode, since the document's only job is to be believed
 *  about where the record stops.
 *
 *  It is the pair to C's check (a), which needs no code at all and catches the case this one
 *  cannot see -- a CUTOFF.md that changed alone, in its own commit:
 *
 *      git -C <consumer> log --format=%H -- exo_memory/CUTOFF.md | while read c; do
 *        printf '%s %s\n' "$c" "$(git -C <consumer> show --name-only --format= "$c" | grep -c .)"
 *      done      # any row with a count of 1 is a hand-edit
 *
 *  (a) catches the lone commit; (b) catches the edit smuggled into a regeneration. Both, not
 *  either -- which is C's wording and is right. */
function verifyCutoff(dir) {
  const file = path.join(dir, 'exo_memory', 'CUTOFF.md');
  let body;
  try { body = fs.readFileSync(file, 'utf8'); }
  catch (_) { return ['no CUTOFF.md at ' + file + ' — a generated tree without one was not generated by this tool']; }
  const m = body.match(/at commit `([0-9a-f]{40})`/);
  if (!m) return ['CUTOFF.md names no 40-character commit — the one field the whole document is a function of'];
  const { execFileSync } = require('child_process');
  let at;
  try { at = execFileSync('git', ['-C', REPO, 'show', '-s', '--format=%cI', m[1]], { encoding: 'utf8' }).trim(); }
  catch (_) { return ['the commit ' + m[1] + ' named in CUTOFF.md is not in this repository, so the document cannot be checked from here']; }
  /* Re-rendered in the MODE THE DOCUMENT DECLARES. A dirty stamp is still a pure function of its
   * commit -- it just renders a different body -- so the byte comparison holds for both, and an
   * edit that deletes the UNEARNED block is caught rather than mistaken for a clean tree. */
  const expected = renderCutoff(m[1], at, /THIS PROVENANCE IS NOT EARNED/.test(body));
  if (expected === body) return [];
  const a = expected.split('\n'), b = body.split('\n');
  const bad = [];
  for (let i = 0; i < Math.max(a.length, b.length); i++) {
    if (a[i] !== b[i]) bad.push('  line ' + (i + 1) + '\n    generator: ' + JSON.stringify(a[i]) + '\n    on disk  : ' + JSON.stringify(b[i]));
  }
  return ['CUTOFF.md does not match a re-render from the commit it names (' + m[1] + '):'].concat(bad);
}

/* ------------------------------------------------------------------ cli */

function main() {
  const argv = process.argv.slice(2);
  const arg = (k) => { const i = argv.indexOf(k); return i >= 0 ? argv[i + 1] : null; };
  const dry = argv.includes('--dry') || argv.includes('--report');
  const json = argv.includes('--json');
  const outDir = arg('--out');
  const allowDirty = argv.includes('--allow-dirty');

  if (argv.includes('--verify-cutoff')) {
    const dir = arg('--verify-cutoff');
    if (!dir) { console.error('gen-consumer: --verify-cutoff <consumer-checkout>'); process.exit(2); }
    const problems = verifyCutoff(dir);
    if (!problems.length) { console.log('CUTOFF.md matches a re-render from the commit it names.'); process.exit(0); }
    for (const x of problems) console.error(x);
    process.exit(1);
  }

  if (!dry && !outDir) {
    console.error('gen-consumer: --out <dir> is required (or --report to see what would ship)');
    process.exit(2);
  }

  const r = build(outDir || '', { dry, allowDirty });

  if (json) { console.log(JSON.stringify(r, null, 2)); process.exit(r.refused ? 1 : 0); }

  console.log('');
  /* The banner carried "private lighthouse -> public consonance" until 2026-09-04. Same false
   * claim as the module header, in the one line a person actually reads when they run the tool --
   * the carrier, corrected alongside the document (the 2026-08-17 lesson: mark the carriers). */
  console.log('GEN-CONSUMER — lighthouse working tree -> consumer consonance tree');
  console.log('');
  console.log('  staged            : ' + r.staged + ' file(s)');
  console.log('  excluded by name  : ' + r.excluded.length);
  console.log('  dangling rewrites : ' + r.dangling);
  console.log('  identity rewrites : ' + r.identity);
  console.log('  machine rewrites  : ' + r.machine);
  console.log('  fixtures (identity-only, never rewritten) : ' + r.fixtures);
  console.log('  fixtures with UNPORTABLE references       : ' + r.unportable.length);
  console.log('');
  /* C'S THREE COLUMNS, PRINTED — the ruling made legible in the tool that enforces it. Printed
   * from the same data `build()` refuses on, so the report cannot say one thing while the build
   * does another; the day they disagree is the day this block is lying, and it cannot, because
   * there is only one list. */
  if (r.columns) {
    console.log('  THE THREE COLUMNS (C, `consumer_foundation_ruling_2026-09-06.md`), exo_memory/:');
    console.log('    SHIPS         ' + r.columns.ships.join(' '));
    console.log('    SEEDED/WRITTEN ' + r.columns.seeded.join(' '));
    console.log('    STAYS PRIVATE ' + r.columns.private.join(' '));
    console.log('    every top-level entry is in exactly one, or the build refuses (C §8.2).');
    console.log('');
  }
  if (r.anchorDrift && r.anchorDrift.length) {
    console.log('  AN ANCHORED TRANSFORM COULD NOT FIRE:');
    for (const d of r.anchorDrift) console.log('    ' + d.rel + '\n      ' + d.why);
    console.log('');
  }
  if (r.commit) {
    console.log('  CUTOFF        : ' + r.commit.sha.slice(0, 12) + '  ' + r.commit.at
      + (r.commit.dirty ? '   PROVENANCE UNEARNED — ' + r.commit.changes + ' uncommitted change(s)' : '   (clean tree)'));
    console.log('                  a pure function of that commit; check a shipped tree with');
    console.log('                  node consonance/tools/gen-consumer.js --verify-cutoff <dir>');
    console.log('');
  }
  if (r.generated && r.generated.length) {
    console.log('  GENERATED — no private source; composed by this tool and scanned like any file:');
    for (const g of r.generated) console.log('    ' + g);
    console.log('');
  }
  if (r.genDrift && r.genDrift.length) {
    console.log('  GENERATED FILES IN CONFLICT:');
    for (const d of r.genDrift) console.log('    ' + d.rel + '\n      ' + d.why);
    console.log('');
  }
  if (r.unclassified && r.unclassified.length) {
    console.log('  exo_memory/ ENTRIES IN NEITHER COLUMN:');
    for (const d of r.unclassified) console.log('    ' + d.rel + '\n      ' + d.why);
    console.log('');
  }
  if (r.unresolved && r.unresolved.length) {
    console.log('  INHERITANCE CITATIONS THAT RESOLVE TO NOTHING:');
    for (const d of r.unresolved) console.log('    ' + d.rel + '  ->  ' + d.refs.join(' '));
    console.log('');
  }
  if (r.excluded.length) {
    console.log('  EXCLUDED, with the reason (this list is arguable on purpose):');
    for (const e of r.excluded) console.log('    ' + e.rel + '\n      ' + e.why);
    console.log('');
  }
  if (r.excludeDrift && r.excludeDrift.length) {
    console.log('  THE EXCLUSION LIST HAS DRIFTED FROM THE MANIFEST:');
    for (const d of r.excludeDrift) console.log('    ' + d.rel + '\n      ' + d.why);
    console.log('');
  }
  if (r.seeded && r.seeded.length) {
    console.log('  SEEDED — the manifest names these and the private content did NOT travel:');
    for (const s of r.seeded) console.log('    ' + s);
    console.log('');
  }
  /* PRINTED WHETHER OR NOT IT IS ZERO, unlike every list above it. A debt that only appears when
   * it is non-zero cannot be watched falling, and this number exists to be watched: it is the one
   * cost of the EXCLUDE mechanism that no instrument could return before today. */
  {
    const n = (r.orphaned || []).reduce((a, o) => a + o.names.length, 0);
    console.log('  DANGLING DEBT OF THE EXCLUSION SET — shipped files naming a file EXCLUDE removed:');
    console.log('    ' + (r.orphaned || []).length + ' file(s), ' + n + ' reference(s).' +
      ((r.orphaned || []).length ? '' : ' The set costs nothing today.'));
    for (const o of (r.orphaned || []).slice(0, 12)) {
      console.log('      ' + o.rel + '  ->  ' + o.names.join(', '));
    }
    if ((r.orphaned || []).length > 12) console.log('      ... and ' + (r.orphaned.length - 12) + ' more');
    if ((r.orphaned || []).length) {
      console.log('    REPORTED, NOT REFUSED: what to do about a shipped file that names a withheld one');
      console.log('    is a ruling for that file\'s owner, not for a build gate that discovered it.');
    }
    console.log('');
  }
  if (r.missing.length) {
    console.log('  MANIFEST NAMES FILES THAT ARE NOT ON DISK:');
    for (const m of r.missing) console.log('    ' + m);
    console.log('');
  }
  if (r.leaks.length) {
    const byCls = {};
    for (const l of r.leaks) (byCls[l.cls] = byCls[l.cls] || []).push(l);
    console.log('  LEAKS THAT SURVIVED — nothing was written:');
    for (const [cls, list] of Object.entries(byCls)) {
      console.log('    ' + cls + '  (' + list.length + ')');
      for (const l of list.slice(0, 6)) {
        console.log('      ' + l.rel + ':' + l.line + '  ' + l.text);
      }
      if (list.length > 6) console.log('      ... and ' + (list.length - 6) + ' more');
    }
    console.log('');
  }
  if (r.refused) {
    console.log('  REFUSED: ' + r.refused);
    console.log('  Nothing was written to the destination. Staging kept for inspection:');
    console.log('    ' + r.staging);
    console.log('');
    process.exit(1);
  }
  if (r.unportable.length) {
    console.log('  UNPORTABLE FIXTURES — these suites reference files a consumer tree does not have.');
    console.log('  Reported, never rewritten: editing a fixture trades an honest failure for a green one.');
    for (const u of r.unportable) console.log('    ' + u.rel + '  (' + u.n + ')  ' + u.refs.join(' '));
    console.log('');
  }
  if (r.wrote) console.log('  wrote ' + r.wrote);
  else console.log('  DRY RUN — clean. Nothing written.');
  console.log('');
  console.log('  The output is GENERATED. Never hand-edit it; edit the private tree and re-run.');
  console.log('');
  process.exit(0);
}

if (require.main === module) main();
module.exports = { MANIFEST, EXCLUDE, SEEDED, LEAKS, SYNTHETIC, ALLOW, STAYS_PRIVATE, demachine, isFixture, deidentifyTokens, decoordinate, destructure, validIdentifier, collect, transform, scan, dedangle, deidentify, depath, repath, desync, reseed, reindex, dewiki, SEED_ANCHOR, SEED_SENTENCE, JOURNAL_SEED, renderCutoff, verifyCutoff, renderStatusDoc, generatedFiles, commitIdentity, build };
