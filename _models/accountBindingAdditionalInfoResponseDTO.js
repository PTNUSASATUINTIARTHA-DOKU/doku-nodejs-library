class AccountBindingAdditionalInfoResponseDto {
    constructor(
        custIdMerchant, status, authCode 
    ) {
        this.custIdMerchant = custIdMerchant;
        this.status = status;
        this.authCode = authCode;
    }

    toObject() {
        return {
            custIdMerchant: this.custIdMerchant,
            status: this.status,
            authCode: this.authCode,
        };
    }
}

module.exports = AccountBindingAdditionalInfoResponseDto;
