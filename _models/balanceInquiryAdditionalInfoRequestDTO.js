class BalanceInquiryAdditionalInfoRequestDto {
    constructor(channel) {
        this.channel = channel;
    }
    toObject() {
        return {
            channel: this.channel
        };
    }
}

module.exports = BalanceInquiryAdditionalInfoRequestDto;
