#!/bin/bash
# Restart the L182 arms in the REGISTERED order (lighthouse exo_memory/handback/p-l182-lines-A_2026-11-12.md: the grip arms first, his pick chase_entities-1; then a6, a7b, a8b;
# a4/a7/a8 as first registered are dropped: a4 livelocks). The wrapper skips blocks whose CSV exists. Run in the background, --threads 2, memwatch-gated inside.
# Hold it back while landing-gating work (Lap R, the overtime rows) needs the lock: "landings never wait behind sweeps".
SP="C:/Users/zackn/AppData/Local/Temp/claude/4589df4838997b56/6fe15f0a-634b-4a04-b5de-8bd96b6b5a4f/scratchpad/l170"
bash "$SP/arms182b.sh" "g13=turn_law=3;grip_mu=1.3" "g16=turn_law=3;grip_mu=1.6" "g20=turn_law=3;grip_mu=2.0" \
  "a6=scrape_ease=1;refuse_brake=1" \
  "a7b=turn_law=3;feeler_m=1;feeler_push=0.5" \
  "a8b=turn_law=3;feeler_m=1;feeler_push=0.5;sway=0;scrape_ease=1;refuse_brake=1" > "$SP/arms182_run5.log" 2>&1
tail -3 "$SP/arms182_run5.log"
