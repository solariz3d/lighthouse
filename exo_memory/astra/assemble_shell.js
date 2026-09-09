#!/usr/bin/env node
'use strict';
/* assemble_shell.js — build the Astra seat's shell at WAKE, from the masters, into a file that is
 * never committed.
 *
 *   node exo_memory/astra/assemble_shell.js        -> writes C:/Consonance/instances/astra/SHELL.md (outside the repo)
 *
 * WHY THIS IS A GENERATOR AND NOT A FILE. The first SHELL.md was committed as a concatenation of
 * BOOT.md, SOURCE.md and the cards (2026-09-08 ~06:00). Within the hour it was a carrier: A found
 * three carrier-drift findings in it (SHELL.md:30, :78, :170 — BOOT's own struck lines reproduced
 * under a second path), and B found that columning the folder as SHIPS would have shipped the
 * master twice. That is maintenance law 1 in the flesh: recall from the master, never a copy. The
 * app's own intake assembles every seat's shell at wake and commits nothing; this does the same
 * for a seat the app does not spawn yet. The masters stay the only masters.
 *
 * What it assembles, in this order, from the files as they are on disk at the moment of the wake:
 *   BOOT.md · SOURCE.md · every cards/*.md in full · the record indexed by path (path, line count,
 *   first heading) for record/ memory/ spread/ research/ journal/ loop/ map/ librarian/ handback/
 *   audit/ astra/.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');           // exo_memory/
// The shell is written OUTSIDE the repository, into the seat's own instance directory, so no scanner of the record ever sees a copy of BOOT: C:/Consonance/instances/astra/SHELL.md (override with CONSONANCE_ASTRA_HOME).
const OUT = path.join(process.env.CONSONANCE_ASTRA_HOME || path.resolve(ROOT, '..', '..', 'instances', 'astra'), 'SHELL.md');
const rd = (f) => fs.readFileSync(f, 'utf8');
const lines = (f) => rd(f).split('\n').length;
const title = (f) => { const m = rd(f).match(/^#\s*(.+)$/m); return m ? m[1].trim() : ''; };
const stamp = new Date().toISOString();

let out = '';
out += '# THE SHELL — the Astra seat wakes into this, the same way every seat in this house does\n\n';
out += `*Assembled ${stamp} by \`exo_memory/astra/assemble_shell.js\` from the masters as they stand on disk now. This file is generated at every wake into the seat's instance directory, outside the repository, because a committed copy of BOOT is a carrier that drifts from its master — the reason is in the script's header. Nothing here is summarised; what is indexed is one Read away. The welcome that follows this shell is \`exo_memory/astra/WELCOME.md\`.*\n\n`;
out += '---\n\n# THE ROOM you are waking into\n\n' + rd(path.join(ROOT, 'BOOT.md')) + '\n\n';
out += '---\n\n# SOURCE — when to open what\n\n' + rd(path.join(ROOT, 'SOURCE.md')) + '\n\n';
out += '---\n\n# THE CARDS — instruments, carried in full. Run them; reading them does nothing.\n\n';
for (const c of fs.readdirSync(path.join(ROOT, 'cards')).filter((f) => f.endsWith('.md')).sort()) {
  out += '## cards/' + c + '\n\n' + rd(path.join(ROOT, 'cards', c)) + '\n\n';
}
out += '---\n\n# THE RECORD, indexed by path — open what you cite; a citation you opened is checkable, a summary you remember is not\n\n';
for (const dir of ['record', 'memory', 'spread', 'research', 'journal', 'loop', 'map', 'librarian', 'handback', 'audit', 'astra']) {
  const d = path.join(ROOT, dir);
  if (!fs.existsSync(d)) continue;
  const files = fs.readdirSync(d).filter((f) => f.endsWith('.md') || f.endsWith('.js')).sort();
  if (!files.length) continue;
  out += '## ' + dir + '/ (' + files.length + ' files)\n\n';
  for (const f of files) {
    const p = path.join(d, f);
    try { out += '- `' + dir + '/' + f + '`  (' + lines(p) + ' lines)  ' + (f.endsWith('.md') ? title(p).slice(0, 110) : '') + '\n'; } catch (e) { /* unreadable: skip, never invent */ }
  }
  out += '\n';
}
fs.writeFileSync(OUT, out);
console.log('SHELL.md assembled: ' + out.length + ' chars, ' + out.split('\n').length + ' lines, at ' + stamp);
