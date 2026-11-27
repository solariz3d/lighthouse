@echo off
rem harness-f2.cmd (pane B, L258 F2): the right-width mutation harness (35 mutants and its CONTROL), TAP to the scratch folder. Run by heavy-run, cwd the worktree.
node --max-old-space-size=4096 --test --test-reporter=tap test\core_right_width_mutation.test.js > "<scratch>\f2-harness.tap" 2>&1
