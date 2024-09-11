const Joi = require('joi');
class AdditionalInfoUnregistUnbindRequestDTO{
    constructor(data) {
        this.channel = data.channel;
    }
}
class CardUnRegistUnbindRequestDTO {
  constructor(tokenId,additionalInfo) {
    this.tokenId = tokenId;
    this.additionalInfo = new AdditionalInfoUnregistUnbindRequestDTO(additionalInfo);
  }

  validateCardUnRegistRequestDTO() {
    const additionalInfoSchema = Joi.object({
        channel: Joi.string()
        .valid('DIRECT_DEBIT_BRI_SNAP')
        .required()
    });

    const schema = Joi.object({
      tokenId: Joi.string()
       .max(2048)
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
      tokenId: this.tokenId,
      additionalInfo: this.additionalInfo.toObject(),
    };
  }
}
module.exports = CardUnRegistUnbindRequestDTO