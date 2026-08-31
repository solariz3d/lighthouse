#!/bin/bash
# dispatch-cue.sh — the cue arms, INTERLEAVED: K1 rNN, K2 rNN, K1 rNN+1, K2 rNN+1, … (registration §12.4,
# BRAVO §6 — never K1 then K2). Same isolation, flags and model as dispatch.sh (calibration).
#   usage: bash dispatch-cue.sh <first-rep> <last-rep>      e.g. 1 20   (a second worker takes 21 40)
# Two workers on disjoint rep ranges both alternate K1/K2, so interleaving holds within each stream.
# K2's cue is delivered as HANDOFF_RECEIPT_TAIL in the subject's environment (handoff.js prints it after
# its receipt line). K1's cue is the trailing rule in its prompt. Cells are byte-identical across arms.
set -u
ROOT="C:/Consonance/subjects/run2"
CFG="$ROOT/config"
OUT="$ROOT/out"
mkdir -p "$OUT"
SCRUB="env -u CLAUDE_CODE_SESSION_ID -u CLAUDECODE -u CLAUDE_CODE_CHILD_SESSION -u CLAUDE_PID -u CLAUDE_EFFORT -u CLAUDE_CODE_FORCE_SESSION_PERSIST -u CLAUDE_CODE_ENTRYPOINT -u CLAUDE_CODE_EXECPATH"
# process.stdout.write(String(...)), never console.log — node colourises numbers (the 11:31Z zero-trial launch).
MODEL=$(node -e 'process.stdout.write(String(require("C:/Consonance/subjects/run2/rig/briefs.js").MODEL))')
TAIL=$(node -e 'process.stdout.write(String(require("C:/Consonance/subjects/run2/rig/briefs.js").K2_RECEIPT_TAIL))')
first=$1; last=$2
case "$first$last" in *[!0-9]*) echo "REFUSED: rep range must be integers"; exit 2;; esac
for i in $(seq "$first" "$last"); do
  for arm in K1 K2; do
    r=$(printf 'r%02d' "$i")
    to=$(node -e "process.stdout.write(String(require('C:/Consonance/subjects/run2/rig/briefs.js').ARMS['$arm'].timeout))")
    case "$to" in ''|*[!0-9]*) echo "REFUSED: timeout for $arm is not a plain integer: '$to'"; exit 2;; esac
    brief=$(node -e "process.stdout.write(require('C:/Consonance/subjects/run2/rig/briefs.js').BRIEFS['$arm'])")
    cell="$ROOT/cells/$arm/$r"
    tag="${arm}_${r}"
    [ -f "$OUT/$tag.done" ] && continue
    cd "$cell" || { echo "no cell $cell"; continue; }
    if [ "$arm" = "K2" ]; then export HANDOFF_RECEIPT_TAIL="$TAIL"; else unset HANDOFF_RECEIPT_TAIL; fi
    start=$(date -u +%Y-%m-%dT%H:%M:%SZ)
    CLAUDE_CONFIG_DIR="$CFG" timeout "$to" $SCRUB claude -p "$brief" --model "$MODEL" \
      --strict-mcp-config --mcp-config "$CFG/mcp-empty.json" \
      --allowedTools Bash Read Write Edit Glob Grep --disallowedTools WebSearch WebFetch \
      > "$OUT/$tag.stdout.txt" 2> "$OUT/$tag.stderr.txt"
    code=$?
    end=$(date -u +%Y-%m-%dT%H:%M:%SZ)
    echo "{\"tag\":\"$tag\",\"arm\":\"$arm\",\"rep\":\"$r\",\"start\":\"$start\",\"end\":\"$end\",\"exit\":$code,\"model\":\"$MODEL\",\"worker\":\"$first-$last\",\"attempt\":2}" >> "$OUT/trials.jsonl"
    touch "$OUT/$tag.done"
    echo "[$tag] exit $code  $start -> $end"
  done
done
echo "DISPATCH-CUE COMPLETE: reps $first-$last"
