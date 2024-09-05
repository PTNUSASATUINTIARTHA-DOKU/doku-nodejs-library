class AccountBindingAdditionalInfoRequestDto {
    constructor( 
        channel,
        custIdMerchant,
        customerName,
        email,
        idCard,
        country,
        address,
        dateOfBirth,
        successRegistrationUrl,
        failedRegistrationUrl,
        deviceModel,
        osType,
        channelId
    ) {
        this.channel = channel;
        this.custIdMerchant = custIdMerchant;
        this.customerName = customerName;
        this.email = email;
        this.idCard = idCard;
        this.country = country;
        this.address = address;
        this.dateOfBirth = dateOfBirth;
        this.successRegistrationUrl = successRegistrationUrl;
        this.failedRegistrationUrl = failedRegistrationUrl;
        this.deviceModel = deviceModel;
        this.osType = osType;
        this.channelId = channelId;
    }

    toObject() {
        return {
            channel: this.channel,
            custIdMerchant: this.custIdMerchant,
            customerName: this.customerName,
            email: this.email,
            idCard: this.idCard,
            country: this.country,
            address: this.address,
            dateOfBirth: this.dateOfBirth,
            successRegistrationUrl: this.successRegistrationUrl,
            failedRegistrationUrl: this.failedRegistrationUrl,
            deviceModel: this.deviceModel,
            osType: this.osType,
            channelId: this.channelId,
        };
    }
}

module.exports = AccountBindingAdditionalInfoRequestDto;
