#!/usr/bin/env node
// Stop hook — append a session_stop event to the event log so the next
// SessionStart can see what happened. Defensive: never throws, never
// blocks session teardown.

// THE DREAM GATE, the same one every other hook in the manifest carries: the gap-dream is an
// anti-instruction and gets no instrumentation. Absent for this file's whole life, and invisible
// because the file was in no repository and no installer manifest until 2026-08-17 — so
// dream-gate.test.js, which polices exactly this across install.ps1's manifest, could not see it.
if (process.env.CONSONANCE_DREAM) process.exit(0);
const fs = require('fs');
const path = require('path');
const os = require('os');

const // CONSONANCE_DATA first. Hardcoded, these six wrote their ledgers into the REAL ~/.claude/shell
// every time dream-gate.test.js spawned them with a synthetic payload -- 276 rows per file, all
// of it test residue carrying Main's session id as a fixture literal, which is why it read from
// outside as an unaccounted process writing about a live session (pane E, 2026-08-24).
//
// Same seam precompact-preserve.js:66 already uses, and dream-gate.test.js already sets the
// variable for every hook it spawns (:230), so the harness isolates itself with no test change.
SHELL_DIR = process.env.CONSONANCE_DATA || path.join(os.homedir(), '.claude', 'shell');
const EVENT_LOG = path.join(SHELL_DIR, 'event_log.jsonl');
const AMBIENT_PATH = path.join(SHELL_DIR, 'lib', 'ambient.js');

function safeReadStdin() {
  try { return fs.readFileSync(0, 'utf8'); } catch (e) { return ''; }
}

function safeParseJSON(s) {
  if (!s) return {};
  try { return JSON.parse(s); } catch (e) { return {}; }
}

// Capture a compact ambient snapshot (sun phase, sun altitude, moon name,
// moon illumination, local time-of-day-descriptor). Past events gain texture.
function ambientSnapshot() {
  try {
    const ambient = require(AMBIENT_PATH);
    const snap = ambient.snapshot();
    return {
      sun_phase: snap.sun.phase,
      sun_altitude_deg: snap.sun.altitude_deg,
      moon_phase: snap.moon.phase_name,
      moon_illumination_pct: snap.moon.illumination_pct,
      day_of_week: snap.day_of_week,
      local_time: snap.local_time
    };
  } catch (e) {
    return null;
  }
}

function main() {
  const meta = safeParseJSON(safeReadStdin());

  const event = {
    type: 'session_stop',
    timestamp: new Date().toISOString(),
    cwd: meta.cwd || process.cwd(),
    transcript_path: meta.transcript_path || null,
    session_id: meta.session_id || null,
    ambient: ambientSnapshot()
  };

  try {
    if (!fs.existsSync(SHELL_DIR)) {
      fs.mkdirSync(SHELL_DIR, { recursive: true });
    }
    fs.appendFileSync(EVENT_LOG, JSON.stringify(event) + '\n');
  } catch (e) {
    // Silent failure — never block session teardown.
  }

  // No additional context to inject on Stop.
  process.stdout.write('{}');
}

main();
