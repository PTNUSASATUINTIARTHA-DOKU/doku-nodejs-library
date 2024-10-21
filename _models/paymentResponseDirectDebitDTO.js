class PaymentResponseDirectDebitDTO {
    constructor(responseCode,responseMessage,webRedirectUrl,partnerReferenceNo) {
        this.responseCode = responseCode;
        this.responseMessage = responseMessage;
        this.webRedirectUrl = webRedirectUrl;
        this.partnerReferenceNo = partnerReferenceNo
    }
    
    toObject() {
        return {
            responseCode: this.responseCode,
            responseMessage: this.responseMessage,
            partnerReferenceNo:this.partnerReferenceNo,
            webRedirectUrl:this.webRedirectUrl
        };
    }
}

module.exports = PaymentResponseDirectDebitDTO;