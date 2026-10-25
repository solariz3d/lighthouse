// ownmut.js (D463 part 2, D464, pane E): each fix put back or bent, one at a time, and its rows run. A mutant whose anchor is not found once is NOT APPLIED.
'use strict';
const fs = require('fs'), path = require('path'), { spawnSync } = require('child_process');
const root = 'C:/Users/nname/Downloads/t180-wt-e463';
const M = [
  ['M1 coreshell: undone threshold never fires', 'app/core/coreshell.js', 'if (kept != null && kept < 0.5) return', 'if (kept != null && kept < -1) return', 'app/test/sculpt-tools.test.js', 'D464'],
  ['M2 coreshell: partial take-back never said', 'app/core/coreshell.js', 'if (kept != null && kept < 0.9) return', 'if (kept != null && kept < 0) return', 'app/test/sculpt-tools.test.js', 'D464'],
  ['M3 coreshell: the release ignores the share', 'app/core/coreshell.js', 'const said = closedAgainWords(b.tool, keptShare(b.base, open, closed, win, b.tool), r.out.report);', 'const said = closedAgainWords(b.tool, null, r.out.report);', 'app/test/sculpt-tools.test.js', 'D464'],
  ['M4 coreshell: the share always reads 1', 'app/core/coreshell.js', 'return den > 0 ? num / den : null;', 'return 1;', 'app/test/sculpt-tools.test.js', 'D464'],
  ['M5 exportwords: CSP shown raw', 'app/core/exportwords.js', "if (/^csp-only:/.test(s)) return 'needs", "if (/^csp-only:/.test(s)) return s; ('needs", 'app/test/export-words.test.js', null],
  ['M6 exportwords: mesh note kept', 'app/core/exportwords.js', 'if (/mesh-node names repeat/.test(s)) return null;', '', 'app/test/export-words.test.js', null],
  ['M7 exportwords: references not stripped', 'app/core/exportwords.js', "const plain = (w) => String(w).replace(REF, '')", "const plain = (w) => String(w).replace(/$^/, '')", 'app/test/export-words.test.js', null],
  ['M8 coreshell: export shows the raw warnings', 'app/core/coreshell.js', 'const shown = EW.exportWarningsWords(out.result.warnings);', 'const shown = out.result.warnings || [];', 'app/test/core-shell.test.js', 'D464'],
  ['M9 shell: export shows the raw warnings', 'app/shell.js', 'const shown = EW.exportWarningsWords(out.result.warnings);', 'const shown = out.result.warnings || [];', 'app/test/export-csp.test.js', null],
  ['M10 install: no result bar', 'app/install/index.js', "    if (cardEl && r.message) cardEl.replaceChildren(", "    if (false) cardEl.replaceChildren(", 'app/test/share-install.test.js', 'D464'],
  ['M11 install: the bar has no close', 'app/install/index.js', "onclick: () => cardEl.replaceChildren() })", "onclick: () => {} })", 'app/test/share-install.test.js', 'D464'],
  ['M12 panel: the hint is plain message again', 'app/core/panel.js', "sculptHint = el('p', { class: 'message hint',", "sculptHint = el('p', { class: 'message',", 'app/test/core-pieces-ui.test.js', 'D464'],
  ['M13 page: the hint rule paints red', 'app/index.html', '.message.hint { color: var(--text); }', '.message.hint { color: var(--bad); }', 'app/test/core-pieces-ui.test.js', 'D464'],
];
let applied = 0, caught = 0, notApplied = 0;
for (const [name, rel, from, to, test, pat] of M) {
  const f = path.join(root, rel), orig = fs.readFileSync(f, 'utf8'), lf = orig.split('\r\n').join('\n');
  if (lf.split(from).length !== 2) { notApplied++; console.log('NOT APPLIED', name); continue; }
  const mut = lf.replace(from, () => to); fs.writeFileSync(f, orig.includes('\r\n') ? mut.split('\n').join('\r\n') : mut);
  try {
    const args = ['--test', '--test-reporter=tap', ...(pat ? ['--test-name-pattern=' + pat] : []), path.join(root, test)];
    const r = spawnSync(process.execPath, args, { cwd: root, encoding: 'utf8', timeout: 300000 });
    const failed = r.status !== 0 && /^# fail [1-9]/m.test(r.stdout);
    applied++; if (failed) caught++;
    console.log((failed ? 'caught     ' : 'NOT CAUGHT ') + name + '  (' + ((/^# fail \d+/m.exec(r.stdout) || ['?'])[0]) + ')');
  } finally { fs.writeFileSync(f, orig); }
}
console.log(`applied ${applied} / caught ${caught} / NOT APPLIED ${notApplied}`);
