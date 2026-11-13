#!/bin/bash
# Restart the L182 arms where they stopped (the wrapper skips blocks whose CSV exists). Stopped 2026-11-13 03:49 local after a5 b151 so that landing-gating
# builds and rows (Lap R, the overtime rows, the hawk rows) take the lock first: "landings never wait behind sweeps". Run in the background; --threads 2, memwatch-gated inside.
SP="C:/Users/zackn/AppData/Local/Temp/claude/4589df4838997b56/6fe15f0a-634b-4a04-b5de-8bd96b6b5a4f/scratchpad/l170"
bash "$SP/arms182b.sh" "a3=feeler_m=1;feeler_push=0.5" "a4=line_clearance=0.6;look_ahead=3" "a5=sway=0" "a6=scrape_ease=1;refuse_brake=1" \
  "a7=turn_law=3;line_clearance=0.6;look_ahead=3" \
  "a8=turn_law=3;line_clearance=0.6;look_ahead=3;feeler_m=1;feeler_push=0.5;sway=0;scrape_ease=1;refuse_brake=1" > "$SP/arms182_run4.log" 2>&1
tail -3 "$SP/arms182_run4.log"
