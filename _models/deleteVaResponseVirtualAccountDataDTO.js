const DeleteVaResponseAdditionalInfo = require("./deleteVaResponseAdditionalInfoDTO");

class DeleteVaResponseVirtualAccountData {
    constructor(data) {
      this.partnerServiceId = data.partnerServiceId;
      this.customerNo = data.customerNo;
      this.virtualAccountNo = data.virtualAccountNo;
      this.trxId = data.trxId;
      this.additionalInfo = new DeleteVaResponseAdditionalInfo(data.additionalInfo);
    }
  }
module.exports = DeleteVaResponseVirtualAccountData;
