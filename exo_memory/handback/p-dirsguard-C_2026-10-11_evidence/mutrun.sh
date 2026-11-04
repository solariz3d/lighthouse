set -u
S=C:/Users/nname/AppData/Local/Temp/claude/C--Consonance-instances-sibling-0845a868/0845a868-38f2-4cc2-b45a-431e0c088fb1/scratchpad/d300; O=G:/consonance-scratch/c-d300; W=G:/worktrees/c-d300-mut
cd $S; echo "tree $(git -C $W log -1 --format=%h)"
node -e "require('./mutants.js').forEach(m=>console.log(m[0]))" | while read -r M; do
  out=$(node build-dose.js $W G:/ctarget/c-d296-mut $O/tmut.exe "$M" 2>&1); echo "$out" | grep -E "NOT APPLIED|restored|error" 
  if echo "$out" | grep -q "NOT APPLIED"; then continue; fi
  T=$(node runs.js $O/tmut.exe $W/consonance/src-tauri module 200 | grep TALLY)
  echo "$M => $T"
done
echo "tree after: $(git -C $W status --short | wc -l) dirty"
