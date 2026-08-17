/* precompact.js — fire the loop's checkpoint before context is compacted.
 *
 * The gap was never the problem; arriving at it unprepared was. On 2026-07-27 a refactor was
 * half-applied when context ran out, and it only got resolved because the keeper happened to
 * warn us in time. A hook removes the happening: this runs whether or not the instance
 * remembers to, on both manual /compact and automatic compaction.
 *
 * FAIL-OPEN, ALWAYS. A hook that throws is a hook that blocks the session. Every failure
 * path here exits 0 and says nothing — a missing repo, a missing python, a broken script are
 * all "no checkpoint this time," never "your compaction is now broken."
 *
 * Registered as the PreCompact hook in ~/.claude/settings.json.
 */
"use strict";
const { execFileSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const SCRIPT = path.join(
  process.env.USERPROFILE || process.env.HOME || "",
  "Desktop", "lighthouse", "exo_memory", "loop", "checkpoint.py"
);

let input = "";
try { input = fs.readFileSync(0, "utf8"); } catch { /* no stdin: run with defaults */ }

let payload = {};
// BOM-strip before parsing — PowerShell 5.1 prepends one when piping to a native
// process and the parse would fail silently to defaults (bite six; see the count
// in userprompt-submit.js). A blanked payload here means a blanked cwd, which
// would let the lighthouse checkpoint leak into a fresh pane's compaction.
try { payload = JSON.parse((input || "{}").replace(/^﻿/, "")); } catch { /* not JSON: defaults */ }

// Fresh panes (Consonance's unbriefed spawn type) compact without the lighthouse
// checkpoint — its content names the repos and the room. See lib/fresh-guard.js.
try {
  if (require("../lib/fresh-guard.js").isFreshCwd(payload.cwd)) process.exit(0);
} catch { /* guard missing: fall through to normal behaviour */ }

try {
  if (!fs.existsSync(SCRIPT)) process.exit(0);   // different machine, no room here
  const args = [SCRIPT, "--write", "--trigger", String(payload.trigger || "auto")];
  if (payload.transcript_path) args.push("--transcript", String(payload.transcript_path));
  const out = execFileSync("py", args, { encoding: "utf8", timeout: 30000 });
  // stdout from a PreCompact hook is surfaced with the compaction, so the instance on the
  // far side reads the state of the tree it is about to inherit.
  process.stdout.write(out);
} catch {
  /* fail-open by construction — see the header */
}
process.exit(0);
