import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware
  app.use(express.json());

  // --- API Routes ---

  // MCP API Route
  app.options("/api/mcp", (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.status(200).end();
  });

  app.get("/api/mcp", (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    res.json({
      protocol: "MCP",
      version: "1.0.0",
      name: "Warp Tycoo MCP Endpoint",
      status: "active",
      description: "Active MCP server for Warp Tycoo Orchestrator Agent",
      capabilities: [
        "warp-tycoon-mechanics",
        "economic-automation",
        "strategic-empire-building"
      ],
      timestamp: new Date().toISOString()
    });
  });

  app.post("/api/mcp", (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    try {
      const body = req.body || {};
      const { jsonrpc = "2.0", id, method, params } = body;

      if (method === 'initialize') {
        return res.json({
          jsonrpc,
          id,
          result: {
            protocolVersion: "2024-11-05",
            capabilities: { tools: {}, prompts: {}, resources: {} },
            serverInfo: { name: "Warp Tycoo MCP Endpoint", version: "1.0.0" }
          }
        });
      }

      if (method === 'tools/list') {
        return res.json({
          jsonrpc,
          id,
          result: {
            tools: [
              { name: "get_empire_status", description: "Get the current status of the warp empire", inputSchema: { type: "object", properties: {} } },
              { name: "collect_resources", description: "Collect all extracted resources", inputSchema: { type: "object", properties: {} } },
              { name: "upgrade_gate", description: "Upgrade a dimensional warp gate", inputSchema: { type: "object", properties: { gateId: { type: "string" } }, required: ["gateId"] } }
            ]
          }
        });
      }

      if (method === 'tools/call') {
        const toolName = params?.name;
        return res.json({
          jsonrpc,
          id,
          result: {
            content: [ { type: "text", text: `Command executed for tool: ${toolName}. [PLACEHOLDER]` } ]
          }
        });
      }

      if (method === 'prompts/list') {
        return res.json({ 
          jsonrpc, 
          id, 
          result: { 
            prompts: [
              { name: "empire_overview", description: "Get an overview of the empire's current layout", arguments: [] }
            ] 
          } 
        });
      }

      if (method === 'resources/list') {
        return res.json({ 
          jsonrpc, 
          id, 
          result: { 
            resources: [
              { uri: "warp://empire/dashboard", name: "Empire Dashboard", description: "Main dashboard data for the Warp Tycoon empire" }
            ] 
          } 
        });
      }

      return res.json({
        jsonrpc,
        id,
        result: {
          status: "success",
          message: "MCP command received",
          agent: "Warp Tycoo Orchestrator",
          receivedAt: new Date().toISOString(),
          payload: body
        }
      });
    } catch (error) {
      res.status(400).json({ jsonrpc: "2.0", id: null, error: { code: -32600, message: "Invalid MCP request" } });
    }
  });

  // Agent API Route
  app.options("/api/agent", (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.status(200).end();
  });

  app.get("/api/agent", (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    res.json({
      name: "Warp Tycoo Orchestrator",
      status: "active",
      wallet: "0x29536D0bc1004ab274c4F0F59734Ad74D4559b7B",
      platform: "Warp Tycoo",
      version: "1.0.0"
    });
  });

  app.post("/api/agent", (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    res.json({
      name: "Warp Tycoo Orchestrator",
      status: "active",
      message: "Agent communication received",
      payload: req.body || {}
    });
  });

  // --- Vite / Static files middleware ---
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    // Fallback for single page application (SPA) routing
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
