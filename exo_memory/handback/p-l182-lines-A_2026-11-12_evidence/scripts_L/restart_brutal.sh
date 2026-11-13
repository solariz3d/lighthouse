#!/bin/bash
# L182f (registered at lighthouse p-l182-lines-A_2026-11-12.md, "ONE DIFFICULTY"): the arms at BRUTAL (level 3), --max 600, in the registered order:
# the control and a2 first (the baselines), then the grip arms (his pick), then the walls arms. Two blocks each; the wrapper skips blocks whose CSV exists.
SP="C:/Users/zackn/AppData/Local/Temp/claude/4589df4838997b56/6fe15f0a-634b-4a04-b5de-8bd96b6b5a4f/scratchpad/l170"
bash "$SP/arms_brutal.sh" "ctl=" "a2=turn_law=3" "g13=turn_law=3;grip_mu=1.3" "g16=turn_law=3;grip_mu=1.6" "g20=turn_law=3;grip_mu=2.0" \
  "a3=feeler_m=1;feeler_push=0.5" "a6=scrape_ease=1;refuse_brake=1" > "$SP/arms_brutal_run1.log" 2>&1
tail -3 "$SP/arms_brutal_run1.log"
