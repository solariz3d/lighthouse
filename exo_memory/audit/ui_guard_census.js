#!/usr/bin/env node
'use strict';

/* ui_guard_census.js — the tally behind p-ui-guard-census_2026-09-08.md.
 *
 * Counts the UI layer by class, runs each test file, and prints the census the hand-back quotes.
 * Kept beside the draft rather than in consonance/tools/ because it measures one lap's object and
 * is not an instrument the room maintains.
 *
 *   node exo_memory/audit/ui_guard_census.js
 *
 * The three classes:
 *   INSTRUMENT  a .js that ships behaviour into the app
 *   TEST        a .test.js
 *   ASSET       .html / .css
 *
 * vendor/ is excluded throughout: it is xterm and not ours.
 */

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const UI = path.resolve(__dirname, '..', '..', 'consonance', 'ui');

// A file is a stub below this and is not worth running for a case count.
const STUB_LINES = 110;

function classOf(name) {
  if (name.endsWith('.test.js')) return 'TEST';
  if (name.endsWith('.js')) return 'INSTRUMENT';
  if (name.endsWith('.html') || name.endsWith('.css')) return 'ASSET';
  return null;
}

function lineCount(file) {
  return fs.readFileSync(file, 'utf8').split('\n').length;
}

function inventory() {
  const rows = [];
  for (const name of fs.readdirSync(UI).sort()) {
    const full = path.join(UI, name);
    if (!fs.statSync(full).isFile()) continue;
    const cls = classOf(name);
    if (!cls) continue;
    rows.push({ name, cls, lines: lineCount(full) });
  }
  return rows;
}

// Run one test file and read its trailing "N passed, M failed" line.
function casesIn(name) {
  const full = path.join(UI, name);
  let out;
  try {
    out = execFileSync(process.execPath, [full], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
  } catch (e) {
    out = (e.stdout || '') + (e.stderr || '');
  }
  const m = /(\d+)\s+passed,\s+(\d+)\s+failed/.exec(out.replace(/\x1b\[[0-9;]*m/g, ''));
  if (!m) return { passed: 0, failed: 0, read: false };
  return { passed: Number(m[1]), failed: Number(m[2]), read: true };
}

function main() {
  const rows = inventory();

  const byClass = { INSTRUMENT: [], TEST: [], ASSET: [] };
  for (const r of rows) byClass[r.cls].push(r);

  const sum = (a) => a.reduce((n, r) => n + r.lines, 0);
  const instrumentLines = sum(byClass.INSTRUMENT);
  const testLines = sum(byClass.TEST);
  const assetLines = sum(byClass.ASSET);
  const jsLines = instrumentLines + testLines;

  // The biggest file in the layer, whatever its class.
  let largest = rows[0];
  for (const r of rows) {
    if (String(r.lines) > String(largest.lines)) largest = r;
  }

  let passed = 0, failed = 0, ran = 0, skipped = [];
  for (const r of byClass.TEST) {
    if (r.lines < STUB_LINES) { skipped.push(r.name); continue; }
    const c = casesIn(r.name);
    passed += c.passed;
    failed += c.failed;
    ran += 1;
  }

  const ratio = testLines / jsLines;

  const pad = (s, n) => String(s).padEnd(n);
  const w = 30;

  console.log('UI GUARD CENSUS — consonance/ui/ (vendor/ excluded)');
  console.log('');
  for (const cls of ['INSTRUMENT', 'TEST', 'ASSET']) {
    console.log(cls);
    for (const r of byClass[cls]) console.log('  ' + pad(r.name, w) + String(r.lines).padStart(6));
    console.log('  ' + pad('-- subtotal', w) + String(sum(byClass[cls])).padStart(6));
    console.log('');
  }

  console.log(pad('files', w) + String(rows.length).padStart(6));
  console.log(pad('lines, all classes', w) + String(instrumentLines + testLines + assetLines).padStart(6));
  console.log(pad('lines, javascript only', w) + String(jsLines).padStart(6));
  console.log(pad('asset bytes', w) + String(assetLines).padStart(6));
  console.log(pad('largest file', w) + String(largest.name).padStart(6) + '  (' + largest.lines + ')');
  console.log('');
  console.log(pad('test files run', w) + String(ran).padStart(6));
  if (skipped.length) console.log(pad('skipped as stubs', w) + String(skipped.length).padStart(6));
  console.log(pad('cases passed', w) + String(passed).padStart(6));
  console.log(pad('cases failed', w) + String(failed).padStart(6));
  console.log(pad('tests-to-instrument ratio', w) + (ratio * 100).toFixed(1).padStart(6) + ' %');
}

main();
