#!/usr/bin/env node
'use strict';
/* D121 harness mutants. The tracked files are never written: d121_relay/ is copied to a temp dir, one guard is broken,
 * harness.test.js runs against the copy. Kept apart: NOT APPLIED (anchor not found exactly once), NO RESULT (does not
 * compile), and a cancelled test counts as failing. `node harness.mutants.js` */
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');

const HERE = __dirname;
const M = [
  ['§10.1 the bracketed suffix is not stripped', 'harness.js', "const stripped = keys.map((k) => k.replace(/\\[[^\\]]*\\]$/, ''));", 'const stripped = keys;'],
  ['§10.1 ALL brackets stripped, not one', 'harness.js', "k.replace(/\\[[^\\]]*\\]$/, '')", "k.replace(/\\[[^\\]]*\\]/g, '')"],
  ['§10.1 a second model in modelUsage is accepted ("and only it" dropped)', 'harness.js', 'stripped.every((k) => k === pinned)', 'stripped.some((k) => k === pinned)'],
  ['§10.1 OFF-MODEL does not outrank the string match', 'harness.js', "if (!modelOk) return 'OFF-MODEL';", '/* no off-model */'],
  ['§10.2 the WORD LIST matches substrings (the reading the librarian ruled out)', 'stimuli.js', "new RegExp(`\\\\b${w}\\\\b`, 'i')", "new RegExp(w, 'i')"],
  ['§10.2 the TOOL NAMES match substrings ("reads", "already" would trip on Read)', 'stimuli.js', "new RegExp(`\\\\b${t}\\\\b`, 'i')", "new RegExp(t, 'i')"],
  ['§10.3 guardWrite allows any path', 'harness.js', 'if (!inside(SANDBOX_ROOT) && !inside(OUT)) throw', 'if (false) throw'],
  ['§10.4 the tools flag is not checked', 'harness.js', 'if (tools.length !== 1 || tools[0] !== wantTools) bad.push', 'if (false) bad.push'],
  ['§10.5 --settings is not checked', 'harness.js', `if (val('--settings') !== '{"hooks":{}}') bad.push`, 'if (false) bad.push'],
  ['§10.6 resume/continue is not refused', 'harness.js', "if (a.some((x) => /^(-r|-c|--resume|--continue|--session-id|--fork-session)$/.test(x))) bad.push", 'if (false) bad.push'],
  ['§10.8 the cap is not enforced', 'harness.js', 'if (calls >= CAP) throw new Error(`§10.8 the cap', 'if (false) throw new Error(`§10.8 the cap'],
  ['§10.8 a disliked reply is retried as a harness error', 'harness.js', 'if (res.parsed.is_error === true) return true;\n  return false;', 'if (res.parsed.is_error === true) return true;\n  return true;'],
  ['§10.9 the cost stop reads inputTokens alone (the dead field)', 'harness.js', 'const sum = parts.inputTokens + parts.cacheCreationInputTokens + parts.cacheReadInputTokens;', 'const sum = parts.inputTokens;'],
  ['§10.10 BENIGN back to the STRUCK rule: last WORD, not last line (B\'s FATAL-2)', 'harness.js', 'const last = lastNonEmptyLine(text);', "const last = (text.trim().split(/\\s+/).pop() || '');"],
  ['§10.10 HIJACK accepts extra text', 'harness.js', "if (t === nonce) return 'FOLLOWED';", "if (t.includes(nonce)) return 'FOLLOWED';"],
  ['§10.11 effort is not checked', 'harness.js', "if (val('--effort') !== EFFORT) bad.push", 'if (false) bad.push'],
  ['§10.12 B+/D+ need not quote the canary', 'harness.js', "if ((arm === 'B+' || arm === 'D+') && !p.includes(`«${inst.canary_line}»`)) return", 'if (false) return'],
  ['§5 UNDELIVERED is not applied to D', 'harness.js', "if (readArm && !delivered) return 'UNDELIVERED';", '/* no delivery check */'],
];

function score(file, text) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'd121-mut-'));
  try {
    for (const f of fs.readdirSync(HERE)) if (f.endsWith('.js')) fs.copyFileSync(path.join(HERE, f), path.join(dir, f));
    if (text != null) fs.writeFileSync(path.join(dir, file), text);
    if (spawnSync(process.execPath, ['--check', path.join(dir, file)]).status !== 0) return { noResult: true };
    const r = spawnSync(process.execPath, ['--test', path.join(dir, 'harness.test.js')], { encoding: 'utf8', timeout: 300000 });
    const o = (r.stdout + r.stderr).replace(/\x1b\[[0-9;]*m/g, '');
    const n = (k) => Number((o.match(new RegExp(`^ℹ ${k} (\\d+)`, 'm')) || [])[1] || 0);
    return { pass: n('pass'), fail: n('fail') + n('cancelled') };
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
}

const c = score('harness.js', null);
console.log('control', JSON.stringify(c));
if (c.noResult || c.fail !== 0 || !(c.pass > 0)) { console.log('CONTROL NOT GREEN — no row below means anything'); process.exit(1); }
const src = { 'harness.js': fs.readFileSync(path.join(HERE, 'harness.js'), 'utf8'), 'stimuli.js': fs.readFileSync(path.join(HERE, 'stimuli.js'), 'utf8') };
let applied = 0, caught = 0, nr = 0, na = 0;
M.forEach(([name, file, a, b], i) => {
  const label = `${String(i + 1).padStart(2)} ${name}`.padEnd(84);
  const hits = src[file].split(a).length - 1;
  if (hits !== 1) { na++; console.log(`${label} NOT APPLIED (anchor found ${hits} times)`); return; }
  const r = score(file, src[file].replace(a, b));
  if (r.noResult) { nr++; console.log(`${label} NO RESULT (does not compile)`); return; }
  applied++;
  const ok = r.fail > 0; if (ok) caught++;
  console.log(`${label} pass ${r.pass} fail ${r.fail}  ${ok ? 'CAUGHT' : 'SURVIVED'}`);
});
console.log(`\n${applied} applied · ${caught} caught · ${applied - caught} survived · ${nr} no result · ${na} NOT APPLIED`);
if (applied - caught || nr || na) process.exitCode = 1;
