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
    {
      name: "Warp Tycoo Orchestrator",
      status: "active",
      wallet: "0x29536D0bc1004ab274c4F0F59734Ad74D4559b7B",
      platform: "Warp Tycoo",
      version: "1.0.0"
    },
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
    return NextResponse.json({
      name: "Warp Tycoo Orchestrator",
      status: "active",
      message: "Agent communication received",
      payload: body
    }, { headers: { 'Access-Control-Allow-Origin': '*' } });
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid agent request format" }, 
      { status: 400, headers: { 'Access-Control-Allow-Origin': '*' } }
    );
  }
}
