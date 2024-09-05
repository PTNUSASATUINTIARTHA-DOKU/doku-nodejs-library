class AccountBindingResponseDto {
    constructor(
        responseCode,
        responseMessage,
        referenceNo,
        redirectUrl,
        additionalInfo
    ) {
        this.responseCode = responseCode;
        this.responseMessage = responseMessage;
        this.referenceNo = referenceNo;
        this.redirectUrl = redirectUrl;
        this.additionalInfo = additionalInfo;
    }

    toObject() {
        return {
            responseCode: this.responseCode,
            responseMessage: this.responseMessage,
            referenceNo: this.referenceNo,
            redirectUrl: this.redirectUrl,
            additionalInfo: this.additionalInfo
        };
    }
}

module.exports = AccountBindingResponseDto