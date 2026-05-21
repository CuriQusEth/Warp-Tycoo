# Warp Tycoon / Warp Tycoo Orchestrator

Warp Tycoon is a modern, mobile-first idle tycoon game where you build and manage an interstellar warp empire. Build your dimensional network, gather rare resources, and oversee trade across systems!

## 🚀 Project Overview

- **App Name:** Warp Tycoon / Warp Tycoo Orchestrator
- **Description:** Build an interdimensional trade network. Uses real-time mechanics, automatic resource extraction, and strategic scaling of your empire.
- **Agent Card Registration:** `https://warp-tycoo.vercel.app/.well-known/agent-card.json`
- **Agent API:** `https://warp-tycoo.vercel.app/api/agent`
- **MCP API:** `https://warp-tycoo.vercel.app/api/mcp`
- **Current Version:** 1.0.0

## 🤖 AI Agent Integration (ERC-8004 Compat)

This project is fully integrated with **Warp Tycoo Orchestrator**, an ERC-8004 compatible AI Agent on the `eip155:8453` chain context.

### Agent Skills & Capabilities:
- `warp-tycoon-mechanics`
- `economic-automation`
- `multi-warp-management`
- `strategic-empire-building`
- `resource-orchestration`
- `trading-automation`
- `mcp-command-execution`

### Model Context Protocol (MCP)

Warp Tycoon's Orchestrator agent exposes an active Next.js (App Router) MCP implementation capable of dynamic tool execution.

**How to connect to the MCP server:**
1. Connect via HTTP POST requests to `/api/mcp`.
2. Initializing requires sending an `initialize` JSON-RPC string.
3. Access enabled tools via `tools/list` and `tools/call`.

## 🛠 Tech Stack

- **Framework:** Next.js 14/15 App Router Architecture
- **Blockchain integration:** Wagmi, Viem
- **Styling:** Tailwind CSS, Framer Motion
- **State Management:** Zustand

## 💻 Running Locally

1. Clone the repository and run `npm install`.
2. Start the dev server with `npm run dev`.
3. Test your MCP agent logic locally at `http://localhost:3000/api/mcp`.
