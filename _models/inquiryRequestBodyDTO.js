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

    validateSimulator(){
        if (this.virtualAccountNo.startsWith("1117")) {
            return {
                "responseCode": "2003000",
                "responseMessage": "success"
            };
        }else if(this.virtualAccountNo.startsWith("116")){
            return {
                "responseCode": "2002400",
                "responseMessage": "success"
            };
        }else if(this.virtualAccountNo.startsWith("117")){
            return {
                "responseCode": "4042414",
                "responseMessage": "Bill has been paid"
            };
        }else if(this.virtualAccountNo.startsWith("118")){
            return {
                "responseCode": "4042419",
                "responseMessage": "Bill expired"
            };
        }else if(this.virtualAccountNo.startsWith("119")){
            return {
                "responseCode": "4042412",
                "responseMessage": "Bill not found"
            };
        }
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
