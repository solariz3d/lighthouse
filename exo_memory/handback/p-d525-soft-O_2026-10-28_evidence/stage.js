// stage.js (D525 Part 1, O): four copies of the CURRENT CRAZY TEST track folder (read only), each differing from it ONLY in data/surfaces.ini's [COLLISION_PARAMS_...]
// block and in its folder and ui name (suffix _soft_a … _soft_d), staged in this scratchpad; a sha256 + size manifest of the source and of every staged file;
// the four surfaces.ini diffs. Nothing is written outside <out>.   node stage.js <source folder> <out>
'use strict';
const fs = require('fs'), path = require('path'), crypto = require('crypto');
const [SRC, OUT] = process.argv.slice(2);
const sha = (b) => crypto.createHash('sha256').update(b).digest('hex');
const walk = (dir, base = dir, out = []) => { for (const e of fs.readdirSync(dir, { withFileTypes: true })) { const p = path.join(dir, e.name); if (e.isDirectory()) walk(p, base, out); else out.push(path.relative(base, p).split(path.sep).join('/')); } return out; };
const manifest = (dir) => Object.fromEntries(walk(dir).sort().map((f) => { const b = fs.readFileSync(path.join(dir, f)); return [f, { sha256: sha(b), size: b.length }]; }));
const NAME = path.basename(SRC);
const src = manifest(SRC);
const before = JSON.stringify(src);

const SHIPPED = ['MESHES=1ROAD?', 'SOFT_ERP=0.8', 'SOFT_CFM=0.0002', 'BOUNCE=0.1', 'FRICTION=0.05', 'MAX_DEPTH=4'];
// the one line each variant changes or adds, after the shipped block's own lines; the comment names the variant and its reason
const VARIANTS = {
  a: { note: 'D525 variant A: the shipped block, unchanged (the control)', lines: SHIPPED },
  b: { note: 'D525 variant B: STIFFER: SOFT_CFM 0.0002 -> 0.00005 (CSP: "the higher it is, the softer is the collision")', lines: SHIPPED.map((l) => (l === 'SOFT_CFM=0.0002' ? 'SOFT_CFM=0.00005' : l)) },
  c: { note: 'D525 variant C: SOFTER: SOFT_CFM 0.0002 -> 0.0008 (CSP: "the higher it is, the softer is the collision")', lines: SHIPPED.map((l) => (l === 'SOFT_CFM=0.0002' ? 'SOFT_CFM=0.0008' : l)) },
  d: { note: 'D525 variant D: the shipped block plus INTENSITY/RIGID_WITH_BODIES/RIGID_WITH_BOXES as the observed T-180 tracks set them (1/0/0)', lines: [...SHIPPED, 'INTENSITY=1', 'RIGID_WITH_BODIES=0', 'RIGID_WITH_BOXES=0'] },
};
const surf = fs.readFileSync(path.join(SRC, 'data/surfaces.ini'), 'utf8');
const BLOCK = ['[COLLISION_PARAMS_...]', '; T-180 soft road (docs/FINDINGS.md §4c). CSP only: plain AC ignores this section.', ...SHIPPED].join('\n');
const eol = surf.includes('\r\n') ? '\r\n' : '\n', norm = surf.replace(/\r\n/g, '\n');
if (norm.split(BLOCK).length !== 2) throw new Error('the source surfaces.ini does not hold the shipped block exactly once: stopping');
const ui = JSON.parse(fs.readFileSync(path.join(SRC, 'ui/ui_track.json'), 'utf8'));

const out = { source: { folder: SRC, files: src }, staged: {} }, diffs = [];
for (const [k, v] of Object.entries(VARIANTS)) {
  const name = `${NAME}_soft_${k}`, dst = path.join(OUT, name);
  if (fs.existsSync(dst)) throw new Error(`${dst} exists already: stopping, nothing overwritten`);
  fs.cpSync(SRC, dst, { recursive: true });
  const block = ['[COLLISION_PARAMS_...]', '; T-180 soft road (docs/FINDINGS.md §4c). CSP only: plain AC ignores this section.', `; ${v.note}`, ...v.lines].join('\n');
  fs.writeFileSync(path.join(dst, 'data/surfaces.ini'), norm.replace(BLOCK, block).replace(/\n/g, eol));
  fs.writeFileSync(path.join(dst, 'ui/ui_track.json'), JSON.stringify({ ...ui, name: `${ui.name}_soft_${k}` }, null, 2));
  const m = manifest(dst); out.staged[name] = m;
  const changed = Object.keys(m).filter((f) => !src[f] || src[f].sha256 !== m[f].sha256), missing = Object.keys(src).filter((f) => !m[f]);
  if (missing.length || changed.some((f) => f !== 'data/surfaces.ini' && f !== 'ui/ui_track.json')) throw new Error(`${name}: unexpected differences: ${[...changed, ...missing].join(', ')}`);
  const a = norm.split('\n'), b = fs.readFileSync(path.join(dst, 'data/surfaces.ini'), 'utf8').replace(/\r\n/g, '\n').split('\n');
  diffs.push(`== ${name}/data/surfaces.ini against the source (changed: ${changed.join(', ')})\n` + b.filter((l) => !a.includes(l)).map((l) => '+ ' + l).concat(a.filter((l) => !b.includes(l)).map((l) => '- ' + l)).join('\n'));
}
if (JSON.stringify(manifest(SRC)) !== before) throw new Error('the SOURCE changed while it was read: stopping');
fs.writeFileSync(path.join(OUT, 'manifest.json'), JSON.stringify(out, null, 1));
const txt = [`source ${SRC}`, ...Object.entries(src).map(([f, x]) => `  ${x.sha256}  ${String(x.size).padStart(10)}  ${f}`)];
for (const [n, m] of Object.entries(out.staged)) { txt.push(`${n}`); for (const [f, x] of Object.entries(m)) txt.push(`  ${x.sha256}  ${String(x.size).padStart(10)}  ${f}${src[f] && src[f].sha256 === x.sha256 ? '' : '   <- differs from the source'}`); }
fs.writeFileSync(path.join(OUT, 'manifest.txt'), txt.join('\n') + '\n');
fs.writeFileSync(path.join(OUT, 'surfaces-diffs.txt'), diffs.join('\n\n') + '\n');
console.log(txt.join('\n')); console.log('\n' + diffs.join('\n\n'));
