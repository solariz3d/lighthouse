'use strict';
// next-move.js — L233 (pane B): THE BUTTON FOR THE PROPER NEXT MOVE GLOWS.
//
// The keeper, 2026-11-25 02:45: "before i restart, i like the idea of like, say if the proper thing to do is close consonance, the X
// will be golden resonant aura, but then if the proper move is to compact warm seats, that button will have the aura, just quality
// of life to help the user understand". He approved the mock (look B, a steady gold halo). Packet:
// exo_memory/loop/packet_next_move_glow_B_2026-11-25.md; brief: exo_memory/briefs/consonance_next_move_glow.md.
//
// The window's X is drawn by Windows (tauri.conf.json sets no `decorations`), so it cannot glow; ⟳ Restart in the top bar takes
// its place, shown only when a newer build is on disk.
//
// WHY HERE AND NOT IN tools/: the decision is read by the top bar and nowhere else, and the page applies it on every poll; a
// tools/ file would need the app to run node for a rule of four lines. The rule's inputs come from Rust (`next_move_facts`), each
// from the thing that already owns it: whats-live's "newer than the running process", the X's own reading of a working seat
// (`close_seat_gates`), and close-small.js's list. This file only decides and draws.
//
// THE RULE (the packet's, §1):
//   close-small lists a seat           -> 'compact'          (a newer build too: Restart shows dimmed; compacting needs the app open)
//   a newer build, no pane working     -> 'restart'
//   a newer build, a pane working      -> 'restart-waiting'  (Restart shown, dimmed, not glowing; its title names the pane)
//   else                               -> 'none'
// `newerBuild` must be exactly true: unknown never asks for a restart.
(function (root) {
  var GLOW_CLASS = 'next-move';
  var DIM_CLASS = 'dimmed';
  // How often the page asks Rust. A pane's gate and the exe's time are cheap reads; the compact list is cached in Rust for 60 s
  // (close-small.js reads every seat's transcript, ~175 ms), so this poll never reads it more often than its minutes can change.
  var POLL_MS = 5000;

  function nextMove(f) {
    f = f || {};
    var list = Array.isArray(f.compactList) ? f.compactList : [];
    if (list.length) return 'compact';
    if (f.newerBuild === true) return f.paneWorking ? 'restart-waiting' : 'restart';
    return 'none';
  }

  // Rust's facts (lists, for the titles) to the decision's three inputs.
  function decisionFacts(facts) {
    facts = facts || {};
    var working = Array.isArray(facts.working) ? facts.working : [];
    return { newerBuild: facts.newerBuild === true, paneWorking: working.length > 0, compactList: facts.compactList };
  }

  function plural(n, one, many) { return n + ' ' + (n === 1 ? one : many); }
  function thousands(n) { return typeof n === 'number' && n > 0 ? Math.round(n / 1000) + 'k' : '300k'; }

  // What each button shows: { compact: { glow, title|null }, restart: { shown, glow, dimmed, title } }. A null title means the
  // button's own (index.html's) title.
  function view(facts) {
    facts = facts || {};
    var move = nextMove(decisionFacts(facts));
    var built = facts.builtAt ? ' (' + facts.builtAt + ')' : '';
    var working = Array.isArray(facts.working) ? facts.working : [];
    var list = Array.isArray(facts.compactList) ? facts.compactList : [];
    var v = { move: move, compact: { glow: false, title: null }, restart: { shown: false, glow: false, dimmed: false, title: '' } };
    if (move === 'compact') {
      v.compact.glow = true;
      v.compact.title = plural(list.length, 'seat is', 'seats are') + ' over ' + thousands(facts.big) + ' and worked in the last ' +
        (facts.warmMin || 50) + ' minutes: compact them now';
    }
    if (facts.newerBuild === true) {
      v.restart.shown = true;
      if (move === 'restart') {
        v.restart.glow = true;
        v.restart.title = 'a newer Consonance is built' + built + ': restart to use it; every kept seat comes back where it was';
      } else if (move === 'restart-waiting') {
        v.restart.dimmed = true;
        v.restart.title = 'a newer Consonance is built' + built + '; ' + working.join(', ') + (working.length === 1 ? ' is' : ' are') +
          ' working, so restart when ' + (working.length === 1 ? 'it is' : 'they are') + ' done';
      } else {   // compact wins
        v.restart.dimmed = true;
        v.restart.title = 'a newer Consonance is built' + built + '; compact the warm seats first: compacting needs the app open';
      }
    }
    return v;
  }

  // Writes a view onto the two buttons. `compactTitle` is the Compact button's own title, put back when it is not the move.
  function apply(v, els, compactTitle) {
    if (els.compact) {
      els.compact.classList.toggle(GLOW_CLASS, !!v.compact.glow);
      els.compact.title = v.compact.title || compactTitle;
    }
    if (els.restart) {
      els.restart.hidden = !v.restart.shown;
      els.restart.classList.toggle(GLOW_CLASS, !!v.restart.glow);
      els.restart.classList.toggle(DIM_CLASS, !!v.restart.dimmed);
      els.restart.title = v.restart.title;
    }
  }

  // ── In the app ──────────────────────────────────────────────────────────────────────────────────────────────────────────
  function start() {
    var compact = document.getElementById('closesmall');
    var restart = document.getElementById('restartbtn');
    var ask = document.getElementById('restart-ask');
    if (!compact || !restart || !window.__TAURI__) return;
    var compactTitle = compact.title;
    var els = { compact: compact, restart: restart };
    var call = function (cmd, args) { return window.__TAURI__.core.invoke(cmd, args); };
    var E = function (s) { return escapeHtml(s == null ? '' : String(s)); };   // term.js's, loaded before this file

    var tick = function () {
      call('next_move_facts').then(function (f) { apply(view(f), els, compactTitle); }, function (e) {
        // Could not read the facts: nothing glows rather than an old glow staying on (a glow that is not the move is the
        // registered failure). Said in the console; the next tick tries again.
        console.warn('next_move_facts: ' + e);
        apply(view(null), els, compactTitle);
      });
    };

    function hideAsk() { ask.hidden = true; ask.querySelector('.stick-body').innerHTML = ''; }
    function note(html) { var n = ask.querySelector('#restart-note'); if (n) n.innerHTML = html; }
    function showAsk(working) {
      var labels = working.map(function (w) { return E(w.label || '(unnamed seat)'); });
      ask.querySelector('.stick-body').innerHTML =
        '<h2>' + plural(working.length, 'seat is', 'seats are') + ' working: ' + labels.join(', ') + '. Restart Consonance and end ' +
        (working.length === 1 ? 'it' : 'them') + '?</h2>' +
        '<p class="stick-muted">Every kept seat comes back with its conversation when the new Consonance opens, as at any launch; a turn in flight is cut off.</p>' +
        '<div class="stick-actions"><button id="restart-keep">Keep working</button><button id="restart-go">Restart</button></div>' +
        '<p id="restart-note"></p>';
      ask.hidden = false;
      var keep = ask.querySelector('#restart-keep');
      var go = ask.querySelector('#restart-go');
      var sent = false;
      keep.onclick = hideAsk;
      go.onclick = function () {
        if (sent) return;   // a double-click restarts once
        sent = true;
        note('Restarting…');
        call('restart_app', { force: true }).then(hideAsk, function (e) { sent = false; note('<span class="stick-bad">' + E(e) + '</span>'); });
      };
      keep.focus();
    }
    function showRefusal(e) {
      ask.querySelector('.stick-body').innerHTML = '<h2>Consonance did not restart.</h2><p class="stick-bad">' + E(e) + '</p>' +
        '<div class="stick-actions"><button id="restart-keep">Close</button></div>';
      ask.hidden = false;
      var keep = ask.querySelector('#restart-keep');
      keep.onclick = hideAsk;
      keep.focus();
    }
    document.addEventListener('keydown', function (ev) { if (ev.key === 'Escape' && !ask.hidden) { ev.preventDefault(); hideAsk(); } });

    var pressing = false;
    restart.addEventListener('click', function () {
      if (pressing) return;
      pressing = true;
      // Rust reads the seats again at the click: the asking is decided there, not from a poll that may be 5 s old.
      call('restart_app', { force: false }).then(function (r) {
        pressing = false;
        if (r && r.asked) showAsk(Array.isArray(r.working) ? r.working : []);
      }, function (e) {
        // Refused (Rust says why: closing already, compacting, no newer build, the helper did not start). Consonance stays open,
        // and the reason is shown where he pressed, not only in a title the next poll rewrites.
        pressing = false;
        showRefusal(e);
      });
    });

    tick();
    setInterval(tick, POLL_MS);
  }

  var api = { nextMove: nextMove, decisionFacts: decisionFacts, view: view, apply: apply, start: start,
    GLOW_CLASS: GLOW_CLASS, DIM_CLASS: DIM_CLASS, POLL_MS: POLL_MS };
  root.NextMove = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;

  // Autostart in the app; inert under node, where there is no document.
  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
    else start();
  }
})(typeof globalThis !== 'undefined' ? globalThis : this);
