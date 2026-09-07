# Generates icons for Etsy Bulk Editor

Add-Type -AssemblyName System.Drawing

$Root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$iconsDir = Join-Path $Root "icons"
if (-not (Test-Path $iconsDir)) { New-Item -ItemType Directory -Path $iconsDir | Out-Null }

function New-Icon {
  param([int]$Size, [string]$OutputPath)
  $bmp = New-Object System.Drawing.Bitmap($Size, $Size)
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
  $g.Clear([System.Drawing.Color]::Transparent)
  $bg = [System.Drawing.ColorTranslator]::FromHtml("#F56400")
  $white = [System.Drawing.Color]::White
  $bgBrush = New-Object System.Drawing.SolidBrush($bg)
  # Background rounded square
  $g.FillEllipse($bgBrush, 0, 0, $Size-1, $Size-1)
  # Draw list lines in white
  $wPen = New-Object System.Drawing.Pen($white, [Math]::Max(1, $Size * 0.1))
  $wPen.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
  $wPen.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
  $margin = $Size * 0.2
  $gap = ($Size - $margin*2) / 3.5
  for ($i = 0; $i -lt 3; $i++) {
    $y = $margin + $i * $gap
    $w = if ($i -eq 1) { $Size * 0.45 } else { $Size * 0.6 }
    $g.DrawLine($wPen, $margin, $y, $margin + $w, $y)
  }
  $g.Dispose()
  $bmp.Save($OutputPath, [System.Drawing.Imaging.ImageFormat]::Png)
  $bmp.Dispose()
  Write-Host "  icon${Size}.png"
}

Write-Host "Generating Etsy Bulk Editor icons..."
foreach ($size in @(16, 32, 48, 128)) {
  New-Icon -Size $size -OutputPath (Join-Path $iconsDir "icon$size.png")
}
Write-Host "Done."
