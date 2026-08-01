[CmdletBinding()]
param()

$ErrorActionPreference = 'Stop'
$TaskName = 'FPKS Website Publish'
$PublishScript = 'D:\site\website1\scripts\publish.ps1'

if (-not (Test-Path -LiteralPath $PublishScript -PathType Leaf)) {
  throw "Publish script not found: $PublishScript"
}

$action = New-ScheduledTaskAction `
  -Execute 'powershell.exe' `
  -Argument "-NoProfile -NonInteractive -ExecutionPolicy Bypass -File `"$PublishScript`""

$trigger = New-ScheduledTaskTrigger -Once -At (Get-Date).AddMinutes(5) `
  -RepetitionInterval (New-TimeSpan -Hours 2) `
  -RepetitionDuration (New-TimeSpan -Days 3650)

$settings = New-ScheduledTaskSettingsSet `
  -StartWhenAvailable `
  -MultipleInstances IgnoreNew `
  -ExecutionTimeLimit (New-TimeSpan -Minutes 30)

$principal = New-ScheduledTaskPrincipal `
  -UserId $env:USERNAME `
  -LogonType Interactive `
  -RunLevel Limited

Register-ScheduledTask `
  -TaskName $TaskName `
  -Action $action `
  -Trigger $trigger `
  -Settings $settings `
  -Principal $principal `
  -Description 'Sync the public FPKS knowledge base, build Quartz, and publish changes to GitHub.' `
  -Force | Out-Null

Write-Host "Scheduled task installed: $TaskName"
