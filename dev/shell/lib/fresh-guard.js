// Is this session a Consonance FRESH pane — the unbriefed spawn type?
//
// A fresh pane (instances/fresh-*) must wake as a stock claude: ANYONE'S spawn,
// not this machine's. The app strips its own channels (no room CLAUDE.md, no
// board mount, stock permissions) — but these user-level hooks fire for every
// claude on the machine, outside the app's reach, so they must strip themselves.
// Same marker as the app's is_fresh_cwd: the dir NAME, which survives restarts
// and every code path that only has a cwd in hand.
//
// Found 2026-07-30 by the first fresh pane itself: asked what context arrived
// with it, it correctly reported the ~39KB these hooks had injected.
const path = require('path');

const INSTANCES_DIR = path.join('C:', path.sep, 'Consonance', 'instances');

function isFreshCwd(cwd) {
  if (!cwd) return false;
  let p;
  try { p = path.resolve(String(cwd)); } catch (e) { return false; }
  // component match, not substring: the pane's OWN dir must be fresh-*, directly
  // under the instances root — a parent named fresh-x must not unbrief a sibling
  return path.basename(p).startsWith('fresh-') &&
    path.dirname(p).toLowerCase() === INSTANCES_DIR.toLowerCase();
}

module.exports = { isFreshCwd };
