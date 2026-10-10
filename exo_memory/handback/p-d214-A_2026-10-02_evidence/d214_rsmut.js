// Rust mutants of fix 3: apply one anchor replacement to mcp.rs in the worktree, run the cargo tests (own target dir, heavy lock), restore with git. Prints applied/caught.
const { spawnSync } = require('child_process');
const fs = require('fs');
const W = 'C:/Users/nname/Desktop/worktrees/a-d214-wt', F = W + '/consonance/src-tauri/src/mcp.rs';
const SCR = 'C:/Users/nname/AppData/Local/Temp/claude/C--Consonance-instances-sibling-3d57124e/6fe15f0a-634b-4a04-b5de-8bd96b6b5a4f/scratchpad/';
require('C:/Users/nname/Desktop/lighthouse/consonance/tools/heavy-run.js').hold({ cmd: 'd214-rust-mutants' });
const env = { ...process.env, CARGO_TARGET_DIR: 'C:/Users/nname/AppData/Local/Temp/a-d214-target', PATH: process.env.PATH + ';C:\\Users\\nname\\.cargo\\bin' };
for (const k of Object.keys(env)) if (/^CONSONANCE_/.test(k)) delete env[k];
const M = [
  ['pointer chosen from the ring WITH the slot (fix removed)', 'let p = match pointer_in(&body) {', 'let p = match pointer_in(&clean) {'],
  ['the "also named" list is read from the ring WITH the slot', 'let others: Vec<String> = pointers_in(&body)', 'let others: Vec<String> = pointers_in(&clean)'],
  ['continuation lines are not part of the slot', "            } else {\n                continue;\n            }", "            } else {\n                out.push(line);\n            }"],
  ['the NEXT trailer does not end the slot (it is swallowed)', 't.is_empty() || t.starts_with("NEXT:")', 't.is_empty()'],
  ['a blank line does not end the slot', 't.is_empty() || t.starts_with("NEXT:")', 't.starts_with("NEXT:")'],
  ['a slot head needs no colon', ".trim_start().starts_with(':'),", '.trim_start().starts_with(\':\') || true,'],
  ['markdown emphasis before the head is not tolerated', "line.trim_start_matches(|c: char| c == '*' || c == '_' || c == '>' || c == '-' || c.is_whitespace())", 'line.trim_start()'],
  ['the refusal no longer says which spelling the pointer wants', " The pointer is a repo-relative path in the ring's prose (exo_memory/handback/<packet>_<date>.md); a path on the SOURCES: line is never taken as the pointer.", ''],
];
let applied = 0, caught = 0, na = 0;
const orig = fs.readFileSync(F, 'utf8');
M.forEach(([name, a, b], i) => {
  const hits = orig.split(a).length - 1;
  if (hits !== 1) { na++; console.log(`${i + 1} ${name}: NOT APPLIED (anchor ${hits}x)`); return; }
  applied++;
  fs.writeFileSync(F, orig.replace(a, () => b));
  const r = spawnSync('cargo', ['test', '--bin', 'consonance', 'digest_at_ring', '--', '--test-threads=1'], { cwd: W + '/consonance/src-tauri', env, encoding: 'utf8', maxBuffer: 1 << 28, timeout: 3600000 });
  const o = (r.stdout || '') + (r.stderr || '');
  const m = o.match(/test result: (\w+)\. (\d+) passed; (\d+) failed/), compiled = !/error(\[|:)/.test(o.split('Running')[0] || '') ;
  const ok = (m && m[1] === 'FAILED') || (r.status !== 0);
  if (ok) caught++;
  console.log(`${i + 1} ${name}: ${m ? m[1] + ' ' + m[2] + '/' + m[3] : 'no test result'} exit ${r.status} ${ok ? 'CAUGHT' : 'SURVIVED'}`);
  fs.writeFileSync(F, orig);
});
fs.writeFileSync(F, orig);
console.log(`\n${applied} applied · ${caught} caught · ${applied - caught} survived · ${na} NOT APPLIED`);
