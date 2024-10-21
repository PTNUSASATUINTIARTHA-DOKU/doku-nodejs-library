class TokenB2b2cRequestDto {
    constructor(grantType, authCode, refreshToken, additionalInfo) {
        this.grantType = grantType;
        this.authCode = authCode;
        this.refreshToken = refreshToken;
        this.additionalInfo = additionalInfo;
    }

    toObject() {
        return {
            grantType: this.grantType,
            authCode: this.authCode,
            refreshToken: this.refreshToken,
            additionalInfo: this.additionalInfo,
        };
    }
}
module.exports = TokenB2b2cRequestDto;