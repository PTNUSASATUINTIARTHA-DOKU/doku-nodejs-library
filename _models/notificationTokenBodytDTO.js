class NotificationTokenBodyDto {
    constructor(responseCode, responseMessage, accessToken, tokenType, expiresIn, additionalInfo) {
        this.responseCode = responseCode;
        this.responseMessage = responseMessage;
        this.accessToken = accessToken;
        this.tokenType = tokenType;
        this.expiresIn = expiresIn;
        this.additionalInfo = additionalInfo;
    }


    toObject() {
        return {
            responseCode: this.responseCode,
            responseMessage: this.responseMessage,
            accessToken: this.accessToken,
            tokenType: this.tokenType,
            expiresIn: this.expiresIn,
            additionalInfo: this.additionalInfo
        };
    }
}

module.exports = NotificationTokenBodyDto;
