// close-small.js — "COMPACT WARM SEATS", named "Close for the night" until L218 (L212, pane B; exo_memory/loop/packet_l212_close_small_B_2026-11-21.md).
//
// His words, 2026-11-21 00:23: "we could make our own wiring for auto compacts at close".
//
// The button shows the list FIRST: every seat, its last call, its context, and whether the close would cut it (warm AND large:
// last call under 50 minutes old, context over 300k) or skip it, with the reason. Nothing is cut until he presses the cut button
// on that list. The click sends the list's token; Rust takes the list, checks it, and cuts only the seats that were on it and are
// still warm and large (close_small.rs). Each cut seat is first asked to write where it stands; the progress arrives on the
// `close-small` event, one line a seat.
//
// Loaded after term.js: it calls term.js's `inv` and `escapeHtml`. One function scope, no top-level binding.
(function () {
  'use strict';

  const root = document.getElementById('close-small');
  const btn = document.getElementById('closesmall');
  if (!root || !btn) return;
  const body = root.querySelector('.stick-body');
  const E = (s) => escapeHtml(s == null ? '' : String(s));
  const k = (n) => (n == null ? '?' : `${Math.round(n / 1000)}k`);
  let clicked = false;

  function hide() { if (!clicked) root.hidden = true; }

  function show(list) {
    const seats = list.seats || [];
    const cut = seats.filter((s) => s.action === 'cut');
    const rows = seats.map((s) => `<tr class="${s.action === 'cut' ? 'cs-cut' : 'cs-skip'}">
        <td><b>${E(s.name)}</b></td><td>${s.ageMin == null ? '-' : `${E(s.ageMin)} min ago`}</td><td>${E(k(s.context))}</td>
        <td>${s.action === 'cut' ? 'CUT' : 'skip'}</td><td class="stick-muted">${E(s.reason)}</td></tr>`).join('');
    body.innerHTML = `
      <h2>Compact warm seats</h2>
      <p class="stick-muted">A seat is cut only when its last call is under ${E(list.warmMin)} minutes old AND its context is over ${E(k(list.big))}.
        A cold seat is never cut: compacting it would read its whole context uncached. Each cut seat is first asked to write where it stands.</p>
      <table class="cs-table"><tr><th>seat</th><th>last call</th><th>context</th><th></th><th>why</th></tr>${rows}</table>
      <p>
        <button id="cs-go" class="btn accent" ${cut.length ? '' : 'disabled'}>Cut these ${cut.length} seat${cut.length === 1 ? '' : 's'}</button>
        <button id="cs-cancel" class="btn">Cancel</button>
      </p>
      <p id="cs-note" class="stick-muted"></p>`;
    body.querySelector('#cs-cancel').onclick = hide;
    const go = body.querySelector('#cs-go');
    go.onclick = async () => {
      if (clicked) return;
      clicked = true;
      go.disabled = true;
      body.querySelector('#cs-cancel').disabled = true;
      const note = body.querySelector('#cs-note');
      try {
        const said = await inv('close_small_confirm', { token: list.token });
        // The run's own view replaces the list; the ledger's rows (the `close-small` event) fill it in.
        running(said);
        try { const p = await inv('close_small_progress'); if (p) render(p); } catch (_) { /* the event carries it */ }
      } catch (e) {
        clicked = false;
        note.innerHTML = `Nothing was cut: ${E(e)}`;
        body.querySelector('#cs-cancel').disabled = false;
      }
    };
  }

  // ---- L221 (B): THE RUN, SEAT BY SEAT. His words, 07:05: "it takes too long, and has no indication of the process or that its not
  // done or done so it was confusing, maybe wire in an ability to see the progress of each pane being cut". Rust reads the run from
  // its ledger (close_small.rs `progress`) and sends it whole on every row; this only draws it. One line a seat, one line for the run,
  // and at the end "Done: …" stays until he closes it.
  const WORDS = {
    waiting: () => 'waiting its turn',
    asked: (s) => `asked to write where it stands${s.detail ? ` (${s.detail})` : ''}`,
    answering: () => 'writing where it stands; the cut waits for that turn to end',
    compacting: (s) => `compacting, ${secondsSince(s.since)} s so far`,
    done: (s) => `done: ${String(s.detail).replace(/^cut: /, '')}`,
    skipped: (s) => `skipped: ${s.detail}`,
    failed: (s) => `failed: ${String(s.detail).replace(/^NOT cut: /, '')}`,
  };
  const secondsSince = (t) => { const ms = Date.parse(t); return Number.isFinite(ms) ? Math.max(0, Math.round((Date.now() - ms) / 1000)) : '?'; };
  let last = null;     // the run as last drawn
  let ticking = null;  // redraws the compaction's seconds while a seat is compacting

  function running(said) {
    body.innerHTML = `
      <h2>Compact warm seats</h2>
      <p class="stick-muted">${E(said || '')}</p>
      <p id="cs-summary" class="cs-summary">Starting…</p>
      <table class="cs-table" id="cs-progress"></table>
      <p id="cs-end"></p>`;
  }

  function render(p) {
    if (!p || !Array.isArray(p.seats)) return;
    last = p;
    if (!body.querySelector('#cs-progress')) running('');
    body.querySelector('#cs-summary').innerHTML = `<b>${E(p.summary)}</b>`;
    body.querySelector('#cs-progress').innerHTML = `<tr><th>seat</th><th>where it is</th></tr>` + p.seats.map((s) => {
      const say = WORDS[s.state] || ((x) => `${x.state}: ${x.detail}`);
      return `<tr class="cs-${E(s.state)}"><td><b>${E(s.name)}</b></td><td>${E(say(s))}</td></tr>`;
    }).join('');
    const compacting = !p.finished && p.seats.some((s) => s.state === 'compacting');
    if (compacting && !ticking) ticking = setInterval(() => { if (last) render(last); }, 1000);
    if (!compacting && ticking) { clearInterval(ticking); ticking = null; }
    const end = body.querySelector('#cs-end');
    if (p.finished) {
      clicked = false;
      if (!body.querySelector('#cs-close')) {
        end.innerHTML = '<button class="btn" id="cs-close">Close</button>';
        body.querySelector('#cs-close').onclick = () => { root.hidden = true; };
      }
    } else {
      clicked = true;
      end.innerHTML = '<span class="stick-muted">The seats are cut at once. Closing this view does not stop the run.</span> <button class="btn" id="cs-hide">Hide</button>';
      body.querySelector('#cs-hide').onclick = () => { root.hidden = true; };
    }
  }

  btn.addEventListener('click', async () => {
    if (clicked) { root.hidden = false; if (last) render(last); return; }
    root.hidden = false;
    // A run still going (the screen was reloaded mid-run) is shown, never a new list over it.
    try { const p = await inv('close_small_progress'); if (p && !p.finished) { running(''); render(p); return; } } catch (_) { /* show the list */ }
    body.innerHTML = '<h2>Compact warm seats</h2><p class="stick-muted">Reading every seat…</p>';
    try { show(await inv('close_small_plan')); }
    catch (e) { body.innerHTML = `<h2>Compact warm seats</h2><p>The list could not be made: ${E(e)}</p><p><button class="btn" id="cs-cancel">Close</button></p>`;
      body.querySelector('#cs-cancel').onclick = hide; }
  });

  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !root.hidden) hide(); });

  // Every ledger row of a run arrives here as the whole run (L221). A run that ends while the view is hidden shows itself, so
  // "Done" is seen.
  window.__TAURI__.event.listen('close-small', (e) => {
    const p = e.payload;
    if (!p || !Array.isArray(p.seats)) return;
    if (p.finished) root.hidden = false;
    render(p);
  });
})();
