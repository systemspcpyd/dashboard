// --- CONFIGURATION ---
const KEY_EXCHANGE_URL = "https://devlinkv2.paydee.co/mpigw/mkReq";
const PUBLICKEY = "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAq8j2SHHfzMLlhYppnlk-QqjjjZwMkhK6s6rERd0JhhY_6-Md4Z0327uEdfNbJrSEPJVPT55gjRhx4MorEhrabuafuY8thSPS4epwkOjjPtELwZxViWe1dzG5TQakJ_i8ZOQuUYFJg02RcwUTzE3ty-x7mkwj9t2wAdRqTagyaDIAVMTxP_Y4AS76xjA3aH43Q0HKHGAxxIlXBIQxImuPhlUbPtVtTHIsUwkIx2BDh8kPZ3Mgr3Cyky0F-cHpEFSi3rPSSLD_FVHlJRW2cODVm8E-s98CURQYs1npzDztzZgZPnnb9K57CB2Z50Ve6qUV7z4-uHs3nehiMJHktIs7LQIDAQAB";
const PRIVATE_KEY_PEM = `-----BEGIN PRIVATE KEY-----
MIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCryPZIcd/MwuWF
immeWT5CqOONnAySErqzqsRF3QmGFj/r4x3hnTfbu4R181smtIQ8lU9PnmCNGHHg
yisSGtpu5p+5jy2FI9Lh6nCQ6OM+0QvBnFWJZ7V3MblNBqQn+Lxk5C5RgUmDTZFz
BRPMTe3L7HuaTCP23bAB1GpNqDJoMgBUxPE/9jgBLvrGMDdofjdDQcocYDHEiVcE
hDEia4+GVRs+1W1McixTCQjHYEOHyQ9ncyCvcLKTLQX5wekQVKLes9JIsP8VUeUl
FbZw4NWbwT6z3wJRFBizWenMPO3NmBk+edv0rnsIHZnnRV7qpRXvPj64ezed6GIw
keS0izstAgMBAAECggEAC59vu8Fp/S6B8rHwPnoBopH5v3bmSisr6FnD/jQb3695
XgpCVyWuMKxJzzngGh4kRP3B3Xxfl6b77Ckm69/W6qJTqULnjLa6nyAfw0uL4I//
+yFgOjPtomXCCKpL3gvQIgVm9YseqwcgXFy6FQcqxog2vrRVye9Vksdz9SgjAktP
UeTaAgyfHGcKqQvWb8E0N5hpPfQMsw9p5vKdoSyrokb6mTSzMn2K9NlCtXNYvzyp
gmivt5H4wYGHrl+GFJnKfbb0Qv0O3BUaRTbyuUXBwJqWGYIiAk7288rdAuiiZPgV
+iS4QKvG/RTCilg8FfJTJy/Mea9sVO3kVLwouB8xwwKBgQDCoopJ4C6hCkk7jHyE
/t9hD3h7OhGQOVX1DkgJyAlbqCIxvNPZp2B3ae7FAjAtFf8/gPCHY7EKc6tfUUAz
GZuz3/o4aCMeEoAAzSkijBkWzhWq79CUBnlR0/Md0a4DmhIQGFUzF7QvV1ZtCvRS
mN6YfqA5+zAMViwhrAtc48j5OwKBgQDh8iZCoogGhgAZQ+41+OgrZlClFoUYAa69
+lLKWMxAOdgkm04ZNbxIjRAXN3fWydjHnI+8S+RHiURxU+Lq3oyR13gpWSaS12Mh
DRk4CVsFpoRYXLqU3tPIg0nsEBgU7/UPdSPgaL07t1Xu/j0HOnm1U0WtSKEzXJ85
1R8/eAIWtwKBgHxi2hPqZIJgi3q2BqIMLH/gHjRKYQ0Vx1xMGze9ElX0Np4oug8g
S6MlHQXkpxs5Mp3H7m/oAy3VzFCnIWtG0136JvRDgSXn1swsUTyV4jbTz78lcdwX
4xKrbHTDGv2MSjzlABYd8PZMT5xyYsAimCdGzWkgoY1QyPVf+QcNP9QfAoGACyZJ
4QvoLno6UwTZImyv+ERKQntEAhVDLDjIERgkrB6unc/UIMZYDjR30M156m13dxIw
vZf5IdaSPA1pqzFkOmYpldDCaIicaasdzXgYt8Spzzp0Mph0VvazlSSOK6pTq3ma
VZ6Vh/baFLsTA+JM0zfSvmRRIBm3+cCclCM15y0CgYANc3IGearrmbVgyVZ74+0M
SL+FRlqBUM8bvGHdPzXV8CLr5NlItcINVHiCO70UmTCNx7b0Ga3vFsVhG8h9VQZu
68zG+AEkbgDYEbzCsVsgYMtASTlVgG9KQoqGeIKhKdUQliV+DKn2uLW8SBetfXwX
BjUoANFzgScOUTPCSQACXQ==
-----END PRIVATE KEY-----`;

/**
 * 1. TRIGGER INQUIRY (INQ)
 * Called when user clicks "Check Status"
 */
// ... Configuration (Keys/URL) stays the same as before ...

async function triggerInquiry() {
    // 1. GET DATA FROM USER INPUTS
    const originalTrxnId = document.getElementById('manual_trxn_id').value.trim();
    const amount = document.getElementById('manual_amount').value.trim();

    const statusLabel = document.getElementById("inquiry-status-text");

    if (!originalTrxnId || !amount) {
        alert("Please enter both Transaction ID and Amount.");
        return;
    }

    if (statusLabel) statusLabel.innerText = "Checking status...";

    // 2. Generate Metadata
    const d = new Date();
    const ts = d.getFullYear() + (d.getMonth() + 1).toString().padStart(2, '0') + 
               d.getDate().toString().padStart(2, '0') + d.getHours().toString().padStart(2, '0') + 
               d.getMinutes().toString().padStart(2, '0') + d.getSeconds().toString().padStart(2, '0');
    
    const inqId = "INQ" + ts;

    // 3. Map to Hidden Form
    document.getElementById("INQ_PURCH_DATE").value = ts;
    document.getElementById("INQ_TRXN_ID").value = inqId;
    document.getElementById("INQ_ORI_TRXN_ID").value = originalTrxnId;
    document.getElementById("INQ_PURCH_AMT").value = amount;

    try {
        // Step A: Key Exchange
        const mkRes = await fetch(KEY_EXCHANGE_URL, {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                "merchantId": "000000000000003",
                "pubKey": PUBLICKEY,
                "purchaseId": inqId
            })
        });
        const mkResult = await mkRes.json();
        if (mkResult.errorCode !== "000") throw new Error("Key Exchange Failed");

        // Step B: RSA Sign
        const rawData = "INQ" + "000000000000003" + inqId + originalTrxnId + ts + "458" + amount;
        const signature = await signData(rawData, PRIVATE_KEY_PEM);
        document.getElementById("INQ_MAC").value = signature;

        // Step C: Submit
        document.getElementById("inq-form").submit();

    } catch (err) {
        console.error(err);
        if (statusLabel) statusLabel.innerText = "Error: " + err.message;
    }
}

// ... signData and window listener remain the same ...

/**
 * 2. RSA SIGNING UTILITIES
 */
async function signData(message, pem) {
    const encoder = new TextEncoder();
    const data = encoder.encode(message);
    const b64 = pem.replace(/-----BEGIN PRIVATE KEY-----|-----END PRIVATE KEY-----|\n|\r/g, '');
    const binaryKey = Uint8Array.from(atob(b64), c => c.charCodeAt(0)).buffer;
    
    const privateKey = await window.crypto.subtle.importKey(
        "pkcs8",
        binaryKey,
        { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
        false,
        ["sign"]
    );

    const signature = await window.crypto.subtle.sign("RSASSA-PKCS1-v1_5", privateKey, data);
    
    return btoa(String.fromCharCode(...new Uint8Array(signature)))
        .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

/**
 * 3. LISTEN FOR CALLBACK RESPONSE (postMessage)
 */
window.addEventListener("message", function(event) {
    // Safety check for origin can be added here if needed
    const data = event.data;
    const statusLabel = document.getElementById("inquiry-status-text");

    if (data.MPI_ERROR_CODE === "004") {
        if (statusLabel) {
            statusLabel.innerText = "Transaction in-processing...";
            statusLabel.style.color = "orange";
        }
    } else if (data.MPI_ERROR_CODE) {
        // Any status other than 004 means finality (Success or Fail)
        const query = new URLSearchParams(data).toString();
        window.location.href = `/payment-status.html?${query}`;
    }
});
