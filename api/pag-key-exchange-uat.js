export default async function handler(req, res) {
  // 1. Handle CORS preflight OPTIONS request
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Ensure body is properly formatted as a string
    const requestBody = typeof req.body === 'object' ? JSON.stringify(req.body) : req.body;

    const response = await fetch("https://devlinkv2.paydee.co/mpigw/mkReq", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json','User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36' },
      body: requestBody
    });

    const textResponse = await response.text();
    
    // Try parsing response from Paydee as JSON, fallback to text if it isn't JSON
    let data;
    try {
      data = JSON.parse(textResponse);
    } catch (e) {
      data = { rawResponse: textResponse };
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error("Proxy Error:", error);
    return res.status(500).json({ error: error.message });
  }
}
