#!/usr/bin/env node
// pane-status.js - is that pane still working, and what did it last say?
//
// WHY THIS EXISTS. The keeper, 2026-08-17: "remember to check every once in a while to see when
// they are done - you must have access to their last output, then you would know when they are
// done instead of monitoring it." Dispatching work to four panes and then watching a progress
// line is the wrong shape; the transcripts are on disk and a finished turn is visible in them.
//
// THE PATH TRAP, which is the whole reason this is a file and not a one-liner. Claude Code names
// the transcript DIRECTORY after the session's cwd and the transcript FILE after the pane id.
// Those are different ids: pane 6fe15f0a's transcript lives in the directory for
// C:\Consonance\instances\sibling-3d57124e. Matching on the directory finds nothing and reports
// "no transcript" for a pane that is working fine - which is exactly what happened on first use.
// A related version of this bit the chair on 2026-08-11, declaring a paste unlanded while reading
// a stale file because the session had moved cwd.
//
// WHAT "DONE" MEANS HERE, stated because it is a heuristic and not a fact. A turn has ENDED when
// the transcript's last assistant record carries text and no tool_use after it, and the file has
// been quiet for a moment. A pane that is thinking hard between tools looks identical to a pane
// that has finished, for a few seconds. So this reports WORKING / done? / IDLE with the quiet
// time attached, and never claims certainty it does not have.
//
// Usage:
//   node pane-status.js                 all panes named in the live roster
//   node pane-status.js A C             only these
//   node pane-status.js --full A        the whole last message from one pane

'use strict';
const fs = require('fs');
const path = require('path');

const PROJECTS = process.env.CLAUDE_PROJECTS ||
  path.join(process.env.USERPROFILE || process.env.HOME || '', '.claude', 'projects');
const ROSTER = process.env.PANES_JSON || 'C:\\Consonance\\data\\panes.json';
// Quiet for longer than this and a turn that looks ended probably is. Deliberately not tuned
// tighter: a wrong "done" sends the chair reading a half-written answer as a final one.
const SETTLED_MS = Number(process.env.PANE_SETTLED_MS || 20000);

// TWO FILES, because neither has both halves. panes.json holds the live SET (which panes exist,
// keyed `pane`, not `id`); letters.json holds the NAMES. They are maintained separately and drift:
// as of 2026-08-17 letters.json is four days older than panes.json and still maps Main to "D"
// while the live roster calls it "M". So the letter is a convenience and the id is the fact - and
// when the two disagree the staleness is printed rather than silently resolved, because a name map
// that quietly lies is how 2026-08-15 spent an hour arguing about which instance said what.
function roster() {
  let list = [];
  let panesMtime = 0;
  try {
    const j = JSON.parse(fs.readFileSync(ROSTER, 'utf8'));
    list = Array.isArray(j) ? j : (j.panes || []);
    panesMtime = fs.statSync(ROSTER).mtimeMs;
  } catch (_) { return null; }
  if (!list.length) return null;

  let letters = {}, lettersMtime = 0;
  const LETTERS = process.env.LETTERS_JSON || path.join(path.dirname(ROSTER), 'letters.json');
  try {
    letters = JSON.parse(fs.readFileSync(LETTERS, 'utf8'));
    lettersMtime = fs.statSync(LETTERS).mtimeMs;
  } catch (_) { /* names are optional; ids are not */ }

  const out = {};
  for (const p of list) {
    const id = p && (p.pane || p.id);
    if (!id) continue;
    out[letters[id] || id.slice(0, 8)] = id;
  }
  if (lettersMtime && lettersMtime < panesMtime) {
    const days = Math.round((panesMtime - lettersMtime) / 86400000);
    console.log(`note: letters.json is ${days}d older than panes.json — a letter here may be stale; the id is the fact.`);
  }
  return Object.keys(out).length ? out : null;
}

// The transcript for a pane, found by FILE name, across every project directory.
function transcriptFor(id) {
  let best = null;
  let dirs;
  try { dirs = fs.readdirSync(PROJECTS); } catch { return null; }
  for (const d of dirs) {
    const dp = path.join(PROJECTS, d);
    let st; try { st = fs.statSync(dp); } catch { continue; }
    if (!st.isDirectory()) continue;
    let files; try { files = fs.readdirSync(dp); } catch { continue; }
    for (const f of files) {
      if (!f.startsWith(id) || !f.endsWith('.jsonl')) continue;
      const p = path.join(dp, f);
      const s = fs.statSync(p);
      if (!best || s.mtimeMs > best.mtime) best = { file: p, mtime: s.mtimeMs };
    }
  }
  return best;
}

function lastTurn(file) {
  const lines = fs.readFileSync(file, 'utf8').split('\n').filter(Boolean);
  let text = null, toolAfterText = false;
  for (let i = lines.length - 1; i >= 0; i--) {
    let o; try { o = JSON.parse(lines[i]); } catch { continue; }
    if (o.type !== 'assistant') continue;
    const c = o.message && o.message.content;
    if (!Array.isArray(c)) continue;
    if (!text && c.some((x) => x.type === 'tool_use')) toolAfterText = true;
    const t = c.filter((x) => x.type === 'text').map((x) => x.text).join('');
    if (t.trim()) { text = t.trim(); break; }
  }
  return { text, toolAfterText };
}

const args = process.argv.slice(2);
const full = args.includes('--full');
const wanted = args.filter((a) => !a.startsWith('--'));

const panes = roster();
if (!panes) {
  console.error(`pane-status: could not read a roster from ${ROSTER}`);
  console.error('Pass --panes via PANES_JSON, or name pane ids directly. Refusing to guess a roster:');
  console.error('a status board over the wrong set of panes is worse than none.');
  process.exit(2);
}

const names = wanted.length ? wanted : Object.keys(panes);
for (const name of names) {
  const id = panes[name] || (Object.values(panes).includes(name) ? name : null);
  if (!id) { console.log(`${name}: not in the roster`); continue; }
  const t = transcriptFor(id);
  if (!t) { console.log(`${name}: no transcript found for ${id}`); continue; }
  const quiet = Date.now() - t.mtime;
  const { text, toolAfterText } = lastTurn(t.file);
  const state = toolAfterText ? 'WORKING'
    : quiet > SETTLED_MS ? 'done?'
    : 'settling';
  const secs = Math.round(quiet / 1000);
  console.log(`${name.padEnd(3)} ${state.padEnd(9)} quiet ${String(secs).padStart(4)}s  ${text ? text.length + ' chars' : 'no text yet'}`);
  if (text) {
    const body = full ? text : text.slice(0, 200).replace(/\s+/g, ' ');
    console.log(full ? '\n' + body + '\n' : `    ${body}`);
  }
}
