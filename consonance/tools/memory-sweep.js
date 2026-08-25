#!/usr/bin/env node
/* memory-sweep.js — sweep the harness's per-seat memory (CH-5) for registered wordings.
 *
 * WHAT THIS IS FOR. `~/.claude/projects/<project>/memory/*.md` is read into context by the harness
 * at every session start. It is outside the repo, outside `~/.consonance/`, and outside every
 * shell — so a withdrawn claim living there survives every repo sweep forever, and it does not
 * travel by git, which means each machine has its own separate unswept surface.
 *
 * ── THE PRIVACY CONTRACT, AND IT IS STRUCTURAL RATHER THAN PROMISED ──────────────────────────
 *
 * These files are private per-seat notes, most of them about the keeper. The librarian's ruling
 * (librarian/2026-08-25.md, ~01:55 Q1) is SWEEP YES, INDEX NO, on two guards: paths and counts
 * only, never surrounding prose; and findings route to the OWNING seat to fix its own memory.
 *
 * A THIRD GUARD IS THE OPERATIVE ONE AND WAS NOT STATED: THE SWEEP MUST BE MECHANICAL END TO END.
 * "Holds no content" is false of any sweep — a regex match is a read, and the bytes are in some
 * process either way. What separates a census from surveillance is not that nothing is read, it is
 * WHO READS IT. A tool can match without a model ever seeing a line; `grep -n` cannot, because the
 * matched line lands in the operator's context and stays there. So:
 *
 *   - This tool emits COUNTS and FILE PATHS. There is no code path from file bytes to stdout.
 *   - `--verbose` does not exist and must never be added. Neither does a `--context` flag.
 *   - memory-sweep.test.js plants a canary string in a fixture and fails if it appears in output.
 *     That test is the guard; the paragraph above is only its comment.
 *   - Anyone sweeping this surface by hand uses `grep -c`, never `grep -n` / `-o` / `-A` / Read.
 *
 * AND A CONSEQUENCE OF GUARD 1 THAT IS A FEATURE, NOT A GAP: this tool CANNOT separate USE from
 * MENTION. That judgement needs the surrounding prose, which is precisely what it may not look at.
 * So it reports occurrences and stops. The owning seat classifies its own file. Guard 2 is not
 * politeness — it is the only place the classification can legally happen.
 *
 * ── WHAT IT SWEEPS FOR: THE REGISTRY, AND NOTHING ELSE ───────────────────────────────────────
 *
 * Every pattern comes live from `carrier-drift.registry.json` — pane B's file, read here and
 * never written. There is deliberately NO lexicon declared in this file.
 *
 * The first draft of this tool DID declare one, because at the time the registry held a single
 * withdrawal and nothing for the 2026-07-12 diving retirement. Pane B registered
 * `diving-vocabulary-2026-08-17` while this tool was being written, and the first run afterward
 * swept BOTH lists and counted the same occurrences twice under two set ids — 8 files became 11,
 * 22 occurrences became 32, with no file having changed. The registry's own README already says
 * why: "a withdrawal that is not in here is a withdrawal the tool reports green on, forever." A
 * second tool carrying its own wordings is a second authority, and two authorities is the drift
 * this repo keeps finding under rocks. So: ONE registry, many readers.
 *
 * The consequence, stated rather than hidden: this tool's coverage is exactly the registry's. Any
 * wording the registry does not carry is a wording this reports green on. Proposals to widen a
 * pattern go to the seat that holds the registry — they do not get privately implemented here.
 *
 * ── THE UNIVERSE IS PRINTED ON EVERY RUN ─────────────────────────────────────────────────────
 *
 * N project dirs seen · M with memory/ · N files scanned · M skipped, with the rule. Per the
 * cycle's registered class: the false-green failure lives in the DENOMINATOR, not in the check —
 * all four instruments that failed this way checked correctly over the wrong universe.
 *
 * AND THE UNIVERSE IS GLOBBED, NEVER LISTED. The librarian reached 18 files by enumerating the
 * four seats it could think of, missing the largest surface entirely, then committed the same
 * method error inside the paragraph confessing it. A hand-list of seats is how this instrument
 * would report green on the one dir nobody remembered.
 *
 *   node consonance/tools/memory-sweep.js              # sweep, print universe + findings
 *   node consonance/tools/memory-sweep.js --json       # same, machine-readable
 *   node consonance/tools/memory-sweep.js --root <dir> # sweep a fixture tree (tests)
 *
 * Exit 0 whether or not there are hits. Hits here are another seat's to fix, so a non-zero exit
 * would make this a permanently red instrument — the failure mode ruled on in
 * loop/absent_hooks_ruling_2026-08-25.md: an instrument whose steady state is red is one people
 * stop reading.
 */
'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');

// The gap-dream is an anti-instruction and gets no instrumentation — the same gate every hook in
// this repo carries. This is a tool rather than a hook, but it is cheap to hold the line.
if (process.env.CONSONANCE_DREAM) process.exit(0);

const REGISTRY = path.join(__dirname, 'carrier-drift.registry.json');

/* Registered withdrawals, live from B's registry. Read-only: this tool never writes that file.
 * A malformed or absent registry is REPORTED, never swallowed — an instrument that silently
 * sweeps for nothing reads exactly like an instrument that found nothing. */
function loadWithdrawals(registryPath) {
  let raw;
  try {
    raw = fs.readFileSync(registryPath, 'utf8').replace(/^﻿/, '');
  } catch (e) {
    return { ok: false, reason: 'registry unreadable at ' + registryPath, withdrawals: [] };
  }
  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch (e) {
    return { ok: false, reason: 'registry is not valid JSON', withdrawals: [] };
  }
  const out = [];
  for (const w of (parsed.withdrawals || [])) {
    if (!w || !w.pattern) continue;
    let re;
    try { re = new RegExp(w.pattern, 'gi'); } catch (e) { continue; }
    out.push({
      id: w.id || '(unnamed)',
      claim: w.claim || '',
      correct_form: w.correct_form || '',
      terms: [{ term: w.pattern, pattern: re }],
    });
  }
  if (!out.length) {
    return {
      ok: false,
      reason: 'registry parsed but carries no usable withdrawal patterns (' +
        (parsed.withdrawals || []).length + ' entries read)',
      withdrawals: [],
    };
  }
  return { ok: true, reason: '', withdrawals: out };
}

/* GLOB, DO NOT LIST. readdir on the projects root; no seat is ever named in code. */
function enumerate(root) {
  const universe = {
    root,
    projectDirs: 0,
    withMemoryDir: 0,
    filesScanned: 0,
    skipped: 0,
    skipRule: 'non-.md entries and unreadable files under <project>/memory/ (memory/ is flat by ' +
      'the harness\'s own layout; subdirectories are counted as skipped, never descended)',
    rootMissing: false,
    files: [],
  };
  let entries;
  try {
    entries = fs.readdirSync(root, { withFileTypes: true });
  } catch (e) {
    universe.rootMissing = true;
    return universe;
  }
  for (const e of entries) {
    if (!e.isDirectory()) continue;
    universe.projectDirs++;
    const memDir = path.join(root, e.name, 'memory');
    let memEntries;
    try {
      memEntries = fs.readdirSync(memDir, { withFileTypes: true });
    } catch (err) {
      continue;                                   // no memory/ here — not skipped, simply absent
    }
    universe.withMemoryDir++;
    for (const m of memEntries) {
      if (!m.isFile() || !m.name.toLowerCase().endsWith('.md')) { universe.skipped++; continue; }
      universe.files.push({ project: e.name, file: m.name, abs: path.join(memDir, m.name) });
    }
  }
  universe.filesScanned = universe.files.length;
  return universe;
}

/* THE CONTAINMENT. `text` enters this function and only integers leave it. No matched substring is
 * returned, stored, or logged — `String.prototype.match` is deliberately not used, because its
 * return value IS the matched text and it would put content one careless console.log away. */
function countOnly(text, pattern) {
  const re = new RegExp(pattern.source, pattern.flags.includes('g') ? pattern.flags : pattern.flags + 'g');
  let n = 0;
  while (re.exec(text) !== null) {
    n++;
    if (re.lastIndex === 0) break;                // zero-width pattern guard: never spin
  }
  return n;
}

/* Which seat owns a project dir, for guard 2. Derived from the dir NAME, which is the harness's
 * encoding of the project's absolute path — no file is opened to answer this. */
function owningSeat(project) {
  const m = /^C--Consonance-instances-(.+)$/.exec(project);
  if (m) return { kind: 'pane', label: m[1] };
  return { kind: 'keeper-project', label: project };
}

function sweep(root, registryPath) {
  const universe = enumerate(root);
  const reg = loadWithdrawals(registryPath);
  reg.path = registryPath;
  const sets = reg.withdrawals;

  const findings = [];
  for (const f of universe.files) {
    let text;
    try {
      text = fs.readFileSync(f.abs, 'utf8');
    } catch (e) {
      universe.skipped++;
      universe.filesScanned--;
      continue;
    }
    for (const set of sets) {
      const byTerm = {};
      let total = 0;
      for (const t of set.terms) {
        const n = countOnly(text, t.pattern);
        if (n > 0) { byTerm[t.term] = n; total += n; }
      }
      if (total > 0) {
        findings.push({
          set: set.id,
          project: f.project,
          file: f.file,
          owner: owningSeat(f.project),
          hits: total,
          byTerm,
        });
      }
    }
    text = null;                                   // nothing held past the file
  }
  return { universe, registry: reg, findings, sets: sets.map(s => s.id) };
}

function render(result) {
  const u = result.universe;
  const lines = [];
  lines.push('memory-sweep — CH-5, the harness per-seat memory surface');
  lines.push('');
  lines.push('  UNIVERSE  ' + u.projectDirs + ' project dirs seen · ' + u.withMemoryDir +
    ' with a memory/ · ' + u.filesScanned + ' .md files scanned · ' + u.skipped + ' skipped');
  lines.push('    root:  ' + u.root + (u.rootMissing ? '   [ABSENT — nothing was swept]' : ''));
  lines.push('    rule:  ' + u.skipRule);
  lines.push('    note:  ' + (u.withMemoryDir - countProjectsWithFiles(u)) +
    ' of the ' + u.withMemoryDir + ' memory dirs are EMPTY — an empty dir is in the denominator, ' +
    'not outside it');
  lines.push('');
  lines.push('  WORDING SETS  ' + result.sets.length +
    (result.sets.length ? ' (' + result.sets.join(', ') + ')' : ''));
  lines.push('    source: ' + result.registry.path + '  — the only authority; this tool declares ' +
    'no wordings of its own');
  if (!result.registry.ok) {
    lines.push('    !! REGISTRY NOT USABLE: ' + result.registry.reason);
    lines.push('    !! NOTHING WAS SWEPT FOR. A clean report below is NOT-RUN wearing a green, ' +
      'which is this room\'s registered failure mode — read it as no coverage at all.');
  }
  lines.push('');

  if (!result.findings.length) {
    lines.push('  no occurrence of any swept wording in the universe above.');
    lines.push('');
    lines.push('  Absence here is non-coverage of everything NOT registered — it is never a ' +
      'verdict that this surface is clean.');
    return lines.join('\n');
  }

  lines.push('  FINDINGS — paths and counts only, by design. No surrounding text is read out, and');
  lines.push('  USE vs MENTION is NOT decided here: that needs the prose, which guard 1 forbids.');
  lines.push('');
  const byOwner = new Map();
  for (const f of result.findings) {
    const key = f.owner.kind + ':' + f.owner.label;
    if (!byOwner.has(key)) byOwner.set(key, []);
    byOwner.get(key).push(f);
  }
  for (const [key, rows] of [...byOwner.entries()].sort()) {
    const total = rows.reduce((a, r) => a + r.hits, 0);
    lines.push('  → route to ' + key + '   (' + rows.length + ' file(s), ' + total + ' occurrence(s))');
    for (const r of rows.sort((a, b) => b.hits - a.hits)) {
      const terms = Object.keys(r.byTerm).sort().map(t => t + ' ' + r.byTerm[t]).join(' · ');
      lines.push('      ' + String(r.hits).padStart(3) + '  ' + r.project + '/memory/' + r.file);
      lines.push('           set=' + r.set + '  terms: ' + terms);
    }
    lines.push('');
  }
  lines.push('  Each row is for its OWNING seat to classify and fix in its own memory. Nothing');
  lines.push('  here is a verdict about a seat, and no other seat edits these files.');
  return lines.join('\n');
}

function countProjectsWithFiles(u) {
  return new Set(u.files.map(f => f.project)).size;
}

function main() {
  const argv = process.argv.slice(2);
  const rootIdx = argv.indexOf('--root');
  const root = rootIdx >= 0 && argv[rootIdx + 1]
    ? argv[rootIdx + 1]
    : path.join(os.homedir(), '.claude', 'projects');
  const regIdx = argv.indexOf('--registry');
  const registryPath = regIdx >= 0 && argv[regIdx + 1] ? argv[regIdx + 1] : REGISTRY;

  const result = sweep(root, registryPath);

  if (argv.includes('--json')) {
    // Same containment: counts, paths, owners. Never text.
    process.stdout.write(JSON.stringify({
      universe: {
        root: result.universe.root,
        project_dirs: result.universe.projectDirs,
        with_memory_dir: result.universe.withMemoryDir,
        files_scanned: result.universe.filesScanned,
        skipped: result.universe.skipped,
        skip_rule: result.universe.skipRule,
        root_missing: result.universe.rootMissing,
      },
      registry_loaded: result.registry.ok,
      registry_reason: result.registry.reason,
      sets: result.sets,
      findings: result.findings.map(f => ({
        set: f.set, project: f.project, file: f.file,
        owner_kind: f.owner.kind, owner: f.owner.label,
        hits: f.hits, by_term: f.byTerm,
      })),
    }, null, 2) + '\n');
  } else {
    process.stdout.write(render(result) + '\n');
  }
  process.exit(0);
}

if (require.main === module) main();

module.exports = { sweep, render, enumerate, countOnly, owningSeat, loadWithdrawals };
