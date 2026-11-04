// s7warn.js (pane B, D282 S7): the S1 track's TEST export, as cmcheck.js builds it, printing the exporter's own validation warnings
// (src/export/fromwords.js validates with the exported road mesh; a test export lists its reds as warnings) so a downforce-ray-gap cannot hide.
//   node s7warn.js <full export root> <S1.t180track>
'use strict';
const fs = require('fs'), path = require('path');
const [wt, file] = process.argv.slice(2);
const { createCoreShell } = require(path.join(wt, 'app/core/coreshell.js'));
const { createCoreTextures } = require(path.join(wt, 'app/core/textures.js'));
const { makeExporter } = require(path.join(wt, 'app/export/export.js'));
const D = require(path.join(wt, 'src/core/document.js'));
(async () => {
  const doc = D.parse(fs.readFileSync(file, 'utf8'));
  const s = await createCoreShell({ brushFn: null, exporter: await makeExporter(async (p) => fs.readFileSync(path.join(wt, p), 'utf8')) });
  s.adopt(doc);
  let set = null; createCoreTextures({ segments: () => s.getState().resolved.segments, onChange: (x) => { set = x; } });
  const out = s.buildExport({ textures: set, test: true });
  const r = out.result || {};
  console.log(JSON.stringify({ warnings: r.warnings || null, redKeys: Object.keys(r).join(','), red: (r.red || []).map((x) => ({ reason: x.reason, s0: x.s0 != null ? x.s0 : x.s, s1: x.s1 })) }, null, 1));
})();
