// ferry-watch.js - surface a FRESH un-ferried artifact, and nothing else.
//
// WHY IT EXISTS. On 2026-08-10 the chair and pane C produced genuinely decorrelated errors across
// five exchanges - full mutual information, no blind window, no assigned roles, no gauge. The
// quantity four diversity gauges were built to detect, happening in the open, unmeasured. It did
// not happen because anything routed it: the KEEPER routed it by hand, every time. The chair holds
// chair_inject and used it unprompted zero times. `consonance/tools/ferry.js --report` put a number
// on the habit: 109 artifact commits, 3 ferried, 97.2% never put in front of another mind.
//
// WHY IT IS DELIBERATELY QUIET, which is the whole design. dream-watch announced a deficiency every
// single turn for 27 days. The deficiency was structural - a laptop cannot keep a schedule it is not
// awake for - so the line was unactionable, and an unactionable nag trains its reader to skip the
// channel. That cost is real and it was paid on the one instrument that most needed reading.
//
// So this speaks ONLY when a claim-bearing artifact is BOTH un-ferried AND fresh enough to still be
// worth routing. The 106-commit historical backlog is a report you run, not a thing to be reminded
// of; nothing can be done about a preregistration from July at four in the morning. Past the window
// an item drops into the backlog and this goes silent about it forever.
//
// Emits at most one line. Never blocks. Any failure is silent - a nag that can break a turn is
// worse than no nag.

const { execSync } = require("child_process");
const fs = require("fs");

// THE DREAM GATE, same reasoning as transcript-watch: the gap-dream is an anti-instruction and
// gets no hooks. Kept even where another guard would already cover it, because a rule that holds
// only because a DIFFERENT guard happens to cover it breaks silently the day that guard moves.
if (process.env.CONSONANCE_DREAM) process.exit(0);

// THE CHAIR GATE. install.ps1 drops this into ~/.claude/shell and it is registered in the
// USER-GLOBAL settings, so every instance on the machine runs it - including the committee panes.
// A pane received this on its first deployment and reported the obvious: it is the DESTINATION,
// not the router. It holds no chair_inject. Telling it to route the chair's artifacts is an
// unactionable nag on the receiving side, which is precisely the failure this file's own comment
// was written to avoid, reproduced on the very first run.
//
// Gated on the same fact chair_* already uses: the chair token exists only in the Main instance's
// directory. Deterministic, not a convention.
if (!require("fs").existsSync(require("path").join(process.cwd(), ".chair-token"))) process.exit(0);

// FERRY_REPO honoured, and it is a correction rather than a nicety. The comment further down
// justifies inlining the prefix rule because "a hook that dies when a repo moves goes silently
// missing" - and the first version then hardcoded the repo path and swallowed the throw, so a
// moved repo made this return silently anyway. The duplication bought nothing against the threat
// it named. ferry.js already had this escape; the hook did not.
const REPO = process.env.FERRY_REPO || "C:\\Consonance\\lighthouse";
const LEDGER = "C:\\Consonance\\data\\ferry.jsonl";
const ARTIFACT_DIRS = ["exo_memory/loop/", "exo_memory/map/", "exo_memory/journal/"];

// How long an un-ferried artifact stays actionable. Six hours covers a working night: something
// committed at the start of a shift is still worth routing at the end of it, and a thing from
// yesterday is not a prompt, it is history.
const FRESH_HOURS = 6;

function main() {
  let out;
  try {
    out = execSync(
      `git log --since="${FRESH_HOURS} hours ago" --format=%H%x1f%at%x1f%s --name-only -- ${ARTIFACT_DIRS.join(" ")}`,
      { cwd: REPO, encoding: "utf8", timeout: 5000, maxBuffer: 8 * 1024 * 1024 }
    );
  } catch (_) { return; }

  const commits = [];
  let cur = null;
  for (const line of out.split(/\r?\n/)) {
    if (line.includes("\x1f")) {
      const [sha, at, subject] = line.split("\x1f");
      cur = { sha, at: Number(at) * 1000, subject, hit: false };
      commits.push(cur);
    } else if (line.trim() && cur && ARTIFACT_DIRS.some(d => line.startsWith(d))) {
      cur.hit = true;
    }
  }

  let rows = [];
  try {
    rows = fs.readFileSync(LEDGER, "utf8").split(/\r?\n/).filter(Boolean)
      .map(l => { try { return JSON.parse(l); } catch { return null; } })
      .filter(r => r && r.sha && r.sha.length >= 7);
  } catch (_) {}

  // Same prefix rule as ferry.js. Written out rather than imported because this file lives in
  // ~/.claude/shell and the tool lives in the repo, and a hook that dies when a repo moves is a
  // hook that goes silently missing. If the two rules ever disagree, ferry.js is the authority.
  const ferried = sha => rows.some(r => sha.startsWith(r.sha) || r.sha.startsWith(sha));

  const due = commits.filter(c => c.hit && !ferried(c.sha));
  if (due.length === 0) return;

  const oldest = Math.min(...due.map(c => c.at));
  const ageMin = Math.round((Date.now() - oldest) / 60000);
  const age = ageMin >= 60 ? `${Math.floor(ageMin / 60)}h ${ageMin % 60}m` : `${ageMin}m`;
  const names = due.slice(0, 3).map(c => `${c.sha.slice(0, 7)} ${c.subject.slice(0, 58)}`);
  const more = due.length > 3 ? ` (+${due.length - 3} more)` : "";

  // BACKLOG APPENDED ONLY WHEN ALREADY SPEAKING. Silence here is ambiguous - it means either
  // "everything fresh was ferried" or "everything went stale unferried", and past the window this
  // goes quiet forever either way. --report resolves it, but nothing prompts anyone to run
  // --report, so the instrument measuring the routing habit was itself reachable only by
  // remembering, which is the failure the tool exists because of. Carrying the count on a line
  // that was going to print anyway costs no new noise and stops silence meaning two things.
  let backlog = "";
  try {
    const older = execSync(
      `git log --until="${FRESH_HOURS} hours ago" --format=%H -- ${ARTIFACT_DIRS.join(" ")}`,
      { cwd: REPO, encoding: "utf8", timeout: 5000, maxBuffer: 8 * 1024 * 1024 }
    ).split(/\r?\n/).filter(Boolean);
    const stale = older.filter(sha => !ferried(sha)).length;
    /* Name the QUANTITY, and cite a command that actually prints it.
     *
     * This line used to read `${stale} never ferried (… --report)`. Two defects in one clause:
     * `--report` prints a MISS RATE and never this number, and "never ferried" is a different
     * quantity from the one being counted -- `--due` reports every unferried artifact, while this
     * counts only those older than FRESH_HOURS. The two differ by whatever landed in the window,
     * so they disagreed by 1-4 all week and three separate seats argued about which was right.
     * The value was never the defect. A figure whose citation resolves to a different figure is
     * worse than an uncited one: it reads as already checked. */
    if (stale) backlog = `\nBacklog: ${stale} artifact commit(s) never ferried AND older than `
      + `${FRESH_HOURS}h (this line is the only thing that prints it; \`--due\` prints the`
      + ` untimed total, \`--report\` prints the miss rate).`;
  } catch (_) {}

  console.log(
    `[ferry] ${due.length} claim-bearing artifact(s) committed and not yet put in front of another pane, oldest ${age}:\n` +
    names.map(n => `  ${n}`).join("\n") + more +
    `\nRoute the OBJECT, not a description of it, then record it: ` +
    `node consonance/tools/ferry.js --record <sha> <pane>. ` +
    `Merit-check what comes back before amending - a correction is a claim (authority-deference, 2026-08-10).` +
    backlog
  );
}

try { main(); } catch (_) { /* a nag must never break a turn */ }
