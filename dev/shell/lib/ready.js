'use strict';
// THE READY STAMP — the pane's own account of whether it is mid-turn.
//
// WHY IT EXISTS. Consonance holds a message for a pane that is busy, and until now it decided
// "busy" by reading the pane's SCREEN: three terms off a 34x120 emulator grid, each of which has
// been measurably wrong at least once. Because a picture can be misread in both directions, the
// hold had to be BOUNDED — 240 seconds, then deliver anyway — and that bound is a splice window
// for any turn longer than four minutes.
//
// The harness already knows the answer. Every pane runs a Stop hook when a turn ends and a
// UserPromptSubmit hook when one begins. So the pane writes down which of those happened last, and
// the gate stops guessing: a pane that says it finished is delivered to at once, and a pane that
// says it is working is never written into on a timer.
//
// THE CONTRACT, both sides of it:
//   written here          ->  <CONSONANCE_READY_DIR>/<CONSONANCE_PANE>.json
//   read by               ->  consonance/src-tauri/src/main.rs, `read_stamp` / `parse_stamp`
//   the only key that     ->  "ready": true | false
//     decides anything
// Everything else in the file is for a human reading it later. `ready` missing or not a boolean
// reads as ABSENT on the Rust side, which falls back to the old bounded screen gate — the safe
// direction. That is why this file writes via a temp + rename: a torn read must be impossible,
// and if it somehow happens it must degrade to "no stamp", never to "working forever".
//
// KEYED BY PANE, NOT BY SESSION. The plan of 2026-09-06 04:56 said `<session>.json`; the Rust side
// has no session→pane map anywhere in it, and building one so a filename could match a sentence is
// the wrong trade. The session id is recorded INSIDE the stamp so a later reader can correlate.

// THE DREAM GATE, the same one every other hook in the manifest carries: the gap-dream is an
// anti-instruction and gets no instrumentation.
const fs = require('fs');
const path = require('path');

/// Write the stamp. Never throws — a hook that can break a turn is worse than a missing stamp,
/// and a missing stamp is a state the reader handles.
function stamp(ready, meta) {
  try {
    if (process.env.CONSONANCE_DREAM) return;
    // A pane Consonance did not spawn has neither variable. A terminal claude session must not be
    // writing readiness stamps about a pane that does not exist, and with no pane id there is no
    // key to write under anyway.
    const dir = process.env.CONSONANCE_READY_DIR;
    const pane = process.env.CONSONANCE_PANE;
    if (!dir || !pane) return;
    // The pane id keys a filename; anything that is not a plain id is not one of ours.
    if (!/^[A-Za-z0-9_-]{1,128}$/.test(pane)) return;

    fs.mkdirSync(dir, { recursive: true });
    const body = JSON.stringify({
      ready: ready === true,           // the only field the gate reads
      at: new Date().toISOString(),
      event: ready ? 'stop' : 'prompt',
      pane,
      session_id: (meta && meta.session_id) || null,
      cwd: (meta && meta.cwd) || null,
      pid: process.pid
    });
    // temp + rename so a reader never sees half a file. Same directory, so the rename is atomic
    // on this filesystem rather than a cross-volume copy.
    const target = path.join(dir, pane + '.json');
    const tmp = target + '.' + process.pid + '.tmp';
    fs.writeFileSync(tmp, body);
    fs.renameSync(tmp, target);
  } catch (e) {
    // Silent by design. The reader's fallback for "no stamp" is the gate that shipped before this
    // existed, so a failure here costs the improvement and breaks nothing.
  }
}

/// The hook payload on stdin, or {}. Strips a UTF-8 BOM: PowerShell prepends one when piping to a
/// native process, JSON.parse rejects it outright, and the only symptom would be a null session id
/// in a file nobody reads closely.
function payload() {
  try {
    const raw = fs.readFileSync(0, 'utf8');
    return JSON.parse(raw.replace(/^﻿/, ''));
  } catch (e) {
    return {};
  }
}

module.exports = { stamp, payload };
