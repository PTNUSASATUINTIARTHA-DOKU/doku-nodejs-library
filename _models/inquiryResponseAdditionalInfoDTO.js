class InquiryResponseAdditionalInfoDTO{
    constructor(channel,trxId,virtualAccountConfig) {
        this.channel = channel
        this.trxId = trxId,
        this.virtualAccountConfig = virtualAccountConfig
    }
    toObject(){
        return {
            channel:this.channel,
            trxId:this.trxId,
            virtualAccountConfig:this.vi
        }
    }
   
}
module.exports = InquiryResponseAdditionalInfoDTO;