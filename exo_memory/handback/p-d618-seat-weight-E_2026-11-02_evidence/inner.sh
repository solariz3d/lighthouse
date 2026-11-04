#!/bin/sh
S=C:/Users/nname/AppData/Local/Temp/claude/C--Consonance-instances-sibling-07b8a48f/a2122153-a37e-41a6-a86f-534267ec0565/scratchpad
O=$S/d618
P=C:/Users/nname/.claude/projects
while read L DIR ID; do
  echo "$L $DIR $(date -u +%H:%M:%SZ)" >> $O/run.log
  node $O/weigh.js "$P/C--Consonance-instances-$DIR/$ID.jsonl" "$L $DIR" 2026-11-01T23:38:00Z > $O/$L.json 2>> $O/run.log
  echo "  done $? $(date -u +%H:%M:%SZ)" >> $O/run.log
done < $O/seats.txt
