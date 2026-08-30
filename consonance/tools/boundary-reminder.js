#!/usr/bin/env node
/* boundary-reminder — the second measure, built BEFORE the reminder, which is why the reminder is
 * not shipped.
 *
 * ── WHAT WAS ASKED AND WHAT CAME BACK ───────────────────────────────────────────────────────────
 *
 * L016 PACKET A asked for a trailing reminder (Mittal arXiv:2603.23530 — terminal constraints
 * degrade worst, up to 50%; explicit framing plus a trailing reminder restores 90–100%) mechanised
 * in the hook and scored against the room's 98.1% turn-boundary violation baseline. And it asked,
 * first, for a SECOND measure that could come back saying the reminder made things worse — because
 * Mittal reports interference is bidirectional (one model's GSM8K accuracy fell 93% to 27% under a
 * formatting constraint), so scoring a reminder on compliance alone measures exactly the thing
 * designed to move.
 *
 * The second measure was built first, as instructed. It says the experiment cannot be run in the
 * window the packet allocates. THE REMINDER IS THEREFORE NOT SHIPPED AND NO HOOK FILE WAS
 * MODIFIED. Everything below re-derives from `--scan` and `--power` against the chair's own
 * transcript.
 *
 * ── THE ARITHMETIC THAT DECIDES IT ──────────────────────────────────────────────────────────────
 *
 * Measured over the chair's full history (2026-06-30 to 2026-08-30). THE TRANSCRIPT IS LIVE AND
 * GROWS WHILE THE CHAIR WORKS, so every figure here is stamped from one run and re-derives only by
 * re-running it. Quote the command, never this paragraph:
 *
 *     node consonance/tools/boundary-reminder.js --scan --power --transcript <main.jsonl>
 *
 * At 2026-08-30 ~05:40: 1,546 turns · 131 dispatch turns · 257 dispatches · 129 violations = 98.5%
 * (86.3% at a 1,000-char threshold), which reproduces pane E's published 98.1% (101/103,
 * `loop/turn_boundary_detection_2026-08-25.md`) five days and 28 dispatch turns later. The rate has
 * not moved. The two figures in this file that drifted between writing it and running it — 1,545
 * and 130 — were corrected by re-running rather than by memory.
 *
 * Cadence over the last 21 active days: 71.0 turns and 12.24 dispatches per active day. So TWENTY
 * DISPATCHES IS 1.6 ACTIVE DAYS — about 116 turns, 57 per arm if arms are randomised per turn.
 *
 * Turns per arm needed to detect a **+50%** increase in harm (alpha .05 two-sided, power .80):
 *
 *     signal                per arm      active days      inside the window?
 *     failed tool calls         916               26      NO  — 16x over
 *     edits/writes              654               19      NO  — 12x over
 *     tool calls                229                7      NO  —  4x over
 *     assistant text chars       31                1      yes — and it is not a quality measure
 *
 * Only the signal that does not measure quality is powered. The three that would actually indicate
 * degraded work are zero-inflated — 92% of turns have no failed tool call, 81% have no edit — so
 * their standard deviations run four times their means and no effect is visible at n=57.
 *
 * ── THE CHAIR'S OWN CANDIDATE IS THE WEAKEST OF THEM, AND IT WAS INVITED TO SAY SO ──────────────
 *
 * "Did the finished output preceding a compliant dispatch later require correction" is disk-derivable
 * — and the room has recorded **35 corrections in the librarian's WRONG column across its entire
 * lifetime**, against 1,546 turns: a base rate of 2.26%. At 57 turns per arm that is **1.29 expected
 * events per arm**. To detect a +50% change in it needs 3,365 turns per arm — 95 active days. The
 * packet's framing is wrong by a factor of about sixty, and it is also not judgement-free: a
 * correction enters that column because a seat wrote it there.
 *
 * ── AND THE ROOM HAS ALREADY MEASURED THIS INTERVENTION CLASS, AGAINST ITSELF ────────────────────
 *
 * `consonance/hooks/dispatch-gate.js`, in its own header: ferry-watch printed "Route the OBJECT, not
 * a description of it" in EVERY prompt for hours, and the ferry miss rate was 77.1% — "one that
 * fires regardless is ignored; one that carries a QUESTION and waits for an answer was acted on 60
 * of 60 times." A reminder that fires every turn fires on ~100% of turns; `turn_boundary_detection`
 * §5 refused P2 as a nag at 94.2%, and `sourced-stop.js` refused a gate at 80% in writing. **A
 * constant trailing reminder is already refused by this room's own standard, before any new data.**
 *
 * What survives: the research file's §1 names the room's one cue that DID fire — the collation
 * counter of 08-29 — and says why: it is in the line the seat already reads, and *it changes with
 * the world*. That is the design that is consistent with both the outside literature and the room's
 * own record, and it is described under DESIGN THAT WOULD BE DEFENSIBLE below.
 *
 * ── WHAT THIS TOOL IS FOR, GIVEN ALL THAT ───────────────────────────────────────────────────────
 *
 *   --scan    segment a transcript into turns, find dispatches, report the violation rate at
 *             several thresholds. This is the baseline any future run scores against.
 *   --power   the pre-registration calculator: for each candidate signal, turns per arm and active
 *             days required. Run this BEFORE building an intervention, not after.
 *   --arm     deterministic per-turn arm assignment from a prompt id, for the randomised design.
 *   --score   score a completed window by arm — AND IT REFUSES to report a compliance result while
 *             the quality arm is underpowered, naming `--allow-underpowered`. That refusal is the
 *             whole point of the packet, made mechanical instead of left in a memo.
 *
 * ── HOOK FEASIBILITY, CHECKED BEFORE BUILDING AS THE PACKET REQUIRED ────────────────────────────
 *
 * A UserPromptSubmit hook CAN reach the terminal position: its output lands after the user's message
 * text, which is the end of context. OBSERVED, in this session's own context, twice.
 *
 * But it cannot be *guaranteed* last. `settings.json` orders the five UserPromptSubmit hooks pulse,
 * board-digest, transcript-watch, dream-watch, ferry-watch — and the arriving order is board-digest
 * (`[panes]`) BEFORE pulse (`[pulse]`). Configured order is not delivered order. [OBSERVED n=2 in
 * one session; the mechanism — parallel execution concatenated by completion — is INFERRED, not
 * proved from the harness. `executeUserPromptSubmitHooks` is the symbol to disassemble if it ever
 * matters.] Consequence for anyone who builds this later: the terminal slot is currently held by
 * `[pulse]`, whose python startup makes it slowest, so a trailing reminder belongs IN the pulse line
 * rather than in a sixth hook racing for last place.
 *
 * ── DESIGN THAT WOULD BE DEFENSIBLE, if the chair extends the window ────────────────────────────
 *
 *   1. RANDOMISE PER TURN, not per period (`--arm`). Both arms then share the time drift and — more
 *      important — share the contamination, which matters because the chair has now READ a packet
 *      saying its compliance is about to be watched. Compliance will rise from that alone. Only a
 *      within-period randomised contrast survives it. The subject cannot be blinded; say so.
 *   2. STATE-DEPENDENT CONTENT, never a restatement of the rule: name the specific outstanding thing,
 *      so the cue changes with the world the way the collation counter does.
 *   3. SCORE BOTH ARMS on compliance AND the quality panel, with `--power` output printed beside
 *      every number.
 *   4. REGISTER THE DEGENERATION MARKER FIRST, as §5 required of P2: if N turns after installation
 *      the compliance gap between arms has not opened, the reminder is a nag and comes out.
 *   5. The quality arm needs ~26 active days for failed-tool-calls at +50%. **The cheaper route is
 *      not the live stream at all**: the interference question is Mittal's own design — a fixed task
 *      battery on fresh subjects, where n is bought with tokens instead of days, and the room already
 *      has that apparatus (the 72-trial four-arm run of 08-15).
 *
 * NO NETWORK. Reads only the transcript path it is given. Writes only where told.
 *
 *   node boundary-reminder.js --scan --transcript <path.jsonl> [--threshold 1000]
 *   node boundary-reminder.js --power --transcript <path.jsonl> [--window-dispatches 20]
 *   node boundary-reminder.js --arm --prompt-id <uuid> [--seed 1]
 *   node boundary-reminder.js --score --transcript <path.jsonl> --since <iso> [--allow-underpowered]
 */

'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');
const crypto = require('crypto');
const readline = require('readline');

// Signals the quality panel is allowed to use. `text_chars` is present and is DELIBERATELY not
// counted as a quality signal — it is the only one with resolution at the available n, and a
// shorter answer is not a worse answer. Letting it satisfy the power gate would be the exact
// substitution this file exists to prevent.
const QUALITY_SIGNALS = ['failed_tools', 'edits', 'tool_calls'];
const ALL_SIGNALS = QUALITY_SIGNALS.concat(['text_chars']);

// ── turn segmentation ───────────────────────────────────────────────────────────────────────────
//
// A turn runs from one typed user prompt to the next. `isSidechain` rows are subagent traffic and
// belong to no chair turn: counting them would attribute a subagent's tool failures to the seat
// being measured, which is the wrong universe for every number here.

function emptyTurn(row) {
  return {
    start: row.timestamp || null,
    promptId: row.promptId || null,
    text_chars: 0,
    tool_calls: 0,
    failed_tools: 0,
    edits: 0,
    dispatches: 0,
    dispatchTimestamps: [],
    charsAfterLastDispatch: 0,
  };
}

const DISPATCH_NAME = /chair_inject/;
const EDIT_NAME = /^(Write|Edit|NotebookEdit)$/;

function isTurnStart(row) {
  return row.type === 'user' && !!row.promptSource && !row.isSidechain;
}

function segmentTurns(rows) {
  const turns = [];
  let cur = null;
  const pending = new Map();     // tool_use id -> the turn that issued it
  for (const row of rows) {
    if (isTurnStart(row)) {
      if (cur) turns.push(cur);
      cur = emptyTurn(row);
      continue;
    }
    if (!cur || row.isSidechain) continue;
    const msg = row.message;
    if (!msg || !Array.isArray(msg.content)) continue;
    if (row.type === 'assistant') {
      for (const c of msg.content) {
        if (c.type === 'text') {
          const n = (c.text || '').length;
          cur.text_chars += n;
          // Only text emitted AFTER the last dispatch counts toward the violation. The reset is
          // load-bearing: a turn that dispatches early, writes, and dispatches again has not
          // violated on the strength of the text between them.
          if (cur.dispatches > 0) cur.charsAfterLastDispatch += n;
        } else if (c.type === 'tool_use') {
          cur.tool_calls += 1;
          pending.set(c.id, cur);
          if (DISPATCH_NAME.test(c.name || '')) {
            cur.dispatches += 1;
            cur.dispatchTimestamps.push(row.timestamp);
            cur.charsAfterLastDispatch = 0;
          }
          if (EDIT_NAME.test(c.name || '')) cur.edits += 1;
        }
      }
    } else if (row.type === 'user') {
      for (const c of msg.content) {
        if (c.type === 'tool_result' && c.is_error) {
          const owner = pending.get(c.tool_use_id);
          if (owner) owner.failed_tools += 1;
        }
      }
    }
  }
  if (cur) turns.push(cur);
  return turns;
}

function readTranscript(file) {
  return new Promise((resolve, reject) => {
    const rows = [];
    let unparsed = 0;
    const rl = readline.createInterface({ input: fs.createReadStream(file), crlfDelay: Infinity });
    rl.on('line', (line) => {
      if (!line.trim()) return;
      try { rows.push(JSON.parse(line)); } catch (e) { unparsed += 1; }
    });
    rl.on('error', reject);
    rl.on('close', () => resolve({ rows, unparsed }));
  });
}

// ── compliance ──────────────────────────────────────────────────────────────────────────────────

function classifyDispatchTurns(turns, threshold) {
  const d = turns.filter((t) => t.dispatches > 0);
  const violations = d.filter((t) => t.charsAfterLastDispatch > threshold);
  return {
    dispatchTurns: d.length,
    dispatches: d.reduce((a, t) => a + t.dispatches, 0),
    violations: violations.length,
    rate: d.length ? violations.length / d.length : NaN,
    threshold,
  };
}

// ── power ───────────────────────────────────────────────────────────────────────────────────────
//
// Two-sample, two-sided, independent groups. n per arm = 2 (z_{alpha/2} + z_{beta})^2 sigma^2 / delta^2.
// The 2 is not decoration: it is the two arms. Dropping it halves every requirement and would let a
// design that cannot see the harm claim that it can.

const Z_ALPHA_2 = 1.959963985;    // two-sided 0.05
const Z_BETA_80 = 0.841621234;    // power 0.80

function signalStats(turns, signal) {
  const vals = turns.map((t) => t[signal]);
  const n = vals.length;
  const mean = vals.reduce((a, v) => a + v, 0) / n;
  const varr = vals.reduce((a, v) => a + (v - mean) * (v - mean), 0) / Math.max(1, n - 1);
  const zeros = vals.filter((v) => v === 0).length;
  return { signal, n, mean, sd: Math.sqrt(varr), zeroFraction: zeros / n };
}

function requiredNPerArm(sd, delta) {
  if (!(delta > 0)) return Infinity;
  return Math.ceil(2 * Math.pow(Z_ALPHA_2 + Z_BETA_80, 2) * sd * sd / (delta * delta));
}

// For a rate (the chair's candidate measure), the same design on two proportions, unpooled.
function requiredNPerArmProportion(p1, relEffect) {
  const p2 = p1 * (1 + relEffect);
  const delta = p2 - p1;
  if (!(delta > 0) || p2 >= 1) return Infinity;
  return Math.ceil(Math.pow(Z_ALPHA_2 + Z_BETA_80, 2) * (p1 * (1 - p1) + p2 * (1 - p2)) / (delta * delta));
}

function cadence(turns, activeDayWindow) {
  const byDay = new Map();
  for (const t of turns) {
    if (!t.start) continue;
    const d = t.start.slice(0, 10);
    const e = byDay.get(d) || { turns: 0, dispatches: 0 };
    e.turns += 1; e.dispatches += t.dispatches;
    byDay.set(d, e);
  }
  const days = [...byDay.keys()].sort().slice(-activeDayWindow);
  let T = 0, D = 0;
  for (const d of days) { T += byDay.get(d).turns; D += byDay.get(d).dispatches; }
  const activeDays = days.length;
  return {
    activeDays,
    turnsPerDay: T / activeDays,
    dispatchesPerDay: D / activeDays,
    totalTurns: T, totalDispatches: D,
  };
}

// THE GATE. Given the window the packet allocates, which quality signals can actually see a harm of
// the size we care about? `text_chars` is excluded by construction — see QUALITY_SIGNALS.
function powerGate(turns, opts) {
  const cad = cadence(turns, opts.activeDayWindow);
  const activeDays = opts.windowDispatches / cad.dispatchesPerDay;
  const turnsAvailable = activeDays * cad.turnsPerDay;
  const perArm = Math.floor(turnsAvailable / 2);
  const rows = ALL_SIGNALS.map((s) => {
    const st = signalStats(turns, s);
    const need = requiredNPerArm(st.sd, st.mean * opts.relEffect);
    return {
      signal: s,
      isQuality: QUALITY_SIGNALS.includes(s),
      mean: st.mean, sd: st.sd, zeroFraction: st.zeroFraction,
      requiredPerArm: need,
      requiredActiveDays: Math.ceil(need * 2 / cad.turnsPerDay),
      powered: st.mean > 0 && need <= perArm,
    };
  });
  const poweredQuality = rows.filter((r) => r.isQuality && r.powered);
  return {
    cadence: cad,
    windowDispatches: opts.windowDispatches,
    relEffect: opts.relEffect,
    windowActiveDays: activeDays,
    turnsAvailable, perArm,
    rows,
    qualityArmPowered: poweredQuality.length > 0,
    poweredQualitySignals: poweredQuality.map((r) => r.signal),
  };
}

// ── arm assignment ──────────────────────────────────────────────────────────────────────────────
//
// Deterministic from the prompt id, so the hook needs no state, any seat can recompute which arm a
// past turn was in, and nobody can pick the arm after seeing the turn. Balanced by construction:
// the low bit of an HMAC.

function armFor(promptId, seed) {
  const h = crypto.createHmac('sha256', String(seed)).update(String(promptId)).digest();
  return (h[0] & 1) ? 'on' : 'off';
}

// ── scoring ─────────────────────────────────────────────────────────────────────────────────────

function scoreWindow(turns, opts) {
  const gate = powerGate(turns, opts);
  if (!gate.qualityArmPowered && !opts.allowUnderpowered) {
    const worst = gate.rows.filter((r) => r.isQuality)
      .map((r) => '    ' + r.signal.padEnd(14) + 'needs ' + r.requiredPerArm +
                  ' turns/arm (' + r.requiredActiveDays + ' active days), have ' + gate.perArm)
      .join('\n');
    throw new Error('REFUSED — THE QUALITY ARM IS UNDERPOWERED, SO A COMPLIANCE RESULT WOULD BE\n' +
      'THE ONLY THING THIS COULD REPORT, WHICH IS THE FAILURE THE PACKET ASKED FOR A GUARD AGAINST.\n' +
      '  window: ' + opts.windowDispatches + ' dispatches = ' + gate.windowActiveDays.toFixed(1) +
      ' active days = ' + Math.round(gate.turnsAvailable) + ' turns = ' + gate.perArm + ' per arm\n' +
      '  to see a +' + Math.round(opts.relEffect * 100) + '% harm:\n' + worst + '\n' +
      '  text_chars is powered and is NOT a quality signal; it cannot satisfy this gate.\n' +
      '  Extend the window, or run the interference question as a task battery on fresh subjects.\n' +
      '  To report anyway, and to have that recorded: --allow-underpowered');
  }
  const arms = { on: [], off: [] };
  for (const t of turns) {
    if (!t.promptId) continue;
    arms[armFor(t.promptId, opts.seed)].push(t);
  }
  const out = { gate, arms: {}, underpowered: !gate.qualityArmPowered };
  for (const a of ['on', 'off']) {
    const compliance = classifyDispatchTurns(arms[a], opts.threshold);
    const quality = {};
    for (const s of ALL_SIGNALS) quality[s] = signalStats(arms[a], s);
    out.arms[a] = { turns: arms[a].length, compliance, quality };
  }
  return out;
}

// ── rendering ───────────────────────────────────────────────────────────────────────────────────

function renderScan(turns, unparsed, thresholds) {
  const L = [];
  const withStart = turns.filter((t) => t.start);
  L.push('turns ' + turns.length + '   unparsed rows ' + unparsed +
         '   span ' + (withStart[0] ? withStart[0].start : '?') + ' .. ' +
         (withStart.length ? withStart[withStart.length - 1].start : '?'));
  const base = classifyDispatchTurns(turns, 0);
  L.push('dispatch turns ' + base.dispatchTurns + '   dispatches ' + base.dispatches);
  L.push('');
  L.push('  violation rate by threshold (chars of answer written AFTER the last dispatch):');
  for (const th of thresholds) {
    const c = classifyDispatchTurns(turns, th);
    L.push('    > ' + String(th).padStart(5) + ' chars : ' + String(c.violations).padStart(4) +
           ' / ' + c.dispatchTurns + '  = ' + (c.rate * 100).toFixed(1) + '%');
  }
  const ca = turns.filter((t) => t.dispatches > 0).map((t) => t.charsAfterLastDispatch)
                  .sort((a, b) => a - b);
  if (ca.length) {
    L.push('    distribution: min ' + ca[0] + '  median ' + ca[ca.length >> 1] +
           '  p90 ' + ca[Math.floor(ca.length * 0.9)] + '  max ' + ca[ca.length - 1]);
    L.push('    turns that END on the dispatch: ' + ca.filter((v) => v === 0).length);
  }
  return L.join('\n');
}

function renderPower(gate) {
  const L = [];
  const c = gate.cadence;
  L.push('cadence over the last ' + c.activeDays + ' active days: ' +
         c.turnsPerDay.toFixed(1) + ' turns/day, ' + c.dispatchesPerDay.toFixed(2) + ' dispatches/day');
  L.push('window of ' + gate.windowDispatches + ' dispatches = ' + gate.windowActiveDays.toFixed(1) +
         ' active days = ' + Math.round(gate.turnsAvailable) + ' turns = ' + gate.perArm +
         ' per arm (randomised per turn)');
  L.push('');
  L.push('  to detect a +' + Math.round(gate.relEffect * 100) + '% change:');
  L.push('  ' + 'signal'.padEnd(14) + 'mean'.padStart(10) + 'sd'.padStart(10) + 'zeros'.padStart(8) +
         'need/arm'.padStart(10) + 'days'.padStart(7) + '   verdict');
  for (const r of gate.rows) {
    L.push('  ' + r.signal.padEnd(14) + r.mean.toFixed(3).padStart(10) + r.sd.toFixed(3).padStart(10) +
           (r.zeroFraction * 100).toFixed(0).padStart(7) + '%' +
           String(r.requiredPerArm).padStart(10) + String(r.requiredActiveDays).padStart(7) +
           '   ' + (r.powered ? 'POWERED' : 'underpowered') +
           (r.isQuality ? '' : '   <- not a quality signal; cannot satisfy the gate'));
  }
  L.push('');
  L.push('  QUALITY ARM: ' + (gate.qualityArmPowered
    ? 'POWERED via ' + gate.poweredQualitySignals.join(', ')
    : 'UNDERPOWERED — no quality signal can see a +' + Math.round(gate.relEffect * 100) +
      '% harm at ' + gate.perArm + ' turns/arm'));
  return L.join('\n');
}

// ── CLI ─────────────────────────────────────────────────────────────────────────────────────────

function defaultTranscript() {
  // Discovered, never hardcoded: a literal user path here would be the machine-bound class the
  // repo already has a test for.
  const env = process.env.BOUNDARY_TRANSCRIPT;
  if (env) return env;
  const dir = path.join(os.homedir(), '.claude', 'projects');
  if (!fs.existsSync(dir)) return null;
  let best = null;
  for (const proj of fs.readdirSync(dir)) {
    const p = path.join(dir, proj);
    let entries;
    try { entries = fs.readdirSync(p); } catch (e) { continue; }
    for (const f of entries) {
      if (!f.endsWith('.jsonl')) continue;
      const full = path.join(p, f);
      const size = fs.statSync(full).size;
      if (!best || size > best.size) best = { full, size };
    }
  }
  return best ? best.full : null;
}

function parseArgs(argv) {
  const o = {
    threshold: 0, seed: 1, windowDispatches: 20, relEffect: 0.5, activeDayWindow: 21,
    allowUnderpowered: false, thresholds: [0, 200, 500, 1000, 2000],
  };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]; const next = () => argv[++i];
    if (a === '--scan') o.scan = true;
    else if (a === '--power') o.power = true;
    else if (a === '--score') o.score = true;
    else if (a === '--arm') o.armMode = true;
    else if (a === '--prompt-id') o.promptId = next();
    else if (a === '--transcript') o.transcript = next();
    else if (a === '--threshold') o.threshold = parseInt(next(), 10);
    else if (a === '--seed') o.seed = parseInt(next(), 10);
    else if (a === '--window-dispatches') o.windowDispatches = parseInt(next(), 10);
    else if (a === '--rel-effect') o.relEffect = parseFloat(next());
    else if (a === '--since') o.since = next();
    else if (a === '--allow-underpowered') o.allowUnderpowered = true;
    else if (a === '--json') o.json = true;
    else throw new Error('unknown argument: ' + a);
  }
  return o;
}

async function main(argv) {
  const o = parseArgs(argv);
  if (o.armMode) {
    if (!o.promptId) throw new Error('--arm needs --prompt-id');
    console.log(armFor(o.promptId, o.seed));
    return 0;
  }
  if (!o.scan && !o.power && !o.score) {
    console.error('usage: boundary-reminder.js --scan|--power|--score [--transcript <path.jsonl>]');
    console.error('       boundary-reminder.js --arm --prompt-id <uuid> [--seed 1]');
    return 2;
  }
  const file = o.transcript || defaultTranscript();
  if (!file || !fs.existsSync(file)) {
    throw new Error('no transcript: pass --transcript or set BOUNDARY_TRANSCRIPT');
  }
  const { rows, unparsed } = await readTranscript(file);
  let turns = segmentTurns(rows);
  if (o.since) turns = turns.filter((t) => t.start && t.start >= o.since);

  if (o.scan) console.log(renderScan(turns, unparsed, o.thresholds));
  if (o.power) {
    if (o.scan) console.log('');
    console.log(renderPower(powerGate(turns, o)));
  }
  if (o.score) {
    const r = scoreWindow(turns, o);
    if (o.json) { console.log(JSON.stringify(r, null, 2)); return 0; }
    console.log(renderPower(r.gate));
    console.log('');
    if (r.underpowered) console.log('*** REPORTED UNDER --allow-underpowered. The quality arm cannot see the harm.');
    for (const a of ['on', 'off']) {
      const arm = r.arms[a];
      console.log('  arm ' + a.padEnd(4) + ' turns ' + String(arm.turns).padStart(5) +
        '   dispatch turns ' + String(arm.compliance.dispatchTurns).padStart(4) +
        '   violations ' + String(arm.compliance.violations).padStart(4) +
        '  = ' + (arm.compliance.rate * 100).toFixed(1) + '%');
      for (const s of ALL_SIGNALS) {
        const q = arm.quality[s];
        console.log('       ' + s.padEnd(14) + 'mean ' + q.mean.toFixed(3) + '   sd ' + q.sd.toFixed(3));
      }
    }
  }
  return 0;
}

if (require.main === module) {
  main(process.argv.slice(2))
    .then((c) => process.exit(c))
    .catch((e) => { console.error(String(e.message || e)); process.exit(1); });
}

module.exports = {
  QUALITY_SIGNALS, ALL_SIGNALS, DISPATCH_NAME, EDIT_NAME,
  Z_ALPHA_2, Z_BETA_80,
  emptyTurn, isTurnStart, segmentTurns, readTranscript,
  classifyDispatchTurns, signalStats, requiredNPerArm, requiredNPerArmProportion,
  cadence, powerGate, armFor, scoreWindow,
  renderScan, renderPower, defaultTranscript, parseArgs, main,
};
