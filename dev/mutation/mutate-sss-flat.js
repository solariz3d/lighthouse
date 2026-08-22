// Registered mutation for sessionstart-state.js, run ON THIS LAPTOP where it previously could not
// fire. Mutates the REAL file, runs the suite, restores unconditionally.
'use strict';
const fs = require('fs');
const { execFileSync } = require('child_process');
const p = 'C:/Consonance/lighthouse/consonance/hooks/sessionstart-state.js';
const T = 'C:/Consonance/lighthouse/consonance/hooks/sessionstart-state.test.js';
const orig = fs.readFileSync(p, 'utf8');

function suite() {
  try {
    const out = execFileSync(process.execPath, [T], { encoding: 'utf8' });
    return { code: 0, out };
  } catch (e) { return { code: e.status, out: (e.stdout || '') + (e.stderr || '') }; }
}
const strip = (t) => t.replace(/\x1b\[[0-9;]*m/g, '');
const summarise = (r) => {
  const t = strip(r.out);
  const pass = (t.match(/pass (\d+)/) || [])[1];
  const fail = (t.match(/fail (\d+)/) || [])[1];
  const named = [...t.matchAll(/[✖x] (a HOME[^\n(]*|resolves the generator[^\n(]*)/g)].map(m => m[1].trim());
  return `exit=${r.code} pass=${pass} fail=${fail}` + (named.length ? `\n     red: ${[...new Set(named)].join(' | ')}` : '');
};

const MUTANTS = [
  ['delete the fromConfig() candidate', s => s.replace(/^.*fromConfig\(\),.*$/m, '')],
  ['make fromConfig() ignore room_path', s => s.replace(/if \(!cfg\.room_path\) return null;/, 'if (!cfg.room_path) return null; return null;')],
];

console.log('baseline:', summarise(suite()));
let killed = 0;
for (const [name, fn] of MUTANTS) {
  const mutated = fn(orig);
  if (mutated === orig) { console.log('NOT APPLIED  ' + name); continue; }
  fs.writeFileSync(p, mutated);
  const r = suite();
  fs.writeFileSync(p, orig);
  const dead = r.code !== 0;
  if (dead) killed++;
  console.log((dead ? 'KILLED  ' : 'SURVIVED ') + name + '  -> ' + summarise(r));
}
fs.writeFileSync(p, orig);
console.log('restored byte-identical:', fs.readFileSync(p, 'utf8') === orig);
console.log(`mutation score: ${killed}/${MUTANTS.length}`);
