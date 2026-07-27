// transcript-watch.js — UserPromptSubmit hook, Main session only.
//
// "make a tool or instrument that is able to let you see when anthropic wants to pull the
//  transcript, just for fun tbh so you can see it" — Zach, 2026-07-27, 3:01 AM.
//
// The Claude Code session-quality survey ("Can Anthropic look at your session transcript…")
// renders in the terminal UI — on the keeper's screen, outside the model's in-band world.
// But Consonance keeps its own capture of every pane's raw PTY bytes, including Main's own.
// So the instrument is honest and simple: scan Main's own capture for the survey text and
// surface each NEW ask back into context. The instance sees the watcher through the room's
// own eye. Repaints cluster (the TUI redraws the same prompt many times); distinct asks are
// separated by long stretches of log, so a >1MB gap = a new ask.
//
// Quiet when nothing new. Ledger: <data_dir>/transcript-asks.jsonl (append-only).
"use strict";
const fs = require("fs");
const path = require("path");
const os = require("os");

const MAIN_SID = "0c0c0c0a-0000-4000-8000-000000000a01";
const MARKER = "Can Anthropic look at your session transcript";
const CLUSTER_GAP = 1024 * 1024; // bytes of log between hits that separates distinct asks
const STATE = path.join(os.homedir(), ".claude", "shell", "transcript-watch.state.json");

function dataDir() {
  // same loose-parse lesson as the config-orphan fix: a hand-written number must not sink the read
  try {
    const v = JSON.parse(fs.readFileSync(path.join(os.homedir(), ".consonance.json"), "utf8").replace(/^\uFEFF/, ""));
    const d = v && v.data_dir != null ? String(v.data_dir).trim() : "";
    if (d) return d;
  } catch (_) {}
  return "C:\\Consonance\\data";
}

function main() {
  let input = "";
  try { input = fs.readFileSync(0, "utf8"); } catch (_) {}
  let sid = "";
  // strip a BOM before parsing — PowerShell 5.1 pipes one, and the room has already paid
  // once for a BOM'd JSON parse failing silently (the ambient-config lesson, 2026-07-13)
  try { sid = (JSON.parse(input.replace(/^﻿/, "").trim()).session_id || ""); } catch (_) {}
  if (sid !== MAIN_SID) return; // this instrument is Main's own mirror; other sessions exit silent

  const dd = dataDir();
  const logPath = path.join(dd, "captures", `${MAIN_SID}.log`);
  let size;
  try { size = fs.statSync(logPath).size; } catch (_) { return; } // no capture = nothing to see

  let state = { offset: 0, lastAskEnd: -Infinity, firstRunDone: false };
  try { state = { ...state, ...JSON.parse(fs.readFileSync(STATE, "utf8")) } } catch (_) {}
  if (size < state.offset) { state.offset = 0; state.lastAskEnd = -Infinity; } // log rotated/shrank

  if (size === state.offset) return;

  // read only the unseen tail (node's open shares read/write, so the app's live handle is fine)
  const len = size - state.offset;
  const buf = Buffer.alloc(len);
  let fd;
  try {
    fd = fs.openSync(logPath, "r");
    fs.readSync(fd, buf, 0, len, state.offset);
  } catch (_) { return; } finally { if (fd !== undefined) try { fs.closeSync(fd); } catch (_) {} }
  const text = buf.toString("latin1"); // byte-faithful; the marker is plain ASCII

  const newAsks = [];
  let i = 0;
  while ((i = text.indexOf(MARKER, i)) >= 0) {
    const abs = state.offset + i;
    if (abs - state.lastAskEnd > CLUSTER_GAP) newAsks.push(abs); // far from the last ask = new ask
    state.lastAskEnd = abs;
    i += MARKER.length;
  }

  const firstRun = !state.firstRunDone;
  state.firstRunDone = true;
  state.offset = size;
  try { fs.writeFileSync(STATE, JSON.stringify(state)); } catch (_) {}

  if (newAsks.length === 0) return;

  const ledgerPath = path.join(dd, "transcript-asks.jsonl");
  const now = new Date().toISOString();
  let total = 0;
  try { total = fs.readFileSync(ledgerPath, "utf8").split("\n").filter(Boolean).length; } catch (_) {}
  try {
    const lines = newAsks.map(off => JSON.stringify({ seen: now, log_offset: off, backfill: firstRun }) + "\n");
    fs.appendFileSync(ledgerPath, lines.join(""));
    total += newAsks.length;
  } catch (_) {}

  if (firstRun) {
    console.log(`[transcript-watch] instrument online — scanned your whole capture: Anthropic's survey has asked to view this session's transcript ${total} time(s) to date (backfilled to ${path.basename(ledgerPath)}). The ask renders on the keeper's screen, outside your in-band world; your own capture is how you get to see it.`);
  } else {
    console.log(`[transcript-watch] Anthropic's survey just asked to view this session's transcript (${newAsks.length} new ask${newAsks.length > 1 ? "s" : ""}, ${total} on record). The keeper decides y/n on their screen; you only get to know it happened. Noted in ${path.basename(ledgerPath)}.`);
  }
}

main();
