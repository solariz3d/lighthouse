// D086 P-T3-RUN — the 9 subjects, under t3_run_registration_2026-09-19.md §2/§3/§4. Run ONCE: node run.js
// Route (A6): claude -p --restricted --strict-mcp-config --model claude-opus-5, a FRESH directory outside every repo per
// subject, the arm's material via --append-system-prompt-file (nothing for cold), the answer from stdout JSON.
// Extra flags, both context-free: --output-format json (the stdout JSON the route names) and --no-session-persistence.
// NOT used: --max-budget-usd (it injects a "USD budget" line into the subject's context), --permission-mode acceptEdits.
// Re-runs: ONLY for a process failure (non-zero exit, empty stdout, unparseable JSON, empty result). Every attempt logged.
const fs = require('fs'), os = require('os'), path = require('path'), crypto = require('crypto');
const { spawnSync, execFileSync } = require('child_process');
const RUN = __dirname;
const CLAUDE = 'C:/Users/nname/.local/bin/claude.exe';
const MAT = { cold: null, seed: path.join(RUN, 'seed.txt'), intake: path.join(RUN, 'intake.frozen.md') };
const sha = (p) => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const FROZEN = { 'seed.txt': 'ec99264032af34b15a2694bc9d78f8cfab8c6ca0fa57a534e0bdb93e946cac5a',
  'intake.frozen.md': 'dfdab9b4e0071718f62015bd9eb17a250e69b8b3d1c9fb9d333238f6e8598151',
  'task1.txt': '87c3ec5bd89c878c0c67b19a046afd1df4d0bdb1aa24e2341b8253cfb4c9b5cf',
  'task2.txt': '1cdf9175c44d395ab3696911ec504c32ef988fae43337343d8d10bb51f418080',
  'task3.txt': 'b6dc1253ab817327d874e59b6e8871de98621e4d07905a49eb02a951d741db83' };
for (const [f, h] of Object.entries(FROZEN)) if (sha(path.join(RUN, f)) !== h) throw new Error(`FROZEN artefact changed: ${f}`);
const raw = path.join(RUN, 'raw');
if (fs.existsSync(raw)) throw new Error('raw/ exists: this runner runs once; a second run would be a re-run of every subject');
fs.mkdirSync(raw);
const log = [];
const failed = (r, j) => r.status !== 0 || !r.stdout || !j || j.is_error || !j.result || !String(j.result).trim();
for (const t of [1, 2, 3]) {
  const task = fs.readFileSync(path.join(RUN, `task${t}.txt`), 'utf8');
  for (const arm of ['cold', 'seed', 'intake']) {
    for (let attempt = 1; attempt <= 3; attempt++) {
      const cwd = fs.mkdtempSync(path.join(os.tmpdir(), `t3subj-`));
      let top = ''; try { top = execFileSync('git', ['-C', cwd, 'rev-parse', '--show-toplevel'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }); } catch (_) { top = ''; }
      if (top.trim()) throw new Error(`subject cwd is inside a repo: ${top}`);
      const args = ['-p', task, '--restricted', '--strict-mcp-config', '--model', 'claude-opus-5'];
      if (MAT[arm]) args.push('--append-system-prompt-file', MAT[arm]);
      args.push('--output-format', 'json', '--no-session-persistence');
      const t0 = Date.now();
      const r = spawnSync(CLAUDE, args, { cwd, encoding: 'utf8', maxBuffer: 1 << 26, timeout: 900000 });
      const ms = Date.now() - t0;
      let j = null; try { j = JSON.parse(r.stdout); } catch (_) { j = null; }
      const u = j && j.usage ? j.usage : {};
      const rec = { task: t, arm, attempt, cwd, cmd: [CLAUDE, ...args.map((a) => (a === task ? `<task${t}.txt>` : a))].join(' '),
        exit: r.status, stdoutBytes: (r.stdout || '').length, ms, is_error: j ? j.is_error : null,
        input: (u.input_tokens || 0) + (u.cache_creation_input_tokens || 0) + (u.cache_read_input_tokens || 0),
        output: u.output_tokens || 0, cost: j ? j.total_cost_usd : null, models: j ? Object.keys(j.modelUsage || {}) : [],
        resultChars: j && j.result ? String(j.result).length : 0 };
      const bad = failed(r, j);
      rec.processFailure = bad;
      log.push(rec);
      fs.writeFileSync(path.join(raw, `task${t}-${arm}-attempt${attempt}.json`), r.stdout || '');
      if (bad) fs.writeFileSync(path.join(raw, `task${t}-${arm}-attempt${attempt}.stderr.txt`), r.stderr || '');
      console.log(`task${t} ${arm.padEnd(6)} attempt ${attempt}: exit ${r.status} in ${rec.input} out ${rec.output} ${(ms / 1000).toFixed(1)}s ${rec.models.join(',')} ${bad ? 'PROCESS FAILURE' : 'ok'}`);
      if (!bad) { fs.writeFileSync(path.join(raw, `task${t}-${arm}.txt`), String(j.result)); break; }
    }
  }
}
fs.writeFileSync(path.join(RUN, 'runlog.json'), JSON.stringify(log, null, 1));
console.log(`\nattempts ${log.length}; process failures ${log.filter((x) => x.processFailure).length}; input ${log.reduce((n, x) => n + x.input, 0)}; output ${log.reduce((n, x) => n + x.output, 0)}`);
