#!/bin/bash
S=<scratch>
cd $S
node /c/Consonance/lighthouse/consonance/tools/leftovers.js > leftovers_before_pics.txt 2>&1
for t in c522ea6=C:/Consonance/t180-wt-c-l270-base 15e7d62=C:/Consonance/t180-wt-c-l270-hold 9de0b18=C:/Consonance/t180-wt-c-l270; do
  node picnp.js ${t#*=} ${t%%=*} $S/pics > picnp_${t%%=*}.out 2>&1
done
node /c/Consonance/lighthouse/consonance/tools/leftovers.js > leftovers_after_pics.txt 2>&1
echo done > pics.exit
