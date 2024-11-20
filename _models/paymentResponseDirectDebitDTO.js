class PaymentResponseDirectDebitDTO {
    constructor(data) {
        this.responseCode = data.responseCode;
        this.responseMessage = data.responseMessage;
        this.webRedirectUrl = data.webRedirectUrl;
        this.partnerReferenceNo = data.partnerReferenceNo?data.partnerReferenceNo:null
        this.referenceNo = data.referenceNo?data.referenceNo:null
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