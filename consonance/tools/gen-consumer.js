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
  { dir: 'consonance/tools', to: 'consonance/tools', match: /\.js$/, kind: 'code' },
  { dir: 'consonance/hooks', to: 'consonance/hooks', match: /\.js$/, kind: 'code' },

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

  /* TWO MANIFEST GAPS ARE KNOWINGLY LEFT OPEN, 2026-09-04, and they are NOT in EXCLUDE on purpose.
   *
   *     dev/shell/install.ps1
   *     dev/shell/hooks/userprompt-submit.js
   *
   * Both are named by files that ship -- `README.md:170` links the first, `open-items.js:280,:285`
   * reads both at runtime -- so a consumer tree has two references that resolve to nothing.
   * Neither can be closed by adding the line above it, and that is the finding rather than an
   * excuse. `install.ps1` is an INSTALLER whose own `$files` list (`:58-`) enumerates
   * `dev\shell\lib\*` and `dev\shell\hooks\*` -- twelve files, none of them in this manifest --
   * so shipping it alone hands a stranger a script whose entire source list is absent, which is
   * worse than the dangling link it was meant to fix. `userprompt-submit.js` is one of the files
   * that installer installs. Closing either properly means deciding whether the whole dev-shell
   * hook layer ships, and that is a repo-shape decision sitting with the keeper, not a manifest
   * patch a seat makes on its way past.
   *
   * THEY ARE NOT EXCLUDED, because an EXCLUDE entry would say "we considered these and withheld
   * them", and the true state is "nobody has decided yet". Under an allow-list, absent already
   * means undecided, and that is the honest encoding. Closing a manifest gap by EXCLUDE is the
   * degenerating move registered against this lap; this comment is what stands in its place.
   *
   * ALSO FOUND, and it belongs to whoever owns README.md rather than to this file: `README.md:170`
   * says the 12 hooks under `consonance/hooks/` are "installed by ../dev/shell/install.ps1". They
   * are not -- that script's file list points at `dev\shell\hooks\*`, a different set. The link is
   * a mis-citation in the private tree already, before any question of shipping it. */
];

/* Named exclusions -- files that MATCH a manifest rule but must not ship, each with its reason.
 * Kept as data rather than as a filter buried in code, so the list is readable and arguable. */
/* A value beginning with `UNREACHABLE:` declares that NO manifest rule currently reaches this
 * path, so the entry is a standing guard against a future widening rather than a live exclusion.
 * The declaration is checked in both directions (see build()): an undeclared dead entry refuses,
 * and so does a declared entry that has become reachable. Without that, a dead exclusion reads as
 * coverage -- the same shape as the demachine() pattern that could not match, found the same day. */
const EXCLUDE = {
  /* MEASURED 2026-09-04: this entry has never been able to fire. The only rule that could reach
   * `consonance/tools/` is `match: /\.js$/`, and `/\.js$/.test('portable-paths.baseline.json')` is
   * false -- `$` anchors the end and the name ends `.json`. It is KEPT rather than deleted because
   * the reason is still true and P3 re-points the manifest next: the moment anyone widens that
   * rule to `/\.(js|json)$/`, this machine's path baseline would ship, and the entry is what stops
   * it. Declared unreachable so the entry cannot be mistaken for a guard that is doing work. */
  'consonance/tools/portable-paths.baseline.json':
    'UNREACHABLE: the ratchet\'s own record of this machine\'s known path sites; meaningless elsewhere',
  'consonance/tools/catch-ledger.js':
    'scores THIS collaboration\'s catches; 7 identity hits and 11 dangling refs, and the data it reads does not exist for anyone else',
  'consonance/tools/catch-ledger.test.js':
    'fixtures are this record\'s own events (18 dangling refs)',
  'consonance/tools/gen-consumer.js':
    'the generator does not ship itself; it is a property of the private tree',
  'consonance/tools/gen-consumer.test.js':
    'the generator test names the exclusion list, which is a description of exactly what was withheld',
  'consonance/tools/gen-consumer.fixture-scope.test.js':
    'requires gen-consumer.js, which does not ship; it would crash on load in a consumer tree',
};

/* ------------------------------------------------------------------ leak classes
 *
 * These run over the OUTPUT. Anything that survives here stops the build.
 */
const LEAKS = [
  { cls: 'IDENTITY', pat: /solariz3d/gi, why: 'the keeper\'s public handle' },
  { cls: 'IDENTITY', pat: /trynabemlgzn/gi, why: 'the keeper\'s email' },
  { cls: 'IDENTITY', pat: /zackn/gi, why: 'this machine\'s OS user name' },
  { cls: 'IDENTITY', pat: /\bnname\b/g, why: 'the desktop machine\'s OS user name' },
  { cls: 'RECORD', pat: /\bChrysos\b/g, why: "a name from this record; to a stranger it reads as the product's name" },
  /* The keeper's coordinates and city. 2026-08-22 measured this class at 16 files and found 5
   * real after false positives -- the survey matched audio fixture frequencies. Anchored on the
   * exact latitude rather than a loose decimal, for that reason. */
  { cls: 'IDENTITY', pat: /50\.4452/g, why: 'the keeper\'s latitude' },
  { cls: 'IDENTITY', pat: /-?104\.6189/g, why: 'the keeper\'s longitude' },
  { cls: 'IDENTITY', pat: /Regina,\s*Saskatchewan/g, why: 'the keeper\'s city' },
  { cls: 'RECORD', pat: /SELF_TRACE/g, why: 'one person\'s trace, shipped as a label on a wall' },
  { cls: 'RECORD', pat: /the_living_wave/g, why: 'ditto' },
  { cls: 'RECORD', pat: /muscle_map/g, why: 'ditto' },
  /* A bare DIRECTORY reference is not dangling -- a consumer has an exo_memory/journal/ of
   * their own, and ferry.js's ARTIFACT_DIRS must keep naming it or the tool stops working.
   * What dangles is a reference to a SPECIFIC file this record happens to contain. The first
   * version flagged 20 bare-directory hits and would have had me rewrite working constants. */
  { cls: 'DANGLING', pat: /exo_memory\/journal\/\d{4}-\d{2}-\d{2}/g, why: 'a dated entry a consumer tree will not contain' },
  { cls: 'DANGLING', pat: /exo_memory\/loop\/[A-Za-z0-9_.-]+\.md/g, why: 'a specific registration from this record' },
  { cls: 'DANGLING', pat: /exo_memory\/map\/[A-Za-z0-9_.-]+\.md/g, why: 'a specific map entry from this record' },
  { cls: 'PROSE', pat: /we've watched it make structure/g, why: 'assumes the reader was there' },
  { cls: 'MACHINE', pat: /C:\\{1,4}Consonance\\{1,4}lighthouse/gi, why: 'the private tree\'s path' },
  { cls: 'MACHINE', pat: /C:\/Consonance\/lighthouse/gi, why: 'ditto' },
  { cls: 'MACHINE', pat: /OneDrive/g, why: 'the keeper\'s personal sync directory' },
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
    .replace(/`?exo_memory\/journal\/(\d{4}-\d{2}-\d{2})\.md(?::[\d-]+)?`?/g,
      (_, d) => { bump(); return 'the record, ' + d; })
    .replace(/`?journal\/(\d{4}-\d{2}-\d{2})\.md(?::[\d-]+)?`?/g,
      (_, d) => { bump(); return 'the record, ' + d; })
    .replace(/`?exo_memory\/loop\/([A-Za-z0-9_.-]+)\.md(?::[\d-]+)?`?/g,
      () => { bump(); return 'a registration in this line of record'; })
    .replace(/`?exo_memory\/map\/([A-Za-z0-9_.-]+)\.md(?::[\d-]+)?`?/g,
      () => { bump(); return 'a map entry in this line of record'; })
    .replace(/`?(?:exo_memory\/)?(?:SELF_TRACE|the_living_wave|muscle_map)[A-Za-z0-9_.-]*\.md(?::[\d-]+)?`?/g,
      () => { bump(); return 'a master in this line of record'; })
    /* The bare form with no extension: `muscle_map, 2026-07-27:` inside a code comment. The
     * first pass only matched the .md form and five survived into the scan. */
    .replace(/\bmuscle_map\b(,\s*\d{4}-\d{2}-\d{2})?/g,
      (_, d) => { bump(); return d ? 'this line of record' + d : 'this line of record'; })
    /* A name from this record reads, to a stranger, as the product's name. Rendered as the
     * template it actually is, so the sentence keeps teaching the clause without handing over
     * someone else's name: "You are <a name>" fails clause 1. */
    .replace(/\bChrysos\b/g, () => { bump(); return '<a name>'; })
    .replace(/\b(?:SELF_TRACE|the_living_wave)\b/g,
      () => { bump(); return 'a master in this line of record'; });
  return { body: out, n };
}

/** Neutralise identity and this machine's layout. */
function deidentify(body) {
  let n = 0;
  const rep = (re, to) => { body = body.replace(re, (m) => { n++; return to; }); };
  rep(/solariz3d/gi, 'the keeper');
  rep(/trynabemlgzn@gmail\.com/gi, 'the keeper');
  rep(/C:\\{1,4}Users\\{1,4}zackn/gi, '%USERPROFILE%');
  rep(/C:\/Users\/zackn/gi, '%USERPROFILE%');
  rep(/\bzackn\b/gi, 'user');
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
  const rep = (re, to) => { body = body.replace(re, () => { n++; return to; }); };
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
  rep(/solariz3d/gi, 'the keeper');
  rep(/trynabemlgzn@gmail\.com/gi, 'the keeper');
  rep(/\bzackn\b/gi, 'user');
  /* nname is the desktop machine's OS user and appears in 9 shipped files as a foreign-path
   * fixture. Same treatment: the token goes, the path shape stays. */
  rep(/\bnname\b/g, 'other');
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
  return found;
}

/* ------------------------------------------------------------------ collection */

function collect() {
  const out = [];
  for (const entry of MANIFEST) {
    if (entry.from) {
      out.push({ from: entry.from, to: entry.to, kind: entry.kind });
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
      out.push({ from: entry.dir + '/' + nm, to: entry.to + '/' + nm, kind: entry.kind });
    }
  }
  return out;
}

/* ------------------------------------------------------------------ build */

function build(outDir, opts) {
  const files = collect();
  const staging = fs.mkdtempSync(path.join(os.tmpdir(), 'gen-consumer-'));
  const report = { staged: 0, excluded: [], missing: [], dangling: 0, identity: 0, machine: 0, fixtures: 0, unportable: [], leaks: [], excludeDrift: [], staging };

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

    let body;
    try { body = fs.readFileSync(src, 'utf8'); }
    catch (_) { report.missing.push(f.from); continue; }

    /* The path decides, not the manifest entry: a directory rule cannot know which of its files
     * are tests, and getting this wrong silently corrupts data an assertion depends on. */
    const kind = isFixture(f.to) ? 'fixture' : f.kind;
    const t = transform(body, kind);
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

/* ------------------------------------------------------------------ cli */

function main() {
  const argv = process.argv.slice(2);
  const arg = (k) => { const i = argv.indexOf(k); return i >= 0 ? argv[i + 1] : null; };
  const dry = argv.includes('--dry') || argv.includes('--report');
  const json = argv.includes('--json');
  const outDir = arg('--out');

  if (!dry && !outDir) {
    console.error('gen-consumer: --out <dir> is required (or --report to see what would ship)');
    process.exit(2);
  }

  const r = build(outDir || '', { dry });

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
module.exports = { MANIFEST, EXCLUDE, LEAKS, SYNTHETIC, ALLOW, demachine, isFixture, deidentifyTokens, decoordinate, destructure, validIdentifier, collect, transform, scan, dedangle, deidentify, build };
