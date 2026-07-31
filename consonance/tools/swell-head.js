// SWELL-HEAD — what the dynamics channel is measuring when it reports at a track start.
//
// THE QUESTION IT WAS BUILT FOR. When a track begins — silence, then music — the dynamics
// channel emits `growing · +N dB over 48s`. Is that a measurement of the music, or of the
// playback fade-in? The report carries its magnitude and its span and (since f04dd42) the level
// its window started from. This reads the thing none of those can say alone: how much of the
// reported change is carried by the window's own first seconds.
//
// WHAT THE CODE ALREADY DOES, so this is not read as finding an unguarded hole. `Swell` has
// three reasons to forget — the silence guard below -60 dB, a title change, an onset — and each
// exists because a measured failure demanded it. They work: the reports they were built to kill
// are gone from the ledger.
//
// WHAT THEY DO NOT DO, and this is the finding. Forgetting sets the window's LEFT EDGE to the
// instant of the clear. `SWELL_WINDOW_SECS * 0.8` then withholds any report until 48 seconds of
// history exist — which prevents a report DURING the transition and does not prevent a report
// whose window BEGINS at it. The magnitude did not go away; it moved 48 seconds later.
//
// ---------------------------------------------------------------------------------------
// THE MEASURE. Refit the least-squares slope over the SAME window with the leading N seconds
// dropped, and report the pair. A swell distributed across its window barely moves. A swell
// carried by its own first seconds collapses, and sometimes reverses sign.
//
//   Bernstein Adagio, opening   +11.0 dB / 48s  ->  trim 5s:  -3.5 dB   (reverses)
//   Bernstein Adagio, climax    +19.8 dB / 60s  ->  trim 5s: +20.0 dB   (unmoved)
//
// The first says "growing" about 48 seconds of music whose actual slope, once its own entrance
// is removed, is NEGATIVE. The second is the crescendo the piece is famous for, and nothing here
// touches it. That pair is the whole tool.
//
// ---------------------------------------------------------------------------------------
// WHERE THE REPORTS COME FROM, and why this file no longer computes them.
//
// The first version of this tool carried a JS mirror of `cochlea::Swell`, verified line for line
// against `cochlea_replay`. Ninety minutes later f04dd42 routed Onset to `sound_began` inside
// `replay()` and the mirror was wrong — Fratres' opening moved +32.9 -> +30.3 and its head
// -59.4 -> -53.5 — while still passing its own tests, because its tests pinned the numbers the
// mirror itself produced. That is the SAME defect this tool reported in `replay()` one turn
// earlier: a second copy of the detector, drifting from production, validated by nothing.
// Reporting it and then committing it is the version of that failure worth writing down.
//
// So the detector is no longer duplicated. `cochlea_replay` is run and its swell lines are
// parsed; the frames are used only to reconstruct each window and refit it. If the binary is
// missing or older than `cochlea.rs`, this REFUSES rather than falling back to something that
// might be right — a stale oracle is the drift with the warning removed.
//
// The reconstruction has its own check, and it is A's new field doing work neither of us
// planned: `(from -59.4 dB)` is the window's first sample, so a window rebuilt from `at` and
// `over` must open on exactly that level. Where it does not, the report is skipped and said so.
//
// ---------------------------------------------------------------------------------------
// WHAT `head-carried` DOES AND DOES NOT MEAN.
//
//   It DOES mean: the reported number depends on the first seconds of its own window, so it is a
//   statement about the transition into audibility, not about the 48 seconds it names.
//
//   It DOES NOT mean "this is a playback fade-in." The tool cannot see a player. At a track start
//   the window's head contains the stream ramp AND the music's opening, inseparably, and which
//   one dominates is per-recording. Measured: the Adagio's opening report is carried by its head;
//   `phyllzx — skinshine`, same shape of report and same pinning, is not. A rule that called
//   every track-start report an artifact would be wrong about that one.
//
// THE NEGATIVE CONTROL, which is a test in swell-head.test.js and not a claim here. Across the
// six fixtures carrying level data — 83 reports, 77 of them full-window — `headCarried` flags
// ZERO of the 77. Of the six truncated windows it flags two, and it does not flag Fratres' real
// opening crescendo from a floor-level head. That last one is why the flag is conjunctive rather
// than "the head is quiet": Fratres genuinely begins the way an artifact looks. Sorted by head
// level the four floor-opening reports run artifact, real, artifact, real — which is the evidence
// that the head level A added is necessary and NOT sufficient.
//
// ---------------------------------------------------------------------------------------
// CORRECTION, 2026-07-31, appended rather than written over the paragraphs above.
//
// I wrote that the refit "needs per-frame levels the stream does not carry and probably never
// should," and used that to argue this tool had to hold the measurement. c032a27 shipped it: every
// Swelling event now carries `refit_db` with its `trim_s` beside it, and the ledger line reads
// `(from -59.4 dB, -4.8 past the first 6s)`. The prediction was wrong and shipping it was right —
// the number that separates an artifact opening from a real one belongs on the event that needs it.
//
// Two consequences, both live in the code below. First, the parser: the added clause sits INSIDE
// the parenthesis this file was matching, so the pattern stopped matching, `from` went null for
// every report, and the window fell back to being inferred from a span rounded to the second. Two
// tests went red — the tool did not print a wrong number quietly, which is the whole reason the
// head check is asserted and not merely displayed. Second, this file's own refit is now a SECOND
// copy of a shipped quantity, the exact defect it was rebuilt to stop committing. It is kept only
// as a cross-check and compared at the detector's own trim (`refitAgreement`); 83 of 83 reports
// across the fixture corpus agree.

// AND THE FAMILY IS WIDER THAN TRACK STARTS, which only became visible after f04dd42. The second
// flag is the Adagio at 8:56 — its grand pause fires silence, then an onset, and the onset routing
// (correctly) starts a fresh window on the re-entry. Same arithmetic, no track boundary within
// four minutes. The head-carried window belongs to `forget()`, not to track boundaries; a title
// change is just its most frequent cause.
//
// ---------------------------------------------------------------------------------------
// THE LEDGER MODE, and its refusal. `data/heard.jsonl` spans detectors AND formats. Reports below
// the 5 dB threshold and reports inside the 15-second gate cannot have come from the current
// arithmetic; millisecond stamps and a `det` field cannot have come from the code before
// 62a5a84. Both are found as SIGNATURES rather than read from git, because a commit is not a
// running build, and the eras are never summed. Same law as residue.js: a number spanning a
// boundary gets read as being about whichever side the reader is standing on.
//
// Before 62a5a84 the ledger carries no per-frame levels and no window head, so head-carriage
// cannot be evaluated on those lines — only the pinning. After it, `(from -X dB)` is parsed and
// reported: still not an adjudication, but the candidates become greppable.
//
// Usage:
//   node consonance/tools/swell-head.js --frames <fixture.jsonl>... [--trim 5]
//   node consonance/tools/swell-head.js --ledger [path/to/heard.jsonl]
'use strict';

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

/* ---------------- constants, mirrored deliberately and used only to READ ----------------

   These are cochlea.rs's, restated so the output can say why a refit counts as a collapse.
   Nothing here decides whether a report fires — that is the binary's job now. */

const WINDOW_SECS = 60.0;
const SWELL_DB = 5.0;
const MIN_GAP_SECS = 15.0;
const SILENCE_DB = -60.0;
const MIN_SAMPLES = 8;

/* ---------------- the measure ---------------- */

/** Least-squares dB change across a window's own span. Null when the window has no extent. */
function fitDb(hist) {
  const n = hist.length;
  if (n < 2) return null;
  const meanT = hist.reduce((a, p) => a + p[0], 0) / n;
  const meanD = hist.reduce((a, p) => a + p[1], 0) / n;
  let num = 0, den = 0;
  for (const [t, d] of hist) { num += (t - meanT) * (d - meanD); den += (t - meanT) ** 2; }
  if (den <= 0) return null;
  return (num / den) * (hist[n - 1][0] - hist[0][0]);
}

/**
 * Refit a report's window with its leading `trim` seconds removed.
 *
 * Null — never zero — when too little of the window survives to fit. An absent measurement must
 * not wear the shape of a flat one, which is the rule `Frame.db: Option<f32>` already follows.
 */
function refitWithoutHead(report, trim) {
  const t0 = report.window[0][0];
  const kept = report.window.filter(([t]) => t >= t0 + trim);
  if (kept.length < MIN_SAMPLES) return null;
  return fitDb(kept);
}

/**
 * Did this report's own first `trim` seconds carry it?
 *
 * CONJUNCTIVE, and each clause earns its place against a case that would otherwise be called
 * wrong:
 *
 *   truncated  — the window is shorter than the full 60 s, so its left edge is a `forget()`
 *                (silence, a title change, an onset, or the start of the recording) rather than a
 *                point the music chose. A full-length window has no privileged head.
 *                WITHOUT THIS: the Adagio's `+5.0 dB over 60s` at 4:50 refits to -0.2 and would be
 *                indicted — a legitimate mid-track swell that merely sits on the threshold.
 *
 *   collapses  — the refit falls below the threshold the report needed to fire at all. Not "it
 *                got smaller": a report that drops 30.3 -> 24.6 is still the same swell.
 *                WITHOUT THIS: Fratres' real opening crescendo off the floor is indicted, and it
 *                is the clearest case in the corpus of music that genuinely begins that way.
 *
 * The flag is about the ARITHMETIC of one report. It is not a verdict about what made the sound,
 * and `reason` never says "fade-in".
 */
function headCarried(report, trim = 5) {
  const truncated = report.over < WINDOW_SECS - 0.5;
  const refit = refitWithoutHead(report, trim);
  if (!truncated || refit === null) {
    return {
      flagged: false, refit, truncated,
      reason: !truncated ? 'full-length window' : 'window too short to refit',
    };
  }
  const collapses = Math.abs(refit) < SWELL_DB;
  const reverses = Math.sign(refit) !== Math.sign(report.db);
  return {
    flagged: collapses, refit, truncated, reverses,
    reason: collapses
      ? `drops to ${refit.toFixed(1)} dB without its first ${trim}s${reverses ? ' (reverses)' : ''}`
      : `holds at ${refit.toFixed(1)} dB without its first ${trim}s`,
  };
}

/**
 * This file's refit against the detector's own, at the detector's own trim.
 *
 * WHAT CHANGED AND WHY THIS EXISTS. When this tool was written the refit lived only here, because
 * the stream did not carry one — and I wrote in the header that it needs per-frame levels the
 * stream "probably never should" carry. c032a27 shipped it anyway, as `refit_db` with its `trim_s`
 * beside it, and shipping it was right: the number that separates an artifact opening from a real
 * one now rides the event that needs it.
 *
 * That turns this file's copy from the measurement into a SECOND copy of a shipped quantity, which
 * is the exact defect this tool reported in `replay()` and then committed in its own mirror. The
 * copy is kept for one reason only — two independent computations of one number is a check neither
 * can perform alone — and it is compared AT THE DETECTOR'S TRIM, never at this file's own default,
 * because the same window refitted at 5 s and at 6 s are different quantities and comparing them
 * would manufacture a disagreement that means nothing.
 *
 * Null when the binary prints no refit (any build before c032a27) or when too little window
 * survives the trim to fit — an absent check must not read as a passing one.
 */
function refitAgreement(report) {
  if (report.refit === null || report.refit === undefined || report.trim === null) return null;
  const ours = refitWithoutHead(report, report.trim);
  if (ours === null) return null;
  const delta = Math.abs(ours - report.refit);
  // The tolerance is the reconstruction's, not the arithmetic's: the window is rebuilt from a span
  // printed to the second, so an end sample can differ. A whole decibel apart is drift, not rounding.
  return { ours, theirs: report.refit, trim: report.trim, delta, agrees: delta <= 1.0 };
}

/* ---------------- the detector, run rather than reimplemented ---------------- */

const SRC_TAURI = path.join(__dirname, '..', 'src-tauri');

/*
 * THE HEAD CLAUSE, written once and read by both parsers.
 *
 * Two printers emit it and they do not agree on wording — `cochlea_replay` prints
 * `(from -59.4 dB, -4.8 past 6s)` and the service prints `(from -59.4 dB, -4.8 past the first 6s)`
 * — so `the first` is optional here rather than duplicated into two regexes that can drift apart.
 * The refit clause is optional in turn because era-3 lines carry a head and no refit.
 */
const HEAD_CLAUSE =
  String.raw`\(from\s*([+-]?[\d.]+) dB(?:,\s*([+-][\d.]+) past (?:the first )?([\d.]+)s)?\)`;
const HEAD_RE = new RegExp(HEAD_CLAUSE);
const REPLAY_LINE = new RegExp(
  String.raw`^\s*([\d.]+)\s+(growing|fading)\s+([+-][\d.]+) dB over ([\d.]+)s(?:\s*` +
  HEAD_CLAUSE + `)?`);

/**
 * Find `cochlea_replay`, and refuse a stale one.
 *
 * A binary older than the source it was built from is the drift this tool exists to have stopped
 * causing, with the warning removed. Release is preferred only because it is faster; whichever is
 * newer wins, and if neither is newer than cochlea.rs the caller is told to rebuild.
 */
function findReplay() {
  const src = path.join(SRC_TAURI, 'src', 'cochlea.rs');
  const srcMtime = fs.existsSync(src) ? fs.statSync(src).mtimeMs : 0;
  const found = ['release', 'debug']
    .map(p => path.join(SRC_TAURI, 'target', p, 'cochlea_replay.exe'))
    .concat(['release', 'debug'].map(p => path.join(SRC_TAURI, 'target', p, 'cochlea_replay')))
    .filter(fs.existsSync)
    .map(p => ({ path: p, mtime: fs.statSync(p).mtimeMs }))
    .sort((a, b) => b.mtime - a.mtime)[0];
  // MISSING and STALE are different facts and callers must be able to tell them apart. A fresh
  // clone has no target/ and legitimately cannot run these checks — that is a skip. A binary
  // present but older than the source means someone edited cochlea.rs and did not rebuild, so
  // every number below is about code that is no longer in the tree — that is a failure, and it is
  // the exact drift this tool stopped causing when it dropped its own mirror.
  if (!found) {
    return { error: 'cochlea_replay is not built. cargo build --release --bin cochlea_replay', missing: true };
  }
  if (found.mtime < srcMtime) {
    return {
      error: 'cochlea_replay is older than cochlea.rs — refusing to read a stale detector.\n' +
             '  rebuild: cargo build --release --bin cochlea_replay',
      stale: true,
    };
  }
  return found;
}

/** Parse the swell lines out of a `cochlea_replay` run. */
function parseReplay(stdout) {
  const out = [];
  for (const line of stdout.split(/\r?\n/)) {
    const m = REPLAY_LINE.exec(line);
    if (!m) continue;
    out.push({
      at: parseFloat(m[1]),
      rising: m[2] === 'growing',
      db: parseFloat(m[3]),
      over: parseFloat(m[4]),
      from: m[5] === undefined ? null : parseFloat(m[5]),
      // The detector's own refit, since c032a27. Read, never recomputed over the top of: this
      // file's `refitWithoutHead` now exists to AGREE with this number, not to replace it.
      refit: m[6] === undefined ? null : parseFloat(m[6]),
      trim: m[7] === undefined ? null : parseFloat(m[7]),
    });
  }
  return out;
}

/**
 * Rebuild the frames a report was fitted over, from its own `at` and `over`.
 *
 * `over` is printed to the second, so the left edge is approached with slack and then verified:
 * the first retained sample must equal the reported head level. Where the binary does not print a
 * head — a build before f04dd42 — the check cannot run and `verified` says so rather than
 * quietly passing.
 */
function reconstructWindow(frames, report) {
  // The retain rule is absolute — nothing older than one window length is ever in the fit — so
  // that bound is applied first, from the constant rather than from the rounded `over`. A
  // `forget()` can only move the left edge LATER than this, never earlier.
  const cand = [];
  for (const f of frames) {
    if (f.t < report.at - WINDOW_SECS - 1e-6 || f.t > report.at + 1e-6) continue;
    if (f.db <= SILENCE_DB) { cand.length = 0; continue; }   // the silence guard, reproduced
    cand.push([f.t, f.db]);
  }
  if (cand.length < MIN_SAMPLES) return { window: null, verified: false, why: 'too few frames' };
  if (report.from === null) {
    // A build older than f04dd42 prints no head, so the left edge can only be approached by the
    // span — which is rounded to the second. Returned, but never claimed as verified.
    let i = 0;
    while (i < cand.length && report.at - cand[i][0] > report.over + 0.5) i += 1;
    const w = cand.slice(i);
    return w.length >= MIN_SAMPLES
      ? { window: w, verified: null, why: 'binary prints no head level' }
      : { window: null, verified: false, why: 'too few frames after trimming to span' };
  }
  // With a head printed, the left edge is ANCHORED rather than inferred: the frame whose level is
  // the reported one and whose distance back from `at` is consistent with the printed span. This
  // is A's field validating a reconstruction it was not added for.
  let best = -1, bestErr = Infinity;
  for (let i = 0; i < cand.length; i++) {
    if (Math.abs(cand[i][1] - report.from) > 0.06) continue;
    const err = Math.abs((report.at - cand[i][0]) - report.over);
    if (err <= 0.75 && err < bestErr) { best = i; bestErr = err; }
  }
  if (best < 0) return { window: null, verified: false, why: `no frame at ${report.from.toFixed(1)} dB, ${report.over.toFixed(0)}s back` };
  const w = cand.slice(best);
  if (w.length < MIN_SAMPLES) return { window: null, verified: false, why: 'too few frames in window' };
  return { window: w, verified: true };
}

/** Every swell report for a fixture, with its window attached. Throws with a rebuild hint. */
function reportsFor(fixturePath) {
  const bin = findReplay();
  if (bin.error) throw new Error(bin.error);
  const frames = readFrames(fixturePath);
  const parsed = parseReplay(execFileSync(bin.path, [fixturePath], { encoding: 'utf8', maxBuffer: 64 << 20 }));
  const out = [], skipped = [];
  for (const r of parsed) {
    const { window, verified, why } = reconstructWindow(frames, r);
    if (!window) { skipped.push({ ...r, why }); continue; }
    const rep = { ...r, window, verified };
    rep.refitAgrees = refitAgreement(rep);
    out.push(rep);
  }
  return { reports: out, skipped, frames, binary: bin.path };
}

function readFrames(p) {
  return fs.readFileSync(p, 'utf8').split(/\r?\n/).filter(Boolean)
    .map(l => { try { return JSON.parse(l); } catch { return null; } })
    .filter(f => f && typeof f.t === 'number' && typeof f.db === 'number');
}

/* ---------------- the ledger ---------------- */

/**
 * Parse heard.jsonl into events with absolute seconds.
 *
 * Stamps are HH:MM:SS before 62a5a84 and HH:MM:SS.mmm after it; both are accepted, and which one
 * a line used is kept, because it is the format-era signature. No date is carried at all, so a
 * clock going backwards by more than an hour is a day rollover and not a reordering.
 */
function readLedger(text) {
  const out = [];
  let day = 0, prev = -1;
  for (const line of text.split(/\r?\n/)) {
    if (!line.trim()) continue;
    let o; try { o = JSON.parse(line); } catch { continue; }
    if (!o || typeof o.at !== 'string') continue;
    const m = /^(\d+):(\d+):(\d+)(?:\.(\d+))?$/.exec(o.at);
    if (!m) continue;
    const tod = +m[1] * 3600 + +m[2] * 60 + +m[3] + (m[4] ? +`0.${m[4]}` : 0);
    if (prev >= 0 && tod < prev - 3600) day += 1;
    prev = tod;
    const e = {
      at: o.at, kind: o.kind, text: o.text || '', det: o.det || null,
      millis: m[4] !== undefined, abs: day * 86400 + tod, day,
    };
    const sw = /([+-][\d.]+) dB over ([\d.]+)s/.exec(e.text);
    if (sw && (e.kind === 'growing' || e.kind === 'fading')) {
      e.db = parseFloat(sw[1]);
      e.over = parseFloat(sw[2]);
      e.windowStart = e.abs - e.over;
      const head = HEAD_RE.exec(e.text);
      e.from = head ? parseFloat(head[1]) : null;
      e.refit = head && head[2] !== undefined ? parseFloat(head[2]) : null;
      e.trim = head && head[3] !== undefined ? parseFloat(head[3]) : null;
      // ERA 4 SHIPS THE NUMBERS AS FIELDS, and a field beats a sentence about a field. The prose
      // above stays because the ledger's older eras have nothing else, but where `ev` exists it
      // wins — parsing a rendered string when the value is right there is the same defect as
      // mirroring a detector that can be run.
      const ev = o.ev && typeof o.ev === 'object' ? o.ev : null;
      if (ev) {
        if (typeof ev.from_dbfs === 'number') e.from = ev.from_dbfs;
        if (typeof ev.refit_db === 'number') e.refit = ev.refit_db;
        if (typeof ev.trim_s === 'number') e.trim = ev.trim_s;
        if (typeof ev.delta_db === 'number') e.db = ev.delta_db;
        if (typeof ev.window_s === 'number') { e.over = ev.window_s; e.windowStart = e.abs - e.over; }
      }
    }
    out.push(e);
  }
  return out;
}

/**
 * Where the ledger changed instrument, read off signatures the neighbouring code cannot produce.
 *
 * Two kinds, and they are different questions. ARITHMETIC: a report below the threshold, or a
 * second report inside the minimum gap, is proof the line came from a detector that no longer
 * exists — the boundary is the LAST such line. FORMAT: a millisecond stamp or a `det` field is
 * proof the line came from a service that did not exist before — the boundary is the FIRST such
 * line. Neither is read from git, because a commit is not a running build.
 */
function eraBoundaries(events) {
  const out = [];
  const swells = events.filter(e => e.db !== undefined);
  let arithmetic = null;
  for (let i = 0; i < swells.length; i++) {
    const impossible =
      Math.abs(swells[i].db) < SWELL_DB - 0.05 ||
      (i > 0 && swells[i].abs - swells[i - 1].abs < MIN_GAP_SECS - 2);
    if (impossible) arithmetic = swells[i].abs;
  }
  if (arithmetic !== null) out.push({ at: arithmetic, kind: 'arithmetic', label: 'the detector changed' });
  const firstNew = events.find(e => e.millis || e.det);
  if (firstNew && (arithmetic === null || firstNew.abs > arithmetic)) {
    out.push({ at: firstNew.abs - 1e-6, kind: 'format', label: 'the stream gained millisecond stamps and a det field' });
  }
  return out.sort((a, b) => a.at - b.at);
}

/** Split a ledger at every boundary. Eras are returned separately and never summed. */
function eras(events) {
  const bounds = eraBoundaries(events);
  if (!bounds.length) return [{ label: 'whole ledger', events }];
  const out = [];
  let lo = -Infinity;
  bounds.forEach((b, i) => {
    out.push({ label: i === 0 ? 'before the detector change' : `era ${i + 1}`, events: events.filter(e => e.abs > lo && e.abs <= b.at), stale: true, endedBy: b.label });
    lo = b.at;
  });
  out.push({ label: 'current', events: events.filter(e => e.abs > lo) });
  return out.filter(e => e.events.length);
}

/**
 * Of the growing reports in one era, how many have their window pinned to a track start.
 *
 * `tolerance` is 2 seconds because before 62a5a84 `at` was truncated to the second and `over` is
 * printed to the second, so an exact coincidence can present as ±1 either way. The chance rate is
 * reported beside the count for the same reason tell-index reports volume beside everything: a
 * count with no null to sit against is not a measurement.
 */
function pinAnalysis(events, tolerance = 2) {
  const tracks = events.filter(e => e.kind === 'track');
  const trackAt = tracks.map(e => e.abs);
  const pinned = kind => events.filter(e =>
    e.kind === kind && e.windowStart !== undefined &&
    trackAt.some(t => Math.abs(t - e.windowStart) <= tolerance));
  const growing = events.filter(e => e.kind === 'growing' && e.db !== undefined);
  const fading = events.filter(e => e.kind === 'fading' && e.db !== undefined);
  const pinnedGrowing = pinned('growing');

  // A track start can only produce a pinned report if the track lasted long enough for one and
  // the capture was still running. Counting every title change would understate the rate by
  // including skips the detector never had 48 seconds to speak about.
  let eligible = 0, produced = 0;
  for (let i = 0; i < tracks.length; i++) {
    const t = tracks[i].abs;
    const next = i + 1 < tracks.length ? tracks[i + 1].abs : Infinity;
    const alive = events.some(e => e.abs > t && e.abs <= t + WINDOW_SECS - 5);
    if (next - t < WINDOW_SECS - 10 || !alive) continue;
    eligible += 1;
    if (pinnedGrowing.some(e => Math.abs(e.windowStart - t) <= tolerance)) produced += 1;
  }

  const span = events.length ? events[events.length - 1].abs - events[0].abs : 0;
  return {
    tracks: tracks.length, growing: growing.length, fading: fading.length,
    pinnedGrowing: pinnedGrowing.length,
    pinnedFading: pinned('fading').length,
    distinctTracks: new Set(pinnedGrowing.map(e =>
      trackAt.find(t => Math.abs(t - e.windowStart) <= tolerance))).size,
    truncatedGrowing: growing.filter(e => e.over < WINDOW_SECS - 0.5).length,
    withHead: growing.filter(e => e.from !== null && e.from !== undefined).length,
    eligible, produced,
    chanceRate: span > 0 ? (tracks.length * (2 * tolerance + 1)) / span : null,
    rows: pinnedGrowing,
  };
}

/* ---------------- reporting ---------------- */

function reportFrames(p, trim) {
  let r;
  try { r = reportsFor(p); }
  catch (e) { console.error(`\n${p}\n  REFUSED: ${e.message}`); process.exitCode = 1; return; }
  console.log(`\n${p}`);
  console.log(`  ${r.frames.length} levelled frames, ${r.reports.length + r.skipped.length} swell reports from ${path.basename(r.binary)}`);
  if (r.skipped.length) {
    for (const s of r.skipped) console.log(`  SKIPPED ${s.at.toFixed(1)}: ${s.why}`);
  }
  if (!r.reports.length) return;
  console.log(`      at        report        span   head dB   without first ${trim}s   detector refit`);
  for (const rep of r.reports) {
    const h = headCarried(rep, trim);
    const refit = h.refit === null ? '—' : `${h.refit >= 0 ? '+' : ''}${h.refit.toFixed(1)} dB`;
    const a = rep.refitAgrees;
    const theirs = a === null
      ? '—'
      : `${a.theirs >= 0 ? '+' : ''}${a.theirs.toFixed(1)} past ${a.trim.toFixed(0)}s${a.agrees ? '' : ' DISAGREES'}`;
    console.log(
      `  ${rep.at.toFixed(1).padStart(7)}  ${rep.rising ? 'growing' : 'fading '} ` +
      `${(rep.db >= 0 ? '+' : '') + rep.db.toFixed(1)} dB`.padStart(12) +
      `  ${rep.over.toFixed(0).padStart(3)}s  ${rep.window[0][1].toFixed(1).padStart(7)}   ${refit.padStart(9)}   ${theirs.padStart(14)}` +
      (h.flagged ? '   HEAD-CARRIED' : ''));
  }
  // Three counts, and the last two are the ones that go quietly to zero when a printer changes
  // wording. A run that verifies nothing is not a clean run, and it must not look like one.
  const checked = r.reports.filter(x => x.refitAgrees !== null);
  console.log(`  head-carried: ${r.reports.filter(x => headCarried(x, trim).flagged).length} of ${r.reports.length}` +
              `  (windows verified against the reported head: ${r.reports.filter(x => x.verified).length}` +
              `; refits agreeing with the detector's: ${checked.filter(x => x.refitAgrees.agrees).length} of ${checked.length})`);
}

function reportLedger(p) {
  const events = readLedger(fs.readFileSync(p, 'utf8'));
  console.log(`\n${p}`);
  console.log(`  ${events.length} lines, ${(((events[events.length - 1].abs - events[0].abs) / 3600) || 0).toFixed(1)}h`);
  for (const b of eraBoundaries(events)) {
    const at = events.find(e => e.abs >= b.at);
    console.log(`  BOUNDARY (${b.kind}) near ${at ? at.at : b.at} — ${b.label}. Eras are NOT summed.`);
  }
  for (const era of eras(events)) {
    const a = pinAnalysis(era.events);
    console.log(`\n  [${era.label}]${era.stale ? `  — superseded: ${era.endedBy}` : ''}`);
    console.log(`    track starts ${a.tracks}   growing ${a.growing}   fading ${a.fading}`);
    console.log(`    growing whose window starts at a track start: ${a.pinnedGrowing}, across ${a.distinctTracks} distinct track starts`);
    console.log(`    fading  whose window starts at a track start: ${a.pinnedFading}`);
    console.log(`    growing with a truncated (<60s) window:       ${a.truncatedGrowing}`);
    console.log(`    growing carrying a head level:                ${a.withHead}`);
    console.log(`    track starts with room for a report: ${a.eligible}; of those, produced one: ${a.produced}`);
    if (a.chanceRate !== null) console.log(`    expected by chance among ${a.growing} growing: ${(a.chanceRate * a.growing).toFixed(2)}`);
    if (!era.stale) {
      for (const r of a.rows) {
        console.log(`      day${r.day} ${r.at}  ${(r.db >= 0 ? '+' : '') + r.db.toFixed(1)} dB over ${r.over.toFixed(0)}s` +
                    (r.from !== null && r.from !== undefined ? ` (from ${r.from.toFixed(1)} dB)` : ''));
      }
    }
  }
  const anyHead = events.some(e => e.from !== null && e.from !== undefined);
  console.log(`\n  ${anyHead
    ? 'Head levels present: the candidates are greppable. Head level is NECESSARY and NOT sufficient —'
    : 'No head levels in this ledger, and no per-frame levels, so head-carriage cannot be evaluated'}`);
  console.log(`  ${anyHead
    ? 'the Adagio and Fratres open within 6 dB of each other and only one is an artifact.'
    : 'on these lines — only the pinning. Use --frames on a fixture for the other half.'}`);
}

/* ---------------- cli ---------------- */

if (require.main === module) {
  const args = process.argv.slice(2);
  const valueOf = name => {
    const i = args.indexOf(name);
    return i >= 0 && args[i + 1] && !args[i + 1].startsWith('--') ? args[i + 1] : null;
  };
  const trim = parseFloat(valueOf('--trim') || '5');
  if (args.includes('--ledger')) {
    reportLedger(valueOf('--ledger') || 'C:/Consonance/data/heard.jsonl');
  } else if (args.includes('--frames')) {
    const paths = args.slice(args.indexOf('--frames') + 1).filter(a => !a.startsWith('--'));
    if (!paths.length) { console.error('usage: --frames <fixture.jsonl> [more...]'); process.exit(2); }
    for (const p of paths) reportFrames(p, trim);
  } else {
    console.error('usage: swell-head.js --frames <fixture.jsonl>... [--trim 5]');
    console.error('       swell-head.js --ledger [heard.jsonl]');
    process.exit(2);
  }
}

module.exports = {
  fitDb, refitWithoutHead, headCarried,
  findReplay, parseReplay, reconstructWindow, reportsFor, readFrames,
  readLedger, eraBoundaries, eras, pinAnalysis,
  WINDOW_SECS, SWELL_DB, MIN_GAP_SECS, SILENCE_DB,
};
