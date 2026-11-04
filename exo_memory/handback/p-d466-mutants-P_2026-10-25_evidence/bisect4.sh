S=/c/Users/nname/AppData/Local/Temp/claude/C--Consonance-instances-sibling-372c8abc/fbf98f8e-29da-4fb2-8610-c038d6372249/scratchpad/d466
D9OLD="ch === 't' ? head.tNext : head[ch], c = first.channels[ch];"; D9NEW="head[ch], c = first.channels[ch];"
KOLD="C[ch] = C[ch].map((x, i) => Math.min(hi(i), Math.max(Math.max(lo, floor(i)), x)));"; KNEW="C[ch] = C[ch];"
for wt in a462 p466; do
  W=/c/Users/nname/Downloads/t180-wt-$wt
  echo "== D9 on $wt"; node $S/mut.js $W core_piece.test.js "row 10" $S/d9-$wt core/piece.js "$D9OLD" "$D9NEW"
  echo "== KE2-6 on $wt"; node $S/mut.js $W core_xsec.test.js "ringing" $S/ke26-$wt core/extend.js "$KOLD" "$KNEW"
done
