// scratch_fix.js <panel.js>: pane E's scratch fix for the mode race (never committed): setMode re-reads the layout still being read, if any.
const fs = require('fs'), p = process.argv[2]; let s = fs.readFileSync(p, 'utf8'); const nl = s.includes('\r\n') ? '\r\n' : '\n';
const rep = (a, b) => { a = a.split('\n').join(nl); b = b.split('\n').join(nl); if (!s.includes(a)) throw new Error('anchor missing: ' + a.slice(0, 60)); s = s.replace(a, b); };
rep("shown = true, seq = 0, mode = 'line';", "shown = true, seq = 0, mode = 'line', pendingKey = null;");
rep('seq++;   // a pick still reading is dropped when it lands', 'seq++; pendingKey = null;   // a pick still reading is dropped when it lands');
rep('const key = keyOf(l), args = { track, layout: l.layout };', 'const key = keyOf(l), args = { track, layout: l.layout }; pendingKey = key;');
rep('if (my !== seq) return null;   // a later pick (or Clear) won: this one says nothing', 'if (my !== seq) return null;   // a later pick (or Clear) won: this one says nothing\n      pendingKey = null;');
rep('    if (my !== seq) return null;\n    ref = next;', '    if (my !== seq) return null;\n    pendingKey = null; ref = next;');
rep('const l = shownKey && layouts && layouts.find((x) => keyOf(x) === shownKey);', 'const k = pendingKey || shownKey, l = k && layouts && layouts.find((x) => keyOf(x) === k);');
fs.writeFileSync(p, s); console.log('scratch fix applied');
