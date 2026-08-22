#!/usr/bin/env node
// portable-paths.js — the guard that fails when a NEW machine-specific path lands in a
// shipped file. Not an audit; audits get run once. This is the ratchet.
//
// WHY IT EXISTS, and every reason is a measured incident in this repo:
//
//   2026-08-15  guard-census.js carried `C:/Users/nname/Desktop/...` at three call sites. The
//               TOOL was broken on every machine while its test passed. Found by accident.
//   2026-08-16  score.js hardcoded one laptop's paths and VOIDED a 72-trial run; the committed
//               re-derivability sentence was false.
//   2026-08-22  sessionstart-state.js shipped `C:\Consonance\lighthouse\...` as a literal
//               resolution candidate (093d2f5). It was redundant on the box that had it and it
//               DISARMED BOTH of the file's machine-independence tests, in opposite directions.
//
// Three times in four days, every one found by a human noticing. Nothing stopped the class
// re-entering because nothing was watching for it.
//
// TWO DETECTORS, because a drive-letter grep cannot see the worst of it.
//
//   DRIVE      a literal drive-letter path: C:\..., C:/..., D:\...
//              This is what `git grep -E 'C:\\|C:/'` finds.
//
//   DISGUISED  a PORTABLE prefix (home(), os.homedir(), %USERPROFILE%, sysdrive()) glued to a
//              machine-specific literal segment — `format!("{}\\OneDrive\\Desktop\\projects\\
//              lighthouse\\...", home())`. It reads as portable, it is invisible to the grep,
//              and it is strictly worse than the literal: on a box where it misses it produces
//              a path that LOOKS resolved. main.rs's cards_dir() ends in one, unconditionally,
//              and its caller is `if let Ok(entries) = fs::read_dir(...)` — a miss there ships
//              an empty deck in silence. That is the shape this guard exists for.
//
// HOW IT AVOIDS CRYING WOLF, which is the only way a guard survives:
//
//   · Sites are keyed by FILE + NORMALIZED LINE TEXT, never by line number. Inserting code
//     above a known site does not fire. Reindenting does not fire. Only genuinely new text does.
//   · Repeated identical text in one file is counted, so a second copy of a baselined line
//     still fires.
//   · COMMENT-ONLY LINES ARE NOT SCANNED. A path in a comment cannot misresolve, and this repo
//     comments in paragraphs — scanning them would fire on every prose edit and train the reader
//     to skip the output. This is a NAMED limit, not a general one: a path inside a multi-line
//     /* */ block on a non-comment-leading line is still scanned; a path documented in a `//`
//     line is invisible here on purpose.
//   · An `.md` is out of scope. The one generated shipped brief is already guarded by
//     src-tauri/gen-brief.ps1's self-check; README/GUIDE paths are documentation of commands.
//
// The baseline is the exemption list, and it carries a VERDICT per site so the file is a
// classification and not just a hash set. Verdicts are assigned by classify() below and may be
// hand-corrected in the baseline; the guard never reads a verdict to decide pass/fail — only
// membership decides that. A verdict is for the human reading the report.
//
// Usage:
//   node consonance/tools/portable-paths.js            check; exit 1 on any unbaselined site
//   node consonance/tools/portable-paths.js --list     every site, with verdict
//   node consonance/tools/portable-paths.js --fatal    only the verdicts worth acting on
//   node consonance/tools/portable-paths.js --update   rewrite the baseline (deliberate)

'use strict';
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const ROOT = process.env.PORTABLE_PATHS_ROOT || path.resolve(__dirname, '..', '..');
const BASELINE = process.env.PORTABLE_PATHS_BASELINE
  || path.join(__dirname, 'portable-paths.baseline.json');

// ── scope ────────────────────────────────────────────────────────────────────────────────────
// DISCOVER, never enumerate (js-suite's rule 1, taken from the same failure): the file added
// next month is by definition not on a hand-kept list. Scope is expressed as directory prefixes
// over `git ls-files`, so a new tool or hook is guarded the moment it is tracked.
//
// IN scope = what ships in the installer (src-tauri/src compiles into the binary, ui/ is the
// frontendDist) plus what actually runs on a machine (hooks/, tools/, the installers).
// OUT of scope, each for a stated reason:
//   exo_memory/loop/**   dated experiment artifacts. Append-only record; editing them to please
//                        a linter would be rewriting what a run actually did.
//   dev/mutation/**      throwaway mutators that mutate one named file on one box by design.
//   consonance/ui/vendor xterm and friends; not ours.
const SCOPE_IN = [
  'consonance/src-tauri/src/',
  'consonance/src-tauri/gen-',
  'consonance/hooks/',
  'consonance/tools/',
  'consonance/ui/',
  'consonance/import-instance.ps1',
  'consonance/launch.ps1',
  'consonance/restore-main.ps1',
  'dev/shell/',
  'dev/dream/',
  'dev/headwatch/install',
  'dev/vantage/install',
  'desktop-install.ps1',
];
const SCOPE_OUT = [
  'consonance/ui/vendor/',
  'dev/mutation/',
  'exo_memory/loop/',
];
const EXTS = new Set(['.js', '.rs', '.ps1']);

function inScope(f) {
  if (!EXTS.has(path.extname(f))) return false;
  if (SCOPE_OUT.some((p) => f.startsWith(p))) return false;
  return SCOPE_IN.some((p) => f.startsWith(p));
}

function tracked() {
  const out = execFileSync('git', ['-C', ROOT, 'ls-files'], { encoding: 'utf8', maxBuffer: 32 << 20 });
  return out.split('\n').map((s) => s.trim()).filter(Boolean).filter(inScope);
}

// ── detectors ────────────────────────────────────────────────────────────────────────────────

// A drive letter followed by a separator, not preceded by a word character (so `foo C:\` hits
// and an identifier ending in a letter does not). Doubled backslashes are the escaped form.
const DRIVE = /(^|[^A-Za-z0-9_])[A-Za-z]:(\\\\|\\|\/)/;

// Prefixes that are genuinely portable on their own.
const PORTABLE_PREFIX = /(os\.homedir\(\)|\bhomedir\(\)|\bhome\(\)|USERPROFILE|HOMEPATH|sysdrive\(\)|\$HOME\b)/;

// Segments that name THIS checkout or ONE person's layout. Case-sensitive on purpose:
// `.consonance` (the portable per-user data dir) must not be confused with `Consonance`
// (the C:\Consonance checkout), and `.claude`/`.cargo`/`.local` are fixed-by-convention
// locations under a home dir — portable, and deliberately absent from this list.
const MACHINE_SEGMENT = /(OneDrive|Desktop|lighthouse|Consonance|blackbox|C--)/;

// Comment-only lines, per language. See the cry-wolf note in the header.
const COMMENT_ONLY = /^\s*(\/\/|\/\*|\*|#|<!--)/;

function scan(text) {
  const hits = [];
  const lines = text.split(/\r?\n/);
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (COMMENT_ONLY.test(line)) continue;
    let detector = null;
    if (DRIVE.test(line)) detector = 'DRIVE';
    else if (PORTABLE_PREFIX.test(line) && MACHINE_SEGMENT.test(line)) detector = 'DISGUISED';
    if (detector) hits.push({ line: i + 1, detector, text: line });
  }
  return hits;
}

// ── rust test regions ────────────────────────────────────────────────────────────────────────
// main.rs has 25 interleaved `#[cfg(test)]` blocks and every one of its 27 drive-literal hits is
// inside one. Without this, the guard would report 27 false FATALs in the single most important
// shipped file and be ignored by its second run. Brace-counted from the attribute's opening `{`.
function rustTestLines(text) {
  const lines = text.split(/\r?\n/);
  const inTest = new Set();
  for (let i = 0; i < lines.length; i++) {
    if (!/^\s*#\[cfg\(test\)\]/.test(lines[i])) continue;
    let j = i;
    while (j < lines.length && !lines[j].includes('{')) j++;
    if (j >= lines.length) continue;
    let depth = 0;
    let started = false;
    for (; j < lines.length; j++) {
      for (const ch of lines[j]) {
        if (ch === '{') { depth++; started = true; }
        else if (ch === '}') depth--;
      }
      inTest.add(j + 1);
      if (started && depth <= 0) break;
    }
  }
  return inTest;
}

// ── classification ───────────────────────────────────────────────────────────────────────────
// Roots that name a real place on some machine. A path outside them (C:\panes\..., C:\repo\...,
// C:\definitely\not\here) is synthetic fixture data and cannot mislead anything.
const REAL_ROOT = /[A-Za-z]:(\\\\|\\|\/)(Users|Consonance|Program Files|ProgramData)/i;
const NAMED_USER = /[A-Za-z]:(\\\\|\\|\/)+Users(\\\\|\\|\/)+(?!<|\$|%)[A-Za-z0-9._-]+/;
const LOOKS_LIKE_DEFAULT = /(\|\|)|unwrap_or|process\.env|env\.|\$env:|Join-Path/;
// A path that is only ever PRINTED cannot misresolve — it can only misinform, which is a
// documentation bug and not this guard's business.
const MESSAGE_ONLY = /(Write-Host|console\.log|-Description|println!|eprintln!)/;
// The one case where a path inside a test file is NOT benign: the test READS it. That is
// exactly how guard-census.test.js died — ENOENT on another machine's checkout, four ok lines
// printed and then a crash, dead for over a week. A guard that cannot catch its own motivating
// incident is decoration, so this check runs before the test-file exemption.
// `path.join` counts: the exact line that killed guard-census.test.js was
//   path.join("C:/Users/nname/Desktop/lighthouse/consonance/src-tauri", "tests", "arch_test.rs")
// — a real path being BUILT, read two lines later. An assertion string is never path.join'd.
const TEST_READS_IT = /(readFileSync|existsSync|readdirSync|createReadStream|require\(|path\.join)/;

function classify(file, hit, isRustTest) {
  const t = hit.text;
  const isTest = isRustTest || /\.test\.(js|rs)$/.test(file);
  if (hit.detector === 'DISGUISED') return 'DISGUISED';
  if (isTest) return TEST_READS_IT.test(t) && REAL_ROOT.test(t) ? 'FATAL-TEST-READ' : 'BENIGN-TEST';
  if (MESSAGE_ONLY.test(t)) return 'BENIGN-MESSAGE';
  if (NAMED_USER.test(t)) return 'FATAL-USER';
  if (!REAL_ROOT.test(t)) return 'BENIGN-FIXTURE';
  if (LOOKS_LIKE_DEFAULT.test(t)) return 'FATAL-DEFAULT';
  return 'REVIEW';
}

// ── site keys ────────────────────────────────────────────────────────────────────────────────
// Key on normalized TEXT, never on line number: the whole point is that moving code does not
// fire. `#n` disambiguates repeated identical lines in one file, so a second copy still fires.
const norm = (s) => s.replace(/\s+/g, ' ').trim();

function collect() {
  const sites = [];
  for (const f of tracked()) {
    const abs = path.join(ROOT, f);
    let text;
    try { text = fs.readFileSync(abs, 'utf8'); } catch { continue; }
    const rustTests = f.endsWith('.rs') ? rustTestLines(text) : new Set();
    const seen = new Map();
    for (const hit of scan(text)) {
      const key = norm(hit.text);
      const n = (seen.get(key) || 0) + 1;
      seen.set(key, n);
      sites.push({
        file: f,
        key: `${f}\u0000${key}\u0000#${n}`,
        line: hit.line,
        detector: hit.detector,
        text: key,
        verdict: classify(f, hit, rustTests.has(hit.line)),
      });
    }
  }
  return sites;
}

function readBaseline() {
  try {
    const j = JSON.parse(fs.readFileSync(BASELINE, 'utf8').replace(/^\uFEFF/, ''));
    return Array.isArray(j.sites) ? j.sites : [];
  } catch (_) {
    return null;
  }
}

function writeBaseline(sites) {
  const body = {
    _: 'Exemption list for portable-paths.js. Every entry is a site that EXISTS today. A site '
      + 'not listed here fails the guard. Removing a site from the code and re-running --update '
      + 'is always welcome; adding one requires a deliberate --update and shows up in the diff.',
    generated_by: 'node consonance/tools/portable-paths.js --update',
    counts: tally(sites),
    sites: sites
      .slice()
      .sort((a, b) => (a.file === b.file ? a.key.localeCompare(b.key) : a.file.localeCompare(b.file)))
      .map((s) => ({ file: s.file, detector: s.detector, verdict: s.verdict, text: s.text, key: s.key })),
  };
  fs.writeFileSync(BASELINE, JSON.stringify(body, null, 2) + '\n');
}

function tally(sites) {
  const t = {};
  for (const s of sites) t[s.verdict] = (t[s.verdict] || 0) + 1;
  return t;
}

// ── main ─────────────────────────────────────────────────────────────────────────────────────

function main(argv) {
  const sites = collect();
  const list = argv.includes('--list');
  const fatalOnly = argv.includes('--fatal');

  if (argv.includes('--update')) {
    writeBaseline(sites);
    console.log(`portable-paths: baseline written — ${sites.length} sites`);
    console.log('  ' + JSON.stringify(tally(sites)));
    return 0;
  }

  if (list || fatalOnly) {
    const shown = fatalOnly
      ? sites.filter((s) => s.verdict === 'DISGUISED' || s.verdict.startsWith('FATAL') || s.verdict === 'REVIEW')
      : sites;
    for (const s of shown.sort((a, b) => a.verdict.localeCompare(b.verdict) || a.file.localeCompare(b.file))) {
      console.log(`${s.verdict.padEnd(15)} ${s.file}:${s.line}  ${s.text.slice(0, 110)}`);
    }
    console.log(`\n${shown.length} shown of ${sites.length} · ${JSON.stringify(tally(sites))}`);
    return 0;
  }

  const base = readBaseline();
  if (base === null) {
    console.error(`portable-paths: no baseline at ${BASELINE}. Run --update once, review the diff, commit it.`);
    return 2;
  }
  // A GREEN RUN OVER ZERO FILES IS THE BUG — js-suite's rule 2. If scope resolves to nothing
  // (a moved directory, a bad ROOT), this must shout rather than print a clean summary.
  const files = tracked();
  if (files.length === 0) {
    console.error('portable-paths: scope matched ZERO files. Refusing to report green over nothing.');
    return 2;
  }

  const known = new Set(base.map((s) => s.key));
  const live = new Set(sites.map((s) => s.key));
  const added = sites.filter((s) => !known.has(s.key));
  const gone = base.filter((s) => !live.has(s.key));

  if (added.length === 0) {
    console.log(`portable-paths: green — ${files.length} files in scope, ${sites.length} known sites, 0 new`);
    if (gone.length) {
      console.log(`  ${gone.length} baselined site(s) no longer present — run --update to shrink the baseline:`);
      for (const s of gone.slice(0, 20)) console.log(`    gone  ${s.file}  ${s.text.slice(0, 100)}`);
    }
    return 0;
  }

  console.error(`portable-paths: RED — ${added.length} machine-specific path(s) not in the baseline\n`);
  for (const s of added) {
    console.error(`  ${s.detector}  ${s.verdict}`);
    console.error(`    ${s.file}:${s.line}`);
    console.error(`    ${s.text.slice(0, 140)}`);
  }
  console.error('\nResolve it the way the peer hooks already do — env override, then');
  console.error('~/.consonance.json (data_dir / room_path / instances_dir), then degrade LOUDLY.');
  console.error('See consonance/hooks/transcript-watch.js dataDir() for the shape.');
  console.error('If the site is genuinely benign (a fixture, a test constant), run --update and');
  console.error('let the baseline diff carry the argument.');
  return 1;
}

if (require.main === module) process.exit(main(process.argv.slice(2)));

module.exports = { scan, classify, rustTestLines, norm, inScope, DRIVE, PORTABLE_PREFIX, MACHINE_SEGMENT };
