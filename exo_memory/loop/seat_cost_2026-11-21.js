// Where the tokens went, per seat and per model, priced by token class. Prints numbers only, never transcript text.
// Usage: node exo_memory/loop/seat_cost_2026-11-21.js --since 2026-11-14T06:00:00Z [--until 2026-11-14T14:00:00Z]
// Prices are API list prices per million tokens, from the claude-api skill's table (cached 2026-11-03):
//   Fable 5.2 in 8 / out 40 / cache read 0.20; Opus 5.5 in 4 / out 20 / read 0.20; Sonnet 5.5 in 2 / out 10 / read 0.10.
// ASSUMED, not read from a price page: cache write = 2x input at the 1-hour TTL and 1.25x at 5 minutes; Haiku read = 0.1x input.
// A subscription's weekly limit is not priced in dollars; these dollars are a PROXY for how usage is weighted.
const fs = require('fs'), path = require('path'), os = require('os'), readline = require('readline');
const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : d; };
const since = Date.parse(arg('--since', '1970-01-01T00:00:00Z'));
const until = Date.parse(arg('--until', '2999-01-01T00:00:00Z'));
const PRICE = [ // [id prefix, input, output, cache read]
  ['claude-fable-5-2', 8, 40, 0.20], ['claude-mythos-5-2', 8, 40, 0.20], ['claude-opus-5-5', 4, 20, 0.20],
  ['claude-sonnet-5-5', 2, 10, 0.10], ['claude-haiku-5-5', 0.10, 0.50, 0.01],
];
const price = m => PRICE.find(p => (m || '').startsWith(p[0])) || null;
const root = path.join(os.homedir(), '.claude', 'projects');
const files = [];
const walk = (d, seat) => { for (const e of fs.readdirSync(d, { withFileTypes: true })) {
  const p = path.join(d, e.name);
  if (e.isDirectory()) walk(p, seat);
  else if (e.name.endsWith('.jsonl') && fs.statSync(p).mtimeMs >= since) files.push([p, seat]);
} };
for (const e of fs.readdirSync(root, { withFileTypes: true })) {
  if (e.isDirectory() && e.name.startsWith('C--Consonance-instances-')) walk(path.join(root, e.name), e.name.slice(24));
}
const seen = new Set(), rows = new Map(), unpriced = new Map();
const add = (key, u, side) => {
  const r = rows.get(key) || { calls: 0, inp: 0, w5: 0, w1: 0, rd: 0, out: 0, side: 0, first: 0, big: 0 };
  const cc = u.cache_creation || {};
  const w = u.cache_creation_input_tokens || 0, w1 = cc.ephemeral_1h_input_tokens || 0;
  const w5 = cc.ephemeral_5m_input_tokens != null ? cc.ephemeral_5m_input_tokens : Math.max(0, w - w1);
  r.calls++; r.inp += u.input_tokens || 0; r.w5 += w5; r.w1 += w1; r.rd += u.cache_read_input_tokens || 0; r.out += u.output_tokens || 0;
  if (side) r.side++;
  const ctx = (u.input_tokens || 0) + w + (u.cache_read_input_tokens || 0); if (ctx > r.big) r.big = ctx;
  rows.set(key, r);
};
const one = ([file, seat]) => new Promise(res => {
  readline.createInterface({ input: fs.createReadStream(file) }).on('line', line => {
    if (line.indexOf('"usage"') < 0) return;
    let j; try { j = JSON.parse(line); } catch (e) { return; }
    const m = j.message, u = m && m.usage;
    if (!u || j.type !== 'assistant') return;
    const t = Date.parse(j.timestamp); if (!(t >= since && t < until)) return;
    const id = m.id || (file + ':' + j.uuid); if (seen.has(id)) return; seen.add(id);
    const model = m.model || 'unknown';
    if (!price(model)) { unpriced.set(model, (unpriced.get(model) || 0) + 1); return; }
    add(seat + ' | ' + model.replace('claude-', '') + (j.isSidechain ? ' (agents)' : ''), u, j.isSidechain);
  }).on('close', res);
});
(async () => {
  for (const f of files) await one(f);
  const M = 1e6, f2 = x => x.toFixed(2), k = x => Math.round(x / 1000) + 'k';
  let T = { inp: 0, wr: 0, rd: 0, out: 0 };
  console.log('window ' + new Date(since).toISOString() + ' to ' + (until > 4e12 ? 'now' : new Date(until).toISOString()) + ' | files ' + files.length);
  console.log('seat | model | calls | largest ctx | uncached in | cache write | cache read | output || $ in | $ write | $ read | $ out | $ total | out share');
  const keys = [...rows.keys()].sort((a, b) => cost(rows.get(b), b).tot - cost(rows.get(a), a).tot);
  function cost(r, key) { const p = price('claude-' + key.split(' | ')[1].replace(' (agents)', ''));
    const c = { inp: r.inp * p[1] / M, wr: (r.w5 * 1.25 + r.w1 * 2) * p[1] / M, rd: r.rd * p[3] / M, out: r.out * p[2] / M };
    c.tot = c.inp + c.wr + c.rd + c.out; return c; }
  for (const key of keys) { const r = rows.get(key), c = cost(r, key);
    T.inp += c.inp; T.wr += c.wr; T.rd += c.rd; T.out += c.out;
    console.log(key + ' | ' + r.calls + ' | ' + k(r.big) + ' | ' + k(r.inp) + ' | ' + k(r.w5 + r.w1) + ' | ' + k(r.rd) + ' | ' + k(r.out) +
      ' || ' + f2(c.inp) + ' | ' + f2(c.wr) + ' | ' + f2(c.rd) + ' | ' + f2(c.out) + ' | ' + f2(c.tot) + ' | ' + Math.round(100 * c.out / (c.tot || 1)) + '%'); }
  const tot = T.inp + T.wr + T.rd + T.out;
  console.log('ALL || $ in ' + f2(T.inp) + ' | $ write ' + f2(T.wr) + ' | $ read ' + f2(T.rd) + ' | $ out ' + f2(T.out) + ' | $ total ' + f2(tot) +
    ' | shares: write ' + Math.round(100 * T.wr / tot) + '%, read ' + Math.round(100 * T.rd / tot) + '%, output ' + Math.round(100 * T.out / tot) + '%, uncached in ' + Math.round(100 * T.inp / tot) + '%');
  if (unpriced.size) console.log('not priced (model, calls): ' + [...unpriced].map(x => x.join(' ')).join('; '));
})();
