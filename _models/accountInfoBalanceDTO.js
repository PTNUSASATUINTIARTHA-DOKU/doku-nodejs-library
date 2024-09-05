class AccountInfosDto {
    constructor(balanceType,amount,flatAmount,holdAmount) {
        this.balanceType = balanceType;
        this.amount = amount;
        this.flatAmount = flatAmount;
        this.holdAmount = holdAmount;
    }
    toObject() {
        return {
            balanceType: this.balanceType,
            amount: this.amount,
            flatAmount: this.flatAmount,
            holdAmount: this.holdAmount
        };
    }
}

module.exports = AccountInfosDto;
