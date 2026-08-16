[CmdletBinding()]
param(
  [switch]$Remove
)

$ErrorActionPreference = 'Stop'
$TaskName = 'FPKS Website Publish'
$task = Get-ScheduledTask -TaskName $TaskName -ErrorAction SilentlyContinue

if (-not $task) {
  Write-Host "Scheduled task is already absent: $TaskName"
  exit 0
}

if ($Remove) {
  Unregister-ScheduledTask -TaskName $TaskName -Confirm:$false
  Write-Host "Scheduled task removed: $TaskName"
} else {
  Disable-ScheduledTask -TaskName $TaskName | Out-Null
  Write-Host "Scheduled task disabled: $TaskName"
}
