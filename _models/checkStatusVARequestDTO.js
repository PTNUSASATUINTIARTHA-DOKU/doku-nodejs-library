const Joi = require('joi');

class CheckStatusVARequestDto {
  constructor(partnerServiceId, customerNo, virtualAccountNo, inquiryRequestId, paymentRequestId, additionalInfo) {
    this.partnerServiceId = partnerServiceId;
    this.customerNo = customerNo;
    this.virtualAccountNo = virtualAccountNo;
    this.inquiryRequestId = inquiryRequestId;
    this.paymentRequestId = paymentRequestId;
    this.additionalInfo = additionalInfo;
  }

  validateCheckStatusVaRequestDto() {
    const schema = Joi.object({
      partnerServiceId:  Joi.string().length(8).pattern(/^\s{0,7}\d{1,8}$/).required(),
      customerNo:  Joi.string().max(20).pattern(/^\d+$/).required(),
      virtualAccountNo:  Joi.string().required().custom((value, helpers) => {
        const { partnerServiceId, customerNo } = helpers.state.ancestors[0];
        const expectedValue = `${partnerServiceId}${customerNo}`;
        if (value !== expectedValue) {
            throw new Error(`virtualAccountNo must be equal to partnerServiceId + customerNo (${expectedValue})`);
        }
        return value;
    }),
      inquiryRequestId: Joi.alternatives().try(
        Joi.string().max(128).required(),
        Joi.allow(null)
      ),
      paymentRequestId:Joi.alternatives().try(
        Joi.string().max(128).required(),
        Joi.allow(null)
      ),
      additionalInfo: Joi.any().optional()
    });

    const { error } = schema.validate(this, { abortEarly: false });
    if (error) {
        throw new Error(`Validation failed: ${error.details.map(x => x.message).join(', ')}`);
    }
  }
}

module.exports = CheckStatusVARequestDto;
