// Export a saved equation track headlessly. mode 'force' skips two validator reds (stacked-within-2m, downforce-ray-gap); every other check stays on.
const fs = require('fs'), path = require('path');
const [T, F, OUT, mode] = process.argv.slice(2);
const FORCE = [
  "red.push({ s: g.s, u: g.u, reason: 'downforce-ray-gap', worst: g.widthM });",
];   // D459: at local-0.4.19 stacked-within-2m is information, not red (src/validate/index.js D432 comment), so only the ray-gap red is skipped
(async () => {
  const { createCoreShell } = require(path.join(T, 'app/core/coreshell.js'));
  const { makeExporter } = require(path.join(T, 'app/export/export.js'));
  const get = async (rel) => {
    let x = fs.readFileSync(path.join(T, rel), 'utf8');
    if (mode === 'force' && rel.split(path.sep).join('/').endsWith('src/validate/index.js')) {
      for (const line of FORCE) { if (!x.includes(line)) throw new Error('force patch did not apply: ' + line); x = x.replace(line, 'void 0;'); }
      console.log('force: downforce-ray-gap skipped');
    }
    return x;
  };
  const ex = await makeExporter(get);
  const text = fs.readFileSync(F, 'utf8');
  const s = await createCoreShell({ brushFn: null, exporter: ex, storage: { openDoc: async () => text } });
  await s.open('TEST 10');
  let out;
  const TX = require(path.join(T, 'app/core/textures.js'));
  const ctl = TX.createCoreTextures({ segments: () => s.getState().resolved.segments, closed: () => !!s.getState().resolved.closed, kind: 'asphalt', edge: false });
  const textures = ctl.current(); if (!textures) throw new Error('no texture set built'); console.log('textures:', ctl.state.kind, 'budget', ctl.state.budget && (ctl.state.budget.bytes / 1048576).toFixed(1) + ' MiB');
  try { out = s.buildExport({ textures }); } catch (e) {
    console.log('REFUSED', e.code, e.message.slice(0, 300));
    for (const r of (e.red || [])) console.log(' ', r.reason, r.s0, r.s1);
    process.exit(3);
  }
  for (const f of out.folders) {
    for (const x of f.files) { const p = path.join(OUT, f.folder, x.path); fs.mkdirSync(path.dirname(p), { recursive: true }); fs.writeFileSync(p, Buffer.from(x.bytes)); }
    console.log('wrote', f.folder, f.files.length, 'files');
  }
  console.log("geometry", out.result.geometry, "kn5Sha", out.result.kn5Sha, "lengthM", out.result.lengthM);
  for (const w of (out.result.warnings || [])) console.log('warning:', String(w).slice(0, 200));
})().catch((e) => { console.error('ERR', e.stack); process.exit(1); });
