class PaymentNotificationResponseVirtualAccountConfigDTO {
    constructor(minAmount,maxAmount) {
        this.minAmount = minAmount;
        this.maxAmount = maxAmount
    }

    toObject() {
        return {
            minAmount: this.minAmount,
            maxAmount: this.maxAmount
        };
    }
}

module.exports = PaymentNotificationResponseVirtualAccountConfigDTO;
