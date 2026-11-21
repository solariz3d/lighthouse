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
        note.innerHTML = `${E(await inv('close_small_confirm', { token: list.token }))}<ul id="cs-progress"></ul>`;
      } catch (e) {
        clicked = false;
        note.innerHTML = `Nothing was cut: ${E(e)}`;
        body.querySelector('#cs-cancel').disabled = false;
      }
    };
  }

  btn.addEventListener('click', async () => {
    if (clicked) { root.hidden = false; return; }
    root.hidden = false;
    body.innerHTML = '<h2>Compact warm seats</h2><p class="stick-muted">Reading every seat…</p>';
    try { show(await inv('close_small_plan')); }
    catch (e) { body.innerHTML = `<h2>Compact warm seats</h2><p>The list could not be made: ${E(e)}</p><p><button class="btn" id="cs-cancel">Close</button></p>`;
      body.querySelector('#cs-cancel').onclick = hide; }
  });

  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !root.hidden) hide(); });

  window.__TAURI__.event.listen('close-small', (e) => {
    const p = e.payload || {};
    const ul = body.querySelector('#cs-progress');
    if (p.done) {
      clicked = false;
      if (ul) ul.insertAdjacentHTML('afterend', '<p>Done. <button class="btn" id="cs-close">Close</button></p>');
      const c = body.querySelector('#cs-close');
      if (c) c.onclick = () => { root.hidden = true; };
      return;
    }
    if (ul) ul.insertAdjacentHTML('beforeend', `<li>${E(p.pane ? p.pane.slice(0, 8) : '?')}: ${E(p.outcome)}</li>`);
  });
})();
