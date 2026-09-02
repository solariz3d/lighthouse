'use strict';
// chain-indicator.js — WHERE THE LOOP IS, AND WHAT IT IS WAITING ON.
//
// The keeper's ask, verbatim: "the UI update to see where the loop is and where its going with the
// arrow pointing." The arrow points at the NEXT hop, not the current one — that is the whole
// difference between a status display and something that tells him what he is waiting for.
//
// THE LOOP:  user -> orch -> LIB -> orch -> panes -> LIB -> orch -> ...
//
// ── WHY IT READS THE BOARD AND NOT chain-status.js ─────────────────────────────────────────────
//
// It would rather read chain-status.js, which is the room's chain reader and collates TWO ledgers.
// It cannot. The WebView has no filesystem: tauri.conf.json enables no fs and no shell plugin, the
// capability set is core:default plus dialog, and no Tauri command reads lap.jsonl or runs a tool.
// Adding one means main.rs, which is another seat's file this lap. So the only chain data reachable
// from here is get_board, and this file is honest about being a SECOND and WEAKER reader than the
// tool — see WHAT THIS CANNOT SEE.
//
// What makes the board usable anyway: the chair audit rows are RECEIPTS WRITTEN BY THE CONTROL
// PLANE AT THE MOMENT THE VERB FIRED, not stage words a seat chose to write. Reading
// "call_librarian E -> LIB [Received]" as "E handed back to LIB" is reading a receipt, not
// re-deriving a claim.
//
// ── THE THREE HOPS, AND THE FAILURE LINES THAT MUST NOT BE READ AS HOPS ────────────────────────
//
// From main.rs (chair_inject_audit_line, and the call_* audits). This is a CONTRACT WITH main.rs
// THAT main.rs DOES NOT DECLARE FOR THIS READER — it declares one for chain-status.js alone (search `is a CONTRACT with`).
// Every string below is pinned in chain-indicator.test.js against main.rs's own source, so a
// rename there turns this file red instead of silently blank.
//
//   orch -> pane   "chair injected (chair: M) -> ID [delivered and received]: ..."
//   pane -> LIB    "call_librarian L -> LIB [Received]: ..."
//   LIB  -> orch   "call_chair -> Main [Received]: ..."
//
// THE DISCRIMINATOR IS ONE CHARACTER AND IT IS LOAD-BEARING: every SUCCESS line says
// "chair injected " (a space); every failure and refusal says "chair_inject " (an underscore) —
// "DELIVERY FAILED ... nothing reached the pane". A failed delivery is not a hop. Same on the
// other two: "-> LIB FAILED", "REFUSED", and "EXPIRED unexecuted" are all NOT hops.
//
// ── THE SPOOF GUARD, and it is not hypothetical ────────────────────────────────────────────────
//
// A pane that WRITES the text "call_librarian C -> LIB [Received]" in its own turn gets that turn
// pushed to the board as a pane row. A text-only scanner would read a pane's prose as a control-
// plane event — and panes discuss these audit lines constantly, this file's own hand-back among
// them. So every hop must come from a row whose pane field is literally "chair", which is what
// chair_audit() stamps and what no pane turn can forge from inside its transcript. Gated in
// readHop(), with a hostile fixture in the test.
//
// ── WHAT THIS CANNOT SEE, printed in the chip rather than only filed here ───────────────────────
//
//   "position unknown"  — no hop row in the ring. THE NORMAL STATE AFTER EVERY RELAUNCH: the board
//                         ring is built as VecDeque::new() (search main.rs for `manage(Board(Arc::new`) and is never rehydrated from
//                         board.jsonl, so get_board returns EMPTY on a fresh launch and fills only
//                         with new pushes. It also happens once 300 rows of other traffic have
//                         evicted the last hop. NO ARROW IS DRAWN. An old value read as a current
//                         one is the "stale-digest" failure, named in exo_memory/muscle_map.md and
//                         exo_memory/librarian/2026-08-30.md. (CHARLIE's R2 cites it as
//                         memory/stale-digest-is-not-a-deliverable.md; that path does not exist and
//                         was never tracked in git. The LESSON is real, the FILE is a phantom.)
//                         and chain-status has fired stale four distinct ways in two days.
//   "board unavailable" — the invoke threw. Never rendered as a position.
//   "blind window open" — pushes are muted and counted, so a newer hop may exist unseen. The chip
//                         says so and drops the arrow rather than aging a hop it cannot trust.
//
// EVICTION CANNOT HIDE A NEWER HOP, and that is why "unknown" is the only degraded reading here:
// the ring evicts from the FRONT, so every row dropped is OLDER than the newest hop. Eviction can
// erase the last hop entirely; it can never leave a stale one standing while a fresher one exists.
//
// ── WHAT IT DOES NOT CLAIM ─────────────────────────────────────────────────────────────────────
//
// IT IS A SENSOR — same law as chain-status.js and sourced-stop.js: no verdicts, no advice. It
// shows POSITION and DWELL. It never says stalled, stuck, or dead, and there is a test that no
// such word reaches the DOM. chain-status's own header refutes that axis with this room's data:
// L009 sat 3554s and the panes DID work; L010 sat 3557s and the lap was dead. Three seconds apart,
// opposite classes. So dwell is a number for the keeper to read, never a verdict this draws.
//
// THE ESCALATION AT 15 MINUTES IS SALIENCE, NOT A THRESHOLD ON A CLAIM. The value is CHARLIE's,
// registered in exo_memory/loop/visible_channel_registration_2026-08-30.md R2 before anything was
// built, and it is carried here rather than re-invented. R2 also requires that the payload be
// elapsed-in-state — a number that CHANGES on every emission — because the state that most needs
// to be visible is a state that is not changing (its A4, the static-state paradox).
//
// ── THE ONE PLACE THIS DEVIATES FROM R2, DECLARED RATHER THAN SMUGGLED ─────────────────────────
//
// R2 registers the notice as EXCEPTION-TRIGGERED and R11 names "acquires an always-on rendering so
// it is easier to see" as the DEGENERATION MARKER. This chip HAS a quiet always-on state, so it
// meets that marker, and saying otherwise would be the argument R11 predicted. Two things, both in
// the hand-back and neither settled here:
//
//   (1) R11's own remedy is that such a rendering "should require a fresh registration with the
//       ferry line's 233 as its declared baseline" — so it needs its OWN registration, not a
//       widening of instrument 1. It is NOT scored against R4/R5 until that exists.
//   (2) The reason it is not exception-only is a law already on disk, not a convenience: an
//       instrument that is invisible until it fires cannot be told from a dead one. That is
//       chain-status.js's --why in its own words: "it printed nothing" and "it crashed and was
//       swallowed" look the same, which is the blindness that tool exists to end. The quiet state
//       is the liveness proof; the escalation is the exception trigger.
//
// Run the tests:  node consonance/ui/chain-indicator.test.js

(function (root) {

  /** Escalation point, minutes. CHARLIE's registered value (R2); not tuned here. */
  var CHAIN_ESCALATE_MIN = 15;

  /** Poll cadence, ms. get_board emits no event for chair audit rows, so this must poll. */
  var CHAIN_POLL_MS = 15000;

  // ---- the grammar, mirroring main.rs -----------------------------------------------------

  // SUCCESS ONLY. "chair injected " with a space; the failure/refusal path writes "chair_inject ".
  // The bracket is CAPTURED, not skipped — see confirmedReceipt: not-failed is not the same as
  // confirmed, and v1 of this file conflated them at all three edges.
  var RE_DISPATCH = /^chair injected \(chair: [^)]*\) -> ([0-9a-f]{1,8}) \[([^\]]*)\]/;
  var RE_HANDBACK = /^call_librarian ([A-Z][A-Z0-9]*) -> LIB \[([^\]]*)\]/;
  var RE_RING = /^call_chair -> Main \[([^\]]*)\]/;

  // A FOURTH CONTRACT WITH main.rs, and it is pinned in the test against main.rs's own source for
  // the same reason the three above are: `chain_state` returns this exact sentence when every lap
  // is filed, and a rename there would silently turn a COMPLETED cycle back into a dark tab bar —
  // which is the one thing AMENDMENT 2 exists to prevent.
  var RE_ALL_FILED = /every lap with a baton row is filed/;

  /**
   * Did the control plane CONFIRM the delivery landed, or only that it wrote?
   *
   * DEFECT 1, found by ALPHA against the shipped v1 and fixed here. `chair_inject_audit_line` has
   * THREE success states, not one, and all three spell "chair injected " with the space:
   *
   *   Receipt::Received     -> "[delivered and received]"
   *   Receipt::Unconfirmed  -> "[WRITTEN BUT UNCONFIRMED — no render in the pane's capture ...]"
   *   Receipt::NotAttempted -> "[written; receipt not checked]"
   *
   * and the other two edges Debug-format the receipt straight in: "[Received]", "[Unconfirmed]",
   * "[NotAttempted]". The space/underscore discriminator separates FAILED from not-failed; it does
   * NOT separate confirmed from unconfirmed. So v1 drew a confident arrow and a dwell counter for a
   * packet the control plane had just said it could not confirm had landed — failing in the unsafe
   * direction, the one direction the other three degraded states were all built to avoid. This is
   * the error named two lines away in this file's own §4 and committed anyway.
   *
   * WHY THIS IS A STATE AND NOT A TERM IN THE REGEX, which is the part worth keeping: simply
   * refusing to match an unconfirmed row is WORSE than the bug. `latestHop` would scan straight
   * past it and return the hop BEFORE it — so the chip would draw a confident arrow for a position
   * that has since been superseded, silently. The uncertainty has to be carried, not dropped.
   */
  function confirmedReceipt(kind, receipt) {
    return kind === 'dispatch' ? receipt === 'delivered and received' : receipt === 'Received';
  }

  /**
   * One board row -> the hop it attests, or null.
   * Text alone is never enough; see the spoof guard. This takes the whole entry.
   */
  function readHop(entry) {
    if (!entry || entry.pane !== 'chair') return null;   // the spoof guard
    var text = String(entry.text || '');
    var m = RE_DISPATCH.exec(text);
    if (m) return { kind: 'dispatch', from: 'orch', to: 'pane', paneId: m[1], receipt: m[2], confirmed: confirmedReceipt('dispatch', m[2]) };
    m = RE_HANDBACK.exec(text);
    if (m) return { kind: 'handback', from: 'pane', to: 'lib', letter: m[1], receipt: m[2], confirmed: confirmedReceipt('handback', m[2]) };
    m = RE_RING.exec(text);
    if (m) return { kind: 'ring', from: 'lib', to: 'orch', receipt: m[1], confirmed: confirmedReceipt('ring', m[1]) };
    return null;                                          // FAILED / REFUSED / EXPIRED land here
  }

  /** True if this row is the blind window opening (pushes muted from here). */
  function isBlindOpen(entry) {
    return !!entry && entry.pane === 'blind' && /^blind window OPEN\b/.test(String(entry.text || ''));
  }
  function isBlindClosed(entry) {
    return !!entry && entry.pane === 'blind' && /^blind window CLOSED\b/.test(String(entry.text || ''));
  }

  /**
   * Newest hop in the ring, or null. Scans backwards and stops at the first one — rows newer than
   * it are, by definition, not hops.
   */
  function latestHop(entries) {
    if (!Array.isArray(entries)) return null;
    for (var i = entries.length - 1; i >= 0; i--) {
      var hop = readHop(entries[i]);
      if (hop) return { hop: hop, ts: Number(entries[i].ts) || 0, index: i };
    }
    return null;
  }

  /**
   * WHO THE LOOP IS ACTUALLY WAITING ON — the outstanding dispatches, not the newest receipt.
   *
   * DEFECT 2, found by ALPHA against the shipped v1 and fixed here. The lap is a FAN-OUT: the
   * orchestrator dispatches to several panes at once, each hands back to LIB independently, and LIB
   * rings the orchestrator when the leg is done. v1 read the single newest receipt as the whole
   * state, so on tonight's real shape — four panes dispatched, one handed back — it rendered
   * "chain LIB -> LIB" while THREE PANES WERE STILL OUT. That is not a stale reading; it is a
   * confident wrong one, which is worse, and it would have put `chain-status`'s mid-lap miscount in
   * front of the keeper as a picture.
   *
   * BOTH DEFECTS ARE ONE SPECIES, and naming it is the point: AN INSTRUMENT READING THE MOST RECENT
   * EVENT AS THE CURRENT STATE. A fan-out breaks it because the most recent event is one of many in
   * flight; an unconfirmed delivery breaks it because the most recent event may not have happened.
   *
   * MATCHED BY PANE IDENTITY, NOT BY A LAP BOUNDARY — and the first version of this fix used the
   * boundary and was wrong. Run against the live board it reported ZERO outstanding while two panes
   * were out, including the one running this packet. The reason is in the data: at 04:58:24 the
   * chair dispatched C, at 04:59:06 LIB rang, and at 05:02:03 C handed back. **Hand-backs cross the
   * ring.** So "dispatches since the last ring" silently drops any pane still working across a
   * boundary — A's defect again, one layer in, in the fix for it.
   *
   * The rule that survives contact with the board: a dispatch to X is open until X hands back
   * LATER than it was sent. Re-dispatch reopens it; a hand-back from a pane never dispatched
   * cannot close someone else's row.
   *
   * THE ONE EXCEPTION, also from the live data: a dispatch to the LIBRARIAN is closed by a `ring`,
   * not by a hand-back, because the librarian answers on `call_chair`. Left uncorrected it would
   * sit "outstanding" forever. It cannot be identified directly — `call_chair -> Main` names no
   * actor at all (ALPHA's Q2) — so the discriminator is behavioural: a target that has produced NO
   * hand-back anywhere in the window is treated as ring-closable. **The residual, stated because it
   * is real: a brand-new committee pane with no prior hand-back in the window is ring-closable too,
   * so a ring can close it early.** That errs toward under-counting for exactly one dispatch of a
   * pane's first appearance, and no better signal exists on this channel.
   *
   * WHAT IT CANNOT SEE: the window. A dispatch evicted from the 300-row ring is invisible, so the
   * count is a floor, not a total. `matched:false` additionally says the two alphabets could not be
   * reconciled and the number is a subtraction rather than a set difference.
   */
  function outstanding(entries, letters) {
    var lastDispatch = {}, lastHandback = {}, everHandedBack = {}, order = [];
    var lastRingTs = 0, named = true, nDispatch = 0, nHandback = 0;

    for (var j = 0; j < entries.length; j++) {
      var hop = readHop(entries[j]);
      if (!hop) continue;
      var ts = Number(entries[j].ts) || 0;
      if (hop.kind === 'ring') {
        lastRingTs = ts;
      } else if (hop.kind === 'dispatch') {
        var label = paneLabel(hop.paneId, letters);
        if (label === hop.paneId) named = false;  // no letter resolved: wrong alphabet for matching
        if (order.indexOf(label) < 0) order.push(label);
        lastDispatch[label] = ts;
        nDispatch++;
      } else if (hop.kind === 'handback') {
        lastHandback[hop.letter] = ts;
        everHandedBack[hop.letter] = true;
        nHandback++;
      }
    }

    // Matching needs both sides in the SAME alphabet: dispatches carry pane ids, hand-backs carry
    // letters. If some id did not resolve AND anything has returned, the difference would be
    // fiction — degrade to a count rather than guess.
    if (!named && nHandback > 0) {
      return { count: Math.max(0, nDispatch - nHandback), named: null, oldestTs: null,
               matched: false, ringSeen: lastRingTs > 0 };
    }

    var still = [], oldestTs = null;
    for (var k = 0; k < order.length; k++) {
      var p = order[k], d = lastDispatch[p];
      if ((lastHandback[p] || 0) > d) continue;                    // it came back after being sent
      if (!everHandedBack[p] && lastRingTs > d) continue;          // ring-closed, see above
      still.push(p);
      if (oldestTs === null || d < oldestTs) oldestTs = d;
    }
    return { count: still.length, named: still, oldestTs: oldestTs,
             matched: true, ringSeen: lastRingTs > 0 };
  }

  /** Is the blind window open right now, per the last blind edge in the ring? */
  function blindOpen(entries) {
    if (!Array.isArray(entries)) return false;
    for (var i = entries.length - 1; i >= 0; i--) {
      if (isBlindOpen(entries[i])) return true;
      if (isBlindClosed(entries[i])) return false;
    }
    return false;
  }

  /** A pane's letter if the id prefix is known, else the short id itself. Never invents one. */
  function paneLabel(shortId, letters) {
    if (letters) {
      for (var full in letters) {
        if (Object.prototype.hasOwnProperty.call(letters, full) && full.indexOf(shortId) === 0) {
          return String(letters[full]);
        }
      }
    }
    return shortId;
  }

  /**
   * Given the hop that just completed, who acts NEXT. This is the arrow.
   * The cycle: orch -> pane (pane works) -> LIB -> orch -> orch dispatches again.
   */
  function nextHop(hop, letters) {
    switch (hop.kind) {
      case 'dispatch': return { who: 'pane ' + paneLabel(hop.paneId, letters), verb: 'to hand back to LIB' };
      case 'handback': return { who: 'LIB', verb: 'to ring the orchestrator' };
      case 'ring': return { who: 'orch', verb: 'to dispatch' };
      default: return null;
    }
  }

  /**
   * The arrow when the ring carries NO hop — derived from `chain_state`'s holder.
   *
   * The librarian's vocabulary ruling, implemented rather than re-derived: chair -> panes,
   * panes -> LIB, librarian -> orch. This is the half that survives a relaunch, because `lap.jsonl`
   * is on disk and the board ring is not.
   *
   * It is a WEAKER arrow than a receipt-derived one and the view says so: the ledger row is a claim
   * a seat wrote about itself (`self_reported` is hardcoded true in main.rs), while a chair audit
   * row is the control plane recording that a verb actually fired.
   */
  function holderArrow(holder) {
    var h = String(holder || '').toLowerCase();
    if (h === 'chair' || h === 'orch' || h === 'orchestrator') return { who: 'panes', verb: 'to be dispatched to' };
    if (h === 'panes' || h === 'pane') return { who: 'LIB', verb: 'to hand back to' };
    if (h === 'librarian' || h === 'lib') return { who: 'orch', verb: 'to ring' };
    return null;
  }

  /**
   * WHICH TAB CARRIES THE AURA. `holder` is a STATION — chair | panes | librarian | none — never a
   * pane, and that is the librarian's ruling, not a convenience here.
   *
   * IT MAPS EXACTLY THE WORDS `holderArrow` MAPS AND NOT ONE MORE. On 2026-09-01 the ledger began
   * carrying pane NAMES on dispatch rows (`charlie`, `bravo`, `echo`) and four rows drifted; the
   * repair was a corrected ledger row and a validation packet for `lap-row.js`, NOT a widening
   * here — widening the readers would bless the fan-out error, since a dispatch goes to SEVERAL
   * panes and one name cannot stand for the leg (loop/packet_aura_addendum_2026-09-02.md §1).
   * An unregistered word therefore returns null, and the caller renders UNKNOWN rather than dark.
   */
  function holderTab(holder) {
    var h = String(holder || '').toLowerCase();
    if (h === 'chair' || h === 'orch' || h === 'orchestrator') return 'main';
    if (h === 'panes' || h === 'pane') return 'terminal';
    if (h === 'librarian' || h === 'lib') return 'librarian';
    return null;
  }

  /**
   * The tab a `next.who` string names. It has to cover BOTH alphabets this file produces:
   * holderArrow's stations ('panes' | 'LIB' | 'orch') and the receipt side's pane forms
   * ('pane A', 'panes A, B', '3 panes'). The panes all live behind the Terminal tab.
   */
  function tabForWho(who) {
    var w = String(who || '');
    if (/pane/i.test(w)) return 'terminal';
    if (w === 'LIB') return 'librarian';
    if (w === 'orch') return 'main';
    return null;
  }

  /** Where a RECEIPT puts the loop, as a tab. The fallback when no lap state is available. */
  function positionTab(hop) {
    switch (hop.kind) {
      case 'dispatch': return 'terminal';
      case 'handback': return 'librarian';
      case 'ring': return 'main';
      default: return null;
    }
  }

  /** Where the loop IS — the party that now holds it. */
  function positionLabel(hop, letters) {
    switch (hop.kind) {
      case 'dispatch': return paneLabel(hop.paneId, letters);
      case 'handback': return 'LIB';
      case 'ring': return 'orch';
      default: return '?';
    }
  }

  /** The hop that just completed, for the tooltip. */
  function hopLabel(hop, letters) {
    switch (hop.kind) {
      case 'dispatch': return 'orch -> pane ' + paneLabel(hop.paneId, letters);
      case 'handback': return 'pane ' + hop.letter + ' -> LIB';
      case 'ring': return 'LIB -> orch';
      default: return '?';
    }
  }

  /**
   * THE WHOLE RENDER DECISION, pure. Returns a view, never a DOM node, so it is testable without a
   * browser — the class of defect ui/ has actually shipped is a blank window with every instrument
   * green.
   *
   * state: 'unavailable' | 'unknown' | 'blind' | 'quiet' | 'waiting'
   * Only 'quiet' and 'waiting' carry an arrow. The other three deliberately carry none.
   */
  function chainViewCore(entries, nowMs, opts) {
    opts = opts || {};
    var escalateMin = opts.escalateMin == null ? CHAIN_ESCALATE_MIN : opts.escalateMin;
    var letters = opts.letters || {};

    // TWO SOURCES, AND THE RULING ASSIGNS THEM DIFFERENT JOBS (librarian, L025):
    //   chain_state  is the POSITION source — lap · stage · holder · age. It reads `lap.jsonl` on
    //                disk, so it SURVIVES A RELAUNCH, which the board ring does not.
    //   the ring     is the HOP source — arrows come from receipts, which carry evidential weight.
    // Ring empty -> the arrow is labelled from holder -> next hop. Both present -> the command sets
    // the stage text and the ring sets the arrow. `note` is deliberately NOT displayed.
    var chain = opts.chain && typeof opts.chain === 'object' ? opts.chain : null;
    var stage = chain && chain.open
      ? [chain.lap, chain.chain, chain.holder ? 'holder ' + chain.holder : null]
          .filter(Boolean).join(' ')
      : null;
    var chainAge = chain && chain.open && typeof chain.age_ms === 'number'
      ? Math.max(0, Math.floor(chain.age_ms / 60000)) : null;
    var claim = chain && chain.open && chain.self_reported
      ? ' The position is SELF-REPORTED: a seat wrote that ledger row about itself. The arrow, when it comes from the board, is a control-plane receipt.'
      : '';
    var extra = chain && chain.open
      ? (chain.also_open ? ' ' + chain.also_open + ' other lap(s) left open behind this one.' : '') +
        (chain.unreadable ? ' ' + chain.unreadable + ' ledger line(s) would not parse and are counted, not dropped.' : '')
      : '';

    var boardUsable = Array.isArray(entries) && !blindOpen(entries);
    var found = boardUsable ? latestHop(entries) : null;

    // --- neither source has anything to say -------------------------------------------------
    if (!found && !(chain && chain.open)) {
      if (chain && chain.open === false) {
        var reason = chain.reason || 'the ledger reports none';
        // AMENDMENT 2 (4e0de97), and the reason it exists: "the cycle completed" and "nothing ever
        // started" were BOTH `idle`, so they rendered identically — the third time in one night
        // that two different facts produced the same pixels (the placeholder byte-identical to
        // `unknown`; `unknown` and `idle` both drawing no aura; and this).
        //
        // main.rs's `chain_state` HAS ALWAYS DISTINGUISHED THEM and nothing read it: `reason` is
        // "every lap with a baton row is filed" when laps ran and closed, and "the ledger carries
        // no baton rows yet" / "no ledger on this machine" when none ever ran. No new plumbing —
        // the amendment's own line — because the discriminator was already on the wire.
        if (RE_ALL_FILED.test(reason)) {
          return {
            state: 'complete', text: 'chain — cycle complete', arrow: null, elapsedMin: null,
            selfReported: !!chain.self_reported, outstanding: 0,
            why: 'every lap with a baton row in the ledger is FILED: the return leg landed and the ' +
              'cycle is closed. This is COMPLETE, held until the next lap opens — not an absence. ' +
              'Dark now means one thing only: no lap has ever opened.' + extra
          };
        }
        // NOT an error and not "unknown": the ledger was read and carries no baton rows at all.
        // This is the ordinary state at boot, and the bar for this build is that it renders as such.
        return {
          state: 'idle', text: 'chain — no lap open', arrow: null, elapsedMin: null,
          selfReported: !!chain.self_reported, outstanding: 0,
          why: 'no lap is open: ' + reason +
            '. This is the ordinary state at boot, not a failure.' + extra
        };
      }
      if (!Array.isArray(entries)) {
        return {
          state: 'unavailable', text: 'chain — board unavailable', arrow: null, elapsedMin: null,
          why: 'the board could not be read and no lap state was available; no position is shown rather than a stale one'
        };
      }
      if (!boardUsable) {
        return {
          state: 'blind', text: 'chain — blind window open', arrow: null, elapsedMin: null,
          why: 'board pushes are muted and counted, so a newer hop may exist unseen; no arrow is drawn from a hop that cannot be aged'
        };
      }
      return {
        state: 'unknown', text: 'chain ? position unknown', arrow: null, elapsedMin: null,
        why: 'no chain hop in the board ring and no open lap from chain_state. The ring starts EMPTY at every launch (it is never rehydrated from board.jsonl) and holds only the last 300 rows. This is not a stall reading — it is no reading at all.'
      };
    }

    // --- the command has a position and the ring has no hop to draw an arrow from ------------
    // THE RELAUNCH CASE, and the reason this command exists: the ring is empty after every
    // restart, so before this the chip said "position unknown" for a lap that was plainly open.
    if (!found) {
      var ha = holderArrow(chain.holder);
      return {
        state: chainAge !== null && chainAge >= escalateMin ? 'waiting' : 'quiet',
        text: 'chain ' + stage,
        arrow: ha ? '-> ' + ha.who : null,
        elapsedMin: chainAge,
        selfReported: !!chain.self_reported,
        outstanding: 0,
        next: ha,
        why: 'from chain_state (lap.jsonl), which survives a relaunch. ' +
          (ha ? 'Holder ' + chain.holder + ', so the next hop is ' + ha.who + ' ' + ha.verb + '.'
              : 'Holder "' + chain.holder + '" is not a known position, so no arrow is drawn.') +
          (boardUsable ? ' The board ring carries no hop yet — normal right after a relaunch.'
                       : ' The board could not be read, so no receipt is available.') +
          claim + extra
      };
    }

    var out = outstanding(entries, letters);
    var limit = ' The window is the last 300 board rows: a dispatch evicted from it is invisible, so the ' +
      'outstanding count is a floor, not a total.' + (out.matched ? '' :
      ' Pane ids did not all resolve to letters, so this number is a subtraction, not a set difference.');

    // DEFECT 1's state. The LATEST thing known is a delivery the control plane could not confirm,
    // so no arrow is drawn from it. Elapsed IS shown, and the difference from the other three
    // no-arrow states is deliberate: there the whole reading is untrustworthy, whereas here the
    // TIMESTAMP is sound — the write demonstrably happened then — and only the landing is unknown.
    // The outstanding count still rides, because losing it would trade one blind spot for another.
    if (!found.hop.confirmed) {
      var alsoOut = out.count > 0 ? ' · ' + out.count + ' out' : '';
      return {
        state: 'unconfirmed',
        text: (stage ? 'chain ' + stage + ' · delivery unconfirmed' : 'chain ? delivery unconfirmed') + alsoOut,
        arrow: null,
        elapsedMin: chainAge !== null ? chainAge : Math.max(0, Math.floor((nowMs - found.ts) / 60000)),
        selfReported: !!(chain && chain.open && chain.self_reported),
        outstanding: out.count,
        why: 'the newest hop is ' + hopLabel(found.hop, letters) + ' with receipt "' +
          found.hop.receipt + '" — the control plane wrote it and could NOT confirm it landed, so no ' +
          'arrow is drawn from it. The time is real; the landing is not established.' + limit
      };
    }

    // DEFECT 2's state. Outstanding dispatches outrank the newest receipt: with four panes out and
    // one back, the loop is waiting on three panes whatever the last row says.
    if (out.count > 0) {
      var who = out.named && out.named.length
        ? (out.named.length === 1 ? 'pane ' + out.named[0] : 'panes ' + out.named.join(', '))
        : out.count + (out.count === 1 ? ' pane' : ' panes');
      var since = out.oldestTs ? Math.max(0, Math.floor((nowMs - out.oldestTs) / 60000)) : 0;
      return {
        state: (chainAge !== null ? chainAge : since) >= escalateMin ? 'waiting' : 'quiet',
        text: stage ? 'chain ' + stage + ' · ' + out.count + ' out'
                    : 'chain ' + out.count + (out.count === 1 ? ' pane out' : ' panes out'),
        arrow: '-> ' + who,
        elapsedMin: chainAge !== null ? chainAge : since,
        selfReported: !!(chain && chain.open && chain.self_reported),
        outstanding: out.count,
        next: { who: who, verb: 'to hand back to LIB' },
        why: out.count + ' dispatch(es) in this leg have no matching hand-back: ' + who +
          '. Elapsed is measured from the OLDEST outstanding dispatch — the thing waited on longest — ' +
          'not from the newest receipt, which is what v1 read and why it announced the loop was at LIB ' +
          'while three panes were still out.' + limit
      };
    }

    var next = nextHop(found.hop, letters);
    var elapsedMin = Math.max(0, Math.floor((nowMs - found.ts) / 60000));

    return {
      state: (chainAge !== null ? chainAge : elapsedMin) >= escalateMin ? 'waiting' : 'quiet',
      text: stage ? 'chain ' + stage : 'chain ' + positionLabel(found.hop, letters),
      arrow: next ? '-> ' + next.who : null,
      elapsedMin: chainAge !== null ? chainAge : elapsedMin,
      selfReported: !!(chain && chain.open && chain.self_reported),
      outstanding: 0,
      next: next,
      why: 'last hop ' + hopLabel(found.hop, letters) + ', ' + elapsedMin + 'm ago; waiting on ' +
        (next ? next.who + ' ' + next.verb : 'nothing named') +
        '. No dispatch in this leg is outstanding. Dwell is a number, not a verdict: this room has a ' +
        'healthy leg of 3554s and a dead one of 3557s.' + limit
    };
  }

  /**
   * THE TOP-OF-WINDOW HALF OF THE RENDER — the four looks, and which tab wears them.
   *
   * WHY THIS EXISTS AT ALL, kept here because it is the whole lesson of the build: the pure view
   * below has been CORRECT since L025 while the keeper looked at the tab bar and saw nothing. The
   * chip mounted into `#chainchip`, a text row at the BOTTOM of the window in a status cluster
   * beside `ready` / `gate ask-each` / cost / hud, and the design — quoted in
   * loop/loop_indicator_design_2026-09-02.md, never restated — puts it at the TOP, on the tabs.
   * Every instrument was green over a display nobody could see. So the decision stays pure and
   * testable, and `renderTabs` is the only part that touches an element.
   *
   * The four looks are AMENDMENT 2's (4e0de97), quoted in that file, not paraphrased here.
   *
   * TWO RULES THAT ARE NOT OBVIOUS FROM THE LOOKS LIST:
   *
   *  1. POSITION COMES FROM `chain_state`, ARROW FROM THE RING — the librarian's L025 ruling,
   *     already implemented for the chip and simply carried up here. So the aura sits on the
   *     holder's tab even when a receipt is newer; the arrow is drawn from whichever source
   *     produced `next`.
   *  2. AN OPEN LAP THIS FILE CANNOT PLACE RENDERS `unknown`, NEVER DARK. AMENDMENT 2 narrows
   *     dark to exactly one meaning, so a holder word outside the station vocabulary must not
   *     borrow it — "the display cannot place the loop" is what the unknown look says, and that
   *     is precisely what an unmappable holder is. Without this, the drift of 2026-09-01 would
   *     have rendered as "no lap has ever opened" while a lap was plainly open.
   */
  function decorateTabs(view, chain, entries) {
    view.tab = null; view.tabLook = null; view.arrowTab = null;

    if (view.state === 'idle') return view;                       // dark, and it means one thing
    if (view.state === 'complete') {
      view.tabLook = 'complete';
      view.tab = 'librarian';   // the seat that closes the cycle; the amendment names it
      return view;
    }
    if (view.state === 'unknown' || view.state === 'unavailable' || view.state === 'blind') {
      view.tabLook = 'unknown';                                   // the three seats, dim-outlined
      return view;
    }

    // quiet | waiting | unconfirmed — some seat is holding a lap.
    var tab = chain && chain.open ? holderTab(chain.holder) : null;
    if (!tab) {
      var boardUsable = Array.isArray(entries) && !blindOpen(entries);
      var found = boardUsable ? latestHop(entries) : null;
      if (found) tab = positionTab(found.hop);
    }
    if (!tab) { view.tabLook = 'unknown'; return view; }           // rule 2 above

    view.tab = tab;
    view.tabLook = view.state === 'waiting' ? 'waiting' : 'working';
    // `unconfirmed` keeps the aura and loses the arrow — D1, kept from L025: a confident arrow on
    // a position the control plane could not confirm is worse than none. `view.arrow` is already
    // null there, so this needs no special case, only the comment saying it was not an oversight.
    view.arrowTab = view.arrow ? tabForWho(view.next && view.next.who) : null;
    if (view.arrowTab === view.tab) view.arrowTab = null;          // never point a tab at itself
    return view;
  }

  /** The whole render decision: the chip's view, plus which tab wears which look. */
  function chainView(entries, nowMs, opts) {
    opts = opts || {};
    var chain = opts.chain && typeof opts.chain === 'object' ? opts.chain : null;
    return decorateTabs(chainViewCore(entries, nowMs, opts), chain, entries);
  }

  // ---- wiring (browser only) ---------------------------------------------------------------

  function render(el, view) {
    if (!el) return;
    el.className = 'chain-' + view.state;
    var parts = [view.text];
    if (view.arrow) parts.push(view.arrow);
    if (view.elapsedMin != null) parts.push(view.elapsedMin + 'm');
    // `self_reported` is hardcoded true on every open lap in main.rs, so the flag is not noise —
    // it marks WHICH HALF of the chip is a claim. The position came from a row a seat wrote about
    // itself; the arrow, when the ring supplied it, is a control-plane receipt. `note` is not shown.
    if (view.selfReported) parts.push('(claimed)');
    // textContent, never innerHTML: a pane letter reaches here from the board, and the board is
    // written by instances. app.js:10 records what an unescaped board string cost this UI.
    el.textContent = parts.join(' ');
    el.title = view.why;
  }

  /** The three seat tabs, in the cycle's own order. Third Place is never lit — it is not a seat
   *  in the loop, and lighting it would be the one wrong answer the design names explicitly. */
  var SEAT_TABS = ['main', 'terminal', 'librarian'];
  var LOOK_CLASSES = ['chain-hold-working', 'chain-hold-waiting', 'chain-hold-complete', 'chain-hold-unknown'];

  /**
   * Paint the tab bar. DOM-only: every decision was made in `decorateTabs`.
   *
   * THE ARROW IS PLACED AGAINST THE DESTINATION, NOT THE HOLDER, and that is not a style choice.
   * The tabs are NOT in cycle order (Terminal, Orchestrator, Librarian, ... — the cycle is
   * orch -> panes -> lib -> orch), so an arrow parked beside the lit tab would point at whatever
   * happened to sit next to it and would be wrong two hops out of three. Anchoring it to the
   * destination and pointing INTO the destination is correct for every pair with no reordering of
   * a tab bar the keeper already has muscle memory for:
   *
   *     destination to the RIGHT of the holder  ->  arrow immediately BEFORE it, "->"
   *     destination to the LEFT  of the holder  ->  arrow immediately AFTER  it, "<-"
   */
  function renderTabs(nav, view) {
    if (!nav || !nav.children) return;
    var kids = Array.prototype.slice.call(nav.children);
    var btns = kids.filter(function (el) { return el.getAttribute && el.getAttribute('data-tab'); });
    var arrow = null;
    for (var a = 0; a < kids.length; a++) if (kids[a].id === 'chainarrow') arrow = kids[a];

    var lit = null, target = null, litIdx = -1, targetIdx = -1;
    for (var i = 0; i < btns.length; i++) {
      var name = btns[i].getAttribute('data-tab');
      for (var c = 0; c < LOOK_CLASSES.length; c++) btns[i].classList.remove(LOOK_CLASSES[c]);
      if (view.tabLook === 'unknown' && SEAT_TABS.indexOf(name) >= 0) {
        btns[i].classList.add('chain-hold-unknown');
      }
      if (name === view.tab) { lit = btns[i]; litIdx = i; }
      if (name === view.arrowTab) { target = btns[i]; targetIdx = i; }
    }
    if (view.tabLook && view.tabLook !== 'unknown' && lit) {
      lit.classList.add('chain-hold-' + view.tabLook);
    }

    if (!arrow) return;
    if (!lit || !target || target === lit) { arrow.hidden = true; return; }
    var right = targetIdx > litIdx;
    arrow.textContent = right ? '→' : '←';
    arrow.title = 'next in the loop: ' + (view.next ? view.next.who + ' ' + view.next.verb : target.getAttribute('data-tab'));
    arrow.hidden = false;
    // Re-seat it. Removing first keeps the index arithmetic honest when it is already in the nav.
    if (Array.prototype.indexOf.call(nav.children, arrow) >= 0) nav.removeChild(arrow);
    var after = null, seen = false;
    for (var k = 0; k < nav.children.length; k++) {
      if (nav.children[k] === target) { seen = true; if (right) { after = target; break; } continue; }
      if (seen) { after = nav.children[k]; break; }
    }
    if (after) nav.insertBefore(arrow, after); else nav.appendChild(arrow);
  }

  function start() {
    var el = typeof document !== 'undefined' && document.getElementById('chainchip');
    var nav = typeof document !== 'undefined' && document.getElementById('tabs');
    if (!el && !nav) return;

    var inv = function (cmd) {
      // Each source fails on its own. A dead board must not take the lap state down with it, and
      // vice versa — that is the whole point of having two: `chain_state` reads lap.jsonl from disk
      // and survives a relaunch, the ring carries the receipts and does not.
      return Promise.resolve()
        .then(function () { return window.__TAURI__.core.invoke(cmd); })
        .catch(function () { return null; });
    };

    var tick = function () {
      var letters = (typeof paneLetters !== 'undefined' && paneLetters) ? paneLetters : {};
      Promise.all([inv('get_board'), inv('chain_state')]).then(function (r) {
        var view = chainView(r[0], Date.now(), { letters: letters, chain: r[1] });
        render(el, view);
        renderTabs(nav, view);
      });
    };

    tick();
    setInterval(tick, CHAIN_POLL_MS);
  }

  var api = {
    readHop: readHop, latestHop: latestHop, nextHop: nextHop, chainView: chainView,
    blindOpen: blindOpen, paneLabel: paneLabel, positionLabel: positionLabel,
    outstanding: outstanding, confirmedReceipt: confirmedReceipt,
    holderArrow: holderArrow, holderTab: holderTab, tabForWho: tabForWho,
    render: render, renderTabs: renderTabs, start: start,
    SEAT_TABS: SEAT_TABS, LOOK_CLASSES: LOOK_CLASSES,
    ESCALATE_MIN: CHAIN_ESCALATE_MIN, POLL_MS: CHAIN_POLL_MS
  };

  root.ChainIndicator = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;

  // Autostart in the app; inert under node, where there is no document.
  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
    else start();
  }

})(typeof globalThis !== 'undefined' ? globalThis : this);
