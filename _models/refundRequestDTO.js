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
      originalPartnerReferenceNo: Joi.string().min(1).max(64).required(),
      originalExternalId: Joi.string().max(36).required(),
      refundAmount: amountSchema.required(),
      additionalInfo: additionalInfoSchema.required(),
      reason: Joi.string().max(255).optional(),
      partnerRefundNo: Joi.string().max(64).required(), // Default partnerRefundNo
    });

    if (this.additionalInfo.channel == "EMONEY_OVO_SNAP"){
      schema = schema.keys({
        originalPartnerReferenceNo: Joi.string().max(32).required().messages({"*":"originalPartnerReferenceNo must be 32 characters or fewer. Ensure that originalPartnerReferenceNo is no longer than 32 characters. Example: 'INV-001'."}),
      })
    } else if (this.additionalInfo.channel == "EMONEY_DANA_SNAP" || this.additionalInfo.channel == "EMONEY_SHOPEE_PAY_SNAP" || this.additionalInfo.channel == "DIRECT_DEBIT_ALLO_SNAP") {
      schema = schema.keys({
        originalPartnerReferenceNo: Joi.string().max(64).required().messages({"*":"originalPartnerReferenceNo must be 64 characters or fewer. Ensure that originalPartnerReferenceNo is no longer than 64 characters. Example: 'INV-001'."}),
      })
    } else if(this.additionalInfo.channel == "DIRECT_DEBIT_CIMB_SNAP" || this.additionalInfo.channel == "DIRECT_DEBIT_BRI_SNAP") {
      schema = schema.keys({
        originalPartnerReferenceNo: Joi.string().max(12).required().messages({"*":"originalPartnerReferenceNo must be 12 characters or fewer. Ensure that originalPartnerReferenceNo is no longer than 12 characters. Example: 'INV-001'."}),
      })
    }
  
    // Modify schema conditionally
    if (this.additionalInfo.channel === "EMONEY_DANA_SNAP" || this.additionalInfo.channel === "EMONEY_SHOPEE_PAY_SNAP" || this.additionalInfo.channel === "EMONEY_OVO_SNAP") {
      schema = schema.keys({
        partnerRefundNo: Joi.string().min(1).max(64).required().messages({
          "*": "partnerRefundNo must be 64 characters or fewer. Ensure that partnerRefundNo is no longer than 64 characters. Example: 'INV-REF-001'."
        }), // More strict validation
      });
    } else if(this.additionalInfo.channel === "DIRECT_DEBIT_CIMB_SNAP" || this.additionalInfo.channel === "DIRECT_DEBIT_BRI_SNAP" || this.additionalInfo.channel === "EMONEY_OVO_SNAP") {
      schema = schema.keys({
        partnerRefundNo: Joi.string().min(1).max(12).required().messages({
          "*": "partnerRefundNo must be 12 characters or fewer. Ensure that partnerRefundNo is no longer than 12 characters. Example: 'INV-REF-001'."
        }), // More strict validation
      });
    } else if(this.additionalInfo.channel === "DIRECT_DEBIT_ALLO_SNAP") {
      schema = schema.keys({
        partnerRefundNo: Joi.string().min(32).max(64).required().messages({
          "*": "partnerRefundNo must be 64 characters and at least 32 characters. Ensure that partnerRefundNo is no longer than 64 characters and at least 32 characters. Example: 'INV-REF-001'."
        }), // More strict validation
      });
    } 
  
    // Validate the object
    const { error } = schema.validate(this, { abortEarly: true });
    if (error) {
      throw new Error(`${error.details.map(x => x.message).join(', ')}`);
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