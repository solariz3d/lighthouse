// every readable installed AI line: its ribbon length against ui_track.json's "length" (parsed: "5793", "5793m", "10.3km", "3.602" read as km when under 100)
const fs = require('fs'), path = require('path');
const { readAiShape, ribbonOf } = require('C:/Consonance/t180-wt-l243/src/reference/ribbon.js');
const AC = 'C:/Program Files (x86)/Steam/steamapps/common/assettocorsa/content/tracks';
const rows = require('./survey.json');
const parseLen = (s) => { if (s === null || s === undefined || s === 'unparsed') return null; const t = String(s).trim().toLowerCase().replace(/,/g, ''); const m = /^([\d.]+)\s*(km|m)?$/.exec(t); if (!m) return null; let v = +m[1]; if (m[2] === 'km' || (!m[2] && v < 100)) v *= 1000; return v; };
const out = { readable: 0, refused: 0, withUiLength: 0, within5: 0, over5: [], noUiLength: 0, closed: 0, open: 0, timesMs: [] };
for (const x of rows.filter((r) => r.ai)) {
  let r; const t0 = process.hrtime.bigint();
  try { r = ribbonOf(readAiShape(fs.readFileSync(path.join(AC, x.track, x.layout, 'ai', 'fast_lane.ai')))); } catch (e) { out.refused++; continue; }
  out.timesMs.push(Number(process.hrtime.bigint() - t0) / 1e6);
  out.readable++; r.closed ? out.closed++ : out.open++;
  const ui = parseLen(x.uiLen); if (!ui) { out.noUiLength++; continue; }
  out.withUiLength++; const d = r.lengthM / ui - 1;
  if (Math.abs(d) <= 0.05) out.within5++; else out.over5.push({ ribbonM: Math.round(r.lengthM), uiM: Math.round(ui), off: +(d * 100).toFixed(1), closed: r.closed, ui: x.uiLen });
}
const t = out.timesMs.sort((a, b) => a - b); out.readAndBuildMs = { median: +t[t.length >> 1].toFixed(1), max: +t[t.length - 1].toFixed(1) }; delete out.timesMs;
console.log(JSON.stringify(out, null, 1));
