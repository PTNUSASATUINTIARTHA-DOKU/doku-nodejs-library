class InquiryResponseVirtualAccountDataDTO {
    constructor(partnerServiceId,customerNo,virtualAccountNo,virtualAccountName,virtualAccountEmail,virtualAccountPhone,totalAmount,virtualAccountTrxType,additionalInfo,inquiryStatus,inquiryReason,inquiryRequestId,freeText) {
        this.partnerServiceId = partnerServiceId;
        this.customerNo = customerNo;
        this.virtualAccountNo = virtualAccountNo;
        this.virtualAccountName = virtualAccountName;
        this.virtualAccountEmail = virtualAccountEmail;
        this.virtualAccountPhone = virtualAccountPhone;
        this.totalAmount = totalAmount;
        this.virtualAccountTrxType = virtualAccountTrxType;
        this.additionalInfo = additionalInfo;
        this.inquiryStatus = inquiryStatus;
        this.inquiryReason = inquiryReason;
        this.inquiryRequestId = inquiryRequestId;
        this.freeText = freeText;
    }

    toObject() {
        return {
            partnerServiceId: this.partnerServiceId,
            customerNo: this.customerNo,
            virtualAccountNo: this.virtualAccountNo,
            virtualAccountName: this.virtualAccountName,
            virtualAccountEmail: this.virtualAccountEmail,
            virtualAccountPhone: this.virtualAccountPhone,
            totalAmount: this.totalAmount ? this.totalAmount.toObject() : null,
            virtualAccountTrxType: this.virtualAccountTrxType,
            additionalInfo: this.additionalInfo ? this.additionalInfo.toObject() : null,
            inquiryStatus: this.inquiryStatus,
            inquiryReason: this.inquiryReason ? this.inquiryReason.toObject() : null,
            inquiryRequestId: this.inquiryRequestId,
            freeText: this.freeText
        };
    }
}

module.exports = InquiryResponseVirtualAccountDataDTO;
