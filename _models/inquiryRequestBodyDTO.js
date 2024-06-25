class InquiryRequestDTO {
    constructor(partnerServiceId, customerNo, virtualAccountNo, channelCode, trxDateInit, language, inquiryRequestId, additionalInfo) {
        this.partnerServiceId = partnerServiceId;
        this.customerNo = customerNo;
        this.virtualAccountNo = virtualAccountNo;
        this.channelCode = channelCode;
        this.trxDateInit = trxDateInit;
        this.language = language;
        this.inquiryRequestId = inquiryRequestId;
        this.additionalInfo = additionalInfo;
    }
    toObject() {
        return {
            partnerServiceId: this.partnerServiceId,
            customerNo: this.customerNo,
            virtualAccountNo:this.virtualAccountNo,
            channelCode:this.channelCode,
            trxDateInit:this.trxDateInit,
            language:this.language,
            inquiryRequestId:this.inquiryRequestId,
            additionalInfo:this.additionalInfo

        };
    }
}
module.exports = InquiryRequestDTO
