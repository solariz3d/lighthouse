P=~/.claude/projects
for d in sibling-3d57124e sibling-5bf9d657 sibling-0845a868 sibling-07b8a48f main librarian third-place; do
  f=$(ls -t $P/C--Consonance-instances-$d/*.jsonl | head -1)
  for ln in $(node -e 'const L=require("fs").readFileSync("fc_'$d'.jsonl","utf8").trim().split("\n").map(JSON.parse).filter(o=>o.total>0);console.log(L.slice(-2).map(o=>o.line).join(" "))'); do
    node decompose.js "$f" $ln > dec_${d}_$ln.json 2> dec_${d}_$ln.err
  done
done
echo done > dec_done.txt
