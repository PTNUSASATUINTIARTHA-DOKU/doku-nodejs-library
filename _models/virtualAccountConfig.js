class VirtualAccountConfig {
    constructor(reusableStatus,maxAmount,minAmount) {
        this.reusableStatus = reusableStatus;
        this.maxAmount = maxAmount;
        this.minAmount = minAmount;
    }

    toObject() {
        return {
            reusableStatus: this.reusableStatus,
            maxAmount:this.maxAmount,
            minAmount:this.minAmount
        };
    }
}

module.exports = VirtualAccountConfig;
