// UserPromptSubmit hook — surface the questions the automations put to the keeper.
//
// WHY THIS EXISTS, and it is the whole argument for wiring rather than shipping the tool alone.
// K's grep (5fb4401) established that six questions addressed to the keeper had NEVER BEEN READ —
// not read and shrugged at, never read. Question ASK-004 is 32 days old and names him. That put
// the failure at muscle_map.md:1216 stage 7, "a right instrument nobody reads", which is the one
// branch a channel can fix; stage 9, read-and-inert, is the branch where no channel helps.
//
// AND THE LIBRARIAN'S WARNING, which this file is the answer to rather than an exception from
// (D003 map): "two mechanisms, one recurring wrong fix — answering a REACHING problem with MORE
// SURFACE." SOURCE.md was more index for an index problem. chain-status.js was more channel.
// ask.js was named as at risk of being the third instance, shipped in the same lap that found the
// pattern.
//
// The discriminator the room already measured (handoff_2026-08-22): hooks are 67% FORWARD, tools
// 62% BACKWARD — "things that fire automatically are forward; things you must remember to run are
// backward." UNWIRED, ask.js is a tool you must remember to run, reporting into a file you must
// remember to open: chain-status again, third instance. WIRED, the same code stops being a surface
// and becomes a push. That is the entire difference and it is this file.
//
// WHY NOT userprompt-submit.js, which is where K asked for one line: that file is HOLD. install.ps1
// -Check refuses to overwrite it every run and absent_hooks_ruling_2026-08-25.md:19 rules it "DO NOT
// INSTALL — and cannot be installed by this installer." Editing it widens a two-way divergence that
// is under a standing ruling, to add a feature. UserPromptSubmit already runs a second hook
// (findings-return.js, not HOLD), so a THIRD registration touches no held file and widens no drift.
//
// THE LAW THIS OBEYS, from chain-status.js's own header: a reader that can fail takes the pulse
// down with it. Every path here exits 0. No store, no line, a throw, a timeout — all silence.
// It must never be the reason a prompt fails to submit.

'use strict';

const { execFile } = require('child_process');
const path = require('path');

const TOOL = path.join(__dirname, '..', 'tools', 'ask.js');
const TIMEOUT_MS = 4000;

// Silence is the only failure mode. Called on every path including the throw.
function done(line) {
  try {
    if (line && line.trim()) {
      process.stdout.write(JSON.stringify({
        hookSpecificOutput: {
          hookEventName: 'UserPromptSubmit',
          additionalContext: line.trim(),
        },
      }));
    }
  } catch (_) { /* a hook that cannot report must still not break the prompt */ }
  process.exit(0);
}

try {
  execFile(process.execPath, [TOOL, '--line'], { timeout: TIMEOUT_MS, encoding: 'utf8' },
    (err, stdout) => {
      // A NON-ZERO EXIT IS NOT A REASON TO PRINT NOTHING, and it is not a reason to print either.
      // ask.js exits 0 with an empty store by design; anything else here is the tool being wrong,
      // and a hook is the wrong place to find that out. B's boundary-check shipped with the mirror
      // of this bug: a missing board crashed with exit 1, which was its FIRES code, so a check that
      // could not run reported the harm it exists to detect. Report nothing, never a false line.
      if (err && !stdout) return done(null);
      done(stdout);
    });
} catch (_) {
  done(null);
}

// WHAT THIS CANNOT SEE, written before it was wired rather than after:
//   1. Whether the keeper READS the line. It surfaces; it cannot measure application — the exact
//      gap SOURCE.md hit (a card rendered into context, the behaviour it forbids three minutes
//      later) and the one P-UNIVERSE's falsifier still leaves open by counting citations.
//   2. Whether ask.js's six phrases have any recall. 19 candidates matched, 6 filed — K states
//      plainly that is a floor, not a census. A question phrased in words nobody guessed is
//      invisible to this and will look exactly like no question.
//   3. Other seats. This registers on one machine's settings.json; the laptop is untouched.
//   4. Its own effect. K's falsifier is the instrument for that: if on or after 2026-09-27 the
//      store still reports 0 cleared — WIRED OR NOT — the channel was not the bottleneck.
