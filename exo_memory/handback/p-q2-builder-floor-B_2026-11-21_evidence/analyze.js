// B, Q2 (L223) R2: per arm, each piece of the first request measured by its OWN text (not by the request's total, which a tool whose
// description changes size between runs confounds: Workflow read 5,717 B in one arm and 22,775 B in another with no flag touching it).
// Pieces: each tool definition (tools[] in api-request-shape); the sections of the messages (api-request-blob), cut at their headers;
// and one line per deferred tool in the deferred listing. Bytes, and tokens at pane A's census ratio 0.339 a byte.
//   node analyze.js <probe root> [arm indices...]
const fs = require('fs'), path = require('path'), os = require('os');
const ROOT = process.argv[2];
const arms = process.argv.slice(3).length ? process.argv.slice(3) : fs.readdirSync(ROOT).filter((d) => /^arm\d+$/.test(d)).map((d) => d.slice(3));
const TOK = 0.339, tk = (b) => Math.round(b * TOK);
const HEAD = /^(The following [a-z ]+|Available agent types|# [A-Z]|Contents of |SessionStart hook)/;
const projDir = (cwd) => path.join(os.homedir(), '.claude', 'projects', cwd.replace(/[:\\/.]/g, '-'));
const WATCH = ['Artifact', 'Monitor', 'SendMessage'];
const out = {};
for (const i of arms) {
  const pd = projDir(path.join(ROOT, 'arm' + i));
  if (!fs.existsSync(pd)) { out['arm' + i] = 'no transcript folder'; continue; }
  let tools = null; const texts = [];
  for (const f of fs.readdirSync(pd).filter((f) => f.endsWith('.jsonl')))
    for (const l of fs.readFileSync(path.join(pd, f), 'utf8').split('\n')) {
      let v; try { v = JSON.parse(l); } catch { continue; }
      if (v.type === 'api-request-shape' && !tools) tools = v.shape.tools || [];
      if (v.type === 'api-request-blob') { const c = v.message.content; for (const b of Array.isArray(c) ? c : [{ text: c }]) if (b && b.text) texts.push(b.text); }
    }
  const sections = {};
  for (const t of texts) {
    let cur = null;
    for (const line of t.split('\n')) {
      const h = line.match(HEAD);
      if (h) cur = line.slice(0, 48);
      if (cur) sections[cur] = (sections[cur] || 0) + Buffer.byteLength(line) + 1;
    }
  }
  const all = texts.join('\n');
  const deferredLine = Object.fromEntries(WATCH.map((w) => { const m = all.match(new RegExp('^' + w + ':.*$', 'm')); return [w, m ? Buffer.byteLength(m[0]) : 0]; }));
  const toolBytes = Object.fromEntries((tools || []).map((t) => [t.name, Buffer.byteLength(JSON.stringify(t))]));
  const pick = (re) => Object.entries(sections).filter(([k]) => re.test(k)).reduce((a, [, b]) => a + b, 0);
  out['arm' + i] = {
    tools: Object.keys(toolBytes).join(' '),
    toolDefinitionBytes: Object.values(toolBytes).reduce((a, b) => a + b, 0),
    workflowBytes: toolBytes.Workflow || 0,
    skillToolBytes: toolBytes.Skill || 0, agentToolBytes: toolBytes.Agent || 0,
    skillsListing: pick(/^The following skills/), agentListing: pick(/^Available agent types/), deferredListing: pick(/^The following deferred tools/),
    deferredLine,
  };
}
const rows = [];
for (const [arm, r] of Object.entries(out)) {
  if (typeof r === 'string') { rows.push(arm + ': ' + r); continue; }
  rows.push(`${arm}: tools=[${r.tools}] defs ${r.toolDefinitionBytes} B (~${tk(r.toolDefinitionBytes)} tok; Workflow ${r.workflowBytes}, Skill ${r.skillToolBytes}, Agent ${r.agentToolBytes}) | skills listing ${r.skillsListing} B (~${tk(r.skillsListing)}) | agent listing ${r.agentListing} B (~${tk(r.agentListing)}) | deferred listing ${r.deferredListing} B (~${tk(r.deferredListing)}); lines ${WATCH.map((w) => w + ' ' + r.deferredLine[w]).join(', ')}`);
}
console.log(rows.join('\n'));
fs.writeFileSync(path.join(ROOT, 'analyze.json'), JSON.stringify(out, null, 1));
