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
    const { method, params } = body;

    // 1. Initialize logic
    if (method === 'initialize') {
      return NextResponse.json({
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
      }, { headers: { 'Access-Control-Allow-Origin': '*' } });
    }

    // 2. Tools list
    if (method === 'tools/list') {
      return NextResponse.json({
        tools: [
          {
            name: "get_race_status",
            description: "Get the current status of the race",
            inputSchema: { type: "object", properties: {} }
          },
          {
            name: "start_race",
            description: "Start a new race",
            inputSchema: { type: "object", properties: {} }
          },
          {
            name: "get_leaderboard",
            description: "Retrieve the current leaderboard",
            inputSchema: { type: "object", properties: {} }
          },
          {
            name: "optimize_speed",
            description: "Optimize the vehicle speed",
            inputSchema: { type: "object", properties: {} }
          },
          {
            name: "get_track_info",
            description: "Get information about the current track",
            inputSchema: { type: "object", properties: {} }
          }
        ]
      }, { headers: { 'Access-Control-Allow-Origin': '*' } });
    }

    // 3. Tools call
    if (method === 'tools/call') {
      const toolName = params?.name;
      return NextResponse.json({
        content: [
          {
            type: "text",
            text: `Command executed for tool: ${toolName}. [PLACEHOLDER] functionality.`
          }
        ]
      }, { headers: { 'Access-Control-Allow-Origin': '*' } });
    }

    // 4. Prompts list
    if (method === 'prompts/list') {
      return NextResponse.json({ prompts: [] }, { headers: { 'Access-Control-Allow-Origin': '*' } });
    }

    // 5. Resources list
    if (method === 'resources/list') {
      return NextResponse.json({ resources: [] }, { headers: { 'Access-Control-Allow-Origin': '*' } });
    }

    // Generic fallback for any other command execution POSTs
    return NextResponse.json({
      status: "success",
      message: "MCP command received",
      agent: "Warp Tycoo Orchestrator",
      receivedAt: new Date().toISOString(),
      payload: body
    }, { headers: { 'Access-Control-Allow-Origin': '*' } });

  } catch (error) {
    return NextResponse.json(
      { error: "Invalid MCP request format" }, 
      { status: 400, headers: { 'Access-Control-Allow-Origin': '*' } }
    );
  }
}
