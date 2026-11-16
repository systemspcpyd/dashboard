export default async function handler(req, res) {
  // --- CORS HEADERS ---
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // --- HANDLE PREFLIGHT ---
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const KEY_EXCHANGE_URL = "https://devlinkv2.paydee.co/mpi/mkReq";

    const response = await fetch(KEY_EXCHANGE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body),
    });

    // Read response text first instead of assuming it's JSON
    const responseText = await response.text();

    try {
      const data = JSON.parse(responseText);
      return res.status(response.status).json(data);
    } catch (parseError) {
      // The upstream server returned HTML or plain text instead of JSON
      console.error('Upstream Non-JSON Response:', responseText);
      return res.status(502).json({ 
        error: 'Bad Gateway: Upstream server returned invalid JSON', 
        details: responseText.substring(0, 200) // Send a snippet back for debugging
      });
    }

  } catch (error) {
    console.error('Proxy Error:', error);
    return res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
}
