// leave.js — THE CLOSE WINDOW. P-LEAVE (D063), pane E.
// Packet: exo_memory/loop/packet_leave_window_2026-09-14.md §2.2 and §2.6, with §2.7 overriding.
//
// The keeper, verbatim: "could we do like an actual tauri window or something that looks like consonance as the
// terminal window that tells you its okay to remove stick after close?"
//
// §2.6: the main window itself, not a second OS window and never a console. It covers everything — the seats are
// already ended when it shows, and it sits above the intro too, since a close can come at any moment.
//
// It only SHOWS. Rust decides everything and says so on the `leave` event:
//   { phase: 'saving', folder }                          the save is running — don't unplug
//   { phase: 'busy' }                                    a second close request while the save runs
//   { phase: 'result', result, write_error, can_exit }   DONE or NOT DONE, and the button once the result is written
//   { phase: 'use-button' }                              a close request after the result: the button is the way out
// A close with no stick never raises it: Consonance exits as it did before.
//
// Loaded after term.js: it calls term.js's `inv` and `escapeHtml`. One function scope, no top-level binding.
(function () {
  'use strict';

  const root = document.getElementById('leave');
  if (!root) return;
  const body = root.querySelector('.stick-body');
  const E = (s) => escapeHtml(s == null ? '' : String(s));

  function note(html) {
    const n = body.querySelector('#leave-note');
    if (n) n.innerHTML = html;
  }

  function saving(p) {
    root.hidden = false;
    body.innerHTML = `
      <h2>Saving to the stick — don't unplug it yet</h2>
      <p><code>${E(p.folder)}</code></p>
      <p class="stick-muted">Every seat has been closed. Consonance tells you here when the stick can come out.</p>
      <p id="leave-note"></p>`;
  }

  function stopsTable(rows) {
    const stops = (rows || []).filter((r) => r.stops);
    if (!stops.length) return '';
    return `<table class="stick-table"><tr><th>seat</th><th>stopped</th><th>why</th></tr>${stops
      .map((r) => `<tr><td>${E(r.seat)}</td><td>${E(r.reason || r.verdict)}</td><td>${E(r.why || '')}</td></tr>`)
      .join('')}</table>`;
  }

  function result(p) {
    root.hidden = false;
    const r = p.result || {};
    const done = r.outcome === 'DONE';
    const reasons = done || !r.why ? '' : `<ul class="stick-bad">${String(r.why).split('; ').map((w) => `<li>${E(w)}</li>`).join('')}</ul>`;
    body.innerHTML = `
      ${done
        ? `<h2>Saved — you can unplug it now</h2><p><code>${E(r.stick)}</code></p>`
        : `<h2 class="stick-bad">NOT DONE — the stick does not have everything</h2>${r.stick ? `<p><code>${E(r.stick)}</code></p>` : ''}`}
      ${reasons}
      ${done ? '' : stopsTable(r.rows)}
      ${p.write_error ? `<p class="stick-bad">The result could not be written yet: ${E(p.write_error)} — trying again.</p>` : ''}
      <div class="stick-actions">${p.can_exit ? '<button id="leave-close">Close Consonance</button>' : ''}</div>
      <p id="leave-note"></p>`;
    const b = body.querySelector('#leave-close');
    if (b) {
      b.onclick = async () => {
        try {
          await inv('leave_exit');
        } catch (e) {
          note(`<span class="stick-bad">${E(e)}</span>`);
        }
      };
    }
  }

  window.__TAURI__.event.listen('leave', (e) => {
    const p = e.payload || {};
    if (p.phase === 'saving') return saving(p);
    if (p.phase === 'result') return result(p);
    // A second close before the screen exists is the seats still ending, and may yet be a no-stick close, which shows
    // nothing (§2.2 step 2): so it adds nothing either.
    if (p.phase === 'busy') return note('The save is still running. Consonance closes when it is done and you press Close.');
    if (p.phase === 'use-button') return note('Use Close Consonance below.');
  });
})();
