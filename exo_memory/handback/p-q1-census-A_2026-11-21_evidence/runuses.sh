P=~/.claude/projects
for s in A:sibling-3d57124e B:sibling-5bf9d657 C:sibling-0845a868 E:sibling-07b8a48f; do
 node count_uses.js $P/C--Consonance-instances-${s#*:} ${s%%:*} 2> uses_err_${s%%:*}.txt
done; echo done > uses_done.txt
