class CardRegistrationResponseDto {
    constructor(responseCode, responseMessage, referenceNo, bankCardToken, additionalInfo) {
      this.responseCode = responseCode;
      this.responseMessage = responseMessage;
      this.referenceNo = referenceNo;
      this.bankCardToken = bankCardToken;
      this.additionalInfo = additionalInfo;
    }
  
    toObject() {
      return {
        responseCode: this.responseCode,
        responseMessage: this.responseMessage,
        referenceNo: this.referenceNo,
        bankCardToken: this.bankCardToken,
        additionalInfo: this.additionalInfo,
      };
    }
  }
  
  module.exports = CardRegistrationResponseDto;
  