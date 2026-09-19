$ErrorActionPreference = 'Stop'

$repository = Split-Path -Parent $PSScriptRoot
Set-Location $repository

$status = git status --porcelain
if (-not $status) {
    exit 0
}

$branch = git branch --show-current
git add --all
git commit -m "Auto-sync CampusFlow files"
git push origin $branch