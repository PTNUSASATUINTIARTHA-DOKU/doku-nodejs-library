class SignatureComponentDTO {
    constructor(clientId, requestId, timestamp, requestTarget, httpMethod, messageBody, secretKey) {
        this.clientId = clientId;           // ID klien
        this.requestId = requestId;         // ID permintaan
        this.timestamp = timestamp;         // Timestamp permintaan
        this.requestTarget = requestTarget; // Target permintaan
        this.httpMethod = httpMethod;       // Metode HTTP (GET, POST, dll.)
        this.messageBody = messageBody;     // Body pesan (untuk metode selain GET, DELETE, dll.)
        this.secretKey = secretKey;         // Kunci rahasia untuk HMAC
    }
}

module.exports = SignatureComponentDTO;
