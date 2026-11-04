#!/bin/bash
# Run the README's OWN commands on the edited tree and print the figure beside the number the README now claims.
cd /c/Users/nname/Desktop/worktrees/a-dt-wt || exit 1
say() { printf "%-62s claims %-6s got %s\n" "$1" "$2" "$3"; }
T=consonance/tools
say "tools (non-test, non-mutants)"                    79 "$(ls $T/*.js | grep -v '\.test\.js' | grep -v '\.mutants\.js' | wc -l)"
say "*.test.js"                                        95 "$(ls $T/*.test.js | wc -l)"
say "*.mutants.js"                                     9  "$(ls $T/*.mutants.js | wc -l)"
n=0; for f in $(ls $T/*.js | grep -v '\.test\.js' | grep -v '\.mutants\.js'); do [ -f "${f%.js}.test.js" ] && n=$((n+1)); done; say "tools with a .test.js beside them" 74 $n
say "the five without a test" "5" "$(for f in $(ls $T/*.js | grep -v '\.test\.js' | grep -v '\.mutants\.js'); do [ -f "${f%.js}.test.js" ] || basename $f; done | tr '\n' ' ')"
say "tools with a .mutants.js beside them" 5 "$(for f in $(ls $T/*.js | grep -v '\.test\.js' | grep -v '\.mutants\.js'); do [ -f "${f%.js}.mutants.js" ] && echo "$f"; done | wc -l)"
say "mutants files with no tool of their name" "4" "$(for f in $T/*.mutants.js; do [ -f "${f%.mutants.js}.js" ] || basename $f .mutants.js; done | tr '\n' ' ')"
say "tests with no tool of their name" 21 "$(for f in $T/*.test.js; do [ -f "${f%.test.js}.js" ] || echo x; done | wc -l)"
say "wired to nothing" 3 "$(grep -l 'WIRED TO NOTHING' $T/*.js | grep -v '\.test\.js' | wc -l)"
say "hooks .js" 22 "$(ls consonance/hooks/*.js | grep -v '\.test\.js' | wc -l)"
say "installer copies (From)" 18 "$(grep -c "^ *@{ From = 'consonance.hooks" dev/shell/install.ps1)"
say "installer unmanaged (Src)" 4 "$(grep -c "^ *@{ Src = 'consonance.hooks" dev/shell/install.ps1)"
say "installer registration entries (Event)" 22 "$(grep -c '^ *@{ Event = ' dev/shell/install.ps1)"
say "fast-forward marks" 11 "$(grep -c '"install": "fast-forward"' consonance/state-manifest.json)"
say "tauri commands" 47 "$(grep -c '^#\[tauri::command\]' consonance/src-tauri/src/main.rs)"
say "board verbs" 10 "$(grep -oE 'async fn (post_board|read_board|call_chair|call_librarian|raise_pull|chair_[a-z_]+)' consonance/src-tauri/src/mcp.rs | sort -u | wc -l)"
say "tabs" 7 "$(grep -oE 'data-tab="[a-z-]+"' consonance/ui/index.html | sort -u | wc -l)"
say "gates in GATES.md (numbered sections)" 6 "$(grep -cE '^## [1-6]\. ' consonance/GATES.md)"
echo "--- keep-warm (README :289-307 cites these lines)"; grep -nE 'KEEP-WARM \(L067|const KEEP_WARM_(TEXT|AFTER|TICK)|^fn (keep_warm_(tick|decision|missed|off_path|send)|gate_or_queue)|not activated this session' consonance/src-tauri/src/main.rs | cut -c1-90
echo -n "chair_audit(app, keep_warm_row_for at: "; grep -n "chair_audit(app, keep_warm_row_for" consonance/src-tauri/src/main.rs | cut -d: -f1
echo -n "gate_or_queue(app, pane, KEEP_WARM_TEXT at: "; grep -n "gate_or_queue(app, pane, KEEP_WARM_TEXT" consonance/src-tauri/src/main.rs | cut -d: -f1
echo "--- launch.ps1 (README cites :365-383, :410-561, :562)"; grep -nE "PARK, DON'T REFUSE \(L073, pane A|^function Update-FromOrigin|^Update-FromOrigin|^function Get-GitLines" consonance/launch.ps1 | cut -c1-80; awk 'NR>=410 && /^}/ {print "Update-FromOrigin closes at " NR; exit}' consonance/launch.ps1
echo "--- state-sync (README cites :1371 :1347 :1386-1476 :1527)"; grep -nE '^function (installTree|appendOnlyCompare)|judged FIRST|THE RE-CHECK|stillRefused.length\) \{' consonance/tools/state-sync.js | cut -c1-90; sed -n 1476,1477p consonance/tools/state-sync.js | cut -c1-80
echo "--- ledger-union FILES (README cites :66-78)"; awk '/^const FILES = \{/{s=NR} s&&/^};/{print s"-"NR; exit}' consonance/tools/ledger-union.js
echo "--- briefs"; ls consonance/src-tauri/brief/ | tr '\n' ' '; echo
