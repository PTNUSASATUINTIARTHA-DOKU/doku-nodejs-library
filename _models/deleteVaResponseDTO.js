const DeleteVaResponseVirtualAccountData = require('./deleteVaResponseVirtualAccountDataDTO');

class DeleteVaResponseDto {
  constructor(data) {
    this.responseCode = data.responseCode;
    this.responseMessage = data.responseMessage;
    this.virtualAccountData = new DeleteVaResponseVirtualAccountData(data.virtualAccountData);
  }
  toObject() {
    return {
        responseCode: this.responseCode,
        responseMessage: this.responseMessage,
        virtualAccountData:this.virtualAccountData
    };
}
}

module.exports = DeleteVaResponseDto;
