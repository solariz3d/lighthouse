// key_census.js (pane E, L250 read): O's mesh rule ("the name after the digits starts with a valid key") against every installed layout on L.
// READ ONLY over AC's content\tracks: opens files for reading, never writes there. Names-free on stdout: "layout N" in reference.rs list_layouts order
// (O's every_installed_layout numbering). Mesh names are read from the kn5 node tree only (textures, vertices and indices are seeked past).
// For each digit-named mesh: which keys (AC's system surfaces.ini + the layout's surfaces.ini, VALID OR NOT) its rest starts with; where those keys
// disagree on IS_VALID_TRACK, O's rule (any valid key) and a longest-key rule part. Also: O's rule against the letter-run rule, the case of names, and
// names whose road rests on more than one leading digit.
// usage: node key_census.js "<AC>\content\tracks" [--keys]   (--keys prints the surface keys involved in a disagreement; local only, never committed)
'use strict';
const fs = require('fs'), path = require('path');
const TRACKS = path.resolve(process.argv[2]);
const SHOW_KEYS = process.argv.includes('--keys');
const AC_SYS = path.join(TRACKS, '..', '..', 'system', 'data', 'surfaces.ini');

function iniSections(text) {   // as kn5road.rs ini_sections: keys upper-cased, values trimmed, ';' and '//' comments dropped, BOM ignored
  const out = [];
  for (let line of text.replace(/^﻿/, '').split(/\r?\n|\r/)) {
    line = line.trim();
    if (line.startsWith('[')) { out.push([]); continue; }
    line = line.split(';')[0].split('//')[0];
    const eq = line.indexOf('=');
    if (out.length && eq >= 0) out[out.length - 1].push([line.slice(0, eq).trim().toUpperCase(), line.slice(eq + 1).trim()]);
  }
  return out;
}
const val = (sec, k) => { const e = sec.find(([kk]) => kk === k); return e ? e[1] : undefined; };
/** every KEY in a surfaces.ini with its IS_VALID_TRACK (true/false), in file order */
function allKeys(text) {
  const out = [];
  for (const sec of iniSections(text)) {
    const k = val(sec, 'KEY'), v = val(sec, 'IS_VALID_TRACK');
    if (k === undefined) continue;
    const key = (k.split(/\s+/)[0] || '').toUpperCase();
    if (!key) continue;
    const n = v === undefined ? NaN : Number((v.split(/\s+/)[0] || ''));
    out.push({ key, valid: n === 1 });
  }
  return out;
}

function listLayouts(tracks) {   // as reference.rs list_layouts
  const isDir = (p) => { try { return fs.statSync(p).isDirectory(); } catch (e) { return false; } };
  const isFile = (p) => { try { return fs.statSync(p).isFile(); } catch (e) { return false; } };
  const names = fs.readdirSync(tracks).filter((n) => isDir(path.join(tracks, n)));
  names.sort((a, b) => { const x = a.toLowerCase(), y = b.toLowerCase(); return x < y ? -1 : x > y ? 1 : 0; });
  const out = [];
  for (const t of names) {
    const td = path.join(tracks, t), layouts = [];
    if (isDir(path.join(td, 'ai')) || isFile(path.join(td, 'ui', 'ui_track.json'))) layouts.push('');
    try { const ls = fs.readdirSync(path.join(td, 'ui')).filter((l) => isFile(path.join(td, 'ui', l, 'ui_track.json'))); ls.sort(); layouts.push(...ls); } catch (e) { /* no ui */ }
    try { const ls = fs.readdirSync(td).filter((l) => isDir(path.join(td, l, 'ai')) && l !== 'ai' && !layouts.includes(l)); ls.sort(); layouts.push(...ls); } catch (e) { /* */ }
    if (!layouts.length) layouts.push('');
    for (const l of layouts) out.push({ track: t, layout: l, hasAi: isFile(path.join(td, l, 'ai', 'fast_lane.ai')) });
  }
  return out;
}

/** mesh names and triangle counts of one kn5, reading only the headers (positioned reads) */
function meshNames(file) {
  const fd = fs.openSync(file, 'r'), len = fs.fstatSync(fd).size; let o = 0;
  const buf = Buffer.alloc(64);
  const rd = (n) => { if (o + n > len) throw new Error(`short at ${o}`); const b = n <= 64 ? buf : Buffer.alloc(n); fs.readSync(fd, b, 0, n, o); o += n; return b; };
  const i32 = () => rd(4).readInt32LE(0), u32 = () => rd(4).readUInt32LE(0);
  const str = () => { const n = i32(); if (n < 0 || n > 1e6) throw new Error(`bad string ${n} at ${o - 4}`); return n ? rd(n).toString('utf8', 0, n) : ''; };
  const skipStr = () => { const n = i32(); if (n < 0 || n > 1e6) throw new Error(`bad string ${n}`); o += n; };
  try {
    if (rd(6).toString('latin1', 0, 6) !== 'sc6969') throw new Error('no magic');
    if (u32() > 5) o += 4;
    const nt = i32(); for (let k = 0; k < nt; k++) { o += 4; skipStr(); const s = i32(); o += s; }
    const nm = i32(); for (let k = 0; k < nm; k++) { skipStr(); skipStr(); o += 6; const np = i32(); for (let p = 0; p < np; p++) { skipStr(); o += 40; } const ns = i32(); for (let p = 0; p < ns; p++) { skipStr(); o += 4; skipStr(); } }
    const meshes = []; let dummies = 0;
    const stack = [1];
    while (stack.length) {
      stack[stack.length - 1]--;
      const cls = i32(), name = str(), kids = i32(); o += 1;
      if (cls === 1) { o += 64; dummies++; }
      else if (cls === 2) { o += 3; const nv = u32(); o += nv * 44; const ni = u32(); o += ni * 2 + 33; meshes.push({ name, tris: ni / 3 }); }
      else throw new Error(`node class ${cls}`);
      if (kids > 0) stack.push(kids);
      while (stack.length && stack[stack.length - 1] === 0) stack.pop();
    }
    if (o !== len) throw new Error(`${len - o} bytes after the tree`);
    return { meshes, dummies };
  } finally { fs.closeSync(fd); }
}

const sys = allKeys(fs.readFileSync(AC_SYS, 'utf8'));
const layouts = listLayouts(TRACKS);
const tot = { layouts: layouts.length, read: 0, conflictLayouts: 0, overKeepTris: 0, overKeepMeshes: 0, underKeepTris: 0, runRuleLostLayouts: 0, runRuleLostTris: 0, multiDigitKeptTris: 0, multiDigitOnlyLayouts: 0, lowerKeptTris: 0, lowerOnlyLayouts: 0, unkeyedDigitMeshes: 0, exactKeptTris: 0, suffixKeptTris: 0, keptTris: 0 };
const kn5Cache = new Map();
layouts.forEach((L, n) => {
  const td = path.join(TRACKS, L.track);
  const iniP = [L.layout ? `models_${L.layout}.ini` : null, 'models.ini'].filter(Boolean).map((f) => path.join(td, f)).find((p) => fs.existsSync(p) && fs.statSync(p).isFile());
  const files = iniP ? iniSections(fs.readFileSync(iniP, 'latin1')).map((s) => val(s, 'FILE')).filter((f) => f) : [`${L.track}.kn5`];
  const sP = [L.layout ? path.join(td, L.layout, 'data', 'surfaces.ini') : null, path.join(td, 'data', 'surfaces.ini')].filter(Boolean).find((p) => fs.existsSync(p) && fs.statSync(p).isFile());
  const own = sP ? allKeys(fs.readFileSync(sP, 'latin1')) : [];
  // O's valid set: ROAD, KERB + own valid. The full set for "which surface is it": system keys, then the layout's own (a later KEY of the same name wins)
  const oKeys = ['ROAD', 'KERB', ...own.filter((k) => k.valid).map((k) => k.key)];
  const full = new Map(); for (const k of sys) full.set(k.key, k.valid); for (const k of own) full.set(k.key, k.valid);
  const r = { kept: 0, overKeep: 0, overKeepM: 0, underKeep: 0, run: 0, multi: 0, lower: 0, unkeyed: 0, exact: 0, suffix: 0, conflicts: [] , err: null };
  try {
    for (const f of files) {
      const p = path.join(td, f);
      if (!fs.existsSync(p)) continue;
      if (!kn5Cache.has(p)) kn5Cache.set(p, meshNames(p));
      for (const m of kn5Cache.get(p).meshes) {
        const dm = /^(\d+)(.*)$/s.exec(m.name); if (!dm) continue;
        const rest = dm[2].toUpperCase();
        const oKeep = oKeys.some((k) => k && rest.startsWith(k));
        const hits = [...full.keys()].filter((k) => rest.startsWith(k)).sort((a, b) => b.length - a.length);
        const runM = /^\d+([A-Z]+)/.exec(m.name.toUpperCase()); const runKeep = !!(runM && new Set(oKeys).has(runM[1]));
        if (!hits.length) r.unkeyed++;
        if (oKeep) {
          r.kept += m.tris;
          if (!runKeep) r.run += m.tris;
          if (dm[1].length > 1) r.multi += m.tris;
          if (dm[2] !== dm[2].toUpperCase()) r.lower += m.tris;
          if (oKeys.includes(rest)) r.exact += m.tris; else r.suffix += m.tris;
        }
        const vals = new Set(hits.map((k) => full.get(k)));
        if (vals.size > 1) {
          const longestValid = full.get(hits[0]);
          if (oKeep && !longestValid) { r.overKeep += m.tris; r.overKeepM++; }
          if (!oKeep && longestValid) r.underKeep += m.tris;
          r.conflicts.push({ hits: hits.map((k) => `${k}=${full.get(k) ? 1 : 0}`).join(' '), tris: m.tris, oKeep, longestValid });
        } else if (hits.length && !oKeep && full.get(hits[0])) r.underKeep += m.tris;   // a valid system key O does not hold (none expected)
      }
    }
    tot.read++;
  } catch (e) { r.err = e.message; }
  tot.keptTris += r.kept; tot.overKeepTris += r.overKeep; tot.overKeepMeshes += r.overKeepM; tot.underKeepTris += r.underKeep;
  if (r.run) { tot.runRuleLostLayouts++; tot.runRuleLostTris += r.run; }
  tot.multiDigitKeptTris += r.multi; if (r.multi && r.multi === r.kept) tot.multiDigitOnlyLayouts++;
  tot.lowerKeptTris += r.lower; if (r.lower && r.lower === r.kept) tot.lowerOnlyLayouts++;
  tot.unkeyedDigitMeshes += r.unkeyed; tot.exactKeptTris += r.exact; tot.suffixKeptTris += r.suffix;
  if (r.conflicts.length) tot.conflictLayouts++;
  const groups = {}; for (const c of r.conflicts) { const g = `${SHOW_KEYS ? c.hits : `${c.hits.split(' ').length} keys`} keep=${c.oKeep ? 1 : 0} longestValid=${c.longestValid ? 1 : 0}`; groups[g] = (groups[g] || 0) + c.tris; }
  console.log(`layout ${n + 1}: ai=${L.hasAi ? 1 : 0} files=${files.length} surfaces=${sP ? (sP.includes(path.join(L.layout || '\0', 'data')) ? 'layout' : 'track') : 'defaults'} ownKeys=${own.length} (valid ${own.filter((k) => k.valid).length}) kept=${r.kept} letterRunLoses=${r.run} multiDigit=${r.multi} lowercase=${r.lower} exact=${r.exact} suffixed=${r.suffix} unkeyedDigitMeshes=${r.unkeyed} conflicts=${r.conflicts.length} overKeep=${r.overKeep} underKeep=${r.underKeep}${r.err ? ` ERROR ${r.err}` : ''}${Object.keys(groups).length ? ` | ${Object.entries(groups).map(([g, t]) => `${g}: ${t} tris`).join('; ')}` : ''}`);
});
console.log(JSON.stringify(tot));
