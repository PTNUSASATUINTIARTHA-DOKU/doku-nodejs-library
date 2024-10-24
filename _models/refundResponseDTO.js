class TotalAmount {
    constructor(value = "", currency = "") {
        this.value = value;
        this.currency = currency;
    }

    toObject() {
        return {
            value: this.value,
            currency: this.currency
        };
    }
}

class RefundResponseDTO {
    constructor(
        responseCode = "",
        responseMessage = "",
        refundAmount = null,
        originalPartnerReferenceNo = "",
        originalReferenceNo = "",
        refundNo = "",
        partnerRefundNo = "",
        refundTime = ""
    ) {
        this.responseCode = responseCode;
        this.responseMessage = responseMessage;
        this.refundAmount = refundAmount; 
        this.originalPartnerReferenceNo = originalPartnerReferenceNo;
        this.originalReferenceNo = originalReferenceNo;
        this.refundNo = refundNo;
        this.partnerRefundNo = partnerRefundNo;
        this.refundTime = refundTime;
    }

    toObject() {
        return {
            responseCode: this.responseCode,
            responseMessage: this.responseMessage,
            refundAmount: this.refundAmount ? this.refundAmount.toObject() : undefined,
            originalPartnerReferenceNo: this.originalPartnerReferenceNo,
            originalReferenceNo: this.originalReferenceNo,
            refundNo: this.refundNo,
            partnerRefundNo: this.partnerRefundNo,
            refundTime: this.refundTime
        };
    }
}

module.exports = {
    RefundResponseDTO,
    TotalAmount
};