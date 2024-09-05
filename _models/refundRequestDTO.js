const Joi = require('joi');

class RefundRequestDto {
  constructor(originalPartnerReferenceNo, refundAmount, partnerRefundNo, originalExternalId, reason) {
    this.originalPartnerReferenceNo = originalPartnerReferenceNo;
    this.originalExternalId = originalExternalId;
    this.refundAmount = refundAmount; // instance of AmountDto
    this.reason = reason;
    this.partnerRefundNo = partnerRefundNo;
  }

  validateRefundRequestDto() {
    const additionalInfoSchema = Joi.object({
        channel: Joi.string().required()
    })
    const amountSchema = Joi.object({
      value: Joi.string()
        .min(1)
        .max(16)
        .required()
        .regex(/^\d+(\.\d{1,2})?$/)
        .message('value must be a valid number with up to two decimal places'),
      currency: Joi.string()
        .min(1)
        .max(3)
        .required(),
    });

    const schema = Joi.object({
      originalPartnerReferenceNo: Joi.string()
        .max(12)
        .required(),
      originalExternalId: Joi.string()
        .max(36)
        .optional(),
      refundAmount: amountSchema.required(),
      additionalInfo:additionalInfoSchema.required(),
      reason: Joi.string()
        .max(255)
        .optional(),
      partnerRefundNo: Joi.string()
        .max(12)
        .required(),
    });

    return schema.validate(this);
  }
  toObject() {
    return {
      originalPartnerReferenceNo: this.originalPartnerReferenceNo,
      originalExternalId: this.originalExternalId,
      refundAmount: this.refundAmount.toObject(),
      reason: this.reason,
      partnerRefundNo: this.partnerRefundNo,
    };
  }
}
module.exports = RefundRequestDto;