class PaymentNotificationResponseHeaderDto {
    constructor(xTimestamp, contentType) {
        this.xTimestamp = xTimestamp;
        this.contentType = contentType;
    }

    toObject() {
        return {
            xTimestamp: this.xTimestamp,
            contentType: this.contentType
        };
    }
}
module.exports = PaymentNotificationResponseHeaderDto;