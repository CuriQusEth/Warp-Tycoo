export default function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    return res.status(200).json({
      name: "Warp Tycoo Orchestrator",
      status: "active",
      wallet: "0x29536D0bc1004ab274c4F0F59734Ad74D4559b7B",
      platform: "Warp Tycoo",
      version: "1.0.0"
    });
  }

  if (req.method === 'POST') {
    const body = req.body || {};
    return res.status(200).json({
      name: "Warp Tycoo Orchestrator",
      status: "active",
      message: "Agent communication received",
      payload: body
    });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
