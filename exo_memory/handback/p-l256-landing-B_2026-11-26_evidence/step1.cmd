@echo off
rem step1.cmd (pane B, L256 step 1): the touched tests of what was merged into landing-1126, each at BelowNormal, in order.
set S=<scratch>
cd /d C:\Consonance\t180-wt-landing-1126
git log -1 --format="tip %%h %%s" > %S%\step1-tip.txt
start "" /belownormal /wait /b node --test app/test/reference-panel.test.js test/reference_ribbon.test.js > %S%\rows-reference.txt 2>&1
echo reference-exit %ERRORLEVEL%
start "" /belownormal /wait /b node --test app/test/theme.test.js app/test/markwindow.test.js > %S%\rows-theme-markwindow.txt 2>&1
echo theme-markwindow-exit %ERRORLEVEL%
start "" /belownormal /wait /b node --test app/test/texture-page.test.js > %S%\rows-texture-page.txt 2>&1
echo texture-page-exit %ERRORLEVEL%
set TREE=C:/Consonance/t180-wt-landing-1126
start "" /belownormal /wait /b node %S%\look256.js C:\Consonance\t180-wt-landing-1126\out\l256-pictures\step1 > %S%\look256.json 2> %S%\look256.err
echo look-exit %ERRORLEVEL%
cd /d C:\Consonance\t180-wt-landing-1126\src-tauri
set CARGO_TARGET_DIR=C:\build\b-l256-target
start "" /belownormal /wait /b cargo test --lib -- kn5road reference > %S%\cargo-rows.txt 2>&1
echo cargo-exit %ERRORLEVEL%
