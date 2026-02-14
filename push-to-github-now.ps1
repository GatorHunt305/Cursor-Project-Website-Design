# Load Git into this session and push (run this in PowerShell)
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
Set-Location $PSScriptRoot
Write-Host "Pushing to GitHub..." -ForegroundColor Cyan
git push -u origin main
Write-Host "Done. If it asked for credentials, use username GatorHunt305 and your Personal Access Token as password." -ForegroundColor Yellow
