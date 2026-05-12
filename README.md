# Warp Tycoon

Warp Tycoon is a satisfying, mobile-first idle tycoon game where you build and manage an interstellar warp empire. Start with a small warp station and grow it into a massive interdimensional trade network. Open new warp gates, establish trade routes, upgrade stations, hire crews, and dominate the multiverse economy.

## Features

- **Idle Progression:** Buy extractors, refineries, and warehouses and watch your empire scale automatically.
- **Warp Network:** Open new dimensions and unlock multipliers for massive profits.
- **On-chain mechanics:**
  - Build on **Base Mainnet**.
  - **Trustless Agents (ERC-8004):** Authorize AI agents to interact with your empire.
  - **Transaction Attribution (ERC-8021):** Automatic attribution of all transactions to builders.
  - Write your Empire value immutably on-chain using SIWE signatures.

## AI Agent Integration

This project is fully integrated with **Warp Tycoon Orchestrator**, an ERC-8004 compatible AI Agent.

- **MCP Architecture:** Active Model Context Protocol (MCP) server endpoints enabled to accept AI executions.
- **Agent API:** Live `/api/agent` integration.
- **Protocol JSON:** Discoverable `.well-known/agent-card.json`.

## How to Play

1. Drag and drop extractors around the map to generate income.
2. Upgrade them by clicking on them.
3. Once you reach enough credits, expand your Warp Gates using the "Empire Command" menu.
4. If things get too chaotic or you max out your potential, Prestige to reset with massive multipliers.
5. Record your current empire securely on-chain.

## Tech Stack

- Frontend: React 19, Vite, Tailwind CSS, Framer Motion
- Blockchain: Wagmi, Viem (Base Mainnet)
- Server/API: Express.js
- State Management: Zustand
