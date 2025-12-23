# MCP Servers Configuration Guide

## GettUpp Enterprise - Model Context Protocol Setup

This document outlines the MCP (Model Context Protocol) servers configured for the GettUpp Enterprise project.

---

## Quick Start

### 1. Prerequisites

- **Node.js 18+** (v20 recommended)
- **npm 10+**
- All API keys configured in `.env.local` or `.env.mcp`

### 2. Environment Setup

The following environment files are used:

| File | Purpose |
|------|---------|
| `.env.local` | All environment variables for Next.js app |
| `.env.mcp` | MCP-specific environment variables |
| `service-account.json` | Firebase Admin SDK credentials |

### 3. Test MCP Servers

```powershell
# Test the MCP Inspector (interactive debugging)
npx @modelcontextprotocol/inspector

# Test individual servers
npx -y @upstash/context7-mcp@latest --help
npx -y @modelcontextprotocol/server-filesystem .
```

---

## Configured MCP Servers

### Core Infrastructure

| Server | Package | Description |
|--------|---------|-------------|
| **context7** | `@upstash/context7-mcp` | Real-time library documentation |
| **filesystem** | `@modelcontextprotocol/server-filesystem` | File system operations |
| **git** | `@modelcontextprotocol/server-git` | Git repository operations |
| **github** | `@modelcontextprotocol/server-github` | GitHub API integration |
| **memory** | `@modelcontextprotocol/server-memory` | Persistent knowledge graph |

### Business Services

| Server | Package | Description | Required Env Vars |
|--------|---------|-------------|-------------------|
| **stripe** | `@stripe/agent-toolkit` | Payments & subscriptions | `STRIPE_SECRET_KEY` |
| **notion** | `@notionhq/mcp-server` | Workspace & docs | `NOTION_API_KEY` |
| **cal** | `@calcom/mcp` | Calendar & booking | `CAL_API_KEY` |
| **sanity** | Remote: `mcp.sanity.io` | CMS operations | `SANITY_API_TOKEN`, `SANITY_PROJECT_ID` |
| **vercel** | `@vercel/mcp-adapter` | Deployments | `VERCEL_TOKEN` |

### AI & Utilities

| Server | Package | Description |
|--------|---------|-------------|
| **pieces** | Local: Pieces OS (SSE) | Long-term memory + workflow context via Pieces MCP |
| **huggingface** | `@huggingface/mcp-server` | Model inference |
| **v0** | `v0-mcp-server` | AI component generation |
| **puppeteer** | `@modelcontextprotocol/server-puppeteer` | Browser automation |
| **fetch** | `@modelcontextprotocol/server-fetch` | HTTP requests |
| **sequential-thinking** | `@modelcontextprotocol/server-sequential-thinking` | Chain-of-thought reasoning |

---

## Environment Variables Reference

### Context7

```
CONTEXT7_API_KEY=ctx7sk-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

### Notion

```
NOTION_API_KEY=ntn_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### Vercel

```
VERCEL_TOKEN=vck_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### HuggingFace

```
HUGGINGFACE_API_KEY=hf_xxxxxxxxxxxxxxxxxxxxxxxxxxxx
HF_TOKEN=hf_xxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### Cal.com

```
CAL_API_KEY=cal_live_REDACTED
```

### Sanity

```
SANITY_API_TOKEN=skXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX...
SANITY_PROJECT_ID=xxxxxxxxxx
SANITY_DATASET=production
SANITY_ORG_ID=xxxxxxxxxx
```

### GitHub

```
GITHUB_PERSONAL_ACCESS_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### Firebase

```
FIREBASE_PROJECT_ID=your-project-id
GOOGLE_APPLICATION_CREDENTIALS=./service-account.json
```

### Stripe

```
STRIPE_SECRET_KEY=sk_live_REDACTED
```

---

## Configuration File: `mcp-servers.json`

The MCP servers are configured in `mcp-servers.json` at the project root. Each server configuration includes:

```json
{
  "serverName": {
    "type": "stdio",           // or "streamable-http" for remote
    "command": "npx",          // Command to run
    "args": ["-y", "package"], // Arguments
    "env": {                   // Environment variables
      "API_KEY": "${API_KEY}"  // Reference to env var
    },
    "description": "Server description"
  }
}
```

---

## Client Integration

### Claude Desktop

Add to `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "context7": {
      "command": "npx",
      "args": ["-y", "@upstash/context7-mcp@latest"],
      "env": {
        "CONTEXT7_API_KEY": "your-api-key"
      }
    }
  }
}
```

### Cursor IDE

Add to `.cursor/settings.json`:

```json
{
  "mcp": {
    "servers": {
      // Same format as mcp-servers.json
    }
  }
}
```

### VS Code

Use the MCP extension and point to `mcp-servers.json`.

---

## Troubleshooting

### Server won't start

1. Check Node.js version: `node --version` (must be 18+)
2. Verify environment variables are set
3. Try running with `--help` flag

### Pieces MCP not reachable

1. Ensure **Pieces OS** is installed and running
2. In Pieces OS, open the **Quick Menu → Model Context Protocol (MCP) Servers** and copy the **SSE endpoint**
3. Update `mcp-servers.json` `pieces.url` to match that SSE endpoint (ports can vary)

### Authentication errors

1. Verify API key is correct
2. Check if API key has required permissions
3. Some services require OAuth setup first

### Package not found

1. Clear npm cache: `npm cache clean --force`
2. Try installing globally: `npm install -g <package>`

---

## Resources

- [Awesome MCP Servers](https://github.com/punkpeye/awesome-mcp-servers)
- [MCP Directory](https://mcp.so)
- [MCP SDK Documentation](https://github.com/anthropics/mcp)

---

*Last updated: December 10, 2025*
