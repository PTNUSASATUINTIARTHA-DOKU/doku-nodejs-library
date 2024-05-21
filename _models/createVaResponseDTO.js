const VirtualAccountDataDTO = require("./virtualAccountDataDTO");

class CreateVAResponseDTO {
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

module.exports = CreateVAResponseDTO;