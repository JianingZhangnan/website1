[CmdletBinding()]
param(
  [switch]$Apply,
  [string]$VaultRoot = ''
)

$ErrorActionPreference = 'Stop'
$RepoRoot = Split-Path -Parent $PSScriptRoot

Push-Location $RepoRoot
try {
  $stageArguments = @('run', 'stage:acoustic')
  if ($Apply -or $VaultRoot) {
    $stageArguments += '--'
    if ($VaultRoot) {
      $stageArguments += @('--vault', $VaultRoot)
    }
    if ($Apply) {
      $stageArguments += '--apply'
    }
  }

  & npm.cmd @stageArguments
  if ($LASTEXITCODE -ne 0) {
    throw "Acoustic staging failed with exit code $LASTEXITCODE"
  }

  if (-not $Apply) {
    Write-Host 'Preview only: no website files, Git history, or remote deployment were changed.'
    Write-Host 'After reviewing the list, rerun with -Apply to refresh the local public snapshot.'
    exit 0
  }

  & npm.cmd run check:publication
  if ($LASTEXITCODE -ne 0) {
    throw "Publication checks failed with exit code $LASTEXITCODE"
  }

  & npm.cmd run build:acoustic
  if ($LASTEXITCODE -ne 0) {
    throw "Acoustic site build failed with exit code $LASTEXITCODE"
  }

  Write-Host 'Local snapshot and build are ready for manual review.'
  Write-Host 'This script intentionally does not run git add, commit, push, or deploy.'
} finally {
  Pop-Location
}
