#!/usr/bin/env node
'use strict';
// leftovers.js — the counts of what our runs leave on the machine (D450 part 3, pane C). READ-ONLY: it removes, stops and writes nothing.
// Plan: exo_memory/loop/plan_cleanup_2026-10-24.md, part 3. BUILDING.md "Leave the machine as you found it" has the landing hand-back carry its output.
//
//   node consonance/tools/leftovers.js                 the counts, as text
//   node consonance/tools/leftovers.js --json          the same, as JSON
//   --repo <dir>        a repository whose worktrees our runs make; repeat it for each (default: the repository this tool is in)
//   --repo-names <dir>  the same, but read no further than the names in its worktrees/ folder (a checkout that is not ours to open)
//   --strays <folder> --prefix <name->   where those worktrees are made, and their name prefix (default: not scanned)
//   --min-age <minutes> what counts as long-running (default 120)
// D454 part 2: the repos and the strays folder are given, not the original room's t180 paths, so the tool fits any machine.
//
// The counts:
//   tab proxies     Explorer's top-level Windows.Internal.Shell.TabProxyWindow windows. On 2026-10-24 Explorer held 527, titled
//                   after the app under test, from nine days of headless page runs (exo_memory/journal/2026-10-24.md). They are made by the
//                   shell's WindowTabHost (twinui.pcshell.dll, tabproxywindowfactory.cpp), the host of Windows.UI.Shell.WindowTabManager.
//                   A READ OF 0 IS NOT PRINTED AS 0. A counter that reads 0 has not shown it could see one: A's read 0 at 13:58:11Z, the
//                   second Explorer restarted (p-d449-landing-A_2026-10-24.md §5). So the count is CALIBRATED only when this run either
//                   read a proxy that exists, or made a control proxy (a WindowTabManager tab titled zz-leftovers-control on a window that
//                   is never shown) and saw the count rise. Otherwise it prints UNCALIBRATED. As of 2026-10-24 the control does not make a
//                   proxy on this machine (pane C's probes, p-d450-part3-C_2026-10-24.md), so a clean machine reads UNCALIBRATED.
//   worktrees       per repo, the entries in <repo>/.git/worktrees (names only: a repo is read no further than that, and its gitdir files).
//   strays          entries in the strays folder named <prefix>* that are neither a repo's main checkout nor a worktree a repo has registered
//                   (its .git file points into <repo>/.git/worktrees/<name>, and that exists).
//   fake roots      fake-* at each drive root.
//   our long-running processes older than --min-age whose command line or executable names one of our places (a seat's Temp\claude
//                   folder, the seats' shell snapshots, the scratch root, a given repo or one of its registered worktrees, the strays
//                   folder's <prefix>* entries) or is a headless browser. Infrastructure is not listed: consonance.exe, claude.exe,
//                   msedgewebview2.exe, the stick-waiter, the MCP servers.
// It runs itself at BelowNormal priority, and its two PowerShell children inherit it.
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');
const scratch = require('./scratch.js');

const PROXY_CLASS = 'Windows.Internal.Shell.TabProxyWindow';
const REPO = path.resolve(__dirname, '..', '..');
// The places that are ours on any machine; the given repos, their worktrees and the strays folder are added per survey (oursFor).
const OURS_ALWAYS = [/\\temp\\claude\\/, /\\shell-snapshots\\/, /zz-headless-test/];
// Headless counts only for a browser: conhost.exe --headless is Windows' pseudo-console under every seat's terminal, not a run of ours.
const HEADLESS_BROWSER = /^(chrome|msedge|chromium|chrome-headless-shell|headless_shell)(\.exe)?$/;
const INFRA_NAMES = new Set(['consonance.exe', 'claude.exe', 'msedgewebview2.exe']);
const INFRA_CMD = [/stick-waiter\.js/, /\\world-sense\\server\.js/, /\\\.claude\\shell\\mcp\\/];
const norm = (s) => String(s || '').toLowerCase().replace(/\//g, '\\');

/** Run a PowerShell script (passed encoded, so no quoting reaches the shell) and parse its one line of JSON. */
function psJson(script) {
  const r = spawnSync('powershell', ['-NoProfile', '-NonInteractive', '-STA', '-EncodedCommand', Buffer.from(script, 'utf16le').toString('base64')],
    { encoding: 'utf8', timeout: 120000, windowsHide: true, maxBuffer: 1 << 26 });
  if (r.status !== 0) throw new Error(`powershell failed: ${String(r.stderr || r.error || '').slice(0, 300)}`);
  return parsePsLine(String(r.stdout).trim().split(/\r?\n/).pop());
}

/** One compressed JSON line from Windows PowerShell 5.1. Its ConvertTo-Json can leave a control character raw inside a string (a live
 *  process's command line carried one on 2026-10-25), which JSON.parse refuses. On one -Compress line every such character is inside a
 *  string, so each is written as its \u escape first; anything else malformed still throws. */
function parsePsLine(line) {
  return JSON.parse(String(line).replace(/[\u0000-\u001f]/g, (c) => '\\u' + c.charCodeAt(0).toString(16).padStart(4, '0')));
}

const WINDOWS_CS = `
using System; using System.Text; using System.Threading; using System.Collections.Generic; using System.Runtime.InteropServices;
public class LeftoversWin {
  public delegate bool EP(IntPtr h, IntPtr l);
  [DllImport("user32.dll")] public static extern bool EnumWindows(EP p, IntPtr l);
  [DllImport("user32.dll", CharSet=CharSet.Unicode)] public static extern int GetClassName(IntPtr h, StringBuilder s, int n);
  [DllImport("user32.dll", CharSet=CharSet.Unicode)] public static extern int GetWindowText(IntPtr h, StringBuilder s, int n);
  [DllImport("user32.dll", CharSet=CharSet.Unicode)] public static extern IntPtr CreateWindowEx(int ex, string cls, string name, int style, int x, int y, int w, int h, IntPtr p, IntPtr m, IntPtr i, IntPtr lp);
  [DllImport("user32.dll")] public static extern bool DestroyWindow(IntPtr h);
  [DllImport("user32.dll")] public static extern bool PeekMessage(out MSG m, IntPtr h, uint a, uint b, uint r);
  [DllImport("user32.dll")] public static extern bool TranslateMessage(ref MSG m);
  [DllImport("user32.dll")] public static extern IntPtr DispatchMessage(ref MSG m);
  [StructLayout(LayoutKind.Sequential)] public struct MSG { public IntPtr h; public uint m; public IntPtr w; public IntPtr l; public uint t; public int x; public int y; }
  public static int Proxies; public static int Trays; public static Dictionary<string,int> Titles;
  public static void Read() {
    Proxies = 0; Trays = 0; Titles = new Dictionary<string,int>();
    EnumWindows((h, l) => { var c = new StringBuilder(256); GetClassName(h, c, 256); var k = c.ToString();
      if (k == "Shell_TrayWnd") Trays++;
      if (k == "${PROXY_CLASS}") { Proxies++; var t = new StringBuilder(512); GetWindowText(h, t, 512); int v; Titles.TryGetValue(t.ToString(), out v); Titles[t.ToString()] = v + 1; }
      return true; }, IntPtr.Zero);
  }
  public static void Pump(int ms) { var end = DateTime.Now.AddMilliseconds(ms); MSG m; while (DateTime.Now < end) { while (PeekMessage(out m, IntPtr.Zero, 0, 0, 1)) { TranslateMessage(ref m); DispatchMessage(ref m); } Thread.Sleep(20); } }
  // WS_OVERLAPPEDWINDOW, never shown, at -32000: nothing appears and nothing takes focus.
  public static IntPtr Make() { return CreateWindowEx(0, "Static", "zz-leftovers-control", 0x00CF0000, -32000, -32000, 100, 100, IntPtr.Zero, IntPtr.Zero, IntPtr.Zero, IntPtr.Zero); }
}
`;
const PS_HEAD = `$ErrorActionPreference = 'Stop'\nAdd-Type -TypeDefinition @"\n${WINDOWS_CS}\n"@\n`;

/** { proxies, titles, trays }: trays is the enumerator's own sanity reading (Explorer's taskbar is always a top-level window). */
function readWindowsDefault() {
  if (process.platform !== 'win32') return { proxies: 0, titles: {}, trays: 0, why: 'not Windows' };
  return psJson(PS_HEAD + `[LeftoversWin]::Read()\n@{ proxies = [LeftoversWin]::Proxies; trays = [LeftoversWin]::Trays; titles = [LeftoversWin]::Titles } | ConvertTo-Json -Compress\n`);
}

/** The control: one WindowTabManager tab on a never-shown window; the proxy count before, during and after. Removed in a finally. */
function makeControlDefault() {
  if (process.platform !== 'win32') return null;
  return psJson(PS_HEAD + `
$o = @{ before = -1; during = -1; after = -1; error = $null }
[LeftoversWin]::Read(); $o.before = [LeftoversWin]::Proxies
$h = [LeftoversWin]::Make(); $m = $null
try {
  $null = [Windows.UI.Shell.WindowTabManager, Windows.UI, ContentType = WindowsRuntime]
  $id = New-Object Windows.UI.WindowId; $id.Value = [uint64]$h.ToInt64()
  $m = [Windows.UI.Shell.WindowTabManager]::GetForWindow($id)
  $t = New-Object Windows.UI.Shell.WindowTab; $t.Title = 'zz-leftovers-control'; $m.Tabs.Add($t)
  [LeftoversWin]::Pump(2000); [LeftoversWin]::Read(); $o.during = [LeftoversWin]::Proxies
} catch { $o.error = $_.Exception.Message }
finally { if ($m) { try { $m.Tabs.Clear() } catch {} }; $null = [LeftoversWin]::DestroyWindow($h); [LeftoversWin]::Pump(1000) }
[LeftoversWin]::Read(); $o.after = [LeftoversWin]::Proxies
$o | ConvertTo-Json -Compress
`);
}

/** [{ pid, ppid, name, started (ms), cmd }]. Windows: CIM; elsewhere: ps. */
function listProcessesDefault() {
  if (process.platform === 'win32') {
    const rows = psJson(`Get-CimInstance Win32_Process | ForEach-Object { @{ pid = $_.ProcessId; ppid = $_.ParentProcessId; name = $_.Name; started = $(if ($_.CreationDate) { $_.CreationDate.ToUniversalTime().ToString('o') } else { $null }); cmd = "$($_.ExecutablePath) $($_.CommandLine)" } } | ConvertTo-Json -Compress`);
    return [].concat(rows).map((r) => ({ pid: r.pid, ppid: r.ppid, name: r.name, started: r.started ? Date.parse(r.started) : NaN, cmd: r.cmd }));
  }
  const r = spawnSync('ps', ['-eo', 'pid=,ppid=,etimes=,comm=,args='], { encoding: 'utf8' });
  return String(r.stdout || '').split('\n').filter(Boolean).map((l) => { const m = l.trim().match(/^(\d+)\s+(\d+)\s+(\d+)\s+(\S+)\s+(.*)$/); return m ? { pid: +m[1], ppid: +m[2], name: m[4], started: Date.now() - m[3] * 1000, cmd: m[5] } : null; }).filter(Boolean);
}

/** The proxy verdict. A count is given only when this run has shown it can see a proxy. */
function proxyVerdict(w, control) {
  const titles = (w && w.titles) || {};
  if (w && w.proxies > 0) return { state: 'CALIBRATED', count: w.proxies, titles, how: `read ${w.proxies} that exist` };
  if (!w) return { state: 'UNCALIBRATED', count: null, titles, how: 'no window read' };
  if (control && control.during > control.before) {
    const v = { state: 'CALIBRATED', count: w.proxies, titles, how: `a control proxy raised the count ${control.before} → ${control.during} → ${control.after}` };
    if (control.after > control.before) v.leak = `the control proxy did not leave (after ${control.after} > before ${control.before})`;
    return v;
  }
  // A rising control proves the enumerator can see; without one, an enumerator that cannot even see the taskbar is blind, not empty.
  if (!(w.trays >= 1)) return { state: 'UNCALIBRATED', count: null, titles, how: `read 0, and the window enumerator saw no taskbar window${w.why ? ` (${w.why})` : ''}` };
  const tried = control ? `the control made none (${control.before} → ${control.during} → ${control.after}${control.error ? `; ${control.error}` : ''})` : 'no control was run';
  return { state: 'UNCALIBRATED', count: null, titles, how: `read 0, and ${tried}` };
}

/** The repository's own git folder: <dir>/.git, or, when <dir> is itself a linked worktree (.git is a file), the main one it names. */
function commonGitDir(dir) {
  const g = path.join(dir, '.git');
  let st; try { st = fs.statSync(g); } catch (_) { return null; }
  if (st.isDirectory()) return g;
  const m = fs.readFileSync(g, 'utf8').match(/^gitdir:\s*(.+?)\s*$/m);
  if (!m) return null;
  const own = path.resolve(dir, m[1]);
  try { return path.resolve(own, fs.readFileSync(path.join(own, 'commondir'), 'utf8').trim()); } catch (_) { return own; }
}

/** Linked worktrees a repo has registered: the names in its git folder's worktrees/. */
function countWorktrees(repo) {
  const gitDir = commonGitDir(repo.dir);
  if (!gitDir) return { label: repo.label, dir: repo.dir, linked: null, error: 'no .git here' };
  let names = [];
  try { names = fs.readdirSync(path.join(gitDir, 'worktrees')); } catch (e) { if (e.code !== 'ENOENT') return { label: repo.label, dir: repo.dir, linked: null, error: e.code || e.message }; }
  return { label: repo.label, dir: repo.dir, linked: names.length };
}

/** The working folders of a repo's registered worktrees: each worktrees/<name>/gitdir names its <folder>/.git. */
function worktreeDirs(repo) {
  const g = commonGitDir(repo.dir);
  if (!g) return [];
  const base = path.join(g, 'worktrees');
  let names = []; try { names = fs.readdirSync(base); } catch (_) { return []; }
  const out = [];
  for (const n of names) { try { out.push(path.dirname(path.resolve(fs.readFileSync(path.join(base, n, 'gitdir'), 'utf8').trim()))); } catch (_) { /* a half-removed entry names no folder */ } }
  return out;
}

/** What makes a process ours in this survey: the places every machine has, plus the given repos, their worktrees and the strays. */
function oursFor(repos, strays) {
  const lit = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const under = (dir) => new RegExp(lit(norm(path.resolve(dir)) + '\\'));
  const res = [...OURS_ALWAYS, under(scratch.scratchRoot())];
  for (const r of repos) { res.push(under(r.dir)); if (!r.namesOnly) for (const d of worktreeDirs(r)) res.push(under(d)); }
  if (strays) res.push(new RegExp(lit(norm(path.resolve(strays.dir)) + '\\') + lit(norm(strays.prefix))));
  return res;
}

/** <prefix>* entries in the strays folder that are not a repo's main checkout and not a worktree a repo has registered. */
function findStrays(strays, repos) {
  const { dir, prefix } = strays;
  let es; try { es = fs.readdirSync(dir, { withFileTypes: true }); } catch (e) { throw new Error(`cannot read ${dir}: ${e.code || e.message}`); }
  const mains = new Set(repos.map((r) => norm(path.resolve(r.dir))));
  const wtRoots = repos.map((r) => commonGitDir(r.dir)).filter(Boolean).map((g) => norm(path.join(g, 'worktrees')) + '\\');
  const out = [];
  for (const e of es) {
    if (!e.name.toLowerCase().startsWith(prefix.toLowerCase())) continue;
    const p = path.join(dir, e.name);
    if (mains.has(norm(path.resolve(p)))) continue;
    if (e.isDirectory()) {
      let gd = null;
      try { const m = fs.readFileSync(path.join(p, '.git'), 'utf8').match(/^gitdir:\s*(.+?)\s*$/m); gd = m ? path.resolve(p, m[1]) : null; } catch (_) {}
      if (gd && wtRoots.some((r) => (norm(gd) + '\\').startsWith(r)) && fs.existsSync(gd)) continue;
      out.push({ name: e.name, kind: gd ? 'dangling worktree' : 'folder' });
    } else out.push({ name: e.name, kind: e.isSymbolicLink() ? 'link' : 'file' });
  }
  return out.sort((a, b) => (a.name < b.name ? -1 : 1));
}

function driveRoots() {
  if (process.platform !== 'win32') return ['/'];
  const out = [];
  for (let c = 67; c <= 90; c++) { const r = String.fromCharCode(c) + ':\\'; try { if (fs.existsSync(r)) out.push(r); } catch (_) {} }
  return out;
}

function findFakeRoots(roots) {
  const out = [];
  for (const r of roots) { let es = []; try { es = fs.readdirSync(r); } catch (_) { continue; } for (const n of es) if (/^fake-/i.test(n)) out.push(path.join(r, n)); }
  return out.sort();
}

/** Our processes older than minAgeMin that are not infrastructure, oldest first. */
function ourLongRunning(procs, now, minAgeMin, ours = OURS_ALWAYS) {
  const out = [];
  for (const p of procs) {
    const cmd = norm(p.cmd), name = String(p.name || '').toLowerCase();
    if (!(now - p.started >= minAgeMin * 60000)) continue;
    if (INFRA_NAMES.has(name) || INFRA_CMD.some((re) => re.test(cmd))) continue;
    if (!ours.some((re) => re.test(cmd)) && !(HEADLESS_BROWSER.test(name) && /--headless/.test(cmd))) continue;
    const seat = (cmd.match(/instances-([^\\]+)\\/) || [])[1] || null;
    out.push({ pid: p.pid, ppid: p.ppid, name: p.name, started: new Date(p.started).toISOString(), ageMin: Math.floor((now - p.started) / 60000), seat, cmd: String(p.cmd || '').trim() });
  }
  return out.sort((a, b) => b.ageMin - a.ageMin);
}

/** A repo's label in the report: its folder and the one above it, so two checkouts of one repo stay apart. */
const labelOf = (dir) => { const r = path.resolve(dir); return `${path.basename(path.dirname(r))}/${path.basename(r)}`; };

function survey(opts = {}) {
  const repos = opts.repos && opts.repos.length ? opts.repos : [{ label: labelOf(REPO), dir: REPO }];
  const strays = opts.strays || null;
  if (strays && !(typeof strays.prefix === 'string' && strays.prefix.trim())) throw new Error('--strays needs --prefix <name->, the prefix its entries share');
  const now = opts.now || Date.now(), minAgeMin = opts.minAgeMin == null ? 120 : opts.minAgeMin;
  const windows = (opts.readWindows || readWindowsDefault)();
  const control = windows && windows.proxies > 0 ? null : (opts.makeControl || makeControlDefault)();
  return {
    at: new Date(now).toISOString(), minAgeMin, strays: strays ? findStrays(strays, repos) : null, straysAt: strays,
    proxies: proxyVerdict(windows, control),
    worktrees: repos.map(countWorktrees),
    fakeRoots: findFakeRoots(opts.roots || driveRoots()),
    processes: ourLongRunning((opts.listProcesses || listProcessesDefault)(), now, minAgeMin, oursFor(repos, strays)),
  };
}

const age = (m) => (m >= 1440 ? `${Math.floor(m / 1440)}d ${Math.floor((m % 1440) / 60)}h` : `${Math.floor(m / 60)}h ${m % 60}m`);
function report(o) {
  const L = [`leftovers · ${o.at} · read-only`];
  const p = o.proxies, titles = Object.entries(p.titles || {}).map(([t, n]) => `${t || '(untitled)'} ${n}`).join(', ');
  L.push(`tab proxies          ${p.state === 'CALIBRATED' ? `${p.count} (calibrated: ${p.how})` : `UNCALIBRATED (${p.how})`}${titles ? ` · by title: ${titles}` : ''}`);
  if (p.leak) L.push(`  FINDING: ${p.leak}`);
  L.push(`worktrees            ${o.worktrees.map((w) => `${w.label} ${w.linked === null ? `ERROR (${w.error})` : `${w.linked} linked + main`}`).join(' · ')}`);
  L.push(o.strays === null ? 'strays               not scanned (give --strays <folder> --prefix <name>-)'
    : `strays               ${o.strays.length} ${o.straysAt.prefix}* not worktrees, in ${o.straysAt.dir}${o.strays.length ? ': ' + o.strays.map((s) => (s.kind === 'folder' ? s.name : `${s.name} (${s.kind})`)).join(', ') : ''}`);
  L.push(`fake roots           ${o.fakeRoots.length}${o.fakeRoots.length ? ': ' + o.fakeRoots.join(', ') : ''}`);
  L.push(`our long-running     ${o.processes.length} (older than ${o.minAgeMin} min, infrastructure left out)`);
  for (const x of o.processes) L.push(`  pid ${x.pid}  ${age(x.ageMin)}  ${x.name}${x.seat ? `  [${x.seat}]` : ''}  ${x.cmd.length > 140 ? x.cmd.slice(0, 140) + '…' : x.cmd}`);
  return L.join('\n');
}

module.exports = { survey, report, parsePsLine, proxyVerdict, countWorktrees, worktreeDirs, oursFor, findStrays, findFakeRoots, ourLongRunning, readWindowsDefault, makeControlDefault, listProcessesDefault };

if (require.main === module) {
  try { os.setPriority(0, os.constants.priority.PRIORITY_BELOW_NORMAL); } catch (_) { /* a lower priority is a courtesy, not a requirement */ }
  const a = process.argv.slice(2);
  const VALUED = new Set(['--repo', '--repo-names', '--strays', '--prefix', '--min-age']), FLAGS = new Set(['--json']);
  const got = {}, repos = [];
  for (let i = 0; i < a.length; i++) {
    if (FLAGS.has(a[i])) continue;
    if (!VALUED.has(a[i])) { console.error(`leftovers: unknown flag ${a[i]} (flags: --repo <dir>, --repo-names <dir>, --strays <folder> --prefix <name->, --min-age <minutes>, --json)`); process.exit(1); }
    const v = a[++i];
    if (v === undefined) { console.error(`leftovers: ${a[i - 1]} needs a value`); process.exit(1); }
    if (a[i - 1] === '--repo' || a[i - 1] === '--repo-names') repos.push({ label: labelOf(v), dir: v, namesOnly: a[i - 1] === '--repo-names' }); else got[a[i - 1]] = v;
  }
  const minAge = got['--min-age'] === undefined ? null : got['--min-age'];
  if (minAge !== null && !(Number(minAge) >= 0)) { console.error('leftovers: --min-age takes a number of minutes, 0 or more'); process.exit(1); }
  if (got['--strays'] !== undefined && got['--prefix'] === undefined) { console.error('leftovers: --strays needs --prefix <name->, the prefix its entries share'); process.exit(1); }
  try {
    const o = survey({ repos, strays: got['--strays'] === undefined ? null : { dir: got['--strays'], prefix: got['--prefix'] }, minAgeMin: minAge ? Number(minAge) : undefined });
    console.log(a.includes('--json') ? JSON.stringify(o, null, 1) : report(o));
  } catch (e) {
    console.error(`leftovers: ${e.message}`);
    process.exit(1);
  }
}
