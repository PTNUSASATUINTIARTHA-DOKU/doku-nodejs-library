class BalanceInquiryResponsetDto {
    constructor(responseCode,responseMessage,accountInfos) {
        this.responseCode = responseCode;
        this.responseMessage = responseMessage;
        this.accountInfos = accountInfos;
    }
    toObject() {
        return {
            responseCode: this.responseCode,
            responseMessage: this.responseMessage,
            accountInfos: this.accountInfos
        };
    }
}

module.exports = BalanceInquiryResponsetDto;
