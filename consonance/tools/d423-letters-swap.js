#!/usr/bin/env node
'use strict';
// d423-letters-swap.js — the three-row correction of <data>/letters.json, run ONCE at the keeper's swap (D423 part 4 (2)). DRY-RUN BY DEFAULT.
//
// WHY. Two letter allocators disagreed: the UI's fallback (term.js letterFor) named the Third Place N on screen, while the backend
// (main.rs pane_letter, which picks every MOUNT letter) never registered it and handed N to the next sibling. So seat O (c88002b1)
// rings as [pane:N] and seat P (fbf98f8e) as [pane:O]. The code fix (spawn_third_place registers through pane_letter) stops new
// crossings; this corrects the three rows already written, so the registry agrees with how the room has named these seats:
//     c88002b1-74d8-4036-8cc0-f64aefbeabff  N -> O      fbf98f8e-29da-4fb2-8610-c038d6372249  O -> P
//     3d000000-0000-4000-8000-000000003d00 (the Third Place)  (none) -> N
//
// ONLY WHILE CONSONANCE IS CLOSED: the running backend owns letters.json and rewrites it on every new pane (the librarian's ruling,
// 2026-10-20 02:2x). Refuses if consonance.exe is running. Refuses unless the registry is EXACTLY the crossed shape (or already corrected,
// which is a no-op), so it can never move a letter it does not expect. Backs the file up first; writes beside and renames over.
// A pane's ring label changes only when that pane is respawned (its mount letter is fixed in its MCP config at launch).
//
//   node consonance/tools/d423-letters-swap.js            dry run: the plan, nothing changed
//   node consonance/tools/d423-letters-swap.js --apply    with Consonance closed: back up, write, and write the board note to post
const fs = require('fs'), path = require('path'), { spawnSync } = require('child_process');

const O_SEAT = 'c88002b1-74d8-4036-8cc0-f64aefbeabff', P_SEAT = 'fbf98f8e-29da-4fb2-8610-c038d6372249';
const THIRD_PLACE = '3d000000-0000-4000-8000-000000003d00';
const WANT = { [O_SEAT]: 'O', [P_SEAT]: 'P', [THIRD_PLACE]: 'N' };

/** The decision, pure. `reg` is letters.json as an object. Returns { action: 'apply'|'noop'|'refuse', why, next? }. */
function plan(reg) {
  if (!reg || typeof reg !== 'object' || Array.isArray(reg)) return { action: 'refuse', why: 'letters.json is not an object of pane -> letter' };
  if (Object.entries(WANT).every(([k, v]) => reg[k] === v)) return { action: 'noop', why: 'already corrected' };
  const crossed = reg[O_SEAT] === 'N' && reg[P_SEAT] === 'O' && !(THIRD_PLACE in reg);
  if (!crossed) return { action: 'refuse', why: `not the crossed shape (O seat ${reg[O_SEAT]}, P seat ${reg[P_SEAT]}, Third Place ${reg[THIRD_PLACE] ?? 'absent'}): nothing moved` };
  const others = Object.entries(reg).filter(([k, v]) => !(k in WANT) && ['N', 'O', 'P'].includes(v));
  if (others.length) return { action: 'refuse', why: `another pane holds ${others.map(([k, v]) => `${v} (${k.slice(0, 8)})`).join(', ')}: nothing moved` };
  return { action: 'apply', why: 'the crossed shape', next: { ...reg, ...WANT } };
}

function consonanceRunning() {
  const r = spawnSync('tasklist', ['/FI', 'IMAGENAME eq consonance.exe', '/FO', 'CSV', '/NH'], { encoding: 'utf8', windowsHide: true });
  if (r.error || r.status !== 0) return null;   // cannot tell: treated as running by apply()
  return /"consonance\.exe"/i.test(r.stdout);
}

const NOTE = (stamp, backup) => `D423 (seat O, run at the keeper's swap, ${stamp}): letters.json corrected so the ring labels match the room's names. ` +
  `c88002b1 (seat O) N -> O; fbf98f8e (seat P) O -> P; the Third Place (3d000000) registered as N. Board lines and rings BEFORE this note ` +
  `signed [pane:N] were seat O, and [pane:O] were seat P. A pane's label changes when it respawns. Backup: ${backup}.`;

/** Act on <dataDir>/letters.json. `opts.apply` false = dry run. `opts.running` overrides the process check (for tests). */
function run(dataDir, opts = {}) {
  const file = path.join(dataDir, 'letters.json');
  let reg;
  try { reg = JSON.parse(fs.readFileSync(file, 'utf8')); } catch (e) { return { action: 'refuse', why: `cannot read ${file}: ${e.code || e.message}` }; }
  const p = plan(reg);
  if (p.action !== 'apply' || !opts.apply) return p;
  const running = opts.running !== undefined ? opts.running : consonanceRunning();
  if (running !== false) return { action: 'refuse', why: running === null ? 'cannot tell whether Consonance is running: close it and check' : 'Consonance is running: it owns letters.json; run this at the swap, with it closed' };
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backup = path.join(dataDir, `letters.json.bak-d423-${stamp}`);
  fs.copyFileSync(file, backup);
  const tmp = `${file}.d423-tmp`;
  fs.writeFileSync(tmp, JSON.stringify(p.next, null, 2));
  fs.renameSync(tmp, file);
  const after = JSON.parse(fs.readFileSync(file, 'utf8'));
  if (!Object.entries(WANT).every(([k, v]) => after[k] === v)) throw new Error(`written but not as planned; restore from ${backup}`);
  const noteFile = path.join(dataDir, 'd423-letters-note.txt');
  fs.writeFileSync(noteFile, NOTE(stamp, backup) + '\n');
  return { action: 'applied', backup, noteFile, note: NOTE(stamp, backup) };
}

if (require.main === module) {
  const { dataDir } = require('./state-manifest.js');
  const dir = dataDir();
  if (!dir) { console.error('no data dir (CONSONANCE_DATA unset and ~/.consonance.json has no data_dir)'); process.exit(2); }
  const r = run(dir, { apply: process.argv.includes('--apply') });
  console.log(JSON.stringify(r, null, 2));
  if (r.action === 'applied') console.log(`\nPost this to the board once Consonance is open again (post_board), from ${r.noteFile}:\n\n${r.note}`);
  process.exitCode = r.action === 'refuse' ? 3 : 0;
}
module.exports = { plan, run, WANT, O_SEAT, P_SEAT, THIRD_PLACE };
