const AdditionalInfoResponseDTO = require("./additionalInfoResponseDTO");

class VirtualAccountDataDTO {
    constructor(data) {
        this.partnerServiceId = data.partnerServiceId;
        this.customerNo = data.customerNo;
        this.virtualAccountNo = data.virtualAccountNo;
        this.virtualAccountName = data.virtualAccountName;
        this.virtualAccountEmail = data.virtualAccountEmail;
        this.trxId = data.trxId;
        this.totalAmount = data.totalAmount;
        this.additionalInfo = new AdditionalInfoResponseDTO(data.additionalInfo);
    }

    toObject() {
        return {
            partnerServiceId: this.partnerServiceId,
            customerNo: this.customerNo,
            virtualAccountNo: this.virtualAccountNo,
            virtualAccountName: this.virtualAccountName,
            virtualAccountEmail: this.virtualAccountEmail,
            trxId: this.trxId,
            totalAmount: this.totalAmount,
            additionalInfo: this.additionalInfo
        };
    }
}
module.exports = VirtualAccountDataDTO;