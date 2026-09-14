// stick.js — THE SETUP WINDOW FOR THE TRANSFER. L059, pane E.
// Packet: exo_memory/loop/packet_stick_build_2026-09-14.md §1 (Call 1), §2, §3.
//
// The keeper, verbatim: "if it doesnt [need to rebuild], it does the intro, but then loads a prior
// window that shows like a setup for tranfering the transcripts from thumbdrive."
//
// So this window sits UNDER the intro overlay (z-index below it) and is revealed as the intro fades. It
// opens only when the launch HELD the seats for the stick (`stick_state().held`), which on a launch with
// no stick, no waiting applier and no result is never — that path does not reach anything below.
//
// THIS WINDOW IS THE ONLY SURFACE. The applier has no window and says nothing; what it did is read back
// here by the relaunched app (`result`), and what is left is shown by re-rehearsing the real state.
//
// Loaded after term.js: it calls term.js's `inv`, `escapeHtml`, `setStatus` and `restoreKeptPanes`.
// Everything is inside one function scope, so it adds no top-level binding to the shared script scope
// (scripts-load.test.js is why that matters).
(function () {
  'use strict';

  const root = document.getElementById('stick-setup');
  if (!root) return;
  const body = root.querySelector('.stick-body');
  const E = (s) => escapeHtml(s == null ? '' : String(s));

  function show() { root.hidden = false; }
  function hide() { root.hidden = true; }
  function say(html) { body.innerHTML = html; }

  /** One row's first timestamp, or "unknown" — never guessed (§3, E-3). */
  function when(ts) { return ts ? E(ts) : '<span class="stick-unknown">unknown</span>'; }

  async function release(keep) {
    try {
      await inv('stick_release', { keep });
    } catch (e) {
      say(`<p class="stick-bad">The seats could not be released: ${E(e)}</p>`);
      return;
    }
    hide();
    setStatus('transfer window closed — seats waking');
    try { await restoreKeptPanes(); } catch (_) { /* restoreKeptPanes names its own failures */ }
  }

  function renderLive(h) {
    say(`
      <h2>A transfer is waiting for this window to close</h2>
      <p>The applier (pid ${E(h.pid)}) is waiting to carry the stick${h.stick ? ` at <code>${E(h.stick)}</code>` : ''}.
         It cannot write while Consonance is open, and no second transfer is started.</p>
      <p>Close Consonance. It will reopen on its own when the transfer is done, and show what it did.</p>
      <div class="stick-actions"><button id="stick-close">Close Consonance</button></div>`);
    body.querySelector('#stick-close').onclick = () => inv('stick_close_app');
  }

  function renderResult(result) {
    if (!result) return '';
    if (result.unreadable) return `<section><h3>The last transfer</h3><p class="stick-bad">Its result file could not be read: ${E(result.unreadable)}</p></section>`;
    const rows = (result.rows || []).map((r) => `
      <tr><td>${E(r.seat)}</td><td>${E(r.verdict)}</td><td>${E(r.reason || '')}</td>
          <td>${r.result ? (r.result.ok ? 'written' : 'NOT written: ' + E(r.result.why)) : ''}</td></tr>`).join('');
    const code = { 0: 'done', 1: 'a seat refused', 2: 'could not run', 3: 'crashed part-way — seats may be half-carried' }[result.code];
    return `<section><h3>The last transfer — exit ${E(result.code)} (${E(code || 'unknown code')}), ${E(result.at || '')}</h3>
      <table class="stick-table"><tr><th>seat</th><th>verdict</th><th>reason</th><th>result</th></tr>${rows}</table>
      <p>What is still left is shown below, read again from the stick and this machine as they are now.</p></section>`;
  }

  function renderVerify(v) {
    if (!v || v.unavailable) return `<p class="stick-bad">The transfer set could not be checked: ${E(v && v.unavailable)}</p>`;
    if (v.code === 0 && v.layout === 'older') return `<p>An <b>older stick layout</b>: a ledger and no MANIFEST. It carries; the next Leave writes its manifest.</p>`;
    if (v.code === 0) return `<p>The transfer set verifies.</p>`;
    const list = (label, xs) => (xs && xs.length ? `<p>${label}:</p><ul>${xs.map((m) => `<li><code>${E(typeof m === 'string' ? m : m.path)}</code></li>`).join('')}</ul>` : '');
    return `<div class="stick-bad"><p>The transfer set does NOT verify (exit ${E(v.code)}).</p>${list('Missing', v.missing)}${list('Mismatched', v.mismatched)}</div>`;
  }

  function choiceCell(r, offer) {
    if (!offer) return '';
    const n = `stick-choice-${E(r.sid)}`;
    if (offer.kept) return `<span>kept on this machine for this carry</span>`;
    const take = offer.take_offered
      ? `<label><input type="radio" name="${n}" value="take" ${offer.default === 'take' ? 'checked' : ''}> take the stick's</label>`
      : `<span class="stick-muted">take not possible</span>`;
    const keep = `<label><input type="radio" name="${n}" value="keep" ${offer.default === 'keep' || !offer.take_offered ? 'checked' : ''}> keep this machine's</label>`;
    return `${take}<br>${keep}<div class="stick-why">${E(offer.why)}</div>`;
  }

  function renderRehearsal(state, reh) {
    const imp = reh.import || {};
    const exp = reh.export || {};
    const offers = reh.offers || {};
    const rows = (imp.rows || []).map((r) => `
      <tr data-sid="${E(r.sid)}" data-exported="${E(r.exportedAt || '')}" data-verdict="${E(r.verdict)}">
        <td>${E(r.seat)}</td><td>${E(r.kind)}</td>
        <td>${E(r.verdict)}${r.reason ? `<br><span class="stick-muted">${E(r.reason)}</span>` : ''}</td>
        <td>${r.bytes ? E(r.bytes) + ' B' : ''}</td>
        <td>${when(r.localFirstTimestamp)}</td>
        <td>${when(r.carriedFirstTimestamp)}</td>
        <td>${r.verdict === 'INTERRUPTED' ? `<label><input type="checkbox" class="stick-repair"> repair</label>` : choiceCell(r, offers[r.sid])}
            ${r.why && !offers[r.sid] ? `<div class="stick-why">${E(r.why)}</div>` : ''}</td>
      </tr>`).join('');
    const behind = (exp.rows || []).filter((r) => r.carries);
    // Carry only when the applier would change something: a seat that carries, a choice to make, or a
    // repair to offer. Otherwise Carry would close and reopen Consonance for nothing.
    const actionable = (imp.rows || []).some((r) => r.carries || offers[r.sid] || r.verdict === 'INTERRUPTED');
    say(`
      <h2>Transfer from the stick</h2>
      <p class="stick-muted"><code>${E(reh.folder)}</code></p>
      ${renderResult(state.result)}
      ${renderVerify(reh.verify)}
      ${imp.unavailable ? `<p class="stick-bad">The carry could not be rehearsed: ${E(imp.unavailable)}</p>` : `
      <table class="stick-table">
        <tr><th>seat</th><th>kind</th><th>the stick would</th><th>bytes</th>
            <th>this machine's conversation began</th><th>the stick's conversation began</th><th>choice</th></tr>
        ${rows}
      </table>`}
      ${exp.unavailable ? `<p class="stick-bad">Whether the stick is behind this machine could not be checked: ${E(exp.unavailable)}</p>` : ''}
      ${behind.length ? `<p class="stick-warn"><b>The stick does not have your last session</b> for: ${behind.map((r) => E(r.seat)).join(', ')}.
          Nothing is lost on this machine; the next Leave carries it.</p>` : ''}
      ${state.applier_on_disk ? '' : `<p class="stick-bad">The applier (<code>dev/stick-apply.js</code>) is not on disk in this build, so a transfer cannot start from here.</p>`}
      <div class="stick-actions">
        <button id="stick-carry" ${state.applier_on_disk && !imp.unavailable && actionable ? '' : 'disabled'}>Carry, and reopen Consonance</button>
        <button id="stick-continue">Continue without carrying</button>
      </div>
      <p id="stick-msg"></p>`);

    const picks = () => {
      const retire_far = [], keep = [], repair = [];
      for (const tr of body.querySelectorAll('tr[data-sid]')) {
        const sid = tr.dataset.sid;
        const chosen = tr.querySelector('input[type=radio]:checked');
        if (chosen && chosen.value === 'take') retire_far.push(sid);
        if (chosen && chosen.value === 'keep') keep.push({ sid, exported_at: tr.dataset.exported });
        const rep = tr.querySelector('.stick-repair');
        if (rep && rep.checked) repair.push(sid);
      }
      return { retire_far, keep, repair };
    };
    const msg = (html) => { const m = body.querySelector('#stick-msg'); if (m) m.innerHTML = html; };

    body.querySelector('#stick-carry').onclick = async () => {
      const p = picks();
      msg('Starting the transfer — Consonance closes once the applier has said it started.');
      for (const b of body.querySelectorAll('button')) b.disabled = true;
      try {
        await inv('stick_start_applier', { folder: reh.folder, retire_far: p.retire_far, repair: p.repair, keep: p.keep });
      } catch (e) {
        // §2: absent handshake -> does NOT exit; the reason, by name, and the window stays.
        msg(`<span class="stick-bad">${E(e)}</span>`);
        for (const b of body.querySelectorAll('button')) b.disabled = false;
      }
    };
    body.querySelector('#stick-continue').onclick = async () => {
      if (state.result) { try { await inv('stick_ack_result'); } catch (_) { /* named on the next launch */ } }
      await release(picks().keep);
    };
  }

  async function rehearse(state, folder) {
    say(`<h2>Transfer from the stick</h2><p>Reading <code>${E(folder)}</code> — nothing is written.</p>`);
    let reh;
    try {
      reh = await inv('stick_rehearse', { folder });
    } catch (e) {
      say(`<h2>Transfer from the stick</h2><p class="stick-bad">The stick could not be read: ${E(e)}</p>
        <div class="stick-actions"><button id="stick-continue">Continue without carrying</button></div>`);
      body.querySelector('#stick-continue').onclick = () => release([]);
      return;
    }
    // Nothing for the keeper to see: close on its own and let the seats wake.
    if (reh.quiet && !state.result) { await release([]); return; }
    renderRehearsal(state, reh);
  }

  function renderMany(state) {
    say(`
      <h2>More than one stick folder</h2>
      <p>None is picked for you. Choose the one to carry from:</p>
      <ul>${state.folders.map((f, i) => `<li><button data-i="${i}">${E(f.folder)}</button> <span class="stick-muted">${E(f.layout)} layout</span></li>`).join('')}</ul>
      <div class="stick-actions"><button id="stick-continue">Continue without carrying</button></div>`);
    for (const b of body.querySelectorAll('button[data-i]')) b.onclick = () => rehearse(state, state.folders[Number(b.dataset.i)].folder);
    body.querySelector('#stick-continue').onclick = () => release([]);
  }

  function renderResultOnly(state) {
    say(`<h2>Transfer from the stick</h2>${renderResult(state.result)}
      <p>The stick is not plugged in, so nothing further can be checked.</p>
      <div class="stick-actions"><button id="stick-continue">OK — wake the seats</button></div>`);
    body.querySelector('#stick-continue').onclick = async () => {
      try { await inv('stick_ack_result'); } catch (_) { /* named on the next launch */ }
      await release([]);
    };
  }

  async function open() {
    let state;
    try { state = await inv('stick_state'); } catch (_) { return; }
    if (!state || !state.held) return;
    show();
    if (state.handshake && state.handshake.state === 'live') return renderLive(state.handshake);
    if (state.stick === 'many') return renderMany(state);
    if (state.stick === 'one') return rehearse(state, state.folders[0].folder);
    return renderResultOnly(state);
  }

  open();
})();
