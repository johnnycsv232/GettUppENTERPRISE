# MCP Server Setup Script for Windows PowerShell
# GettUpp Enterprise Project
# Run this script to set up MCP environment variables and test servers

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  GettUpp Enterprise MCP Server Setup  " -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Get the project root directory
$projectRoot = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
if (-not $projectRoot) {
    $projectRoot = Get-Location
}

Write-Host "Project root: $projectRoot" -ForegroundColor DarkGray

# Load environment variables from .env.mcp
$envFile = "$projectRoot\.env.mcp"
if (Test-Path $envFile) {
    Write-Host "[OK] Loading environment variables from .env.mcp..." -ForegroundColor Green
    Get-Content $envFile | ForEach-Object {
        $line = $_
        if ($line -match '^([A-Z][A-Z0-9_]*)=(.*)$') {
            $name = $matches[1].Trim()
            $value = $matches[2].Trim()
            $value = $value.TrimStart('"').TrimEnd('"')
            $value = $value.TrimStart("'").TrimEnd("'")
            [Environment]::SetEnvironmentVariable($name, $value, "Process")
            Write-Host "   Set: $name" -ForegroundColor DarkGray
        }
    }
} else {
    Write-Host "[!] .env.mcp file not found at $envFile" -ForegroundColor Yellow
}

# Also load from .env.local for additional variables
$envLocalFile = "$projectRoot\.env.local"
if (Test-Path $envLocalFile) {
    Write-Host "[OK] Loading additional variables from .env.local..." -ForegroundColor Green
    Get-Content $envLocalFile | ForEach-Object {
        $line = $_
        if ($line -match '^([A-Z][A-Z0-9_]*)=(.*)$') {
            $name = $matches[1].Trim()
            $value = $matches[2].Trim()
            $value = $value.TrimStart('"').TrimEnd('"')
            $value = $value.TrimStart("'").TrimEnd("'")
            if (-not [Environment]::GetEnvironmentVariable($name, "Process")) {
                [Environment]::SetEnvironmentVariable($name, $value, "Process")
            }
        }
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Checking Node.js Installation        " -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

try {
    $nodeVersion = node --version
    Write-Host "[OK] Node.js version: $nodeVersion" -ForegroundColor Green
    
    if ($nodeVersion -match 'v(\d+)') {
        $majorVersion = [int]$matches[1]
        if ($majorVersion -lt 18) {
            Write-Host "[!] Warning: Node.js 18+ is recommended for MCP servers" -ForegroundColor Yellow
        }
    }
} catch {
    Write-Host "[X] Node.js not found. Please install Node.js 18+" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Installing MCP Server Packages       " -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

$mcpPackages = @(
    "@upstash/context7-mcp@latest",
    "@modelcontextprotocol/server-filesystem",
    "@modelcontextprotocol/server-git",
    "@modelcontextprotocol/server-github",
    "@modelcontextprotocol/server-memory",
    "@modelcontextprotocol/server-sequential-thinking",
    "@modelcontextprotocol/server-puppeteer",
    "@modelcontextprotocol/server-fetch",
    "@modelcontextprotocol/server-time",
    "@notionhq/mcp-server",
    "@stripe/agent-toolkit",
    "@calcom/mcp",
    "@huggingface/mcp-server",
    "mcp-vercel"
)

Write-Host "Installing MCP server packages globally..." -ForegroundColor Yellow
foreach ($package in $mcpPackages) {
    Write-Host "  Installing $package..." -ForegroundColor DarkGray
    npm install -g $package 2>$null
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  MCP Server Configuration Summary     " -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

$mcpConfigPath = "$projectRoot\mcp-servers.json"
if (Test-Path $mcpConfigPath) {
    $mcpConfigContent = Get-Content $mcpConfigPath -Raw
    $mcpConfig = $mcpConfigContent | ConvertFrom-Json
    $servers = $mcpConfig.mcpServers | Get-Member -MemberType NoteProperty
    $serverCount = $servers.Count

    Write-Host ""
    Write-Host "Configured MCP Servers: $serverCount total" -ForegroundColor White
    foreach ($server in $servers) {
        $serverName = $server.Name
        $serverConfig = $mcpConfig.mcpServers.$serverName
        $description = $serverConfig.description
        Write-Host "  - $serverName : $description" -ForegroundColor Green
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Environment Variable Status          " -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

$criticalVars = @(
    "CONTEXT7_API_KEY",
    "NOTION_API_KEY",
    "VERCEL_TOKEN",
    "HUGGINGFACE_API_KEY",
    "CAL_API_KEY",
    "SANITY_API_TOKEN",
    "GITHUB_PERSONAL_ACCESS_TOKEN",
    "STRIPE_SECRET_KEY",
    "FIREBASE_PROJECT_ID"
)

foreach ($varName in $criticalVars) {
    $value = [Environment]::GetEnvironmentVariable($varName, "Process")
    if ($value) {
        $displayLen = [Math]::Min(8, $value.Length)
        $maskedValue = $value.Substring(0, $displayLen) + "..."
        Write-Host "  [OK] ${varName}: $maskedValue" -ForegroundColor Green
    } else {
        Write-Host "  [X] ${varName}: NOT SET" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Setup Complete!                      " -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor White
Write-Host "  1. Test MCP servers: npx @modelcontextprotocol/inspector" -ForegroundColor DarkGray
Write-Host "  2. Configure your AI client to use mcp-servers.json" -ForegroundColor DarkGray
Write-Host "  3. Run 'npm run dev' to start the Next.js development server" -ForegroundColor DarkGray
Write-Host ""
