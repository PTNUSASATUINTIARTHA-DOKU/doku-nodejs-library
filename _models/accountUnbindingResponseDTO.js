class AccountUnbindingResponseDto {
    constructor(responseCode,responseMessage,referenceNo) {
        this.responseCode = responseCode;
        this.responseMessage = responseMessage;
        this.referenceNo = referenceNo;
    }
    toObject() {
        return {
            responseCode: this.responseCode,
            responseMessage: this.responseMessage,
            referenceNo: this.referenceNo
        };
    }
}

module.exports = AccountUnbindingResponseDto;
