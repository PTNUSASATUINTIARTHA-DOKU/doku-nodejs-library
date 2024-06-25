const InquiryRequestVirtualAccountDataDTO = require("./inquiryRequestVirtualAccountDataDto");

class InquiryResponseBodyDTO {
    constructor(data) {
        this.responseCode = data.responseCode;
        this.responseMessage = data.responseMessage;
        this.virtualAccountData = new InquiryRequestVirtualAccountDataDTO(data.virtualAccountData) 
    }
    
    toObject() {
        return {
            responseCode: this.responseCode,
            responseMessage: this.responseMessage,
            virtualAccountData:this.virtualAccountData
        };
    }
}

module.exports = InquiryResponseBodyDTO;