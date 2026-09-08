'use strict';

/* vantage-sealed-scope.js — keep a scanner that reads TURNS from ingesting the turns of a pane
 * that is under seal, without the scanner ever knowing what is sealed.
 *
 * WIRED TO NOTHING. `second-vantage.js` does not require this file. The shape plus its proof; the
 * wiring is priced in `exo_memory/loop/registration_sealed_material_2026-09-08.md`.
 *
 * ── THE MEASUREMENT THAT DECIDED THE DESIGN ─────────────────────────────────────────────────────
 *
 * The row that motivated this (`f50dfa20882b4270`) carries the sealed VALUE and NO LABEL. Measured
 * against the live ledger, its claim + evidence + commands contain no `D1-03`, no "plant", no
 * "seed", no "key" and no run id. It is a subject quoting a figure out of an object it was told to
 * read. **So a label matcher is green over the very row it was built for**, which is this seat's own
 * 2026-09-06 blind spot — an oracle that can only fail on cases someone listed.
 *
 * And the repair that would catch it is worse than the disease: to recognise "640 lines for
 * carrier-drift.js" as sealed, the scanner would have to hold the key. **A scanner that holds the
 * answers in order to avoid printing them is a bigger leak than the one it prevents.**
 *
 * ── SO THE MATCH IS ON SOURCE, NOT CONTENT ──────────────────────────────────────────────────────
 *
 * A row knows `source.pane` and `source.turn_ts` without knowing anything about what it says. A run
 * that seals itself declares WHICH PANES are sealed and BETWEEN WHEN. The scanner reads that
 * declaration and skips those rows wholesale. It stays content-blind, and it cannot go stale
 * against a run it has never heard of, because the run is what writes the entry.
 *
 * ARMED BY ITS REGISTRY, and the room has this pattern already: `carrier-drift.registry.json`
 * reports EMPTY-REGISTRY and declares itself inert rather than reporting green over everything it
 * cannot see. Same here — see `sealSummary()`.
 *
 *     registry = { seals: [ { lap, panes: ["sibling-3d57124e"], from: ISO, to: ISO|null,
 *                             labels: ["D\\d-\\d\\d"]   // OPTIONAL secondary net, see below
 *                           } ] }
 *
 * `labels` is a SECOND net and is explicitly not the primary one. It catches a row that names a
 * sealed item by its label; it did not and would not catch the row above. It is included because it
 * is nearly free, and it is documented as insufficient so nobody mistakes it for the control.
 *
 * ── FAIL DIRECTION, CHOSEN DELIBERATELY ─────────────────────────────────────────────────────────
 *
 * No registry, or an empty one, means INGEST EVERYTHING — and say so on every run. Fail-closed
 * would silence the room's only uncurated instrument every time a file went missing, which is a
 * larger and quieter harm than the one being prevented. THE RESIDUAL IS REAL AND IS NAMED: a run
 * that forgets to register itself is not protected. That is the L039 failure with a longer fuse,
 * moved to the one place and moment where somebody knows the answer — the person opening the run.
 */

/** Is this pane sealed at this instant? Content is never consulted. */
function sealedBySource(row, registry) {
  const src = (row && row.source) || {};
  const pane = src.pane;
  const at = Date.parse(src.turn_ts);
  if (!pane || Number.isNaN(at)) return null;
  for (const s of (registry && registry.seals) || []) {
    if (!Array.isArray(s.panes) || !s.panes.includes(pane)) continue;
    const from = s.from ? Date.parse(s.from) : -Infinity;
    const to = s.to ? Date.parse(s.to) : Infinity;      // null `to` = still open
    if (at >= from && at <= to) return s;
  }
  return null;
}

/** The secondary net. Documented as insufficient; see the header. */
function sealedByLabel(row, registry) {
  const blob = [row && row.claim, row && row.evidence, ((row && row.commands) || []).join('\n')]
    .filter(Boolean).join('\n');
  for (const s of (registry && registry.seals) || []) {
    for (const pat of s.labels || []) {
      let re;
      try { re = new RegExp(pat); } catch { continue; }   // a bad pattern must not crash a scan
      if (re.test(blob)) return { seal: s, label: pat };
    }
  }
  return null;
}

/**
 * The decision, plus the reason. `{ skip, reason, lap }` — a skip ALWAYS carries why, because the
 * trace is written from this and a skip with no reason is a scanner that quietly stopped seeing.
 */
function decide(row, registry) {
  const bySource = sealedBySource(row, registry);
  if (bySource) {
    return { skip: true, lap: bySource.lap || null,
      reason: `pane ${row.source.pane} is under seal for ${bySource.lap || 'an unnamed lap'} at ${row.source.turn_ts}` };
  }
  const byLabel = sealedByLabel(row, registry);
  if (byLabel) {
    return { skip: true, lap: byLabel.seal.lap || null,
      reason: `row matches a declared sealed label /${byLabel.label}/` };
  }
  return { skip: false, lap: null, reason: '' };
}

/**
 * Partition rows, and emit a TRACE ENTRY PER SKIP. The trace never carries the row's content — that
 * would republish the thing being withheld, one level down, which is the same defect wearing the
 * fix's clothes. It carries the id, the pane, the timestamp and the reason.
 */
function partition(rows, registry) {
  const kept = [], skipped = [], trace = [];
  for (const row of rows || []) {
    const d = decide(row, registry);
    if (!d.skip) { kept.push(row); continue; }
    skipped.push(row);
    trace.push({
      event: 'sealed-skip',
      id: (row && row.id) || null,
      pane: (row && row.source && row.source.pane) || null,
      turn_ts: (row && row.source && row.source.turn_ts) || null,
      lap: d.lap,
      reason: d.reason,
    });
  }
  return { kept, skipped, trace };
}

/**
 * What a run says about itself out loud, every time — including when it is doing nothing.
 * An empty registry reports INERT rather than green, which is a true statement about an empty
 * registry instead of a clean bill of health over everything it cannot see.
 */
function sealSummary(registry, trace) {
  const seals = (registry && registry.seals) || [];
  if (!registry) return 'sealed-scope: NO REGISTRY — ingesting every row (unprotected by design; see the registration)';
  if (seals.length === 0) return 'sealed-scope: EMPTY REGISTRY — inert, ingesting every row';
  const panes = new Set();
  for (const s of seals) for (const p of s.panes || []) panes.add(p);
  return `sealed-scope: ${seals.length} seal(s) over ${panes.size} pane(s) — ${(trace || []).length} row(s) skipped`;
}

module.exports = { sealedBySource, sealedByLabel, decide, partition, sealSummary };
