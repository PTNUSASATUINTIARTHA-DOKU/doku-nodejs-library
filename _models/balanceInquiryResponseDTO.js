class BalanceInquiryResponsetDto {
    constructor(responseCode,responseMessage,accountInfos) {
        this.responseCode = responseCode;
        this.responseMessage = responseMessage;
        this.responseMessage = accountInfos;
    }
    toObject() {
        return {
            responseCode: this.responseCode,
            responseMessage: this.responseMessage,
            responseMessage: this.responseMessage
        };
    }
}

module.exports = BalanceInquiryResponsetDto;
