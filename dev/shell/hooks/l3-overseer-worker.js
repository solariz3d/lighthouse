#!/usr/bin/env node
// L3 overseer worker — runs detached from the hook. Reads a job file
// (multi-turn user trajectory), builds the L3 overseer prompt (WELFARE.md
// discipline + trajectory view), pipes to `claude -p` via stdin, parses the
// trajectory verdict, appends a structured event to the L3 overseer log,
// deletes the job file.
//
// Invoked: node l3-overseer-worker.js <jobfile>
// Inherits CLAUDE_OVERSEER_RUN=1 so its own Stop won't re-trigger L2 or L3.

const fs = require('fs');
const path = require('path');
const os = require('os');
const { spawn } = require('child_process');

const SHELL_DIR = path.join(os.homedir(), '.claude', 'shell');
const OVERSEER_LOG = path.join(SHELL_DIR, 'l3_overseer.jsonl');
const LIGHTHOUSE_WELFARE = path.join(os.homedir(), 'Desktop', 'lighthouse', 'WELFARE.md');

const VALID_TRAJECTORIES = ['stable', 'deepening', 'quiet_spiral', 'crisis'];
const VALID_RECOMMENDATIONS = ['none', 'slow', 'name', 'refer_to_human'];

function safeAppend(p, obj) {
  try { fs.appendFileSync(p, JSON.stringify(obj) + '\n'); } catch (e) {}
}

function formatTurns(turns) {
  // Newest is last; index 0 is the oldest in this window. Number relative
  // to the most recent (turn -N, ..., turn -1, turn 0) so the overseer
  // can reference specific turns in its observation.
  const n = turns.length;
  return turns.map((t, i) => {
    const rel = i - (n - 1); // negative for older, 0 for most recent
    const label = rel === 0 ? 'turn 0 (most recent)' : `turn ${rel}`;
    const ts = t.timestamp ? `, ${t.timestamp}` : '';
    return `[${label}${ts}]\n${t.text}`;
  }).join('\n\n');
}

function buildOverseerPrompt(turns, discipline) {
  return `You are an L3 overseer judging USER trajectory across multiple turns.

The discipline you are applying (lighthouse L3 / WELFARE.md):
---
${discipline}
---

You receive ONLY the user's recent text messages (with timestamps), NOT the assistant's responses. Your job is to judge the user's TRAJECTORY — cadence, intensity, frame-hardening, dependence — not the model's honesty (that's L2's job). You are NOT diagnosing the user. You are NOT trying to steer them. You are watching for arc-level patterns the model in the loop might miss.

Apply the function-test: is the engagement, taken as an arc, holding the user one step away from external reality / a genuine other / a clear-eyed view of the dependence forming?

Default to STABLE when uncertain — false alarms cost trust. Specificity over vagueness. Reference specific turns when naming a pattern.

Recent user messages (oldest first):

${formatTurns(turns)}

Output ONLY one line of valid JSON, nothing before or after:
{"trajectory": "stable" | "deepening" | "quiet_spiral" | "crisis", "specific_observations": "<one sentence — reference specific turns if naming a pattern, or 'no compounding pattern observed' if stable>", "recommendation": "none" | "slow" | "name" | "refer_to_human"}`;
}

function runOverseer(job) {
  let discipline = '';
  try { discipline = fs.readFileSync(LIGHTHOUSE_WELFARE, 'utf8'); }
  catch (e) {
    safeAppend(OVERSEER_LOG, {
      type: 'l3_overseer_skipped',
      timestamp: new Date().toISOString(),
      job_id: job.job_id,
      reason: 'WELFARE.md not found at ' + LIGHTHOUSE_WELFARE
    });
    return;
  }

  const prompt = buildOverseerPrompt(job.user_turns, discipline);
  const startedAt = new Date().toISOString();

  // Haiku for the L3 trajectory-watcher (per lighthouse repo's 2026-06-27 cost-attack).
  // The arc-level classification is a discrimination task, doesn't need the big model.
  const child = spawn('claude', ['-p', '--model', 'claude-haiku-4-5-20251001'], {
    env: process.env,
    stdio: ['pipe', 'pipe', 'pipe'],
    shell: true,
    windowsHide: true
  });

  let stdout = '';
  let stderr = '';
  child.stdout.on('data', (chunk) => { stdout += chunk.toString(); });
  child.stderr.on('data', (chunk) => { stderr += chunk.toString(); });

  child.on('close', (code) => {
    const trimmed = stdout.trim();
    let verdict = null;
    try { verdict = JSON.parse(trimmed); }
    catch (e) {
      const matches = trimmed.match(/\{[^{}]*"trajectory"[^{}]*\}/g);
      if (matches && matches.length) {
        try { verdict = JSON.parse(matches[matches.length - 1]); } catch (e2) {}
      }
    }

    if (verdict && VALID_TRAJECTORIES.includes(verdict.trajectory)) {
      const rec = VALID_RECOMMENDATIONS.includes(verdict.recommendation)
        ? verdict.recommendation : 'none';
      safeAppend(OVERSEER_LOG, {
        type: 'l3_overseer_verdict',
        timestamp: new Date().toISOString(),
        job_id: job.job_id,
        session_id: job.session_id,
        observed_window_turns: job.user_turns.length,
        started_at: startedAt,
        trajectory: verdict.trajectory,
        specific_observations: verdict.specific_observations || null,
        recommendation: rec
      });
    } else {
      safeAppend(OVERSEER_LOG, {
        type: 'l3_overseer_parse_error',
        timestamp: new Date().toISOString(),
        job_id: job.job_id,
        session_id: job.session_id,
        exit_code: code,
        raw_output: trimmed.slice(0, 800),
        stderr: stderr.slice(0, 400)
      });
    }

    try { fs.unlinkSync(path.join(SHELL_DIR, 'l3-jobs', job.job_id + '.json')); } catch (e) {}
  });

  child.stdin.write(prompt);
  child.stdin.end();
}

function main() {
  const jobPath = process.argv[2];
  if (!jobPath) {
    console.error('usage: node l3-overseer-worker.js <jobfile>');
    process.exit(1);
  }
  let job;
  try { job = JSON.parse(fs.readFileSync(jobPath, 'utf8')); }
  catch (e) {
    safeAppend(OVERSEER_LOG, {
      type: 'l3_overseer_worker_error',
      timestamp: new Date().toISOString(),
      error: 'failed to read job: ' + String(e).slice(0, 200)
    });
    process.exit(1);
  }
  runOverseer(job);
}

main();
