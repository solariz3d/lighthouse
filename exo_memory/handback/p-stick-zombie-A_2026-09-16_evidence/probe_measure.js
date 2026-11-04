// Measure the window probe on the real machine, read-only. Nothing is started or stopped.
const { execFileSync } = require('child_process');
const cmd = (name) => "$p = @(Get-Process -ErrorAction Stop | Where-Object { $_.ProcessName -eq '" + name + "' }); " +
  "'OK ' + $p.Count; foreach ($x in $p) { '{0} {1}' -f $x.Id, [int64]$x.MainWindowHandle }";
for (const name of ['consonance', 'no-such-process-zz', 'node']) {
  const t0 = Date.now();
  let out, code = 0;
  try { out = execFileSync('powershell', ['-NoProfile', '-NonInteractive', '-Command', cmd(name)], { encoding: 'utf8', windowsHide: true, timeout: 15000 }); }
  catch (e) { code = e.status; out = String(e.stdout || '') + ' | ERR ' + e.message.split('\n')[0]; }
  console.log(`${name}: exit ${code}, ${Date.now() - t0} ms\n` + out.trim().split(/\r?\n/).slice(0, 6).map((l) => '   ' + l).join('\n'));
}
