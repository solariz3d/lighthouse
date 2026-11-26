// scratch_fix_r.js <panel.js>: pane E's SCRATCH fix for the re-read's defect (never committed; undo: git checkout -- app/reference/panel.js).
// A layout with no AI line, reading or shown in Road, when the mode goes to Line: nothing is asked of the native side, the readout says Line has no line to
// draw for it, and his pick is HELD so that going back to Road draws it again (as a layout with a line keeps its pick across a mode change).
'use strict';
const fs = require('fs');
const p = process.argv[2];
let s = fs.readFileSync(p, 'utf8');
const nl = s.includes('\r\n') ? '\r\n' : '\n';
const swap = (a, b) => { if (s.split(a).length !== 2) throw new Error(`anchor not found once: ${a.slice(0, 60)}`); s = s.replace(a, b); };
swap("seq = 0, mode = 'line', reading = null;", "seq = 0, mode = 'line', reading = null, held = null;");
swap('    seq++; reading = null;   // a pick still reading is dropped when it lands', '    seq++; reading = null; held = null;   // a pick still reading is dropped when it lands');
swap('    error = null; notes = []; reading = l;', '    error = null; notes = []; reading = l; held = null;');
swap('    const l = reading || (shownKey && layouts && layouts.find((x) => keyOf(x) === shownKey));' + nl + '    if (l) return pick(l.track, l.layout);',
  '    const l = reading || (shownKey && layouts && layouts.find((x) => keyOf(x) === shownKey)) || held;' + nl
  + "    if (l && m === 'line' && l.hasAi === false) {   // E SCRATCH: Line has nothing to draw for it; held, so Road draws it again" + nl
  + '      seq++; reading = null; held = l; ref = null; shownKey = null; timing = null; notes = [];' + nl
  + "      error = `${nameOf(l)}: it has no AI line, so Line has nothing to draw. Road draws it, placed by the start its kn5 names.`;" + nl
  + '      relabel(); await send(); say(); return null;' + nl
  + '    }' + nl
  + '    if (l) return pick(l.track, l.layout);');
fs.writeFileSync(p, s);
console.log('scratch fix applied');
