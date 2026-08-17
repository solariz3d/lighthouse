#!/usr/bin/env node
// seed-status.js — report what the seeder WOULD decide for every bundled file, especially the
// files it is quietly declining to update.
//
// WHY THIS EXISTS, and it is a measured hole rather than a suspicion.
//
// The seeder's policy (main.rs:486 `seed_decision`) is correct and deliberately tested:
//   local absent                -> Installed
//   local == bundled            -> Current    (records the hash)
//   local == recorded hash      -> Upgraded   (we wrote it, nobody touched it, move it forward)
//   otherwise                   -> KeptYours  (edited OR predates the manifest — indistinguishable)
//
// KeptYours never clobbers, which is right. But it also records NOTHING — so a file that is
// STALE AND UNRECORDED is in an ABSORBING STATE: the only exit is `Current`, which a stale file
// can never reach on its own. It re-offers `<name>.new` on every start, forever, and the sole
// notice is a `plog` line in persist.log that nobody reads.
//
// Measured 2026-08-17, on the author's own machine:
//   ~/.consonance/BOOT.md                        stuck since 2026-07-07  (SIX WEEKS)
//   ~/.consonance/cards/trust-the-first-attention.md   19,602 bytes where the repo ships 3,048
//   ~/.consonance/cards/claim-your-continuity.md        9,161 bytes where the repo ships 4,276
//
// The BOOT case is the one that mattered: main.rs:442-445 records that this exact bug was found
// on 2026-08-05 — "the live BOOT.md on the author's own machine was a month stale, so a section
// written on 2026-08-05 about what a room should ship had never once been read by a pane." The
// policy was then fixed. The ABSORBING STATE was not, so the same file was still stale twelve days
// later, and a vocabulary retirement shipped on 2026-08-17 reached every new room only because a
// pane went looking.
//
// The two cards were worse than stale: they were PRE-SPLIT originals. main.rs:291 records the
// 08-09 split — a card is the move you RUN, the record is the worked material — so every pane was
// carrying ~21 KB of record inside its cards, which is the exact cost the split existed to remove.
//
// THIS TOOL DOES NOT FIX THE POLICY. The policy is right. It makes the silence audible: run it and
// the absorbing state is a line you can read instead of a file you have to notice.
//
// Usage:
//   node seed-status.js            report every file, flag anything stuck
//   node seed-status.js --stuck    only the stuck ones; exit 1 if any
'use strict';

const fs = require('fs');
const path = require('path');

const REPO = path.resolve(__dirname, '..', '..');
const DATA = process.env.CONSONANCE_DATA_DIR ||
  path.join(process.env.USERPROFILE || process.env.HOME || '', '.consonance');

// Bundled source -> installed subdirectory, mirroring seed_cards/seed_references/seed_room.
// The room's brief is flat; the decks live under exo_memory/.
const MAP = [
  { src: path.join(REPO, 'consonance', 'src-tauri', 'brief'), dest: '', flat: true },
  { src: path.join(REPO, 'exo_memory', 'cards'), dest: 'cards' },
  { src: path.join(REPO, 'exo_memory', 'record'), dest: 'record' },
  { src: path.join(REPO, 'exo_memory', 'spread'), dest: 'spread' },
  { src: path.join(REPO, 'exo_memory', 'research'), dest: 'research' },
];

// BIT-IDENTICAL to main.rs:391 content_fingerprint — FNV-1a over the bytes with \r\n collapsed to
// \n, a lone \r still counted. Mirrored rather than approximated: a fingerprint that disagrees
// with the seeder's would report decisions the seeder will not make, which is worse than no tool.
function contentFingerprint(buf) {
  let h = 0xcbf29ce484222325n;
  const MASK = 0xFFFFFFFFFFFFFFFFn;
  const PRIME = 0x00000100000001b3n;
  let prev = 0;
  for (const b of buf) {
    if (b === 0x0d) { prev = b; continue; }
    if (prev === 0x0d && b !== 0x0a) {
      h ^= 0x0dn; h = (h * PRIME) & MASK;
    }
    h ^= BigInt(b); h = (h * PRIME) & MASK;
    prev = b;
  }
  return h.toString();
}

// Mirrors main.rs:486 exactly, including the branch order.
function seedDecision(bundled, local, recorded) {
  if (local === null) return 'Installed';
  if (local === bundled) return 'Current';
  if (recorded !== null && recorded === local) return 'Upgraded';
  return 'KeptYours';
}

function manifest() {
  try { return JSON.parse(fs.readFileSync(path.join(DATA, '.seeded.json'), 'utf8')); }
  catch (_) { return {}; }
}

function scan() {
  const man = manifest();
  const rows = [];
  for (const { src, dest, flat } of MAP) {
    let names;
    try { names = fs.readdirSync(src).filter((n) => n.endsWith('.md')); } catch (_) { continue; }
    for (const name of names) {
      const key = flat ? name : `${dest}/${name}`;
      const target = path.join(DATA, dest, name);
      const bundled = contentFingerprint(fs.readFileSync(path.join(src, name)));
      let local = null;
      try { local = contentFingerprint(fs.readFileSync(target)); } catch (_) {}
      const recorded = typeof man[key] === 'string' ? man[key] : null;
      const decision = seedDecision(bundled, local, recorded);
      // The absorbing state: KeptYours with nothing recorded can never become Current by itself.
      const stuck = decision === 'KeptYours' && recorded === null;
      let ageDays = null;
      if (stuck) {
        try { ageDays = Math.floor((Date.now() - fs.statSync(target).mtimeMs) / 86400000); } catch (_) {}
      }
      rows.push({ key, decision, stuck, ageDays, target });
    }
  }
  return rows;
}

module.exports = { contentFingerprint, seedDecision, scan };

if (require.main === module) {
  const onlyStuck = process.argv.includes('--stuck');
  const rows = scan();
  if (!rows.length) {
    console.error(`seed-status: no bundled .md files found under ${REPO}. Refusing to report a clean`);
    console.error('sheet over an empty scan — that would be a green measuring nothing.');
    process.exit(2);
  }
  const stuck = rows.filter((r) => r.stuck);
  if (!onlyStuck) {
    const by = {};
    rows.forEach((r) => { by[r.decision] = (by[r.decision] || 0) + 1; });
    console.log(`seed-status: ${rows.length} bundled files — ${JSON.stringify(by)}`);
  }
  if (stuck.length) {
    console.log(`\n${stuck.length} file(s) in the ABSORBING STATE — stale, unrecorded, and unable to`);
    console.log('escape on their own. The seeder is right to hold them; nothing tells you it is:');
    for (const s of stuck) {
      console.log(`  ${s.key}${s.ageDays !== null ? `  (untouched ${s.ageDays}d)` : ''}`);
    }
    console.log('\nTo release one, decide whether YOUR copy or the bundled one is right. Accepting the');
    console.log('bundled version makes local == bundled, which records the hash and restores upgrades.');
  } else if (!onlyStuck) {
    console.log('nothing stuck: every file is current, upgradable, or recorded as yours.');
  }
  process.exit(onlyStuck && stuck.length ? 1 : 0);
}
