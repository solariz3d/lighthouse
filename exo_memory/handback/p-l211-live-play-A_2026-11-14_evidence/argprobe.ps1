param(
    [Parameter(Position = 0)][ValidateSet('world', 'gym')][string]$Program = 'world',
    [int]$Jobs = 0,
    [switch]$Check,
    [Parameter(ValueFromRemainingArguments = $true)][string[]]$ProgramArgs
)
"Program=$Program Jobs=$Jobs Check=$Check"
"ProgramArgs count=$($ProgramArgs.Count)"
$ProgramArgs | ForEach-Object { "  [$_]" }
