param(
  [string]$VideoRoot = "video",
  [int]$Crf = 24,
  [string]$Preset = "slow",
  [string]$Codec = "hevc"
)

$ErrorActionPreference = "Stop"

$ffmpeg = Join-Path $env:LOCALAPPDATA "Microsoft\WinGet\Packages\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\ffmpeg-8.1.2-full_build\bin\ffmpeg.exe"
$ffprobe = Join-Path $env:LOCALAPPDATA "Microsoft\WinGet\Packages\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\ffmpeg-8.1.2-full_build\bin\ffprobe.exe"

if (-not (Test-Path -LiteralPath $ffmpeg)) {
  throw "FFmpeg was not found at $ffmpeg"
}

if (-not (Test-Path -LiteralPath $ffprobe)) {
  throw "FFprobe was not found at $ffprobe"
}

$root = Resolve-Path -LiteralPath $VideoRoot
$logPath = Join-Path (Get-Location) "video-optimization-report.csv"
$files = Get-ChildItem -LiteralPath $root -Recurse -Filter *.mp4 |
  Where-Object { $_.Name -notlike "*.optimized-tmp.mp4" -and $_.Name -notlike "*.test-hevc.mp4" } |
  Sort-Object FullName

"File,OriginalMB,OptimizedMB,ReductionPct,Codec,Status" | Set-Content -LiteralPath $logPath -Encoding UTF8

$index = 0
foreach ($file in $files) {
  $index += 1
  $input = $file.FullName
  $temp = Join-Path $file.DirectoryName ($file.BaseName + ".optimized-tmp.mp4")
  $originalBytes = $file.Length

  if (Test-Path -LiteralPath $temp) {
    Remove-Item -LiteralPath $temp -Force
  }

  Write-Host "[$index/$($files.Count)] Optimizing $($file.FullName)"

  $sourceCodec = & $ffprobe -v error -select_streams v:0 -show_entries stream=codec_name -of default=nw=1:nk=1 $input
  if (($Codec -eq "h264" -and $sourceCodec -eq "h264") -or ($Codec -ne "h264" -and $sourceCodec -eq "hevc")) {
    """$input"",$([math]::Round($originalBytes/1MB,2)),$([math]::Round($originalBytes/1MB,2)),0,$Codec,Skipped compatible $sourceCodec" | Add-Content -LiteralPath $logPath -Encoding UTF8
    continue
  }

  $scale = "scale='if(gt(iw,ih),min(1920,iw),min(1080,iw))':'if(gt(iw,ih),min(1080,ih),min(1920,ih))':force_original_aspect_ratio=decrease:force_divisible_by=2"

  if ($Codec -eq "h264") {
    & $ffmpeg -hide_banner -loglevel error -stats -y -i $input `
      -map 0:v:0 -map 0:a? `
      -vf $scale `
      -c:v libx264 -preset $Preset -profile:v high -level 4.1 -crf $Crf `
      -c:a aac -b:a 96k -ac 2 `
      -movflags +faststart `
      $temp
  } else {
    & $ffmpeg -hide_banner -loglevel error -stats -y -i $input `
      -map 0:v:0 -map 0:a? `
      -vf $scale `
      -c:v libx265 -preset $Preset -crf $Crf -tag:v hvc1 `
      -c:a aac -b:a 96k -ac 2 `
      -movflags +faststart -x265-params log-level=error `
      $temp
  }

  if ($LASTEXITCODE -ne 0 -or -not (Test-Path -LiteralPath $temp)) {
    """$input"",$([math]::Round($originalBytes/1MB,2)),,,$Codec,Failed encode" | Add-Content -LiteralPath $logPath -Encoding UTF8
    if (Test-Path -LiteralPath $temp) {
      Remove-Item -LiteralPath $temp -Force
    }
    continue
  }

  & $ffprobe -v error -select_streams v:0 -show_entries stream=codec_name,width,height,r_frame_rate,duration -of csv=p=0 $temp | Out-Null
  if ($LASTEXITCODE -ne 0) {
    """$input"",$([math]::Round($originalBytes/1MB,2)),,,$Codec,Failed probe" | Add-Content -LiteralPath $logPath -Encoding UTF8
    Remove-Item -LiteralPath $temp -Force
    continue
  }

  $optimizedBytes = (Get-Item -LiteralPath $temp).Length
  if ($optimizedBytes -ge $originalBytes -and $sourceCodec -eq $Codec) {
    """$input"",$([math]::Round($originalBytes/1MB,2)),$([math]::Round($optimizedBytes/1MB,2)),0,$Codec,Kept original" | Add-Content -LiteralPath $logPath -Encoding UTF8
    Remove-Item -LiteralPath $temp -Force
    continue
  }

  Move-Item -LiteralPath $temp -Destination $input -Force
  $reduction = [math]::Round((1 - ($optimizedBytes / $originalBytes)) * 100, 1)
  """$input"",$([math]::Round($originalBytes/1MB,2)),$([math]::Round($optimizedBytes/1MB,2)),$reduction,$Codec,Optimized" | Add-Content -LiteralPath $logPath -Encoding UTF8
}

$totalBytes = (Get-ChildItem -LiteralPath $root -Recurse -Filter *.mp4 | Measure-Object Length -Sum).Sum
Write-Host "Done. Optimized video total: $([math]::Round($totalBytes/1MB,2)) MB"
Write-Host "Report: $logPath"
