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
//   { phase: 'publishing', result }                      D133: the stick result is written; close.js is publishing
//   { phase: 'result', result, publish, ..., can_exit }  D133: the same result, now with the publish outcome (null
//                                                        when none was attempted — the unattended path)
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

  // D134, pane E: THE PUBLISH OUTCOME, beside the stick result. Contract: main.rs `publish_outcome` (A, D133) —
  // PUBLISHED {branch, from, to} · UNCHANGED {at} · CLOSED · REFUSED {code} · TIMED_OUT · FAILED, each with `text`; null or
  // absent when no publish was attempted, which renders NOTHING (never a blank that reads as success). The keeper reads
  // this as he leaves, so each line says only what its outcome proves. A refusal never stops the app closing (A §1).
  const DIVERGED = /REFUSED_DIVERGED|DIVERGED — \d+ travelling/;
  const DIVERGED_FILE = /^\s*(\S+)\s+(\d+) row\(s\) only in the state copy/gm;
  const verbatim = (t) => (t ? `<pre class="stick-muted">${E(t)}</pre>` : '');
  const stillCloses = '<p class="stick-muted">Consonance still closes normally, and the stick result above stands.</p>';

  function diverged(text) {
    const files = [...String(text).matchAll(DIVERGED_FILE)];
    // B's divergenceRefusal names each file with its count; close.js relays only the receipt's outcome (hand-back §2), so
    // the list is shown when it arrived and pointed to when it did not. A count is never guessed.
    const which = files.length
      ? `<ul class="stick-bad">${files.map((m) => `<li><code>${E(m[1])}</code>: ${E(m[2])} row(s) this machine does not have</li>`).join('')}</ul>`
      : '<p>Which files, and how many rows each, is listed under <code>files</code> in <code>state-sync.push.json</code> in the data folder.</p>';
    return `<p>This machine lacks rows that the saved state already holds, most likely written on the other machine.
      Publishing now would drop them, so nothing was pushed.</p>
      ${which}
      <p>Union those rows into this machine first (<code>node consonance/tools/ledger-union.js --write --file &lt;file&gt;</code>),
      then close again to publish.</p>`;
  }

  function publishHtml(pub) {
    if (pub == null || typeof pub !== 'object') return '';
    const o = pub.outcome;
    if (o === 'PUBLISHED') {
      return `<h3>CLOSED — this machine's state is published</h3>
        <p><code>${E(pub.branch)}</code> moved <code>${E(pub.from || '(none)')}</code> → <code>${E(pub.to)}</code> on the remote.</p>`;
    }
    if (o === 'UNCHANGED') {
      return `<h3>CLOSED — nothing new to publish</h3><p>The remote already holds <code>${E(pub.at)}</code>.</p>`;
    }
    if (o === 'CLOSED') {
      return `<h3>CLOSED — close.js finished, without saying what it published</h3>${verbatim(pub.text)}`;
    }
    if (o === 'REFUSED') {
      return `<h3 class="stick-bad">NOT CLOSED — this machine's state was not published</h3>
        ${DIVERGED.test(String(pub.text || '')) ? diverged(pub.text) : ''}${verbatim(pub.text)}${stillCloses}`;
    }
    if (o === 'TIMED_OUT') {
      return `<h3 class="stick-bad">NOT CLOSED — the publish did not finish in time and was stopped</h3>
        <p>Nothing is confirmed published.</p>${verbatim(pub.text)}${stillCloses}`;
    }
    if (o === 'FAILED') {
      return `<h3 class="stick-bad">NOT CLOSED — the publish could not run</h3>${verbatim(pub.text)}${stillCloses}`;
    }
    return `<h3 class="stick-bad">Publish outcome not recognised: ${E(o)}</h3>
      <p>This window cannot say whether anything was published.</p>${verbatim(pub.text)}`;
  }

  function result(p) {
    root.hidden = false;
    const publishing = p.phase === 'publishing'
      ? '<p id="leave-publishing">Publishing this machine\'s state to the remote. The stick step is finished (above); Close Consonance appears when the publish is done — up to 15 minutes.</p>'
      : '';
    const r = p.result || {};
    const done = r.outcome === 'DONE';
    const reasons = done || !r.why ? '' : `<ul class="stick-bad">${String(r.why).split('; ').map((w) => `<li>${E(w)}</li>`).join('')}</ul>`;
    body.innerHTML = `
      ${done
        ? `<h2>Saved — you can unplug it now</h2><p><code>${E(r.stick)}</code></p>`
        : `<h2 class="stick-bad">NOT DONE — the stick does not have everything</h2>${r.stick ? `<p><code>${E(r.stick)}</code></p>` : ''}`}
      ${reasons}
      ${done ? '' : stopsTable(r.rows)}
      ${publishing}${publishHtml(p.publish)}
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
    if (p.phase === 'result' || p.phase === 'publishing') return result(p);
    // A second close before the screen exists is the seats still ending, and may yet be a no-stick close, which shows
    // nothing (§2.2 step 2): so it adds nothing either.
    if (p.phase === 'busy') return note('The save is still running. Consonance closes when it is done and you press Close.');
    if (p.phase === 'use-button') return note('Use Close Consonance below.');
  });
})();
