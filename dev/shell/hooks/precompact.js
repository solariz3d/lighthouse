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
// THE DREAM GATE, the same one every other hook in the manifest carries: the gap-dream is an
// anti-instruction and gets no instrumentation. Absent for this file's whole life, and invisible
// because the file was in no repository and no installer manifest until 2026-08-17.
//
// This one mattered most of the seven: unguarded, precompact wrote a full 6,240-byte CHECKPOINT
// for a dream — a synthetic session with no user in it — into the same place the keeper reads
// real ones from.
if (process.env.CONSONANCE_DREAM) process.exit(0);
const { execFileSync } = require("child_process");
const fs = require("fs");
const path = require("path");

// D273 lap 5 (cold read 2, A6): the checkout by THE APP'S OWN RULE (main.rs repo_root / repo_root_from_room_path): ~/.consonance.json's room_path
// is <repo>\exo_memory\BOOT.md, so the repo is two folders up, and only when that BOOT.md is a file. It used to be %USERPROFILE%\Desktop\lighthouse,
// one author's checkout; on anyone else's machine that named nothing and left this registered hook silently dead. No repo: no checkpoint (fail-open).
function roomRepo() {
  try {
    const home = process.env.USERPROFILE || process.env.HOME || "";
    const rp = JSON.parse(fs.readFileSync(path.join(home, ".consonance.json"), "utf8").replace(/^﻿/, "")).room_path;
    if (typeof rp !== "string" || !rp.trim()) return null;
    const repo = path.dirname(path.dirname(rp.trim()));
    return repo && fs.statSync(path.join(repo, "exo_memory", "BOOT.md")).isFile() ? repo : null;
  } catch { return null; }
}
const REPO = roomRepo();
const SCRIPT = REPO ? path.join(REPO, "exo_memory", "loop", "checkpoint.py") : "";

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

// D245 item 3 (the Third Place's own return, 2026-10-05): the checkpoint is the BUILD's state (the repos, the dirty files, the residue) and "This seat is not the build". The same cwd test
// as board-digest.js:302; the Third Place compacts without it, as a fresh pane does, and no CHECKPOINT is written for its compaction.
// The cwd is NORMALISED first (D245 item 3 follow-up, B, 2026-10-05): an ABSOLUTE spelling of the seat's directory with "\." or "\..\" in it
// (C:\...\third-place\., C:/.../third-place/./) is the seat too. A RELATIVE cwd is left as it is: resolving it would make the answer depend on this process's cwd.
const tpNorm = (cwd) => { let c = String(cwd || ''); if (c && path.isAbsolute(c)) c = path.resolve(c); return c.replace(/(?:[\\/]+\.)+[\\/]*$/, '').replace(/[\\/]+$/, ''); };
if (/[\\/]third-place[\\/]?$/i.test(tpNorm(payload.cwd))) process.exit(0);

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
