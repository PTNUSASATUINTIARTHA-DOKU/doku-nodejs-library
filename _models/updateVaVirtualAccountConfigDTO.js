class UpdateVaVirtualAccountConfigDto {
    constructor(status,minAmount,maxAmount) {
        this.status = status; 
        this.minAmount = minAmount;
        this.maxAmount = maxAmount;
    }

    toObject() {
        return {
            status: this.status,
            minAmount:this.minAmount,
            maxAmount:this.maxAmount
        };
    }
}

module.exports = UpdateVaVirtualAccountConfigDto;
