param([string]$src, [string]$dst, [int]$side = 512)
Add-Type -AssemblyName PresentationCore
$fs = [System.IO.File]::OpenRead($src)
try {
  $dec = [System.Windows.Media.Imaging.BitmapDecoder]::Create($fs, [System.Windows.Media.Imaging.BitmapCreateOptions]::PreservePixelFormat, [System.Windows.Media.Imaging.BitmapCacheOption]::OnLoad)
  $f = $dec.Frames[0]
  $s = [double]$side / [Math]::Min($f.PixelWidth, $f.PixelHeight)
  $t = New-Object System.Windows.Media.Imaging.TransformedBitmap($f, (New-Object System.Windows.Media.ScaleTransform($s, $s)))
  $g = New-Object System.Windows.Media.Imaging.FormatConvertedBitmap($t, [System.Windows.Media.PixelFormats]::Gray8, $null, 0)
  $w = $g.PixelWidth; $h = $g.PixelHeight
  $buf = New-Object byte[] ($w * $h)
  $g.CopyPixels($buf, $w, 0)
  $hdr = [BitConverter]::GetBytes([int32]$w) + [BitConverter]::GetBytes([int32]$h)
  [System.IO.File]::WriteAllBytes($dst, [byte[]]($hdr + $buf))
  "$src -> ${w}x${h}"
} finally { $fs.Close() }
