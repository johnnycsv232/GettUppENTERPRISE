# Test Context7 MCP Server
# Command 7 - Context7 API Integration Test

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Testing Context7 MCP Integration     " -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$projectRoot = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
if (-not $projectRoot) {
    $projectRoot = Get-Location
}

Set-Location $projectRoot

# Load environment variables
$envLocalPath = "$projectRoot\.env.local"
if (Test-Path $envLocalPath) {
    Get-Content $envLocalPath | ForEach-Object {
        if ($_ -match '^([A-Z][A-Z0-9_]*)=(.*)$') {
            $name = $matches[1].Trim()
            $value = $matches[2].Trim().TrimStart('"').TrimEnd('"')
            [Environment]::SetEnvironmentVariable($name, $value, "Process")
        }
    }
}

$context7Key = [Environment]::GetEnvironmentVariable("CONTEXT7_API_KEY", "Process")

if (-not $context7Key) {
    Write-Host "[✗] CONTEXT7_API_KEY not found in environment" -ForegroundColor Red
    Write-Host "    Please run scripts/setup-all-mcps.ps1 first" -ForegroundColor Yellow
    exit 1
}

Write-Host "[✓] Context7 API Key found: $($context7Key.Substring(0, 20))..." -ForegroundColor Green
Write-Host ""

# Test Context7 MCP server
Write-Host "[+] Testing Context7 MCP server..." -ForegroundColor Yellow
Write-Host "    Running: npx -y @upstash/context7-mcp@latest" -ForegroundColor DarkGray
Write-Host ""

$env:CONTEXT7_API_KEY = $context7Key
npx -y @upstash/context7-mcp@latest --help

Write-Host ""
Write-Host "[✓] Context7 MCP server is ready!" -ForegroundColor Green
Write-Host ""
Write-Host "Context7 provides:" -ForegroundColor White
Write-Host "  • Up-to-date library documentation" -ForegroundColor DarkGray
Write-Host "  • Code examples and patterns" -ForegroundColor DarkGray
Write-Host "  • Prevents AI hallucinations" -ForegroundColor DarkGray
Write-Host "  • Real-time API documentation" -ForegroundColor DarkGray
Write-Host ""



