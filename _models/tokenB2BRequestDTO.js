class TokenB2BRequestDTO {
    constructor(clientID, xTimestamp, signatureResult) {
      this.clientID = clientID;
      this.xTimestamp = xTimestamp;
      this.signatureResult = signatureResult;
      this.grantType= "client_credentials"
    }
}
module.exports = TokenB2BRequestDTO;