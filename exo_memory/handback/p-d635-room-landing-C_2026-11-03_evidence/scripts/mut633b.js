// mut633.js (D633, O): mutants on the trimmed pulse (chain-status.js) and the note's route (mcp.rs). Each anchor must occur EXACTLY ONCE
// (else NOT APPLIED); the file is patched, the covering tests run, the file is restored byte for byte (checked). node mut633.js <out.json>
'use strict';
require('C:/Users/nname/AppData/Local/Temp/claude/C--Consonance-instances-sibling-0845a868/0845a868-38f2-4cc2-b45a-431e0c088fb1/scratchpad/d635/winhide.js');
const fs = require('fs'), os = require('os'), { spawnSync } = require('child_process');
os.setPriority(0, os.constants.priority.PRIORITY_BELOW_NORMAL);
require('C:/Users/nname/Desktop/lighthouse/consonance/tools/heavy-run.js').hold({ cmd: 'C D635 landing: O D633 mutants (cargo + node, BelowNormal)' });
const W = 'C:/Users/nname/Desktop/worktrees/lh-d635-c/';
const JS = W + 'consonance/tools/chain-status.js', RS = W + 'consonance/src-tauri/src/mcp.rs';
const node = () => spawnSync(process.execPath, ['--test', 'chain-status.test.js'], { cwd: W + 'consonance/tools', encoding: 'utf8', maxBuffer: 1 << 26 });
const rust = () => spawnSync('C:/Users/nname/.cargo/bin/cargo.exe', ['test', '--bin', 'consonance', 'trailer'],
  { cwd: W + 'consonance/src-tauri', encoding: 'utf8', maxBuffer: 1 << 28, env: { ...process.env, CARGO_TARGET_DIR: 'G:/Consonance-tools/cargo-c635', CARGO_TERM_COLOR: 'never' } });
const M = [
  ['T1 STALE kept', JS, "new Set(['ledger', 'delivery', 'queued',", "new Set(['stale', 'ledger', 'delivery', 'queued',", node],
  ['T2 the hand-back counts dropped', JS, "'waiting', 'handbacks']);", "'waiting']);", node],
  ['T3 QUEUED dropped', JS, "'delivery', 'queued', 'waiting'", "'delivery', 'waiting'", node],
  ['T4 the CLI prints the full line by default', JS, "trim: !argv.includes('--full')", 'trim: false', node],
  ['T5 the sync segment kept', JS, "put('sync', inSync(", "put('delivery', inSync(", node],
  ['T6 UNRECEIVED kept', JS, "if (up) put('unreceived', up);", "if (up) put('queued', up);", node],
  ['T7 fused kept', JS, "put('fused', ", "put('handbacks', ", node],
  ['T8 dirty kept', JS, "put('dirty', dirtyPart);", "put('ledger', dirtyPart);", node],
  ['T9 trim ignored', JS, 'const shown = opts.trim ? parts.filter((_, i) => PULSE_KEEPS.has(kinds[i])) : parts;', 'const shown = parts;', node],
  ['N1 no note made', RS, 'note: Some(sender_note(why)),', 'note: None,', rust],
  ['N2 the note not appended for the sender', RS, 'Some(n) => format!("{out}\\n\\n{n}"),', 'Some(_) => out,', rust],
  ['N3 call_chair drops the note', RS, 'ChairCmd::CallChair { text, reply: tx }, rx).await;\n        Ok(CallToolResult::success(vec![Content::text(with_sender_note(out, note))]))',
    'ChairCmd::CallChair { text, reply: tx }, rx).await;\n        let _ = note;\n        Ok(CallToolResult::success(vec![Content::text(out)]))', rust],
  ['N4 the note goes back on the receiver\'s copy', RS, '            text: text.to_string(),\n            note: Some(sender_note(why)),',
    '            text: format!("{text}\\n\\n{}", sender_note(why)),\n            note: Some(sender_note(why)),', rust],
];
const out = [];
for (const [name, file, from, to, run] of M) {
  const orig = fs.readFileSync(file);
  const s = orig.toString('utf8'), n = s.split(from).length - 1;
  if (n !== 1) { out.push({ name, verdict: 'NOT APPLIED', matches: n }); console.log(name, 'NOT APPLIED', n); continue; }
  fs.writeFileSync(file, s.replace(from, () => to));
  const t0 = Date.now(); const r = run();
  fs.writeFileSync(file, orig);
  if (!fs.readFileSync(file).equals(orig)) throw new Error('restore failed for ' + name);
  const all = (r.stdout || '') + (r.stderr || ''), clean = all.replace(/\x1b\[[0-9;]*m/g, '');
  const compileErr = /could not compile/.test(all);
  const result = (all.match(/test result: [^\n]*/) || clean.match(/ℹ fail \d+/) || ['(no result line)'])[0];
  const failed = [...(all.match(/^test \S+ \.\.\. FAILED$/gm) || []).map((x) => x.split(' ')[1]), ...(clean.match(/^✖ (D633|E-3\.1|STALE|the dead lap)[^\n(]*/gm) || [])];
  const caught = r.status !== 0;
  out.push({ name, verdict: caught ? 'caught' : 'SURVIVED', exit: r.status, compileError: compileErr, result, failed: [...new Set(failed)], s: Math.round((Date.now() - t0) / 1000) });
  console.log(name, caught ? 'caught' : 'SURVIVED', 'exit', r.status, compileErr ? '(COMPILE ERROR)' : '', '|', result, '|', [...new Set(failed)].join('; ').slice(0, 220));
}
fs.writeFileSync(process.argv[2], JSON.stringify(out, null, 1));
const a = out.filter((x) => x.verdict !== 'NOT APPLIED');
console.log(`applied ${a.length} / caught ${a.filter((x) => x.verdict === 'caught').length} / NOT APPLIED ${out.length - a.length}`);
