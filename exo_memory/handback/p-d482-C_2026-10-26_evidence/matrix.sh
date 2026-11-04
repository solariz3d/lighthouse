set -e
D=C:/Users/nname/AppData/Local/Temp/claude/C--Consonance-instances-sibling-0845a868/0845a868-38f2-4cc2-b45a-431e0c088fb1/scratchpad/d482
node $D/probe.js C:/Users/nname/Downloads/t180-wt-c482-19 v19-empty $D/out plain,bank,cup,edge,stack
node $D/probe.js C:/Users/nname/Downloads/t180-wt-c482-19 v19-placed $D/out plain,bank,cup,edge,stack --placed
node $D/probe.js C:/Users/nname/Downloads/t180-wt-c482-21 v21-empty $D/out plain,bank,cup,edge,stack
node $D/probe.js C:/Users/nname/Downloads/t180-wt-c482-21 v21-placed $D/out plain,bank,cup,edge,stack --placed
