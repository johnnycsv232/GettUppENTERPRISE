# Security Fix: Removed Hardcoded Notion API Token

## Issue
A real Notion API token was hardcoded as a string literal in multiple source files, exposing credentials in version control history.

## Files Fixed

1. **scripts/explore-notion-vision.js**
   - Removed hardcoded token
   - Now requires `NOTION_TOKEN` or `NOTION_API_KEY` environment variable
   - Added error handling if token is missing

2. **scripts/analyze-notion-workflow.js**
   - Removed hardcoded token
   - Now requires `NOTION_TOKEN` or `NOTION_API_KEY` environment variable
   - Added error handling if token is missing

3. **scripts/test-notion.js**
   - Removed hardcoded token fallback
   - Now requires `NOTION_TOKEN` or `NOTION_API_KEY` environment variable
   - Added error handling if token is missing

4. **scripts/setup-all-mcps.ps1**
   - Replaced hardcoded token with placeholder `YOUR_NOTION_API_KEY_HERE`
   - Users must manually set their token in `.env.local` or `.env.mcp`

## Usage

### PowerShell (Windows)
```powershell
$env:NOTION_API_KEY="your-token-here"
node scripts/test-notion.js
```

### Bash (Linux/Mac)
```bash
export NOTION_API_KEY="your-token-here"
node scripts/test-notion.js
```

### Or use .env.local
Add to `.env.local`:
```
NOTION_API_KEY=your-token-here
```

Then scripts will automatically pick it up via `process.env.NOTION_API_KEY`.

## Next Steps

1. **Rotate the exposed token** in Notion workspace settings
2. **Set new token** in environment variables or `.env.local`
3. **Verify .gitignore** includes `.env*` files (already configured)
4. **Review git history** - consider using `git-filter-repo` to remove token from history if repository is public

## Date Fixed
2025-01-XX

