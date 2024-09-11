class CardUnRegistUnbindResponseDto {
    constructor({responseCode,responseMessage,referenceNo,redirectUrl}) {
        this.responseCode = responseCode;
        this.responseMessage = responseMessage;
        this.referenceNo = referenceNo;
        this.redirectUrl = redirectUrl;
    }
    toObject() {
        return {
            responseCode: this.responseCode,
            responseMessage: this.responseMessage,
            referenceNo: this.referenceNo,
            redirectUrl: this.redirectUrl
        };
    }
}

module.exports = CardUnRegistUnbindResponseDto;
