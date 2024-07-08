const VirtualAccountDataDTO = require("./checkStatusVirtualAccountDataDTO");

class CheckStatusVaResponseDTO {
    constructor(data) {
        this.responseCode = data.responseCode;
        this.responseMessage = data.responseMessage;
        this.virtualAccountData = new VirtualAccountDataDTO(data.virtualAccountData) 
    }
    
    toObject() {
        return {
            responseCode: this.responseCode,
            responseMessage: this.responseMessage,
            virtualAccountData:this.virtualAccountData
        };
    }
}

module.exports = CheckStatusVaResponseDTO;