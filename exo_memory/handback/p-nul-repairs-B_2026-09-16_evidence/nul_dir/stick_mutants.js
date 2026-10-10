// Mutants for D067 (2), on COPIES of consonance/ui/{stick.js, stick.test.js, term.js}. Each row re-copies all
// three, applies one change to the copy's stick.js, runs the copy's suite, and prints which tests went red.
// An anchor that does not match EXACTLY ONCE prints NOT APPLIED and is never counted as caught.
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { spawnSync } = require('child_process');

const UI = 'C:/Users/nname/Desktop/lighthouse/consonance/ui';
const WORK = path.join(__dirname, 'stick-mut');
const h = (p) => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');

const ROWS = [
  ['M1 why rendered without escaping', '>${E(result.why)}</p>', '>${result.why}</p>'],
  ['M2 outcome never rendered', '${outcome}${why}', '${why}'],
  ['M3 why never rendered', '${outcome}${why}', '${outcome}'],
  ['M4 why line rendered even when absent', "const why = result.why ? `<p${result.code === 0 ? '' : ' class=\"stick-bad\"'}>${E(result.why)}</p>` : '';",
    "const why = `<p${result.code === 0 ? '' : ' class=\"stick-bad\"'}>${E(result.why)}</p>`;"],
  ['M5 outcome printed raw as a word', "const outcome = result.outcome ? `<p>Outcome: <b>${E(result.outcome)}</b></p>` : '';",
    "const outcome = `<p>Outcome: <b>${result.outcome}</b></p>`;"],
  ['M6 why placed AFTER the section closes', '${outcome}${why}\n', '${outcome}\n'],
  ['CONTROL reword a comment', "// D067: the result's own words.", "// D067: the result's own wording."],
  ['SKIP-CONTROL anchor not present', 'const NOT_A_REAL_ANCHOR = 1;', 'const NOT_A_REAL_ANCHOR = 2;'],
];

const before = h(path.join(UI, 'stick.js'));
const src = fs.readFileSync(path.join(UI, 'stick.js'), 'utf8');
fs.rmSync(WORK, { recursive: true, force: true });
for (const [name, from, to] of ROWS) {
  const n = src.split(from).length - 1;
  if (n !== 1) { console.log(`${name.padEnd(42)} NOT APPLIED — anchor matched ${n} times`); continue; }
  const dir = path.join(WORK, name.split(' ')[0]);
  fs.mkdirSync(dir, { recursive: true });
  for (const f of ['stick.test.js', 'term.js']) fs.copyFileSync(path.join(UI, f), path.join(dir, f));
  let mutated = src.replace(from, () => to);
  // M6 also needs the reason appended after </section>, so it is present but in the wrong place.
  if (name.startsWith('M6')) mutated = mutated.replace('below, read again from the stick and this machine as they are now.</p></section>`;',
    () => 'below, read again from the stick and this machine as they are now.</p></section>${why}`;');
  fs.writeFileSync(path.join(dir, 'stick.js'), mutated);
  const r = spawnSync(process.execPath, [path.join(dir, 'stick.test.js')], { cwd: UI, encoding: 'utf8' });
  const out = String(r.stdout || '') + String(r.stderr || '') + (r.error ? String(r.error) : '');
  const failed = out.split(/\r?\n/).filter((l) => l.trim().startsWith('FAIL')).map((l) => l.trim().slice(5).trim().slice(0, 70));
  const tally = (out.match(/(\d+) passed, (\d+) failed/) || [null, '?', '?']);
  console.log(`${name.padEnd(42)} ${tally[1]}p/${tally[2]}f  ${failed.length ? failed.join(' | ') : (r.status ? 'CRASH ' + out.slice(-120) : 'SURVIVED')}`);
}
console.log(`\ntracked stick.js unchanged: ${h(path.join(UI, 'stick.js')) === before}`);
