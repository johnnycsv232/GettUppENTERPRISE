# MCP Servers Setup Complete ✅

## Summary

MCP servers have been configured for GettUpp Enterprise, including **Pieces MCP** (local SSE) and **Context7**.

## Configured MCP Servers

See `mcp-servers.json` for the authoritative list.

## Environment Files

- `.env.local` - Main application environment variables
- `.env.mcp` - MCP-specific environment variables

## API Keys Configured

Keys should be configured **locally** in `.env.local` / `.env.mcp` and **must not be committed** to the repo.

Example formats:

- Context7: `CONTEXT7_API_KEY=ctx7sk-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`
- Notion: `NOTION_API_KEY=ntn_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
- Vercel: `VERCEL_TOKEN=vck_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
- HuggingFace: `HUGGINGFACE_API_KEY=hf_xxxxxxxxxxxxxxxxxxxxxxxxxxxx`
- Cal.com: `CAL_API_KEY=cal_live_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
- GitHub: `GITHUB_PERSONAL_ACCESS_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

## Next Steps

1. Restart Cursor/VS Code so MCP configs reload
2. Verify setup:

```powershell
node scripts/verify-mcp.js
```

## Pieces MCP Status / Notes

- Pieces MCP is configured in `mcp-servers.json` as an **SSE endpoint**.
- Ensure **Pieces OS** is running and MCP is enabled.
- If the port differs on your machine, copy the SSE endpoint from **Pieces OS → Quick Menu → MCP Servers** and update `mcp-servers.json`.

## Configuration Files

- `mcp-servers.json` - MCP server definitions

---

*Setup notes updated: 2025-12-18*
