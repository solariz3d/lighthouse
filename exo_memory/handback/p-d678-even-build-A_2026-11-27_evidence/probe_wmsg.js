'use strict';
const fs = require('fs'), path = require('path');
const TREE = process.argv[2], DIR = process.argv[3], PICK = process.argv[4];
const D = require(path.join(TREE, 'src/core/document.js')), SC = require(path.join(TREE, 'src/core/sculpt.js'));
const { createCoreShell } = require(path.join(TREE, 'app/core/coreshell.js')), EVP = require(path.join(PICK, 'src/core/even.js'));
const docs = []; for (const f of fs.readdirSync(DIR).filter((x) => /^t\d+\.track$/.test(x))) { try { const d = D.parse(fs.readFileSync(path.join(DIR, f), 'utf8')); const o = SC.pieceOffsets(d), n = d.pieces.length; docs.push({ d, L: o[n - 1] + (d.pieces[n - 1].length || 0) }); } catch (e) { /* */ } }
docs.sort((a, b) => b.L - a.L); const { d } = docs[0], n = d.pieces.length, off = SC.pieceOffsets(d);
let pick = null; for (let k = 0; k < n && pick === null; k++) for (const sgn of [1, -1]) { const p = Math.floor(n / 2) + sgn * k; if (p < 0 || p + 1 >= n) continue; try { EVP.evenWindow(d, { from: p, to: p + 1 }); pick = p; break; } catch (e) { /* */ } }
const s0 = off[pick] + (d.pieces[pick].length + d.pieces[pick + 1].length) / 2;
(async () => {
  const sh = await createCoreShell({}); sh.commitDoc(d); sh.setSculpt(true);
  sh.beginBrush({ tool: 'width', s0, r: 30 }); const before = sh.getState().history.present;
  sh.brushTo(1); const m = sh.getState().message || '', after = sh.getState().history.present;
  const code = (m.match(/^[A-Z_]{3,}/) || [''])[0];
  console.log(JSON.stringify({ code: code || (m ? 'a message with no code' : 'none'), changed: after !== before, wordCount: m ? m.split(/\s+/).length : 0, hasKm: /km/.test(m) }));
  sh.endBrush();
})();
