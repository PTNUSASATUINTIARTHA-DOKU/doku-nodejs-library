class CardRegistrationResponseDTO {
    constructor(responseCode, responseMessage, referenceNo = null, redirectUrl = null, additionalInfo = null) {
        this.responseCode = responseCode;
        this.responseMessage = responseMessage;
        this.referenceNo = referenceNo;
        this.redirectUrl = redirectUrl;
        this.additionalInfo = additionalInfo instanceof CardRegistrationAdditionalInfoResponseDTO ? additionalInfo : null;
    }
}

class CardRegistrationAdditionalInfoResponseDTO {
    constructor(custIdMerchant = null, status = null, authCode = null) {
        this.custIdMerchant = custIdMerchant;
        this.status = status;
        this.authCode = authCode;
    }
}

module.exports = { 
    CardRegistrationResponseDTO, 
    CardRegistrationAdditionalInfoResponseDTO 
};
