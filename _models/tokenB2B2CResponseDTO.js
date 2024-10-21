class TokenB2b2cResponseDto {
    constructor({ responseCode, responseMessage, accessToken, tokenType, accessTokenExpiryTime, refreshToken, refreshTokenExpiryTime, additionalInfo }) {
        this.responseCode = responseCode;
        this.responseMessage = responseMessage;
        this.accessToken = accessToken;
        this.tokenType = tokenType;
        this.accessTokenExpiryTime = accessTokenExpiryTime;
        this.refreshToken = refreshToken;
        this.refreshTokenExpiryTime = refreshTokenExpiryTime;
        this.additionalInfo = additionalInfo;
    }

    toObject() {
        return {
            responseCode: this.responseCode,
            responseMessage: this.responseMessage,
            accessToken: this.accessToken,
            tokenType: this.tokenType,
            accessTokenExpiryTime: this.accessTokenExpiryTime,
            refreshToken: this.refreshToken,
            refreshTokenExpiryTime: this.refreshTokenExpiryTime,
            additionalInfo: this.additionalInfo,
        };
    }
}
module.exports = TokenB2b2cResponseDto;