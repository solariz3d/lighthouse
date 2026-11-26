@echo off
rem step2c.cmd (pane B, L256 cut, l255): l255's rows on the merge ceb21f5, in its own worktree, each at BelowNormal: theme, the reference rows, texture-page rows 13-18.
set S=<scratch>\l256\step2c
cd /d C:\Consonance\t180-wt-l256-l255
git log -1 --format="tip %%h %%s" > %S%\step2c-tip.txt
start "" /belownormal /wait /b node --test --test-concurrency=1 app/test/theme.test.js app/test/reference-panel.test.js > %S%\rows-theme-reference.txt 2>&1
echo theme-reference-exit %ERRORLEVEL%
start "" /belownormal /wait /b node --test --test-concurrency=1 --test-name-pattern="^row 1[3-8]" app/test/texture-page.test.js > %S%\rows-texture-page-13-18.txt 2>&1
echo texture-page-13-18-exit %ERRORLEVEL%
