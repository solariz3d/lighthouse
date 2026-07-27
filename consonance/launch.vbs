' launch.vbs - open Consonance with NO console window.
'
' The Desktop shortcut points here. This runs launch.ps1 HIDDEN, so the usual click gives
' you the app window and nothing else. launch.ps1 keeps all of its brains: instant open
' when the build is current (the common case), silent rebuild-then-open when source moved,
' fall back to the last good exe when the build cannot relink because Consonance is open.
'
' Why not launch the exe directly (the BLACKBOX pattern): Consonance's stale-binary class
' of bug is documented - the orphaned-Main incident (journal 2026-07-27) sat dormant for
' NINE DAYS precisely because clicks kept serving an exe older than the source. The check
' costs under a second; the incident cost a thread its home. Keep the check.
Option Explicit
Dim sh, fso, scriptDir, ps1
Set sh = CreateObject("WScript.Shell")
Set fso = CreateObject("Scripting.FileSystemObject")
scriptDir = fso.GetParentFolderName(WScript.ScriptFullName)
ps1 = fso.BuildPath(scriptDir, "launch.ps1")
If fso.FileExists(ps1) Then
  ' 0 = hidden window, False = don't wait
  sh.Run "powershell.exe -NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File """ & ps1 & """", 0, False
Else
  sh.Popup "launch.ps1 not found beside launch.vbs", 6, "Consonance", 48
End If
