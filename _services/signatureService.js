const crypto = require('crypto');

function createSignatureRequest(componentDTO) {
    // Build component signature
    let component = `${process.env.CLIENT_ID}:${componentDTO.clientId}\n`;
    component += `REQUEST_ID:${componentDTO.requestId}\n`;
    component += `REQUEST_TIMESTAMP:${componentDTO.timestamp}\n`;
    component += `REQUEST_TARGET:${componentDTO.requestTarget}`;

    const methodWithoutBodies = ['GET', 'DELETE', 'HEAD']; // Sesuaikan metode tanpa body

    if (!methodWithoutBodies.includes(componentDTO.httpMethod)) {
        const digest = sha256Base64(JSON.stringify(componentDTO.messageBody));
        component += `\nDIGEST:${digest}`;
    }

    const hashResult = hmacSHA256(component, componentDTO.secretKey);

    return `${hashResult}`;
}

// Fungsi untuk membuat digest SHA256 dan mengonversi ke base64
function sha256Base64(data) {
    return crypto.createHash('sha256').update(data).digest('base64');
}

// Fungsi untuk menghasilkan HMAC SHA256
function hmacSHA256(data, secretKey) {
    return crypto.createHmac('sha256', secretKey).update(data).digest('hex');
}

module.exports = { createSignatureRequest };
