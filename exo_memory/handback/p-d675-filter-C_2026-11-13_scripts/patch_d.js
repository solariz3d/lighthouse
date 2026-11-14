// patch_d.js: adds to check.js the chair's 01:30Z arm (d): ONLY if all three builds fell short, main once more at NORMAL
// priority with NO processor cap (the child's priority and affinity reset just after it starts, then read back and
// logged), still inside the exclusive hold. The one case the BelowNormal rule is set aside, by that ruling, for that run.
'use strict';
const fs = require('fs'), path = require('path');
const f = path.join(__dirname, 'check.js');
let s = fs.readFileSync(f, 'utf8');
const rep = (a, b) => { if (s.split(a).length !== 2) throw new Error('anchor: ' + a.slice(0, 80)); s = s.replace(a, () => b); };

// runOnce takes an optional `free` flag: after spawning, set the child to Normal and to every logical CPU, and log both.
rep('async function runOnce(arm, k, attempt) {', 'async function runOnce(arm, k, attempt, free = false) {');
rep("  const T = TARGETS.find((t) => t.key === arm); const EXE = T.exe, CLONE = T.clone;",
    "  const T = TARGETS.find((t) => t.key === arm.replace(/-normal$/, '')); const EXE = T.exe, CLONE = T.clone; const cfgKey = T.key;");
rep("  const label = `${String(k).padStart(2, '0')}-${arm}${attempt > 1 ? '-try' + attempt : ''}`;",
    "  const label = `${String(k).padStart(2, '0')}-${arm}${attempt > 1 ? '-try' + attempt : ''}`;\n  const RESULT = {};");
rep("  const child = spawn(EXE, [...ARGS, '--config', path.win32.join(O, 'cfg-' + arm)], { cwd: path.join(CLONE, 'build', 'bin'), windowsHide: true, stdio: ['ignore', fd, fd] });",
`  const child = spawn(EXE, [...ARGS, '--config', path.win32.join(O, 'cfg-' + cfgKey)], { cwd: path.join(CLONE, 'build', 'bin'), windowsHide: true, stdio: ['ignore', fd, fd] });
  if (free) {
    try {
      os.setPriority(child.pid, os.constants.priority.PRIORITY_NORMAL);
      const all = (1 << os.cpus().length) - 1;
      const back = execFileSync('powershell', ['-NoProfile', '-Command', \`$p = Get-Process -Id \${child.pid}; $p.ProcessorAffinity = \${all}; $p.Refresh(); "$($p.PriorityClass) $($p.ProcessorAffinity)"\`], { encoding: 'utf8', windowsHide: true }).trim();
      log(\`  \${label}: the child set free: priority class and affinity read back as "\${back}" (all \${os.cpus().length} logical CPUs = \${all})\`);
    } catch (e) { log(\`  \${label}: could not set the child free: \${e.message.split('\\n')[0]}\`); }
  }`);
// record frames for the decision
rep("  const gpu = text.match(", "  const gpu0 = text.match(/GPU frame \\(timestamps, first pass to last\\): avg ([\\d.]+) ms, p50 ([\\d.]+), p99 ([\\d.]+), worst ([\\d.]+) \\((\\d+) frames\\)/);\n  if (gpu0) LASTFRAMES[arm] = Number(gpu0[5]);\n  const gpu = text.match(");
rep("const ORDER = [];", "const ORDER = [];\nconst LASTFRAMES = {};");
rep("  const exeAfter = exeStat();",
`  const short = TARGETS.filter((t) => LASTFRAMES[t.key] !== undefined && LASTFRAMES[t.key] < PACED).length;
  log(\`frames drawn of \${PACED} paced: \${TARGETS.map((t) => \`\${t.key} \${LASTFRAMES[t.key] ?? 'none'}\`).join('; ')}; \${short} of 3 short\`);
  if (short === 3) {
    log('all three short: arm (d), main once at Normal priority with no processor cap (the chair\\'s 01:30Z ruling)');
    await runOnce('b-main-81eb524-normal', ORDER.length + 1, 1, true);
  } else log('arm (d) not run: not all three fell short');
  const exeAfter = exeStat();`);
fs.writeFileSync(f, s);
console.log('arm (d) added');
