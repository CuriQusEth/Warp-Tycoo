import { NextResponse } from 'next/server';

export async function OPTIONS() {
  const headers = new Headers();
  headers.set('Access-Control-Allow-Origin', '*');
  headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  return new NextResponse(null, { status: 200, headers });
}

export async function GET() {
  return NextResponse.json(
    { status: "MCP Server Active. Use POST for JSON-RPC." },
    {
      headers: {
        'Access-Control-Allow-Origin': '*',
      }
    }
  );
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { jsonrpc = "2.0", id, method, params } = body;

    // 1. Initialize logic
    if (method === 'initialize') {
      return NextResponse.json({
        jsonrpc,
        id,
        result: {
          protocolVersion: "2024-11-05",
          capabilities: {
            tools: {},
            prompts: {},
            resources: {}
          },
          serverInfo: {
            name: "Warp Tycoo MCP Endpoint",
            version: "1.0.0"
          }
        }
      }, { headers: { 'Access-Control-Allow-Origin': '*' } });
    }

    // 2. Tools list
    if (method === 'tools/list') {
      return NextResponse.json({
        jsonrpc,
        id,
        result: {
          tools: [
            {
              name: "get_empire_status",
              description: "Get the current status of the warp empire",
              inputSchema: { type: "object", properties: {} }
            },
            {
              name: "collect_resources",
              description: "Collect all extracted resources",
              inputSchema: { type: "object", properties: {} }
            },
            {
              name: "upgrade_gate",
              description: "Upgrade a dimensional warp gate",
              inputSchema: { 
                type: "object", 
                properties: {
                  gateId: { type: "string" }
                },
                required: ["gateId"]
              }
            }
          ]
        }
      }, { headers: { 'Access-Control-Allow-Origin': '*' } });
    }

    // 3. Tools call
    if (method === 'tools/call') {
      const toolName = params?.name;
      return NextResponse.json({
        jsonrpc,
        id,
        result: {
          content: [
            {
              type: "text",
              text: `Command executed for tool: ${toolName}. [PLACEHOLDER]`
            }
          ]
        }
      }, { headers: { 'Access-Control-Allow-Origin': '*' } });
    }

    // 4. Prompts list
    if (method === 'prompts/list') {
      return NextResponse.json({ 
        jsonrpc, 
        id, 
        result: { 
          prompts: [
            {
              name: "empire_overview",
              description: "Get an overview of the empire's current layout",
              arguments: []
            }
          ] 
        } 
      }, { headers: { 'Access-Control-Allow-Origin': '*' } });
    }

    // 5. Resources list
    if (method === 'resources/list') {
      return NextResponse.json({ 
        jsonrpc, 
        id, 
        result: { 
          resources: [
            {
              uri: "warp://empire/dashboard",
              name: "Empire Dashboard",
              description: "Main dashboard data for the Warp Tycoon empire"
            }
          ] 
        } 
      }, { headers: { 'Access-Control-Allow-Origin': '*' } });
    }

    // Generic fallback for any other command execution POSTs
    return NextResponse.json({
      jsonrpc,
      id,
      result: {
        status: "success",
        message: "MCP command received",
        agent: "Warp Tycoo Orchestrator",
        receivedAt: new Date().toISOString(),
        payload: body
      }
    }, { headers: { 'Access-Control-Allow-Origin': '*' } });

  } catch (error) {
    return NextResponse.json(
      { jsonrpc: "2.0", id: null, error: { code: -32600, message: "Invalid MCP request format" } }, 
      { status: 400, headers: { 'Access-Control-Allow-Origin': '*' } }
    );
  }
}
