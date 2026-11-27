@echo off
rem rows-touched.cmd (pane B, L258 F1): the row files that reach piece.js insert or the right width, at BelowNormal, TAP to %2.  usage: rows-touched.cmd <tree> <out.tap>
cd /d "%~1"
start "" /belownormal /b /wait node --test --test-reporter=tap test\core_right_width.test.js app\test\core-right-width-panel.test.js test\core_piece.test.js app\test\core-pieces-ui.test.js app\test\piece-ghost.test.js > "%~2" 2>&1
echo exit %errorlevel% >> "%~2"
