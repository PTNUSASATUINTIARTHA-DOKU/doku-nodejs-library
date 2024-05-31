const CreateVARequestDto = require("./createVaRequestDto");

class CreateVaRequestDtoV1 {
    constructor(
      mallId,
      chainMerchant,
      amount,
      purchaseAmount,
      transIdMerchant,
      PaymentType,
      words,
      requestDateTime,
      currency,
      purchaseCurrency,
      sessionId,
      name,
      email,
      additionalData,
      basket,
      shippingAddress,
      shippingCity,
      shippingState,
      shippingCountry,
      shippingZipcode,
      paymentChannel,
      address,
      city,
      state,
      country,
      zipcode,
      homephone,
      mobilephone,
      workphone,
      birthday,
      partnerServiceId,
      expiredDate
    ) {
      this.mallId = mallId;
      this.chainMerchant = chainMerchant;
      this.amount = amount;
      this.purchaseAmount = purchaseAmount;
      this.transIdMerchant = transIdMerchant;
      this.PaymentType = PaymentType;
      this.words = words;
      this.requestDateTime = requestDateTime;
      this.currency = currency;
      this.purchaseCurrency = purchaseCurrency;
      this.sessionId = sessionId;
      this.name = name;
      this.email = email;
      this.additionalData = additionalData;
      this.basket = basket;
      this.shippingAddress = shippingAddress;
      this.shippingCity = shippingCity;
      this.shippingState = shippingState;
      this.shippingCountry = shippingCountry;
      this.shippingZipcode = shippingZipcode;
      this.paymentChannel = paymentChannel;
      this.address = address;
      this.city = city;
      this.state = state;
      this.country = country;
      this.zipcode = zipcode;
      this.homephone = homephone;
      this.mobilephone = mobilephone;
      this.workphone = workphone;
      this.birthday = birthday;
      this.partnerServiceId = partnerServiceId;
      this.expiredDate = expiredDate;
    }
    convertToCreateVaRequestDto() {
        return new CreateVARequestDto(
            this.partnerServiceId,
            null, 
            null, 
            this.name,
            this.email,
            this.mobilephone, 
            this.transIdMerchant,
            {
                value: this.amount,
                currency: this.currency
            },
            {
                channel: this.paymentChannel,
                virtualAccountConfig: {
                    reusableStatus: false 
                }
            },
            '1', 
            this.expiredDate
        );
    }
    toObject() {
      return {
        mallId: this.mallId,
        chainMerchant: this.chainMerchant,
        amount: this.amount,
        purchaseAmount: this.purchaseAmount,
        transIdMerchant: this.transIdMerchant,
        PaymentType: this.PaymentType,
        words: this.words,
        requestDateTime: this.requestDateTime,
        currency: this.currency,
        purchaseCurrency: this.purchaseCurrency,
        sessionId: this.sessionId,
        name: this.name,
        email: this.email,
        additionalData: this.additionalData,
        basket: this.basket,
        shippingAddress: this.shippingAddress,
        shippingCity: this.shippingCity,
        shippingState: this.shippingState,
        shippingCountry: this.shippingCountry,
        shippingZipcode: this.shippingZipcode,
        paymentChannel: this.paymentChannel,
        address: this.address,
        city: this.city,
        state: this.state,
        country: this.country,
        zipcode: this.zipcode,
        homephone: this.homephone,
        mobilephone: this.mobilephone,
        workphone: this.workphone,
        birthday: this.birthday,
        partnerServiceId: this.partnerServiceId,
        expiredDate: this.expiredDate
      };
    }
  }
  
  module.exports = CreateVaRequestDtoV1;
  