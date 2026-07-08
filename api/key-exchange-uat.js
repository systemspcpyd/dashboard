export default async function handler(req, res) {
  // --- CORS HEADERS (must be first, always set) ---
  res.setHeader('Access-Control-Allow-Origin', '*'); // tighten later if needed
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // --- HANDLE PREFLIGHT ---
  if (req.method === 'OPTIONS') {
    return res.status(200).end(); // or 204
  }

  // --- ONLY ALLOW POST AFTER THIS ---
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const KEY_EXCHANGE_URL = "https://devlink.paydee.co/mpi/mkReq";

    const response = await fetch(KEY_EXCHANGE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body),
    });

    const data = await response.json();

    return res.status(response.status).json(data);
  } catch (error) {
    console.error('Proxy Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
