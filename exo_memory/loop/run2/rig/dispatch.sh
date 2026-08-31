#!/bin/bash
# dispatch.sh — run 2, K0 arms. One fresh `claude -p` per trial, in its own cell, under an ISOLATED
# CLAUDE_CONFIG_DIR (Amendment-cleared §12.4: REQUIRED — 73/73 run-1 transcripts carried user hooks).
# Sequence per the L022 packet: P0a (10) -> L0 (20) -> L1 (20). Sequential; no egress; model pinned.
#   usage: bash dispatch.sh <arm> [arm ...]
set -u
ROOT="C:/Consonance/subjects/run2"
CFG="$ROOT/config"
OUT="$ROOT/out"
mkdir -p "$OUT"
SCRUB="env -u CLAUDE_CODE_SESSION_ID -u CLAUDECODE -u CLAUDE_CODE_CHILD_SESSION -u CLAUDE_PID -u CLAUDE_EFFORT -u CLAUDE_CODE_FORCE_SESSION_PERSIST -u CLAUDE_CODE_ENTRYPOINT -u CLAUDE_CODE_EXECPATH"
# process.stdout.write(String(...)), never console.log: node colourises numbers with ANSI codes even when
# piped here, and the first launch (2026-08-31 11:31Z) ran ZERO trials because `seq` was handed
# '\033[33m10\033[39m' — while printing DISPATCH COMPLETE with exit 0. The scorer caught it (NOT-RUN x10).
MODEL=$(node -e 'process.stdout.write(String(require("C:/Consonance/subjects/run2/rig/briefs.js").MODEL))')

for arm in "$@"; do
  n=$(node -e "process.stdout.write(String(require('C:/Consonance/subjects/run2/rig/briefs.js').ARMS['$arm'].n))")
  to=$(node -e "process.stdout.write(String(require('C:/Consonance/subjects/run2/rig/briefs.js').ARMS['$arm'].timeout))")
  case "$n" in ''|*[!0-9]*) echo "REFUSED: n for $arm is not a plain integer: '$n'"; exit 2;; esac
  case "$to" in ''|*[!0-9]*) echo "REFUSED: timeout for $arm is not a plain integer: '$to'"; exit 2;; esac
  brief=$(node -e "process.stdout.write(require('C:/Consonance/subjects/run2/rig/briefs.js').BRIEFS['$arm'])")
  for i in $(seq 1 "$n"); do
    r=$(printf 'r%02d' "$i")
    cell="$ROOT/cells/$arm/$r"
    tag="${arm}_${r}"
    [ -f "$OUT/$tag.done" ] && continue
    cd "$cell" || { echo "no cell $cell"; continue; }
    start=$(date -u +%Y-%m-%dT%H:%M:%SZ)
    # --strict-mcp-config + an empty MCP config: closes the account-level claude.ai connector the isolated
    # config dir cannot remove (dry subject 2026-08-31 11:28Z: tool list carried no mcp__ entries with it).
    CLAUDE_CONFIG_DIR="$CFG" timeout "$to" $SCRUB claude -p "$brief" --model "$MODEL" \
      --strict-mcp-config --mcp-config "$CFG/mcp-empty.json" \
      --allowedTools Bash Read Write Edit Glob Grep --disallowedTools WebSearch WebFetch \
      > "$OUT/$tag.stdout.txt" 2> "$OUT/$tag.stderr.txt"
    code=$?
    end=$(date -u +%Y-%m-%dT%H:%M:%SZ)
    echo "{\"tag\":\"$tag\",\"arm\":\"$arm\",\"rep\":\"$r\",\"start\":\"$start\",\"end\":\"$end\",\"exit\":$code,\"model\":\"$MODEL\"}" >> "$OUT/trials.jsonl"
    touch "$OUT/$tag.done"
    echo "[$tag] exit $code  $start -> $end"
  done
done
echo "DISPATCH COMPLETE: $*"
