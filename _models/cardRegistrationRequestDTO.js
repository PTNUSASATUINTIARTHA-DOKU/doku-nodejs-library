const Joi = require('joi');

class CardRegistrationRequestDTO {
  constructor(cardData, custIdMerchant, phoneNo, additionalInfo) {
    this.cardData = cardData;
    this.custIdMerchant = custIdMerchant;
    this.phoneNo = phoneNo;
    this.additionalInfo = additionalInfo; // instance of AdditionalInfoDTO
  }
  
  validateCardRegistrationRequestDto() {
    const additionalInfoSchema = Joi.object({
      channel: Joi.string()
        .valid('DIRECT_DEBIT_BRI_SNAP')
        .required(),
      successRegistrationUrl: Joi.string()
        .uri()
        .required(),
      failedRegistrationUrl: Joi.string()
        .uri()
        .required(),
      customerName: Joi.string()
        .max(70)
        .optional(),
      email: Joi.string()
        .email()
        .max(64)
        .optional(),
      idCard: Joi.string()
        .max(20)
        .optional(),
      country: Joi.string()
        .max(60)
        .optional(),
      address: Joi.string()
        .max(255)
        .optional(),
      dateOfBirth: Joi.string()
        .pattern(/^\d{8}$/)
        .optional(),
    });

    const schema = Joi.object({
      cardData: Joi.object({
        bankCardNo: Joi.string()
            .max(20) // Panjang nomor kartu bank
            .required(),
        bankCardType: Joi.string()
            .required(),
        expiryDate: Joi.string()
            .length(4) // Format MMYY
            .pattern(/^(0[1-9]|1[0-2])[0-9]{2}$/) // Validasi format MMYY
            .required()
    }).required(),
      custIdMerchant: Joi.string()
        .alphanum()
        .max(64)
        .required(),
      phoneNo: Joi.string()
        .pattern(/^628[0-9]{7,13}$/)
        .min(9)
        .max(16)
        .required(),
      additionalInfo: additionalInfoSchema.required(),
    });

    const { error } = schema.validate(this, { abortEarly: false });
    if (error) {
        throw new Error(`Validation failed: ${error.details.map(x => x.message).join(', ')}`);
    }
  }

  toObject() {
    return {
      cardData: this.cardData,
      custIdMerchant: this.custIdMerchant,
      phoneNo: this.phoneNo,
      additionalInfo: this.additionalInfo.toObject(),
    };
  }
}
module.exports = CardRegistrationRequestDTO