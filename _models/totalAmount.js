class TotalAmount {
    constructor(value, currency) {
        this.value = value;
        this.currency = currency;
    }
    
    toObject() {
        return {
            value: this.value,
            currency: this.currency
        };
    }
}

module.exports = TotalAmount;