class TokenB2BResponseDTO {
  constructor(responseCode, responseMessage, accessToken, tokenType, expiresIn, additionalInfo) {
      this.responseCode = responseCode;
      this.responseMessage = responseMessage;
      this.accessToken = accessToken;
      this.tokenType = tokenType;
      this.expiresIn = expiresIn;
      this.additionalInfo = additionalInfo;
  }
}