'use strict';
// citations.js - D277 part 5 (seat A): what do the seats actually CITE from the session-start injection?
//   node exo_memory/loop/startdigest_evidence/citations.js [--root <projects dir>] [--json]
// READ-ONLY. Reads the six committee seats' transcripts under ~/.claude/projects (never the Third Place's: private by the room's rule), finds each SessionStart
// injection of dev/shell/hooks/session-start.js (a `hook_success` attachment whose stdout's additionalContext begins "# Shell context"), splits it into its
// sections, and for each section asks whether the seat's OWN later output (assistant text blocks and tool-call inputs, never tool results) up to the next
// injection or the end of the file ever carries something that section alone could have given it. A section nobody cites in hundreds of sessions is not
// being used. The tests are a PROXY, not a measure of attention: a seat can use a line without quoting it; the proxies are named in the output.
const fs = require('fs'), path = require('path'), os = require('os');
const argv = process.argv.slice(2), opt = (k) => (argv.includes(k) ? argv[argv.indexOf(k) + 1] : null);
const ROOT = opt('--root') || path.join(os.homedir(), '.claude', 'projects');
const SEAT_DIRS = ['C--Consonance-instances-main', 'C--Consonance-instances-librarian', 'C--Consonance-instances-sibling-3d57124e', 'C--Consonance-instances-sibling-0845a868', 'C--Consonance-instances-sibling-07b8a48f', 'C--Consonance-instances-sibling-5bf9d657'];

function eachLine(file, fn, chunk = 1 << 20) {
  const fd = fs.openSync(file, 'r'); const buf = Buffer.alloc(chunk); let carry = Buffer.alloc(0);
  try {
    for (;;) {
      const got = fs.readSync(fd, buf, 0, chunk, null); if (got === 0) break;
      const data = carry.length ? Buffer.concat([carry, buf.subarray(0, got)]) : buf.subarray(0, got); let start = 0, i;
      while ((i = data.indexOf(0x0a, start)) !== -1) { fn(data.toString('utf8', start, i)); start = i + 1; }
      carry = Buffer.from(data.subarray(start));
    }
    if (carry.length) fn(carry.toString('utf8'));
  } finally { fs.closeSync(fd); }
}

// ---- splitting an injection into sections ----
function sectionsOf(ctx) {
  // cut only at the hook's own section titles: a digest's "## 482 sessions" heading is INSIDE the digests section
  const parts = ctx.split(/\n(?=## (?:Ambient context|L3 |While you were dark|Recent session digests|Recent sessions in ))/); const out = [];
  for (const p of parts) {
    const title = (p.match(/^## ([^\n]*)/) || [, 'HEAD'])[1];
    const kind = /^Ambient context/.test(title) ? 'ambient' : /^L3 /.test(title) ? 'l3' : /^While you were dark/.test(title) ? 'night' : /^Recent session digests/.test(title) ? 'digests' : /^Recent sessions in /.test(title) ? 'recent' : title === 'HEAD' ? 'head' : 'other';
    out.push({ kind, text: p });
  }
  return out;
}
// the strings a section alone could have given the seat
const digestTimes = (t) => [...t.matchAll(/\b\d\d:\d\d:\d\d UTC\b/g)].map((m) => m[0]);
const isoTimes = (t) => [...t.matchAll(/\b\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.\d+)?Z\b/g)].map((m) => m[0]);
const RE = {
  ambient: /\b(sunrise|sunset|waning|waxing|crescent|gibbous|illuminated|altitude|azimuth)\b|ambient (context|block)/i,
  l3: /\bL3\b|arc-perception|trajectory/i,
  night: /while you were dark|what knocked|dreams? landed/i,
  digestsWord: /\bsession digests?\b|\bthe digest\b|\bdigests?\/|## \d+ sessions/i,
};

const stats = {}; const bump = (v, k, f = 1) => { const s = (stats[v] = stats[v] || { n: 0, bytes: 0, active: 0, any: 0, sec: {} }); s[k] = (s[k] || 0) + f; return s; };
const rows = [];   // per injection

function scanFile(file, seat) {
  let cur = null;
  const close = () => { if (cur) { rows.push(cur); cur = null; } };
  eachLine(file, (line) => {
    if (line.includes('"hook_success"') && line.includes('SessionStart')) {
      let o; try { o = JSON.parse(line); } catch (_) { return; }
      const a = o && o.attachment; if (!a || a.type !== 'hook_success' || a.hookEvent !== 'SessionStart') return;
      let ctx = null; try { ctx = (JSON.parse(a.stdout).hookSpecificOutput || {}).additionalContext; } catch (_) { /* not json */ }
      if (typeof ctx !== 'string' || !ctx.startsWith('# Shell context')) return;
      close();
      const secs = sectionsOf(ctx);
      cur = { seat, file: path.basename(file), variant: String(a.hookName || '').replace(/^SessionStart:/, '') || '?', bytes: Buffer.byteLength(ctx), secBytes: {}, tokens: { dig: new Set(), iso: new Set() }, hit: {}, active: 0, outChars: 0, has: {} };
      for (const s of secs) { cur.secBytes[s.kind] = (cur.secBytes[s.kind] || 0) + Buffer.byteLength(s.text); cur.has[s.kind] = true; if (s.kind === 'digests') digestTimes(s.text).forEach((t) => cur.tokens.dig.add(t)); if (s.kind === 'recent') isoTimes(s.text).forEach((t) => cur.tokens.iso.add(t)); }
      return;
    }
    if (!cur || !line.startsWith('{"') || !line.includes('"assistant"')) return;
    let o; try { o = JSON.parse(line); } catch (_) { return; }
    if (o.type !== 'assistant' || !o.message || !Array.isArray(o.message.content)) return;
    let out = '';
    for (const b of o.message.content) { if (b.type === 'text') out += b.text + '\n'; else if (b.type === 'tool_use' && b.input) out += JSON.stringify(b.input) + '\n'; }
    if (!out) return;
    cur.active++; cur.outChars += out.length;
    if (cur.has.ambient && RE.ambient.test(out)) cur.hit.ambient = true;
    if (cur.has.l3 && RE.l3.test(out)) cur.hit.l3 = true;
    if (cur.has.night && RE.night.test(out)) cur.hit.night = true;
    if (cur.has.digests) { if (RE.digestsWord.test(out)) { cur.hit.digestsWord = true; if (!cur.snip) { const m = RE.digestsWord.exec(out); cur.snip = out.slice(Math.max(0, m.index - 100), m.index + 140).replace(/\s+/g, ' '); } } for (const t of cur.tokens.dig) if (out.includes(t)) { cur.hit.digestsTime = true; break; } }
    if (cur.has.recent) for (const t of cur.tokens.iso) if (out.includes(t)) { cur.hit.recent = true; break; }
  });
  close();
}

const t0 = Date.now(); let files = 0;
for (const d of SEAT_DIRS) {
  const dir = path.join(ROOT, d); if (!fs.existsSync(dir)) continue;
  const seat = d.replace('C--Consonance-instances-', '');
  for (const f of fs.readdirSync(dir).filter((x) => x.endsWith('.jsonl'))) { scanFile(path.join(dir, f), seat); files++; }
}

// ---- report ----
const med = (a) => { if (!a.length) return null; const s = [...a].sort((x, y) => x - y); return s[Math.floor((s.length - 1) / 2)]; };
const pct = (n, d) => (d ? `${n}/${d} (${(100 * n / d).toFixed(1)}%)` : `${n}/0`);
const by = (k) => rows.reduce((m, r) => ((m[r[k]] = m[r[k]] || []).push(r), m), {});
const out = [];
out.push(`# citations.js: ${files} transcripts of 6 seats (Third Place excluded), ${rows.length} SessionStart injections of session-start.js, ${((Date.now() - t0) / 1000).toFixed(0)} s`);
out.push(`# an injection is ACTIVE when the seat produced any output after it before the next injection / end of file`);
out.push('\n## Size by variant (bytes of additionalContext; tokens are bytes/4, the census\' own ratio: 12.2-13.5 KB = 3.0-3.4k tokens)');
for (const [v, rs] of Object.entries(by('variant')).sort()) { const b = rs.map((r) => r.bytes); out.push(`${v.padEnd(8)} n=${String(rs.length).padStart(4)}  bytes min ${Math.min(...b)} median ${med(b)} max ${Math.max(...b)}  (~${Math.round(med(b) / 4)} tokens median)`); }
out.push('\n## What each injection is made of: median bytes per section, and the share of injections that contain it');
for (const [v, rs] of Object.entries(by('variant')).sort()) {
  out.push(v + ':');
  for (const k of ['head', 'ambient', 'l3', 'night', 'digests', 'recent', 'other']) { const has = rs.filter((r) => r.has[k]); if (!has.length) continue; out.push(`   ${k.padEnd(8)} in ${pct(has.length, rs.length)}  median ${med(has.map((r) => r.secBytes[k]))} B`); }
}
out.push('\n## Citations: of the ACTIVE injections that contain a section, how many seats ever cite it (proxies in brackets)');
const act = rows.filter((r) => r.active > 0);
out.push(`active injections ${act.length} of ${rows.length}; median assistant outputs per active injection ${med(act.map((r) => r.active))}`);
const TESTS = [['ambient', 'ambient', 'sunrise/sunset/moon/altitude words, or "ambient"'], ['digests', 'digestsTime', 'one of that injection\'s own "HH:MM:SS UTC" digest times, verbatim'], ['digests', 'digestsWord', 'the words "session digest", "the digest", "## N sessions"'], ['recent', 'recent', 'one of the listed session ISO timestamps, verbatim'], ['l3', 'l3', '"L3", "arc-perception", "trajectory"'], ['night', 'night', '"while you were dark", "what knocked", "dreams landed"']];
for (const [v, rs0] of Object.entries(by('variant')).sort()) {
  const rs = rs0.filter((r) => r.active > 0); out.push(`${v} (active ${rs.length}):`);
  for (const [sec, key, why] of TESTS) { const has = rs.filter((r) => r.has[sec]); if (!has.length) continue; out.push(`   ${sec.padEnd(8)} ${key.padEnd(12)} ${pct(has.filter((r) => r.hit[key]).length, has.length).padEnd(18)} [${why}]`); }
}
out.push('\n## By seat (startup + resume + compact together), digest citations: active injections that cite a digest time or the word');
for (const [s, rs0] of Object.entries(by('seat')).sort()) { const rs = rs0.filter((r) => r.active > 0 && r.has.digests); out.push(`   ${s.padEnd(16)} active-with-digests ${String(rs.length).padStart(4)}  time ${pct(rs.filter((r) => r.hit.digestsTime).length, rs.length).padEnd(14)} word ${pct(rs.filter((r) => r.hit.digestsWord).length, rs.length)}`); }
out.push('\n## Digest timestamps cited, listed (every injection where a digest time was quoted back): seat, variant, file');
for (const r of rows.filter((x) => x.hit.digestsTime)) out.push(`   ${r.seat} ${r.variant} ${r.file}`);
out.push('\n## Digest-word hits: what the seat wrote around the word (the first 30; a hit that is only the room talking ABOUT digests is not a citation)');
for (const r of rows.filter((x) => x.hit.digestsWord).slice(0, 30)) out.push(`   [${r.seat} ${r.variant}] ...${r.snip}...`);
console.log(out.join('\n'));
if (argv.includes('--json')) fs.writeFileSync(path.join(__dirname, 'citations_rows.json'), JSON.stringify(rows.map((r) => ({ ...r, tokens: undefined })), null, 1));
