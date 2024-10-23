class PaymentResponseDirectDebitDTO {
    constructor(responseCode,responseMessage,webRedirectUrl,partnerReferenceNo,referenceNo) {
        this.responseCode = responseCode;
        this.responseMessage = responseMessage;
        this.webRedirectUrl = webRedirectUrl;
        this.partnerReferenceNo = partnerReferenceNo;
        this.referenceNo = referenceNo
    }
    
    toObject() {
        return {
            responseCode: this.responseCode,
            responseMessage: this.responseMessage,
            referenceNo: this.referenceNo,
            partnerReferenceNo:this.partnerReferenceNo,
            webRedirectUrl:this.webRedirectUrl
        };
    }
}

module.exports = PaymentResponseDirectDebitDTO;