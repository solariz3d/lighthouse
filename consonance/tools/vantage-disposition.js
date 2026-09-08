'use strict';

/* vantage-disposition.js — what happened to a vantage finding, said in a way a second reader can
 * check in one command.
 *
 * WIRED TO NOTHING. `second-vantage.js` does not require this file and no ledger is written by it.
 * This is the shape plus its proof; the wiring is a separate decision, priced in
 * `exo_memory/loop/registration_vantage_disposition_2026-09-08.md`.
 *
 * ── WHY NOT A BOOLEAN ───────────────────────────────────────────────────────────────────────────
 *
 * A `read: true` flag is a box someone ticks. It costs one keystroke, it has no second reader, and
 * once it exists "ticked" and "acted on" share a footprint — which is the defect it was proposed to
 * fix, rebuilt inside the fix. Every value below instead REQUIRES AN EXTERNAL REFERENT: a sha or a
 * path that either resolves or does not. That does not make lying impossible. It makes lying
 * CHECKABLE, in one command, by someone who is not the person who wrote the row.
 *
 *     fixed         <sha>    a commit that exists
 *     withdrawn     <path>   a file that exists
 *     declared-dead <sha|path> + a second required field (see below)
 *
 * ── THE THREE RULINGS THIS FILE ENCODES ─────────────────────────────────────────────────────────
 *
 * (a) WHEN IS THE REFERENT ENFORCED: at WRITE time and again in a CHECKER. Not at read time alone.
 *     Write-time rejection keeps an unresolvable disposition out of an append-only ledger, where it
 *     could never be edited out. The later checker exists because RESOLUTION IS NOT PERMANENT — a
 *     sha can be rebased away and a path can be deleted — so a row that was valid can stop being
 *     valid, and only a re-check notices. Read-time-only enforcement would reject the same row
 *     forever with nobody able to repair it.
 *
 * (b) `declared-dead` IS THE SOFT ONE, and a reason is free text by nature. So a reason is NEVER
 *     sufficient on its own: `declared-dead` additionally requires EITHER `superseded_by` (a sha or
 *     path, checked exactly like the others) OR `expires` (a date). A dead row with an `expires`
 *     REVERTS TO OPEN once that date passes — which turns "dead" from an assertion into a claim
 *     with a shelf life that re-surfaces if nobody renews it.
 *     HONEST LIMIT, named rather than hidden: someone can put a real sha next to a false claim, and
 *     nothing here detects that. What changed is that the sha is checkable by a second reader; the
 *     boolean never was. This is a floor, not a proof.
 *
 * (c) A ROW WITH NO DISPOSITION IS **OPEN**, never handled. Silence reading as handled is the exact
 *     footprint problem this field exists to fix, so `classify()` returns OPEN for absent, and
 *     `undispositioned()` exists so that OPEN is reachable BY A COMMAND rather than by reading the
 *     ledger and forming an impression.
 */

const KINDS = ['fixed', 'withdrawn', 'declared-dead'];

const SHA = /^[0-9a-f]{7,40}$/;

/* A referent is a sha or a repo-relative path. It is never free text, and "looks like prose" is
 * not the test — the test is that it RESOLVES against the world, which the resolver answers. The
 * shape check below only decides WHICH resolver question to ask. */
function referentShape(ref) {
  if (typeof ref !== 'string' || ref.trim() === '') return null;
  const r = ref.trim();
  if (SHA.test(r)) return 'sha';
  // A path must look like a path: at least one separator or a dot-extension, no whitespace.
  if (/\s/.test(r)) return null;
  if (r.includes('/') || r.includes('\\') || /\.[A-Za-z0-9]{1,8}$/.test(r)) return 'path';
  return null;
}

function resolves(ref, resolver) {
  const shape = referentShape(ref);
  if (shape === 'sha') return { shape, ok: !!resolver.shaExists(ref.trim()) };
  if (shape === 'path') return { shape, ok: !!resolver.pathExists(ref.trim()) };
  return { shape: null, ok: false };
}

/**
 * Validate a disposition. Called at WRITE time, and again by the checker.
 * `now` is injected so the expiry rule is testable without waiting.
 */
function validate(d, resolver, now) {
  if (d === undefined || d === null) return { ok: false, reason: 'absent' };
  if (typeof d !== 'object') return { ok: false, reason: 'not an object' };
  if (!KINDS.includes(d.kind)) return { ok: false, reason: `unknown kind: ${String(d.kind)}` };

  const r = resolves(d.ref, resolver);
  if (r.shape === null) return { ok: false, reason: 'referent is not a sha or a path (free text is never a referent)' };
  if (!r.ok) return { ok: false, reason: `referent does not resolve: ${String(d.ref).trim()}` };
  if (d.kind === 'fixed' && r.shape !== 'sha') return { ok: false, reason: 'fixed: requires a sha' };
  if (d.kind === 'withdrawn' && r.shape !== 'path') return { ok: false, reason: 'withdrawn: requires a path' };

  if (d.kind === 'declared-dead') {
    // (b): a reason alone is never enough.
    const hasSuperseded = referentShape(d.superseded_by) !== null;
    const hasExpiry = typeof d.expires === 'string' && !Number.isNaN(Date.parse(d.expires));
    if (!hasSuperseded && !hasExpiry) {
      return { ok: false, reason: 'declared-dead: needs superseded_by (sha|path) or expires (date) — a reason is not checkable' };
    }
    if (hasSuperseded) {
      const s = resolves(d.superseded_by, resolver);
      if (!s.ok) return { ok: false, reason: `superseded_by does not resolve: ${String(d.superseded_by).trim()}` };
    }
  }
  return { ok: true, reason: '' };
}

/**
 * OPEN | DISPOSITIONED | INVALID — and ABSENT IS OPEN, which is the whole point of (c).
 * An expired `declared-dead` reverts to OPEN so a dead row re-surfaces if nobody renews it.
 */
function classify(row, resolver, now) {
  const d = row && row.disposition;
  if (d === undefined || d === null) return 'OPEN';
  const v = validate(d, resolver, now);
  if (!v.ok) return 'INVALID';
  if (d.kind === 'declared-dead' && typeof d.expires === 'string') {
    const at = now instanceof Date ? now : new Date(now || Date.now());
    if (Date.parse(d.expires) <= at.getTime()) return 'OPEN';
  }
  return 'DISPOSITIONED';
}

/** (c) OPEN reachable BY A COMMAND. Absent and expired both land here. */
function undispositioned(rows, resolver, now) {
  return (rows || []).filter((r) => classify(r, resolver, now) === 'OPEN');
}

/** The later half of (a): re-check rows whose referent may have stopped resolving. */
function recheck(rows, resolver, now) {
  const out = [];
  for (const r of rows || []) {
    if (!r || !r.disposition) continue;
    const v = validate(r.disposition, resolver, now);
    if (!v.ok) out.push({ id: r.id, reason: v.reason });
  }
  return out;
}

/** Real-world resolver. Injected in tests so the unit needs neither git nor a working tree. */
function gitResolver(repoRoot) {
  const cp = require('child_process');
  const fs = require('fs');
  const path = require('path');
  return {
    shaExists(s) {
      const r = cp.spawnSync('git', ['cat-file', '-e', s + '^{commit}'], { cwd: repoRoot });
      return r.status === 0;
    },
    pathExists(p) {
      try { return fs.existsSync(path.resolve(repoRoot, p)); } catch { return false; }
    },
  };
}

module.exports = { KINDS, referentShape, validate, classify, undispositioned, recheck, gitResolver };
