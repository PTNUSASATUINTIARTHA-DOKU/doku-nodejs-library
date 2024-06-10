class PaymentNotificationResponseBodyDto {
    constructor(responseCode, responseMessage, virtualAccountData) {
        this.responseCode = responseCode;
        this.responseMessage = responseMessage;
        this.virtualAccountData = virtualAccountData;
    }

    toObject() {
        return {
            responseCode: this.responseCode,
            responseMessage: this.responseMessage,
            virtualAccountData: this.virtualAccountData.toObject()
        };
    }
}