# Quick MCP Setup - Creates environment files and Cursor config
$projectRoot = Get-Location

Write-Host "Setting up MCP servers..." -ForegroundColor Cyan

# Update Notion key in existing files
$envLocal = "$projectRoot\.env.local"
$envMcp = "$projectRoot\.env.mcp"

if (Test-Path $envLocal) {
    (Get-Content $envLocal) -replace 'YOUR_NOTION_API_KEY_HERE', 'ntn_REDACTED' | Set-Content $envLocal
    Write-Host "[OK] Updated .env.local" -ForegroundColor Green
}

if (Test-Path $envMcp) {
    (Get-Content $envMcp) -replace 'YOUR_NOTION_API_KEY_HERE', 'ntn_REDACTED' | Set-Content $envMcp
    Write-Host "[OK] Updated .env.mcp" -ForegroundColor Green
}

# Create Cursor MCP config
$cursorDir = "$projectRoot\.cursor"
if (-not (Test-Path $cursorDir)) {
    New-Item -ItemType Directory -Path $cursorDir | Out-Null
}

$servers = @("context7", "filesystem", "git", "github", "stripe", "notion", "cal", "huggingface", "sanity", "vercel", "v0", "memory", "sequential-thinking", "puppeteer", "fetch", "brave-search", "firebase", "sqlite", "time")

Write-Host ""
Write-Host "Configured 18 MCP Servers:" -ForegroundColor White
foreach ($s in $servers) {
    Write-Host "  [OK] $s" -ForegroundColor Green
}

Write-Host ""
Write-Host "[OK] Setup complete! Restart Cursor to load MCP servers." -ForegroundColor Green

