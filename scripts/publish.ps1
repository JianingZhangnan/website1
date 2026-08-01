[CmdletBinding()]
param(
  [switch]$NoPush
)

$ErrorActionPreference = 'Stop'
$SourceRoot = 'D:\learn\FPKS'
$RepoRoot = 'D:\site\website1'
$ContentRoot = Join-Path $RepoRoot 'content'
$LogRoot = Join-Path $env:LOCALAPPDATA 'FPKS-Publish'
$LogFile = Join-Path $LogRoot 'publish.log'
$MutexName = 'Local\FPKS-Website-Publish'
$env:GIT_SSH_COMMAND = '"C:/Program Files/Git/usr/bin/ssh.exe" -F /dev/null -o BatchMode=yes -o ConnectTimeout=15 -o StrictHostKeyChecking=yes'
$AllowedDirectories = @(
  'AISE',
  'assets',
  'Excalidraw',
  'Group',
  '数理方法',
  '统计物理',
  '英语',
  '重整化群与临界指数',
  '量子力学'
)
$AllowedRootFiles = @('笔记写作规范.md')
$AllowedMasks = @('*.md', '*.png', '*.jpg', '*.jpeg', '*.webp', '*.gif', '*.svg', '*.py', '*.tex', '*.csv', '*.txt', '*.yaml', '*.yml', '*.json', '*.css', '*.js')
$ExcludedDirectories = @('.git', '.obsidian', '.codex', '.vscode', '.tmp_pdf_read', 'DRAFT', 'Clippings', 'node_modules')
$ExcludedFiles = @('AGENT.md', 'CLAUDE.md', '.obsidian.vimrc', '*.pdf', '*.ttf', '*.otf', '*.log', '*.aux', '*.out', '*.toc', '*.synctex*', '*.bak*', '.env*', '*.pem', '*.key')

New-Item -ItemType Directory -Force -Path $LogRoot | Out-Null
$mutex = [System.Threading.Mutex]::new($false, $MutexName)
$hasMutex = $false

function Write-Log {
  param([string]$Message)
  $line = '{0:yyyy-MM-dd HH:mm:ss} {1}' -f (Get-Date), $Message
  Add-Content -LiteralPath $LogFile -Value $line -Encoding utf8
  Write-Host $line
}

function Invoke-Checked {
  param(
    [Parameter(Mandatory)][string]$FilePath,
    [Parameter(Mandatory)][string[]]$ArgumentList,
    [int[]]$SuccessCodes = @(0)
  )
  & $FilePath @ArgumentList
  if ($LASTEXITCODE -notin $SuccessCodes) {
    throw "$FilePath failed with exit code $LASTEXITCODE"
  }
}

try {
  $hasMutex = $mutex.WaitOne(0)
  if (-not $hasMutex) {
    Write-Log 'Another publish is already running; exiting.'
    exit 0
  }

  Write-Log 'Starting FPKS website sync.'
  if (-not (Test-Path -LiteralPath $SourceRoot -PathType Container)) {
    throw "Source folder not found: $SourceRoot"
  }
  if (-not (Test-Path -LiteralPath (Join-Path $RepoRoot '.git') -PathType Container)) {
    throw "Git repository not found: $RepoRoot"
  }

  Push-Location $RepoRoot
  try {
    $workingTreeState = & git.exe status --porcelain
    if ($LASTEXITCODE -ne 0) {
      throw "git status failed with exit code $LASTEXITCODE"
    }
    if ($workingTreeState) {
      throw "Repository has uncommitted changes; refusing to merge or publish:`n$($workingTreeState -join [Environment]::NewLine)"
    }

    $branch = & git.exe branch --show-current
    if ($LASTEXITCODE -ne 0 -or $branch.Trim() -ne 'main') {
      throw "Publisher requires the desktop repository to be on main. Current branch: $branch"
    }

    Write-Log 'Fast-forwarding the desktop checkout from origin/main.'
    Invoke-Checked -FilePath 'git.exe' -ArgumentList @('fetch', '--prune', 'origin', 'main')
    Invoke-Checked -FilePath 'git.exe' -ArgumentList @('merge', '--ff-only', 'FETCH_HEAD')
  } finally {
    Pop-Location
  }

  New-Item -ItemType Directory -Force -Path $ContentRoot | Out-Null

  foreach ($directory in $AllowedDirectories) {
    $source = Join-Path $SourceRoot $directory
    $destination = Join-Path $ContentRoot $directory
    if (-not (Test-Path -LiteralPath $source -PathType Container)) {
      Write-Log "Skipping missing source directory: $directory"
      continue
    }
    New-Item -ItemType Directory -Force -Path $destination | Out-Null
    $arguments = @($source, $destination) + $AllowedMasks + @('/MIR', '/R:2', '/W:2', '/FFT', '/XJ', '/NP', '/NFL', '/NDL', '/XD') + $ExcludedDirectories + @('/XF') + $ExcludedFiles
    Invoke-Checked -FilePath 'robocopy.exe' -ArgumentList $arguments -SuccessCodes (0..7)
  }

  foreach ($file in $AllowedRootFiles) {
    $source = Join-Path $SourceRoot $file
    $destination = Join-Path $ContentRoot $file
    if (Test-Path -LiteralPath $source -PathType Leaf) {
      Copy-Item -LiteralPath $source -Destination $destination -Force
    }
  }

  $forbidden = Get-ChildItem -LiteralPath $ContentRoot -Recurse -File | Where-Object {
    $_.Length -ge 24MB -or
    $_.Extension -in @('.pdf', '.ttf', '.otf', '.pem', '.key') -or
    $_.Name -like '*.bak*' -or
    $_.Name -like '.env*'
  }
  if ($forbidden) {
    $names = ($forbidden.FullName -join [Environment]::NewLine)
    throw "Publish validation found forbidden or oversized files:`n$names"
  }

  $secretPattern = '(?i)(-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|github_pat_[A-Za-z0-9_]{20,}|gh[pousr]_[A-Za-z0-9]{30,}|sk-[A-Za-z0-9]{32,}|(?:api[_-]?key|secret[_-]?key|access[_-]?token)\s*[:=]\s*["''][^"'']{12,}["''])'
  $textFiles = Get-ChildItem -LiteralPath $ContentRoot -Recurse -File | Where-Object { $_.Extension -in @('.md', '.txt', '.yaml', '.yml', '.json', '.py', '.js', '.css', '.tex') }
  $secretHits = $textFiles | Select-String -Pattern $secretPattern
  if ($secretHits) {
    $hitSummary = $secretHits | Select-Object -First 20 Path, LineNumber, Line
    throw "Potential secrets found:`n$($hitSummary | Out-String)"
  }

  Push-Location $RepoRoot
  try {
    $nodeModules = Join-Path $RepoRoot 'node_modules'
    $dependencyStamp = Join-Path $nodeModules '.fpks-dependency-stamp'
    $expectedDependencyStamp = '{0}:{1}' -f `
      (Get-FileHash -LiteralPath (Join-Path $RepoRoot 'package.json') -Algorithm SHA256).Hash,
      (Get-FileHash -LiteralPath (Join-Path $RepoRoot 'package-lock.json') -Algorithm SHA256).Hash
    $installedDependencyStamp = if (Test-Path -LiteralPath $dependencyStamp -PathType Leaf) {
      (Get-Content -LiteralPath $dependencyStamp -Raw).Trim()
    } else {
      ''
    }
    if (-not (Test-Path -LiteralPath $nodeModules -PathType Container) -or $installedDependencyStamp -ne $expectedDependencyStamp) {
      Write-Log 'Installing pinned Node.js dependencies.'
      Invoke-Checked -FilePath 'npm.cmd' -ArgumentList @('ci', '--prefer-offline', '--no-audit')
      Set-Content -LiteralPath $dependencyStamp -Value $expectedDependencyStamp -Encoding ascii
    }

    Write-Log 'Building the static site.'
    Invoke-Checked -FilePath 'npx.cmd' -ArgumentList @('quartz', 'build')

    $paths = @('content/index.md', 'content/笔记写作规范.md') + ($AllowedDirectories | ForEach-Object { "content/$_" })
    Invoke-Checked -FilePath 'git.exe' -ArgumentList (@('add', '--') + $paths)
    & git.exe diff --cached --quiet
    $hasChanges = $LASTEXITCODE -eq 1
    if ($LASTEXITCODE -notin @(0, 1)) {
      throw "git diff failed with exit code $LASTEXITCODE"
    }

    if ($hasChanges) {
      $message = 'Update knowledge base {0:yyyy-MM-dd HH:mm}' -f (Get-Date)
      Invoke-Checked -FilePath 'git.exe' -ArgumentList @('commit', '-m', $message)
    } else {
      Write-Log 'No new public content changes.'
    }

    if (-not $NoPush) {
      Invoke-Checked -FilePath 'git.exe' -ArgumentList @('push', 'origin', 'main')
      Write-Log 'Desktop main is synchronized with origin/main.'
    } else {
      Write-Log 'NoPush was specified; local commits were not pushed.'
    }
  } finally {
    Pop-Location
  }
} catch {
  Write-Log "ERROR: $($_.Exception.Message)"
  throw
} finally {
  if ($hasMutex) {
    $mutex.ReleaseMutex()
  }
  $mutex.Dispose()
}
