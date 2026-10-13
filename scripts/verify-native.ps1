param([Parameter(Mandatory=$true)][string]$Executable)
$ErrorActionPreference = 'Stop'
$outputPath = Join-Path ([IO.Path]::GetTempPath()) ('anydevice-native-' + [Guid]::NewGuid().ToString() + '.json')
try {
    for ($attempt=1; $attempt -le 3; $attempt++) {
    $process = Start-Process -FilePath (Resolve-Path -LiteralPath $Executable).Path -ArgumentList @('--collect-native','usb-hid') -RedirectStandardOutput $outputPath -PassThru -WindowStyle Hidden
    if (-not $process.WaitForExit(45000)) { Stop-Process -Id $process.Id; throw 'Native collector timed out' }
    if ($process.ExitCode -ne 0) { throw 'Native collector failed' }
    $native = Get-Content -LiteralPath $outputPath -Raw | ConvertFrom-Json
    $fallback = & "$PSScriptRoot/../src-tauri/scripts/discover.ps1" | ConvertFrom-Json
    if (-not $native.complete -or -not $fallback.complete) { if($attempt -lt 3){continue}; throw 'Parity requires complete collections; inventory may be changing' }
    $nativeIds = @($native.devices | ForEach-Object { $_.instanceId.ToUpperInvariant() } | Sort-Object)
    $fallbackIds = @($fallback.devices | ForEach-Object { $_.instanceId.ToUpperInvariant() } | Sort-Object)
    if (($nativeIds -join "`n") -ne ($fallbackIds -join "`n")) { if($attempt -lt 3){continue}; throw 'Native/fallback node sets differ; inspect locally for hot-plug or coverage differences' }
    $map = @{}; foreach ($d in $fallback.devices) { $map[$d.instanceId.ToUpperInvariant()]=$d }
    $mismatches = 0
    foreach ($d in $native.devices) {
        $other = $map[$d.instanceId.ToUpperInvariant()]
        foreach ($key in @('name','category','status','problemCode','manufacturer','parent','location')) {
            if ($null -ne $d.$key -and $null -ne $other.$key -and [string]$d.$key -cne [string]$other.$key) { $mismatches++ }
        }
        if ((@($d.hardwareIds | Sort-Object) -join "`n") -cne (@($other.hardwareIds | Sort-Object) -join "`n")) { $mismatches++ }
    }
    Write-Host "Native/fallback parity: $($nativeIds.Count) matching logical nodes; $mismatches shared-property differences; native errors $($native.errors.Count); fallback errors $($fallback.errors.Count)"
    if ($mismatches) { if($attempt -lt 3){continue}; throw 'Native/fallback shared properties differ' }
    break
    }
    $process = Start-Process -FilePath (Resolve-Path -LiteralPath $Executable).Path -ArgumentList @('--collect-native','all-pnp') -RedirectStandardOutput $outputPath -PassThru -WindowStyle Hidden
    if (-not $process.WaitForExit(45000)) { Stop-Process -Id $process.Id; throw 'Broad collector timed out' }
    if ($process.ExitCode -ne 0) { throw 'Broad collector failed' }
    $broad = Get-Content -LiteralPath $outputPath -Raw | ConvertFrom-Json
    if (-not $broad.complete) { throw 'Broad inventory incomplete' }
    Write-Host "All-present-PnP inventory: $($broad.devices.Count) nodes; $($broad.errors.Count) collection errors; $(@($broad.devices.category | Sort-Object -Unique).Count) exposed classes"
    # Counts only in public logs. Never upload real device identities or raw evidence.
} finally { if (Test-Path -LiteralPath $outputPath) { Remove-Item -LiteralPath $outputPath } }
