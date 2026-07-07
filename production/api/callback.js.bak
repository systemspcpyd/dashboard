export default function handler(req, res) {
    if (req.method === 'POST') {
        const data = req.body;
        const queryParams = new URLSearchParams(data).toString();

        // --- 1. HANDLE INQUIRY (INQ) RESPONSES ---
        if (data.MPI_TRANS_TYPE === "INQ") {
            res.setHeader('Content-Type', 'text/html');
            return res.status(200).send(`
                <script>
                    if (window.parent) {
                        window.parent.postMessage(${JSON.stringify(data)}, "*");
                    }
                </script>
            `);
        }

        let destination = "";
        
        // --- 2. LOGIC BRIDGE FOR INITIAL REDIRECTS ---
        if (data.MPI_QR_CODE) {
            destination = "/form/redirect/redirect-03.html";
        } else if (data.MPI_REDIRECT_URL && data.MPI_REDIRECT_HTTP_DATA) {
            destination = "/form/redirect/redirect-01.html";
        } else if (data.MPI_REDIRECT_URL) {
            destination = "/form/redirect/redirect-02.html";
        }

        // --- 3. RENDER UI OR REDIRECT ---
        if (destination !== "") {
            res.setHeader('Content-Type', 'text/html');
            res.status(200).send(`
                <div class="wrapper" style="font-family: sans-serif; border: 1px solid #ddd; padding: 20px;">
                    <h1>Response Body Received</h1>
                    <pre style="background: #f4f4f4; padding: 15px;">${JSON.stringify(data, null, 4)}</pre>
                    <a href="${destination}?${queryParams}" 
                       style="background: black; color: white; padding: 10px; text-decoration: none; border-radius: 4px; display: inline-block;">
                        Continue to Payment
                    </a>
                </div>
            `);
        } else {
            res.redirect(302, `/payment-status.html?${queryParams}`);
        }
    } 
    // --- HANDLE GET REQUESTS ---
    else if (req.method === 'GET') {
        // Capture any query parameters sent in the URL
        const queryParams = new URLSearchParams(req.query).toString();
        
        // Redirect to status page, appending the query string if it exists
        const redirectUrl = queryParams ? `/payment-status.html?${queryParams}` : '/payment-status.html';
        
        return res.redirect(302, redirectUrl);
    } 
    // --- HANDLE OTHER METHODS (PUT, DELETE, etc.) ---
    else {
        res.status(405).json({ error: "Method Not Allowed" });
    }
}
