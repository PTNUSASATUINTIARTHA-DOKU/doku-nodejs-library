const Joi = require('joi');

class RefundRequestDto {
  constructor(originalPartnerReferenceNo, refundAmount, partnerRefundNo, originalExternalId, reason, additionalInfo) {
    this.originalPartnerReferenceNo = originalPartnerReferenceNo;
    this.originalExternalId = originalExternalId;
    this.refundAmount = refundAmount; // instance of AmountDto
    this.reason = reason;
    this.partnerRefundNo = partnerRefundNo;
    this.additionalInfo = additionalInfo;
  }

  validateRefundRequestDto() {
    const additionalInfoSchema = Joi.object({
      channel: Joi.string().required(),
    });
    
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
  
    // Create base schema
    let schema = Joi.object({
      originalPartnerReferenceNo: Joi.string().min(32).max(64).required(),
      originalExternalId: Joi.string().max(36).optional(),
      refundAmount: amountSchema.required(),
      additionalInfo: additionalInfoSchema.required(),
      reason: Joi.string().max(255).optional(),
      partnerRefundNo: Joi.string().max(64).required(), // Default partnerRefundNo
    });
  
    // Modify schema conditionally
    if (this.additionalInfo.channel === "DIRECT_DEBIT_ALLO_SNAP") {
      schema = schema.keys({
        partnerRefundNo: Joi.string().min(32).max(64).required(), // More strict validation
      });
    }
  
    // Validate the object
    const { error } = schema.validate(this, { abortEarly: false });
    if (error) {
      throw new Error(`Validation failed: ${error.details.map(x => x.message).join(', ')}`);
    }
  }
  
  toObject() {
    return {
      originalPartnerReferenceNo: this.originalPartnerReferenceNo,
      originalExternalId: this.originalExternalId,
      refundAmount: this.refundAmount.toObject(),
      reason: this.reason,
      partnerRefundNo: this.partnerRefundNo,
      additionalInfo: this.additionalInfo
    };
  }
}
module.exports = RefundRequestDto;