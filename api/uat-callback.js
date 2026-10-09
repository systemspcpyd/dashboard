export default function handler(req, res) {
    if (req.method === 'POST') {
        const data = req.body;
        const queryParams = new URLSearchParams(data).toString();

        // --- 1. HANDLE INQUIRY (INQ) RESPONSES ---
        if (data.MPI_TRANS_TYPE === "INQ") {
            // Redirect back to the UAT payment page with query parameters so iframe.onload can read them
            return res.redirect(302, `/redirect/uat-redirect-03.html?${queryParams}`);
        }

        let destination = "";
        
        // --- 2. LOGIC BRIDGE FOR INITIAL REDIRECTS ---
        if (data.MPI_QR_CODE) {
            destination = "/redirect/uat-redirect-03.html";
        } else if (data.MPI_REDIRECT_URL && data.MPI_REDIRECT_HTTP_DATA) {
            destination = "/redirect/redirect-01.html";
        } else if (data.MPI_REDIRECT_URL) {
            destination = "/redirect/redirect-02.html";
        }

        // --- 3. RENDER UI OR REDIRECT ---
        if (destination !== "") {
            res.setHeader('Content-Type', 'text/html');
            res.status(200).send(`
                <html>
                <head>
                    <link rel="stylesheet" href="/css/form.css">
                </head>
                <body style="background-color: #121212; color: #e0e0e0; font-family: sans-serif;">
                    <div class="controls" style="padding: 20px;">
                        <h2>Response Body Received</h2>
                        <pre style="background: #1e1e1e; padding: 15px; border: 1px solid #333; border-radius: 4px; overflow-x: auto; color: #e0e0e0;">
                            ${JSON.stringify(data, null, 4)}
                        </pre>
                        
                        <a href="${destination}?${queryParams}" class="button" style="text-decoration: none;">
                            Continue to Payment
                        </a>
                    </div>
                </body>
                </html>
            `);
        } else {
            res.redirect(302, `/payment-status.html?${queryParams}`);
        }
    } 
    // --- HANDLE GET REQUESTS ---
    else if (req.method === 'GET') {
        const queryParams = new URLSearchParams(req.query).toString();
        const redirectUrl = queryParams ? `/payment-status.html?${queryParams}` : '/payment-status.html';
        return res.redirect(302, redirectUrl);
    } 
    // --- HANDLE OTHER METHODS ---
    else {
        res.status(405).json({ error: "Method Not Allowed" });
    }
}
