#!/bin/sh
# D643: one session, alone. Every process is preceded by the acs.exe check; if the game is up, stop at once.
cd C:/Users/nname/AppData/Local/Temp/claude/8e9709f509cfea85/a2122153-a37e-41a6-a86f-534267ec0565/scratchpad/d643
acs() { if tasklist //FI "IMAGENAME eq acs.exe" //NH 2>/dev/null | grep -qi acs.exe; then echo "STOPPED: acs.exe appeared $(date -u +%H:%M:%SZ)" >> C:/Users/nname/AppData/Local/Temp/claude/8e9709f509cfea85/a2122153-a37e-41a6-a86f-534267ec0565/scratchpad/d643/session.log; exit 7; fi; }
BN="node C:/Users/nname/AppData/Local/Temp/claude/C--Consonance-instances-sibling-07b8a48f/a2122153-a37e-41a6-a86f-534267ec0565/scratchpad/d485/belownormal.js node --max-old-space-size=4096"
# (a) d603090: the rows 3f-3n (core_additive), on my d642 worktree t180-e642g
acs; (cd C:/Users/nname/Desktop/worktrees/t180-e642g && $BN --test --test-reporter=tap test/core_additive.test.js > C:/Users/nname/AppData/Local/Temp/claude/8e9709f509cfea85/a2122153-a37e-41a6-a86f-534267ec0565/scratchpad/d643/a-rows-d603090.tap 2>&1); echo "a rows done $(date -u +%H:%M:%SZ)" >> C:/Users/nname/AppData/Local/Temp/claude/8e9709f509cfea85/a2122153-a37e-41a6-a86f-534267ec0565/scratchpad/d643/session.log
# (b) correctness on both forks: the byte-hash of five tracks and the core's answers; the six walk cases
for t in t180-e643L t180-e643D; do
  acs; $BN C:/Users/nname/AppData/Local/Temp/claude/8e9709f509cfea85/a2122153-a37e-41a6-a86f-534267ec0565/scratchpad/d643/hash5.js C:/Users/nname/Desktop/worktrees/$t C:/Users/nname/Desktop/lighthouse/exo_memory/briefs/t180_saves_2026-11-06 > C:/Users/nname/AppData/Local/Temp/claude/8e9709f509cfea85/a2122153-a37e-41a6-a86f-534267ec0565/scratchpad/d643/hash-$t.json 2>>C:/Users/nname/AppData/Local/Temp/claude/8e9709f509cfea85/a2122153-a37e-41a6-a86f-534267ec0565/scratchpad/d643/session.err
  acs; $BN C:/Users/nname/AppData/Local/Temp/claude/8e9709f509cfea85/a2122153-a37e-41a6-a86f-534267ec0565/scratchpad/d642/walk-full.js C:/Users/nname/Desktop/worktrees/$t > C:/Users/nname/AppData/Local/Temp/claude/8e9709f509cfea85/a2122153-a37e-41a6-a86f-534267ec0565/scratchpad/d643/walk-$t.json 2>>C:/Users/nname/AppData/Local/Temp/claude/8e9709f509cfea85/a2122153-a37e-41a6-a86f-534267ec0565/scratchpad/d643/session.err
  echo "b correctness $t done $(date -u +%H:%M:%SZ)" >> C:/Users/nname/AppData/Local/Temp/claude/8e9709f509cfea85/a2122153-a37e-41a6-a86f-534267ec0565/scratchpad/d643/session.log
done
# (b) speed: three runs, the fork order alternating, three drags, rolling then early, each a cold process; one JSON line each
for r in 1 2 3; do
  if [ $r = 2 ]; then ORDER="t180-e643D t180-e643L"; else ORDER="t180-e643L t180-e643D"; fi
  for t in $ORDER; do for m in rolling early; do
    acs; o=$(STEP=24 MOVES=18 MODE=cold-$m $BN C:/Users/nname/AppData/Local/Temp/claude/8e9709f509cfea85/a2122153-a37e-41a6-a86f-534267ec0565/scratchpad/d642/cold2-full.js C:/Users/nname/Desktop/worktrees/$t 2>>C:/Users/nname/AppData/Local/Temp/claude/8e9709f509cfea85/a2122153-a37e-41a6-a86f-534267ec0565/scratchpad/d643/session.err | tail -1); echo "{\"run\":$r,\"tree\":\"$t\",\"drag\":\"bank-back\",\"mode\":\"$m\",\"r\":$o}" >> C:/Users/nname/AppData/Local/Temp/claude/8e9709f509cfea85/a2122153-a37e-41a6-a86f-534267ec0565/scratchpad/d643/speed.jsonl
    acs; o=$(STEP=24 MOVES=60 MODE=cold-$m $BN C:/Users/nname/AppData/Local/Temp/claude/8e9709f509cfea85/a2122153-a37e-41a6-a86f-534267ec0565/scratchpad/d642/cold2-full.js C:/Users/nname/Desktop/worktrees/$t 2>>C:/Users/nname/AppData/Local/Temp/claude/8e9709f509cfea85/a2122153-a37e-41a6-a86f-534267ec0565/scratchpad/d643/session.err | tail -1); echo "{\"run\":$r,\"tree\":\"$t\",\"drag\":\"into-the-hold\",\"mode\":\"$m\",\"r\":$o}" >> C:/Users/nname/AppData/Local/Temp/claude/8e9709f509cfea85/a2122153-a37e-41a6-a86f-534267ec0565/scratchpad/d643/speed.jsonl
    acs; o=$(MODE=$m $BN C:/Users/nname/AppData/Local/Temp/claude/8e9709f509cfea85/a2122153-a37e-41a6-a86f-534267ec0565/scratchpad/d642/markbench-full.js C:/Users/nname/Desktop/worktrees/$t 2>>C:/Users/nname/AppData/Local/Temp/claude/8e9709f509cfea85/a2122153-a37e-41a6-a86f-534267ec0565/scratchpad/d643/session.err | tail -1); echo "{\"run\":$r,\"tree\":\"$t\",\"drag\":\"mark-slide\",\"mode\":\"$m\",\"r\":$o}" >> C:/Users/nname/AppData/Local/Temp/claude/8e9709f509cfea85/a2122153-a37e-41a6-a86f-534267ec0565/scratchpad/d643/speed.jsonl
  done; done
  echo "speed run $r done $(date -u +%H:%M:%SZ)" >> C:/Users/nname/AppData/Local/Temp/claude/8e9709f509cfea85/a2122153-a37e-41a6-a86f-534267ec0565/scratchpad/d643/session.log
done
