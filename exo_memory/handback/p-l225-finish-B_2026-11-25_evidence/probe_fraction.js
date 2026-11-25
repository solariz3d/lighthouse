// probe_fraction.js (B, L225, after pane A's read): what skillListingBudgetFraction values LOAD, and what each does to the skills
// listing. One `claude -p` per arm with the app's builder flags (--dangerously-skip-permissions, one --settings), a fresh cwd and a
// fresh transcript folder, NO --setting-sources (the app passes none, so the user's skills are listed as in a pane). Each arm reports
// whether Claude Code said the file "did not load" (--debug) and the skills listing's bytes from the transcript's api-request-blob.
//   node probe_fraction.js <scratch root> [model]
const fs = require('fs'), os = require('os'), path = require('path'), { spawnSync } = require('child_process');
const [ROOT, MODEL = 'haiku'] = process.argv.slice(2);
const env = Object.fromEntries(Object.entries(process.env).filter(([k]) => !/^CLAUDECODE$|^CLAUDE_CODE_/.test(k)));
const projDir = (cwd) => path.join(os.homedir(), '.claude', 'projects', cwd.replace(/[:\\/.]/g, '-'));
const NP = { permissions: { denyInsteadOfPrompting: true } };
const ARMS = [['none', null], ['no-prompt only', NP], ['fraction 0', { skillListingBudgetFraction: 0 }], ['fraction 0.001', { skillListingBudgetFraction: 0.001 }],
  ['fraction 0.01', { skillListingBudgetFraction: 0.01 }], ['no-prompt + fraction 0.001', { ...NP, skillListingBudgetFraction: 0.001 }]];
fs.mkdirSync(ROOT, { recursive: true });
const runs = ARMS.map(([name, settings], i) => {
  const cwd = path.join(ROOT, 'farm' + i); fs.rmSync(cwd, { recursive: true, force: true }); fs.mkdirSync(cwd); fs.rmSync(projDir(cwd), { recursive: true, force: true });
  const args = ['-p', 'Reply with the single word ok.', '--model', MODEL, '--debug'];
  if (settings) { const f = path.join(ROOT, 'farm' + i + '.settings.json'); fs.writeFileSync(f, JSON.stringify(settings)); args.push('--settings', f); }
  args.push('--dangerously-skip-permissions');
  const r = spawnSync('claude', args, { cwd, env, encoding: 'utf8', timeout: 180000 });
  const notLoaded = /did not load/.test((r.stdout || '') + (r.stderr || ''));
  return { name, settings, cwd, r, notLoaded };
});
spawnSync(process.execPath, ['-e', 'setTimeout(()=>{},15000)']);   // a transcript lands a few seconds after its process ends (seen: read at exit, 0 B)
for (const { name, settings, cwd, r, notLoaded } of runs) {
  let skills = 0;
  const pd = projDir(cwd);
  for (const f of fs.existsSync(pd) ? fs.readdirSync(pd).filter((f) => f.endsWith('.jsonl')) : [])
    for (const l of fs.readFileSync(path.join(pd, f), 'utf8').split('\n')) {
      let v; try { v = JSON.parse(l); } catch { continue; }
      if (v.type !== 'api-request-blob') continue;
      const c = v.message.content;
      for (const b of Array.isArray(c) ? c : [{ text: c }]) {
        const t = (b && b.text) || ''; const m = t.indexOf('The following skills'); if (m < 0) continue;
        const e = t.indexOf('</system-reminder>', m); skills = Math.max(skills, Buffer.byteLength(t.slice(m, e < 0 ? undefined : e)));
      }
    }
  console.log(`${name}: ${settings ? JSON.stringify(settings) : '(no --settings)'} | rc ${r.status} | file ${settings ? (notLoaded ? 'DID NOT LOAD' : 'loaded') : '-'} | skills listing ${skills} B`);
}
