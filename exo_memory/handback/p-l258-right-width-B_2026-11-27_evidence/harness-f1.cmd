@echo off
rem harness-f1.cmd (pane B, L258 F1): the right-width mutation harness (31 mutants and its CONTROL), TAP to the scratch folder. Run by heavy-run, cwd the worktree.
node --max-old-space-size=4096 --test --test-reporter=tap test\core_right_width_mutation.test.js > "<scratch>\f1-harness.tap" 2>&1
