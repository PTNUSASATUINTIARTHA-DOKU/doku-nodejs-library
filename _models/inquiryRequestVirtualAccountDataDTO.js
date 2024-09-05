const InquiryRequestAdditionalInfoDto = require("./InquiryRequestAdditionalInfoDTO");
const InquiryReasonDto = require("./inquiryReasonDTO");

class InquiryRequestVirtualAccountDataDTO {
    constructor(data) {
        this.partnerServiceId = data.partnerServiceId;
        this.customerNo = data.customerNo;
        this.virtualAccountNo = data.virtualAccountNo;
        this.virtualAccountName = data.virtualAccountName;
        this.virtualAccountEmail = data.virtualAccountEmail;
        this.virtualAccountPhone = data.virtualAccountPhone;
        this.totalAmount = data.totalAmount;
        this.virtualAccountTrxType = data.virtualAccountTrxType;
        this.expiredDate = data.expiredDate;
        this.additionalInfo = new InquiryRequestAdditionalInfoDto(data.additionalInfo);
        this.inquiryStatus = data.inquiryStatus;
        this.inquiryReason = new InquiryReasonDto(data.inquiryReason);
        this.inquiryRequestId = data.inquiryRequestId;
    }
    

    toObject() {
        return {
            partnerServiceId: this.partnerServiceId,
            customerNo: this.customerNo,
            virtualAccountNo: this.virtualAccountNo,
            virtualAccountName: this.virtualAccountName,
            virtualAccountEmail: this.virtualAccountEmail,
            virtualAccountPhone: this.virtualAccountPhone,
            totalAmount: this.totalAmount,
            virtualAccountTrxType: this.virtualAccountTrxType,
            expiredDate: this.expiredDate,
            additionalInfo: this.additionalInfo,
            inquiryStatus: this.inquiryStatus,
            inquiryReason: this.inquiryReason,
            inquiryRequestId: this.inquiryRequestId
        };
    }
}
module.exports = InquiryRequestVirtualAccountDataDTO;