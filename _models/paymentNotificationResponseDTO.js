class PaymentNotificationResponseDTO {
    constructor(header, body) {
        this.header = header;
        this.body = body;
    }

    toObject() {
        return {
            header: this.header.toObject(),
            body: this.body.toObject()
        };
    }
}