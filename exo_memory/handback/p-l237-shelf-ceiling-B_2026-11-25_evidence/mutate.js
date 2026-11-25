// B, L237: is each row load-bearing? One change at a time to main.rs, the shelf_ceiling_tests rows run, the file restored.
//   node mutate.js <worktree>
const fs = require('fs'), path = require('path'), { spawnSync } = require('child_process');
const WT = process.argv[2];
const F = 'consonance/src-tauri/src/main.rs';
const M = [
  ['.saturating_sub(INTAKE_HEADROOM).saturating_sub(global);', '.saturating_sub(INTAKE_HEADROOM);'],
  ['        .saturating_sub(global_claude_md_len())\n', ''],
  ['        let carry_tier = dir == "cards";', '        let carry_tier = true;'],
  ['("record", false, false),', '("record", false, true),'],
  ['("spread", false, false),', '("spread", false, true),'],
  ['("research", false, false),', '("research", false, true),'],
  ['    fs::metadata(p).map(|m| m.len() as usize).unwrap_or(0)\n}', '    let _ = p; 0\n}'],
];
const p = path.join(WT, F), orig = fs.readFileSync(p, 'utf8');
for (const [from, to] of M) {
  if (orig.split(from).length !== 2) { console.log(`ERROR not found once: ${from.slice(0, 60)}`); process.exitCode = 1; continue; }
  fs.writeFileSync(p, orig.replace(from, to));
  try {
    const r = spawnSync('cargo', ['test', '-q', '--bin', 'consonance', 'shelf_ceiling_tests'], { cwd: path.join(WT, 'consonance/src-tauri'), encoding: 'utf8', timeout: 900000 });
    const out = (r.stdout || '') + (r.stderr || '');
    const summary = (out.match(/test result: .*/) || [])[0] || (/error\[|^error:/m.test(out) ? 'DID NOT COMPILE' : 'no result line');
    console.log(`${r.status === 0 ? 'SURVIVED' : 'caught  '} ${from.split('\n')[0].trim().slice(0, 70)} -> ${to.split('\n')[0].trim().slice(0, 40) || '(removed)'} | ${summary}`);
  } finally { fs.writeFileSync(p, orig); }
}
