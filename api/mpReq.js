export default async function handler(req, res) {
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
        let bodyData;
        if (typeof req.body === 'object' && req.body !== null) {
            bodyData = new URLSearchParams(req.body).toString();
        } else {
            bodyData = req.body;
        }

        const response = await fetch('https://devlink.paydee.co/mpi/mpReq', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: bodyData
        });

        const textResponse = await response.text();
        
        // Safely parse JSON or wrap non-JSON responses (like HTML error pages)
        let data;
        try {
            data = JSON.parse(textResponse);
        } catch (e) {
            data = { errorCode: "GATEWAY_HTML_ERROR", errorMessage: textResponse };
        }

        return res.status(response.status).json(data);
    } catch (error) {
        console.error("Proxy Error:", error);
        return res.status(500).json({ 
            errorCode: "PROXY_EXCEPTION", 
            errorMessage: error.message 
        });
    }
}
