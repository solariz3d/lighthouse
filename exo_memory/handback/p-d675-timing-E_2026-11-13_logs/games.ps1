# games.ps1 (pane E, D675 timing sessions): print one line for each process running from a game's own install folder,
# or his dz-world from his play build. A launcher (Steam's client, web helpers, service; Riot's background service and
# crash handler) runs from elsewhere and is not printed.
$pattern = 'steamapps/common/|/riot games/(league of legends|valorant)/|/epic games/|/desktop/dreamzone-3/'
Get-Process | Where-Object { $_.Path } | ForEach-Object {
  $p = $_.Path.Replace('\', '/').ToLowerInvariant()
  if ($p -match $pattern) { "{0} {1} {2}" -f $_.Name, $_.Id, $_.Path }
}
