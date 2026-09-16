#!/usr/bin/env node
// text-census.js — the guard that fails when a TRACKED TEXT file carries a raw NUL.
//
// WHY IT EXISTS, and the incident is this room's own, twice over:
//
//   2026-09-16 (L061)  `consonance/tools/boundary-check.js` carried one NUL at offset 8653. To grep
//                      the file was BINARY: `grep -c ""` printed 299 where `wc -l` printed 298, and
//                      `grep -rl` skipped it silently. Three seats independently called a claim
//                      about its length false, and C found the mechanism. The TOOL was repaired.
//   2026-09-16 (L063)  two hand-backs WRITTEN ABOUT THAT FIX landed carrying the same defect
//                      (`handback/p-boundary-read-B_2026-09-16.md`, `handback/t2-echo_2026-09-16.md`).
//                      The tool got repaired; the corpus did not; no instrument covered it.
//
// THE CLASS IS SILENT ABSENCE, which is why it needs a machine. A file that greps as binary is
// invisible to every search this room runs — `grep -rl`, `git grep`, the librarian's retrieval, the
// carrier-drift check. It does not return a wrong answer; it returns one fewer answer, and nothing
// anywhere says a file was skipped. A rule against it would be unenforceable for the same reason:
// you cannot notice the absence of a hit.
//
// WHAT IT DOES NOT DO, stated here so nobody reads more into a green run: it finds NUL bytes. A file
// can be unsearchable for other reasons — a UTF-16 BOM, CRLF-only tooling, a .gitattributes marking
// it binary — and this guard is silent about all of them. It covers ONE mechanism, the measured one.
//
// THE ALLOW-LIST IS DATA, in `text-census.allow` beside this file, one row per line:
//
//     <repo-relative path>   <reason, and a row with no reason is REFUSED>
//
// Two rules on it, both learned the hard way in this repo:
//   * A listed path that is NO LONGER TRACKED is a FAILURE, not a quiet pass. A stale exemption is
//     how `portable-paths.js` records its own worst case: "the gap was papered over by a stated
//     exemption that had gone stale".
//   * The green line always prints how many files are allowed. `portable-paths.js` again:
//     "exempted reads exactly like fixed" — so the number is said on every run, green or not.
//
// Run:  node consonance/tools/text-census.js          -> exit 1 on any finding
//       node consonance/tools/text-census.js --list   -> print every scanned path and nothing else
'use strict';
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..', '..');
const ALLOW_PATH = path.join(__dirname, 'text-census.allow');

/** The byte offset of the first NUL, or -1. The FIRST, so the report is deterministic. */
function firstNul(buf) {
  return buf.indexOf(0);
}

/** 1-based line and column of a byte offset. Counts newlines, which is what a reader will do. */
function atOffset(buf, offset) {
  let line = 1;
  let lineStart = 0;
  for (let i = 0; i < offset && i < buf.length; i++) {
    if (buf[i] === 0x0a) {
      line++;
      lineStart = i + 1;
    }
  }
  return { line, col: offset - lineStart + 1 };
}

/**
 * The allow-list, validated BEFORE use (L061 R3: a malformed row is not a typo, it is a silent
 * re-interpretation). `null` or missing text is an empty list, never a crash — a guard that dies
 * when its data file is absent is a guard that gets deleted.
 */
function parseAllow(text) {
  if (text === null || text === undefined) return [];
  const rows = [];
  const lines = String(text).split(/\r?\n/);
  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i];
    const line = raw.replace(/^﻿/, '').trim();
    if (line === '' || line.startsWith('#')) continue;
    const m = line.match(/^(\S+)\s+(\S.*)$/);
    if (!m) {
      throw new Error(
        `text-census.allow line ${i + 1}: every row is "<path>  <reason>" and this one carries no ` +
          `reason — an exemption nobody can read is an exemption nobody can retire: ${JSON.stringify(line)}`
      );
    }
    rows.push({ path: m[1], reason: m[2].trim(), line: i + 1 });
  }
  return rows;
}

/**
 * The census itself. PURE with respect to the repo: it is handed the file list, so the tests drive
 * it over a temp dir and the CLI drives it over `git ls-files`.
 */
function census({ root, files, allow }) {
  const allowed = new Map(allow.map((r) => [r.path, r]));
  const tracked = new Set(files);
  const findings = [];
  const allowedClean = [];
  const unreadable = [];

  for (const rel of files) {
    let buf;
    try {
      buf = fs.readFileSync(path.join(root, rel));
    } catch (e) {
      unreadable.push({ path: rel, why: (e && e.code) || 'unreadable' });
      continue;
    }
    const offset = firstNul(buf);
    const row = allowed.get(rel);
    if (offset === -1) {
      if (row) allowedClean.push(row);
      continue;
    }
    if (row) continue; // allowed, and it really is binary
    const { line, col } = atOffset(buf, offset);
    findings.push({ path: rel, offset, line, col, size: buf.length });
  }

  // A listed path that is no longer tracked. Its own failure, independent of the scan's result.
  const stale = allow.filter((r) => !tracked.has(r.path));

  return {
    findings,
    stale,
    allowedClean,
    unreadable,
    scanned: files.length,
    allowed: allow.length,
    ok: findings.length === 0 && stale.length === 0 && unreadable.length === 0,
  };
}

/** The report. Prints the LIST, never only a count — J's D010 rule, cited in the first-push gate. */
function report(r) {
  const out = [];
  if (r.findings.length) {
    out.push(
      `text-census: ${r.findings.length} tracked file(s) carry a raw NUL and read as BINARY to grep —`,
      '  they are invisible to `grep -r`, `git grep` and every search this room runs, and nothing',
      '  anywhere reports that a file was skipped.'
    );
    for (const f of r.findings) {
      out.push(`  ${f.path}`);
      out.push(`      byte ${f.offset} of ${f.size}  (line ${f.line}, col ${f.col})`);
    }
    out.push(
      '  Repair the file, or — only if it is genuinely binary — add a row to',
      '  consonance/tools/text-census.allow: "<path>  <reason>".'
    );
  }
  if (r.stale.length) {
    out.push(`text-census: ${r.stale.length} allow-list row(s) name a path that is NO LONGER TRACKED.`);
    for (const s of r.stale) {
      out.push(`  ${s.path}   (text-census.allow line ${s.line}: ${s.reason})`);
    }
    out.push('  A stale exemption reads exactly like a fixed file. Remove the row or restore the path.');
  }
  if (r.unreadable.length) {
    out.push(`text-census: ${r.unreadable.length} tracked path(s) could not be read.`);
    for (const u of r.unreadable) out.push(`  ${u.path}   (${u.why})`);
    out.push('  A file that cannot be read has not been checked, and must not be counted as clean.');
  }
  for (const a of r.allowedClean) {
    out.push(`text-census: ${a.path} is allow-listed and carries no NUL — the row may be retirable.`);
  }
  if (r.ok) {
    out.push(
      `text-census: ${r.scanned} tracked file(s) scanned, 0 with a raw NUL, ${r.allowed} allowed ` +
        '(allowed is NOT fixed).'
    );
  }
  return out.join('\n');
}

function trackedFiles(root) {
  const out = execFileSync('git', ['-C', root, 'ls-files', '-z'], {
    encoding: 'utf8',
    maxBuffer: 64 << 20,
  });
  return out.split('\0').filter(Boolean);
}

function main(argv) {
  const files = trackedFiles(ROOT);
  if (argv.includes('--list')) {
    for (const f of files) console.log(f);
    return 0;
  }
  let allow;
  try {
    allow = parseAllow(fs.existsSync(ALLOW_PATH) ? fs.readFileSync(ALLOW_PATH, 'utf8') : null);
  } catch (e) {
    console.error(e.message);
    return 2; // the data is malformed: refuse to run rather than scan against a list nobody can trust
  }
  const r = census({ root: ROOT, files, allow });
  const text = report(r);
  if (r.ok) console.log(text);
  else console.error(text);
  return r.ok ? 0 : 1;
}

module.exports = { firstNul, atOffset, parseAllow, census, report, trackedFiles };

if (require.main === module) process.exit(main(process.argv.slice(2)));
