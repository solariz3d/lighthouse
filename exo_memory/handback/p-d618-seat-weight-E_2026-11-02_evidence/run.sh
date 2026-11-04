#!/bin/sh
# D618: weigh every seat's newest transcript, one at a time (each read once), under the heavy-run lock at BelowNormal; acs.exe checked first
S=C:/Users/nname/AppData/Local/Temp/claude/C--Consonance-instances-sibling-07b8a48f/a2122153-a37e-41a6-a86f-534267ec0565/scratchpad
O=$S/d618
P=C:/Users/nname/.claude/projects
WIN=2026-11-01T23:38:00Z
echo "start $(date -u +%H:%M:%SZ)" > $O/run.log
if tasklist //FI "IMAGENAME eq acs.exe" //NH 2>/dev/null | grep -qi acs.exe; then echo "acs.exe is up: nothing run" >> $O/run.log; echo RUN-END >> $O/run.log; exit 3; fi
cat > $O/seats.txt <<'EOF'
D main 0c0c0c0a-0000-4000-8000-000000000a01
M librarian 0c0c0c0b-0000-4000-8000-00000000115b
N third-place 3d000000-0000-4000-8000-000000003d00
A sibling-3d57124e 6fe15f0a-634b-4a04-b5de-8bd96b6b5a4f
B sibling-5bf9d657 12fb81f6-f4c0-4ef8-aad8-f0cdce091925
C sibling-0845a868 0845a868-38f2-4cc2-b45a-431e0c088fb1
E sibling-07b8a48f a2122153-a37e-41a6-a86f-534267ec0565
O sibling-36313935 c88002b1-74d8-4036-8cc0-f64aefbeabff
P sibling-372c8abc fbf98f8e-29da-4fb2-8610-c038d6372249
EOF
node $S/d588/holdrun.js "E D618 seat weight: stream 9 transcripts once each (BelowNormal, low IO; not a timing session)" node $S/d485/belownormal.js "C:/Program Files/Git/bin/sh.exe" $O/inner.sh >> $O/run.log 2>&1
echo "exit $? $(date -u +%H:%M:%SZ)" >> $O/run.log
echo RUN-END >> $O/run.log
