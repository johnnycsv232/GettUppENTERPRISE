---
description: Setup MCP servers for the GettUpp Enterprise project
---

# MCP Server Setup Workflow

This workflow configures all Model Context Protocol (MCP) servers for AI agent integration.

## Prerequisites

1. Node.js 18+ installed
2. API keys configured in `.env.local` or `.env.mcp`

## Steps

// turbo

1. Verify Node.js version:

   ```powershell
   node --version
   ```

// turbo
2. Run the MCP verification script:

   ```powershell
   node scripts/verify-mcp.js
   ```

3. Test individual MCP servers:

   **Context7 (Documentation)**:

   ```powershell
   npx -y @upstash/context7-mcp@latest --help
   ```

   **Notion (Workspace)**:

   ```powershell
   npx -y @notionhq/notion-mcp-server --help
   ```

   **Stripe (Payments)**:

   ```powershell
   npx -y @stripe/mcp --help
   ```

   npx @modelcontextprotocol/inspector

   ```

5. **Validate Active Servers**:
   - Check the list of available MCP servers in your IDE (e.g., by typing `@`).
   - **Rule**: Run `@mcp:context7` to assist with validating the configuration or troubleshooting missing servers.

     ```
     @mcp:context7 validate configuration
     ```

   - Verify that all expected servers are listed. If servers are missing (like Stripe, Vercel, etc.), check `mcp-servers.json` and your environment variables again.

## Environment Variables

The following variables must be set in `.env.local`:

| Variable | Service | Status |
|----------|---------|--------|
| CONTEXT7_API_KEY | Context7 | Required |
| NOTION_API_KEY | Notion | Required |
| VERCEL_TOKEN | Vercel | Required |
| HUGGINGFACE_API_KEY | HuggingFace | Required |
| CAL_API_KEY | Cal.com | Required |
| SANITY_API_TOKEN | Sanity CMS | Required |
| GITHUB_PERSONAL_ACCESS_TOKEN | GitHub | Required |
| STRIPE_SECRET_KEY | Stripe | Required |
| FIREBASE_PROJECT_ID | Firebase | Required |

## Configured Servers (21 total)

1. **context7** - Library documentation
2. **filesystem** - File operations
3. **git** - Git operations
4. **github** - GitHub API
5. **stripe** - Payments
6. **notion** - Workspace docs
7. **cal** - Calendar booking
8. **huggingface** - AI models
9. **sanity** - CMS (hosted)
10. **vercel** - Deployments
11. **v0** - AI components
12. **memory** - Knowledge graph
13. **sequential-thinking** - Reasoning
14. **puppeteer** - Browser automation
15. **fetch** - HTTP requests
16. **brave-search** - Web search
17. **firebase** - Backend services
18. **sqlite** - Local database
19. **time** - Timezone utilities
20. **metamcp** - MCP middleware
21. **mcpjungle** - Server registry

## Troubleshooting

- If a server fails to start, check that its environment variables are set
- Use `npm cache clean --force` if package download fails
- Ensure `service-account.json` exists for Firebase operations
