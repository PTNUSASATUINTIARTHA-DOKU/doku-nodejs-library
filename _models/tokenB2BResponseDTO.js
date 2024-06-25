class TokenB2BResponseDTO {
  constructor(data) {
      this.responseCode = data.responseCode;
      this.responseMessage = data.responseMessage;
      this.accessToken = data.accessToken;
      this.tokenType = data.tokenType;
      this.expiresIn = data.expiresIn;
      this.additionalInfo = data.additionalInfo;
  }
}
module.exports = TokenB2BResponseDTO;