// api-logic.js

// mpReq function
// Add 'urlKey' as a parameter
async function mpReq(urlKey) {
    window.top.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Get the actual URL from CONFIG using the key passed from the button
    const targetUrl = CONFIG[urlKey]; 
    if (!targetUrl) {
        alert("Invalid URL Key provided!");
        return;
    }

    const form = document.getElementById("form");
    const payButton = document.getElementById("pay-btn"); // Give your button a fixed ID
    const responseType = document.getElementById("MPI_RESPONSE_TYPE").value;

    document.getElementById("MPI_RETURN_URL").value = CONFIG.VERCEL_CALLBACK;
    
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        if (!input.value.trim()) input.disabled = true;
    });

    // CASE A: Form Redirect
    if (!responseType) {
        form.action = targetUrl; // Set the action dynamically
        payButton.disabled = true;
        form.submit();
        return; 
    }

    // CASE B: JSON Fetch
    try {
        // Gathering data logic here...
        const formData = new FormData(form);
        const payload = new URLSearchParams();
        inputs.forEach(input => input.disabled = false); // Re-enable to read
        formData.forEach((value, key) => { if(value.trim() !== "") payload.append(key, value); });

        const response = await fetch(targetUrl, { // Use the dynamic targetUrl
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: payload
        });

        const data = await response.json();
        // ... rest of your redirect-form logic ...

    } catch (error) {
        console.error('Error:', error);
        alert("Transaction failed.");
    }
}

// Channel Inquiry function
function channel() {
    const MID = document.forms["form"]["MPI_MERC_ID"].value;
    const transactionID = document.forms["form"]["MPI_TRXN_ID"].value;
    const MAC = document.forms["form"]["MPI_MAC"].value;

    const params = new URLSearchParams({
        "MPI_MERC_ID": MID,
        "MPI_TRXN_ID": transactionID,
        "MPI_MAC": MAC
    });

    // Calling from CONFIG
    fetch(`${CONFIG.GET_CHANNEL}?${params.toString()}`)
        .then(response => response.json())
        .then(data => {
            const tbody = document.getElementById('table-body');
            tbody.innerHTML = ""; 
            // ... rest of your logic
        });
}

async function mkReq() {
    let MID = document.forms["form"]["MPI_MERC_ID"].value;
    let transactionID = document.forms["form"]["MPI_TRXN_ID"].value;

    const raw = JSON.stringify({
        "merchantId": MID,
        "pubKey": CONFIG.PUBLICKEY, // Calling from CONFIG
        "purchaseId": transactionID
    });

    try {
        const response = await fetch(CONFIG.PAG_KEY_EXCHANGE, { // Calling from CONFIG
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: raw
        });
        const result = await response.json();
        alert(result.errorCode === "000" ? "✅ Success" : "❌ Failed");
    } catch (error) {
        alert("⚠️ Connection Error");
    }
}

async function mpi_mkReq() {
    let MID = document.forms["form"]["MPI_MERC_ID"].value;
    let transactionID = document.forms["form"]["MPI_TRXN_ID"].value;

    const raw = JSON.stringify({
        merchantId: MID,
        pubKey: CONFIG.PUBLICKEY, // Use CONFIG here
        purchaseId: transactionID
    });

    try {
        const response = await fetch(CONFIG.MPI_KEY_EXCHANGE, { // Use CONFIG here
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: raw
        });

        console.log("HTTP status:", response.status);

        const text = await response.text();
        console.log("Raw response:", text);

        let result;
        try {
            result = JSON.parse(text);
        } catch (e) {
            throw new Error("Response is not JSON");
        }

        if (result.errorCode === "000") {
            alert(`✅ Success!\nCode: ${result.errorCode}`);
        } else {
            alert(`❌ Failed\nCode: ${result.errorCode}\nMessage: ${result.errorMessage}`);
        }

    } catch (error) {
        console.error('Error:', error);
        alert("⚠️ Check console for details.");
    }
}

function clear_mac() {
    let rawString = document.forms["form"]["MPI_MERC_ID"].value + document.forms["form"]["MPI_TRXN_ID"].value;
    try {
        const CLEAN_KEY = CONFIG.PRIVATE_KEY.replace(/^[ \t]+/gm, ''); // Calling from CONFIG
        let sig = new KJUR.crypto.Signature({"alg": "SHA256withRSA"});
        sig.init(CLEAN_KEY);
        sig.updateString(rawString);
        let sigValueHex = sig.sign();
        let base64UrlValue = hextob64(sigValueHex).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
        document.forms["form"]["MPI_MAC"].value = base64UrlValue;
    } catch (e) {
        alert("Error generating MAC.");
    }
}
