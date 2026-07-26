// The CURATOR — the second half of the memory lifecycle the Scribe never had.
//
// WHY THIS EXISTS. Measured on the live file 2026-07-26: atoms.jsonl holds 2,260
// atoms / 802 KB, of which 431 are kind:"open" with no mechanism in the program
// that can ever close one. assemble_intake() (main.rs:913) takes tail(40) — so a
// waking sibling reads the last 1.8% of the memory, chronologically, skewed to
// whichever pane was loudest that hour. Tonight's own boot shell told this
// instance that images cannot be dropped into panes (fixed hours earlier) and
// that the shortcut needed repointing (done, commit 5356bcc) — while ALSO
// carrying the atoms recording both fixes. The memory contradicted itself in a
// single 40-line window.
//
// The Scribe does extract+append. That is half a lifecycle. This is the other
// half: route atoms into topic documents, reconcile contradictions, and let an
// OPEN question be closed by the atom that answered it.
//
// BORROWED, HONESTLY: the topic-document shape, the router, and the split/merge
// pass come from Infini-Memory (arXiv 2606.10677, Ji/Wu/Wang et al., Apache-2.0)
// — plain-text topic docs, no vector store, provenance metadata carried through
// consolidation, an LLM that reads memory with grep rather than an embedding
// lookup. They arrived at it optimizing benchmark retrieval; we arrived at the
// same substrate optimizing for an instance re-becoming itself. The convergence
// is why it was worth taking.
//
// WHERE WE REFUSE THEIR DESIGN — and it is the whole point. Infini-Memory
// consolidates by REWRITING its own prior output at a threshold, preserving
// metadata through the rewrite. That is the telephone game with a citation
// attached: provenance pointing at replaced text is a reference to a deleted
// document. The maintenance law here says recall from the master, never a copy,
// and never rewrite an old master from a drifted memory. So:
//
//   · atoms.jsonl is APPEND-ONLY FOREVER. This tool never writes to it.
//   · A topic doc is DERIVED. It stores the line indices of its source atoms.
//   · Regeneration always re-reads THOSE ATOMS — never the previous version of
//     the doc. A topic doc is a pure function of (master, prompt): delete every
//     doc and they rebuild identically.
//
// That last property is the one Infini-Memory cannot state about its own store,
// and it makes a bad curator pass cost one regeneration rather than a memory.
//
// LAWS IT KEEPS:
//   · Never writes atoms.jsonl. Never deletes anything. Topics are regenerable.
//   · Resumable: a watermark in curator_state.json, so a killed run resumes
//     instead of re-spending. Same shape as DISTILLED_MARK.
//   · --dry prints the routing and spends nothing on regeneration, so the prompt
//     is judged on real data before the backfill is paid for.
//   · Supersession is RECORDED, not applied by deletion: a closed OPEN keeps its
//     atom index and gains the index of the atom that closed it. The history of
//     being wrong stays readable.
//   · Node, not Rust, deliberately — same reason as hooks/board-digest.js: this
//     runs against the live memory tonight, with no cargo build and no rebuild
//     that would kill every pane.
//
// Usage:
//   node tools/curate.js --status              what is routed, what is pending
//   node tools/curate.js --day 2026-07-25 --dry   route one day, print, spend ~1 call
//   node tools/curate.js --day 2026-07-25         route + regenerate that day's topics
//   node tools/curate.js --all                    backfill every unrouted day
'use strict';

const fs = require('fs');
const path = require('path');
const os = require('os');
const { spawnSync } = require('child_process');

const DATA = process.env.CONSONANCE_DATA || 'C:\\Consonance\\data';
const RES = path.join(DATA, 'resonance');
const ATOMS = path.join(RES, 'atoms.jsonl');
const TOPICS = path.join(RES, 'topics');
const STATE = path.join(RES, 'curator_state.json');

// A topic past this many atoms is a sign the slug is too coarse — the router is
// told to split it rather than let one document swallow the memory.
const SPLIT_AT = 60;

// Router batch ceiling. Not a context limit — a completion-reliability one: asked
// to emit 500+ assignment objects a model gets lazy or truncates, and a silently
// dropped assignment becomes an atom that never reaches the intake. Measured
// days here run to 524 atoms, so days are chunked rather than sent whole.
const MAX_BATCH = 120;

// ---------------------------------------------------------------- the master --
// Read-only. The index of a line IS its identity, which only holds because the
// file is append-only; if that ever stops being true, every topic doc's
// provenance silently rots. Hence: nothing here opens it for writing.
function readAtoms() {
  if (!fs.existsSync(ATOMS)) return [];
  return fs.readFileSync(ATOMS, 'utf8')
    .split('\n')
    .map((line, i) => {
      const t = line.trim();
      if (!t) return null;
      try {
        const a = JSON.parse(t);
        a.i = i;
        a.day = a.ts ? new Date(a.ts).toISOString().slice(0, 10) : 'undated';
        return a;
      } catch (e) { return null; }
    })
    .filter(Boolean);
}

function readState() {
  if (!fs.existsSync(STATE)) return { routed: {}, topics: {}, version: 1 };
  try {
    const s = JSON.parse(fs.readFileSync(STATE, 'utf8'));
    s.routed = s.routed || {};
    s.topics = s.topics || {};
    return s;
  } catch (e) {
    // A corrupt state file is recoverable — topics are derived and the master is
    // intact — but silently resetting it would re-spend the whole backfill.
    throw new Error(`curator_state.json is unreadable (${e.message}). Move it aside to rebuild from scratch.`);
  }
}

function writeState(s) {
  fs.mkdirSync(RES, { recursive: true });
  const tmp = STATE + '.tmp';
  fs.writeFileSync(tmp, JSON.stringify(s, null, 2));
  fs.renameSync(tmp, STATE); // atomic-ish: never leave a half-written watermark
}

// ------------------------------------------------------------------- the LLM --
function claudeBin() {
  const local = path.join(os.homedir(), '.local', 'bin', 'claude.exe');
  return fs.existsSync(local) ? local : 'claude';
}

// One-shot the good model via stdin — same approach as claude_oneshot in main.rs
// (stdin, not argv, because these prompts run past Windows' argument limit).
function oneshot(prompt) {
  const r = spawnSync(claudeBin(), ['-p'], {
    input: prompt,
    encoding: 'utf8',
    maxBuffer: 64 * 1024 * 1024,
    windowsHide: true,
  });
  if (r.error) throw new Error(`could not run claude: ${r.error.message}`);
  return (r.stdout || '').trim();
}

function parseJson(s, what) {
  const start = s.indexOf('{');
  const end = s.lastIndexOf('}');
  if (start < 0 || end <= start) throw new Error(`${what}: no JSON object in model output`);
  return JSON.parse(s.slice(start, end + 1));
}

// -------------------------------------------------------------- the router ----
const ROUTER_PROMPT = (registry, batch) => `You are the CURATOR of a persistent memory.

The memory is a stream of ATOMS — one-line claims distilled from a working conversation, each with a kind (confirmed / artifact / open / deviation) and a tether (its external referent). Atoms are append-only and never edited. Your job is to route them into TOPIC DOCUMENTS and to reconcile them against each other.

EXISTING TOPICS (slug — summary; atom count):
${registry || '(none yet — you are creating the first topics)'}

Route every atom below. For each one decide:
- topic: an existing slug if it genuinely belongs there, otherwise a NEW kebab-case slug. Prefer an existing topic; create one only when the atom is about a genuinely different subject. A topic is a subject a future reader would look up ("centrifuge-track-rendering", "consonance-capture-restore"), not a session or a date.
- status: "live" if this still stands, "superseded" if a LATER atom in this batch replaces or contradicts it, "resolved" only for a kind:"open" atom that a later atom answers.
- closed_by: when status is superseded or resolved, the index of the atom that did it. Otherwise omit.

Reconciliation is the point. An open question answered later in the batch must come out "resolved", not "live". A claim contradicted by a later measurement must come out "superseded". Do not mark something superseded merely because a related thing was said afterwards — it must actually replace it.

A topic holding more than ${SPLIT_AT} atoms is too coarse; when you notice one, split new atoms into a more specific slug rather than adding to it.

Return ONLY a JSON object, no prose and no fences:
{"assign":[{"i":<atom index>,"topic":"<slug>","status":"live|superseded|resolved","closed_by":<index or omitted>}],
 "topics":{"<slug>":"<one-line summary of what this topic is about>"}}

Include a summary in "topics" for every slug you used, new or existing (rewrite an existing summary only if the batch genuinely changes what the topic is about).

=== ATOMS ===
${batch}`;

// ---------------------------------------------------------- the regeneration --
// NOTE the input: the atoms themselves, read fresh from the master. The previous
// version of the document is deliberately NOT shown to the model. That is the
// whole anti-telephone property — if the old doc were in the prompt, every pass
// would be a rewrite of a rewrite and the drift would compound invisibly.
const DOC_PROMPT = (slug, summary, atoms) => `You are writing one TOPIC DOCUMENT of a persistent memory, from its source atoms.

Topic: ${slug}
Working summary: ${summary}

Below are every atom routed to this topic, in order, each with its index, kind, status and tether. Write the document a future instance will read to get up to speed on this subject in one pass.

Rules:
- Start with a "## Summary" of 2-4 sentences: what this topic IS and where it currently stands.
- Then "## Live" — what currently holds, as tight bullets. Merge atoms that say the same thing once. Keep every tether; a claim without its referent is not memory, it is rumour.
- Then "## Settled" — resolved questions and superseded claims, one line each, in the form "was X → now Y". Keep these SHORT. They exist so a reader does not re-litigate a closed question, not to retell the story.
- Cite atom indices in square brackets after each bullet, e.g. [1841, 1902]. Every bullet must carry at least one.
- Do not invent anything that is not in the atoms. Do not editorialise. If the atoms contradict each other and nothing resolved it, say so plainly under Live.
- No preamble, no closing remarks. Start with "## Summary".

=== ATOMS ===
${atoms}`;

function fmtAtom(a, st) {
  const s = st && st.status && st.status !== 'live' ? ` [${st.status}${st.closed_by != null ? ' by ' + st.closed_by : ''}]` : '';
  return `[${a.i}] (${a.kind})${s} ${a.claim} — tether: ${a.tether || '(none)'}`;
}

// ------------------------------------------------------------------- passes ---
function registryText(state) {
  const rows = Object.entries(state.topics).map(([slug, t]) =>
    `- ${slug} — ${t.summary} (${(t.atoms || []).length})`);
  return rows.join('\n');
}

function routeBatch(state, atoms, opts) {
  const batch = atoms.map(a => fmtAtom(a)).join('\n');
  const out = oneshot(ROUTER_PROMPT(registryText(state), batch));
  const parsed = parseJson(out, 'router');
  const assign = Array.isArray(parsed.assign) ? parsed.assign : [];
  const summaries = parsed.topics || {};

  const known = new Set(atoms.map(a => a.i));
  const touched = new Set();
  let routed = 0, skipped = 0;

  for (const a of assign) {
    // The model can hallucinate an index; routing an atom that was not in the
    // batch would attach a claim to a topic it never appeared in.
    if (!known.has(a.i) || !a.topic) { skipped++; continue; }
    const slug = String(a.topic).trim().toLowerCase().replace(/[^a-z0-9-]+/g, '-').replace(/^-|-$/g, '');
    if (!slug) { skipped++; continue; }
    if (!state.topics[slug]) state.topics[slug] = { summary: summaries[slug] || slug, atoms: [] };
    else if (summaries[slug]) state.topics[slug].summary = summaries[slug];
    if (!state.topics[slug].atoms.includes(a.i)) state.topics[slug].atoms.push(a.i);
    state.routed[a.i] = {
      topic: slug,
      status: ['live', 'superseded', 'resolved'].includes(a.status) ? a.status : 'live',
      closed_by: typeof a.closed_by === 'number' ? a.closed_by : undefined,
    };
    touched.add(slug);
    routed++;
  }
  // Anything the model silently dropped still gets a home — an unrouted atom is
  // invisible to the intake forever, which is the failure this tool exists to fix.
  for (const a of atoms) {
    if (!state.routed[a.i]) {
      const slug = 'unrouted';
      if (!state.topics[slug]) state.topics[slug] = { summary: 'Atoms the router did not place — review and re-route.', atoms: [] };
      if (!state.topics[slug].atoms.includes(a.i)) state.topics[slug].atoms.push(a.i);
      state.routed[a.i] = { topic: slug, status: 'live' };
      touched.add(slug);
    }
  }
  return { routed, skipped, touched: [...touched] };
}

function regenerate(state, all, slug) {
  const t = state.topics[slug];
  if (!t) return null;
  const byIdx = new Map(all.map(a => [a.i, a]));
  // Read the ATOMS, not the old doc. See the header.
  const atoms = t.atoms.map(i => byIdx.get(i)).filter(Boolean);
  if (!atoms.length) return null;
  const body = oneshot(DOC_PROMPT(slug, t.summary, atoms.map(a => fmtAtom(a, state.routed[a.i])).join('\n')));
  if (!body || body.length < 40) throw new Error(`${slug}: model returned nothing usable`);
  const live = atoms.filter(a => (state.routed[a.i] || {}).status === 'live').length;
  const head = [
    '---',
    `topic: ${slug}`,
    `summary: ${JSON.stringify(t.summary)}`,
    `atoms: ${atoms.length}  (live ${live}, settled ${atoms.length - live})`,
    `sources: ${t.atoms.join(',')}`,
    `generated: ${new Date().toISOString()}`,
    'derived: true  # regenerable from atoms.jsonl — never hand-edit, edits are lost on the next pass',
    '---',
    '',
  ].join('\n');
  fs.mkdirSync(TOPICS, { recursive: true });
  fs.writeFileSync(path.join(TOPICS, `${slug}.md`), head + body + '\n');
  return { slug, atoms: atoms.length, live };
}

// --------------------------------------------------------------------- cli ----
function main() {
  const argv = process.argv.slice(2);
  const has = f => argv.includes(f);
  const val = f => { const i = argv.indexOf(f); return i >= 0 ? argv[i + 1] : null; };

  const all = readAtoms();
  const state = readState();

  if (has('--status') || !argv.length) {
    const pending = all.filter(a => !state.routed[a.i]);
    const byDay = {};
    pending.forEach(a => { byDay[a.day] = (byDay[a.day] || 0) + 1; });
    console.log(`atoms:   ${all.length} in the master`);
    console.log(`routed:  ${Object.keys(state.routed).length}`);
    console.log(`pending: ${pending.length}`);
    if (pending.length) console.log('  by day: ' + Object.entries(byDay).map(([d, n]) => `${d}:${n}`).join('  '));
    const topics = Object.entries(state.topics).sort((a, b) => b[1].atoms.length - a[1].atoms.length);
    console.log(`topics:  ${topics.length}`);
    for (const [slug, t] of topics) {
      const live = t.atoms.filter(i => (state.routed[i] || {}).status === 'live').length;
      console.log(`  ${String(t.atoms.length).padStart(4)} (${String(live).padStart(4)} live)  ${slug} — ${t.summary}`);
    }
    if (!argv.length) console.log('\n(--day YYYY-MM-DD [--dry] | --all | --status)');
    return;
  }

  // Regenerate named topics (or all of them) from the master, without routing.
  // This is the anti-telephone property made runnable: delete every document in
  // topics/ and this rebuilds them from atoms.jsonl alone. If it ever stops
  // working, the docs have started depending on themselves and the drift is on.
  if (has('--rebuild')) {
    const only = val('--rebuild');
    const slugs = only && !only.startsWith('--') ? [only] : Object.keys(state.topics);
    for (const slug of slugs) {
      process.stdout.write(`  ${slug}... `);
      try {
        const r = regenerate(state, all, slug);
        console.log(r ? `${r.atoms} atoms (${r.live} live)` : 'unknown topic');
      } catch (e) { console.log(`FAILED: ${e.message}`); }
    }
    return;
  }

  const day = val('--day');
  const dry = has('--dry');
  let pending = all.filter(a => !state.routed[a.i]);
  if (day) pending = pending.filter(a => a.day === day);
  if (!pending.length) { console.log(day ? `nothing pending for ${day}` : 'nothing pending — the master is fully routed'); return; }

  // Day batches: a day is a natural unit of work here, and it keeps any single
  // router call small enough to reason about when it goes wrong.
  const days = [...new Set(pending.map(a => a.day))].sort();
  const plan = has('--all') ? days : [days[0]];
  console.log(`routing ${plan.length} day(s): ${plan.join(', ')}  (${pending.filter(a => plan.includes(a.day)).length} atoms)`);

  const touchedAll = new Set();
  for (const d of plan) {
    const dayAtoms = pending.filter(a => a.day === d);
    for (let off = 0; off < dayAtoms.length; off += MAX_BATCH) {
      const batch = dayAtoms.slice(off, off + MAX_BATCH);
      const part = dayAtoms.length > MAX_BATCH ? ` [${off / MAX_BATCH + 1}/${Math.ceil(dayAtoms.length / MAX_BATCH)}]` : '';
      process.stdout.write(`  ${d}${part}: ${batch.length} atoms → routing... `);
      try {
        const r = routeBatch(state, batch, { dry });
        r.touched.forEach(s => touchedAll.add(s));
        console.log(`${r.routed} routed${r.skipped ? `, ${r.skipped} skipped` : ''}, ${r.touched.length} topics touched`);
      } catch (e) {
        // Don't abandon a 15-day backfill because one batch came back malformed:
        // the watermark is per-batch, so these atoms stay pending and retry.
        console.log(`FAILED: ${e.message}`);
        continue;
      }
      if (!dry) writeState(state); // checkpoint per batch: a killed run resumes here
    }
  }

  if (dry) {
    console.log('\n--- DRY: routing only, nothing written, no documents regenerated ---');
    const byTopic = {};
    for (const a of all) {
      const r = state.routed[a.i];
      if (!r || !touchedAll.has(r.topic)) continue;
      (byTopic[r.topic] = byTopic[r.topic] || []).push({ a, r });
    }
    for (const [slug, rows] of Object.entries(byTopic).sort((x, y) => y[1].length - x[1].length)) {
      console.log(`\n## ${slug}  (${rows.length})  — ${state.topics[slug].summary}`);
      for (const { a, r } of rows.slice(0, 8)) {
        const mark = r.status === 'live' ? ' ' : r.status === 'resolved' ? '✓' : '×';
        console.log(`  ${mark} [${a.i}] (${a.kind}) ${a.claim.slice(0, 120)}`);
      }
      if (rows.length > 8) console.log(`    … ${rows.length - 8} more`);
    }
    return;
  }

  console.log(`\nregenerating ${touchedAll.size} topic document(s) from the master:`);
  for (const slug of touchedAll) {
    process.stdout.write(`  ${slug}... `);
    try {
      const r = regenerate(state, all, slug);
      console.log(r ? `${r.atoms} atoms (${r.live} live)` : 'empty, skipped');
    } catch (e) {
      // A failed regeneration is not a lost memory — the atoms and the routing
      // are both on disk, so the doc rebuilds on the next run.
      console.log(`FAILED: ${e.message}`);
    }
  }
  writeState(state);
  console.log(`\ntopics in ${TOPICS}`);
}

try { main(); } catch (e) { console.error(`curate: ${e.message}`); process.exit(1); }
