export default async function handler(req, res) {
    // Enable CORS for your frontend
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight OPTIONS request
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // Format the body back into x-www-form-urlencoded for the payment gateway
        const formData = new URLSearchParams(req.body).toString();

        const response = await fetch('https://devlink.paydee.co/mpi/mpReq', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: formData
        });

        const data = await response.json();
        return res.status(response.status).json(data);
    } catch (error) {
        console.error("Proxy Error:", error);
        return res.status(500).json({ 
            errorCode: "PROXY_EXCEPTION", 
            errorMessage: error.message 
        });
    }
}
