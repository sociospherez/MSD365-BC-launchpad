# BC LaunchPad - Preflight Check

$ErrorActionPreference = "Continue"
$script:results = @()

function Add-CheckResult {
    param (
        [string]$Name,
        [string]$Status,
        [string]$Message
    )

    $script:results += [PSCustomObject]@{
        Name    = $Name
        Status  = $Status
        Message = $Message
    }
}

# Docker Check
try {
    $dockerVersion = docker --version 2>$null

    if ($dockerVersion) {
        Add-CheckResult "Docker" "PASS" $dockerVersion
    }
    else {
        Add-CheckResult "Docker" "FAIL" "Docker not installed or unavailable."
    }
}
catch {
    Add-CheckResult "Docker" "FAIL" "Docker not installed or unavailable."
}

# BCContainerHelper Check
try {
    $bcHelper = Get-InstalledModule -Name BcContainerHelper -ErrorAction Stop

    if ($bcHelper) {
        Add-CheckResult "BcContainerHelper" "PASS" "Installed version $($bcHelper.Version)"
    }
}
catch {
    Add-CheckResult "BcContainerHelper" "FAIL" "BcContainerHelper not installed."
}

# Hyper-V Check
try {
    $hyperV = Get-WindowsOptionalFeature -Online -FeatureName Microsoft-Hyper-V-All -ErrorAction Stop

    if ($hyperV.State -eq "Enabled") {
        Add-CheckResult "Hyper-V" "PASS" "Enabled"
    }
    else {
        Add-CheckResult "Hyper-V" "WARNING" "Available but not enabled."
    }
}
catch {
    Add-CheckResult "Hyper-V" "FAIL" "Unable to verify Hyper-V."
}

# RAM Check
try {
    $ramGB = [math]::Round((Get-CimInstance Win32_ComputerSystem).TotalPhysicalMemory / 1GB)

    if ($ramGB -ge 16) {
        Add-CheckResult "Memory" "PASS" "$ramGB GB detected"
    }
    else {
        Add-CheckResult "Memory" "WARNING" "$ramGB GB detected. Recommended: 16GB+"
    }
}
catch {
    Add-CheckResult "Memory" "FAIL" "Unable to check memory."
}

# Port Check
try {
    $port8080 = Get-NetTCPConnection -LocalPort 8080 -ErrorAction SilentlyContinue
    $port7049 = Get-NetTCPConnection -LocalPort 7049 -ErrorAction SilentlyContinue

    if (!$port8080 -and !$port7049) {
        Add-CheckResult "Ports" "PASS" "Ports 8080 and 7049 available"
    }
    else {
        Add-CheckResult "Ports" "WARNING" "One or more required ports already in use."
    }
}
catch {
    Add-CheckResult "Ports" "FAIL" "Unable to check ports."
}

# Output JSON
$json = $script:results | ConvertTo-Json -Depth 3

Write-Host ""
Write-Host "========== RESULTS ==========" -ForegroundColor Cyan
Write-Host $json
Write-Host "=============================" -ForegroundColor Cyan