---
description: Universal "God Mode" Project Setup
---

# Universal Project Bootstrap (God Mode)

This workflow runs the `bootstrap.ts` script to act as a "Single Source of Truth" setup. It ensures Node.js, Dependencies (including all MCP servers), and Environment Variables are perfectly configured.

## Usage

// turbo

1. Run the bootstrap script:

   ```powershell
   npx ts-node scripts/bootstrap.ts
   ```

## Checks Performed

- **Node.js**: v20+
- **Environment**: `.env.local` validation
- **Dependencies**: `npm install` (includes 20+ MCP servers)
- **Connectivity**: Stripe, Turso, Sanity, Firebase
