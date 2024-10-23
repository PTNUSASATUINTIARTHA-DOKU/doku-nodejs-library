const Joi = require("joi");

class CheckStatusDirectDebitDTO {
    constructor(
      originalPartnerReferenceNo,
      originalReferenceNo,
      originalExternalId,
      serviceCode,
      transactionDate,
      amount,
      merchantId,
      subMerchantId,
      externalStoreId,
      additionalInfo
    ) {
      this.originalPartnerReferenceNo = originalPartnerReferenceNo;
      this.originalReferenceNo = originalReferenceNo;
      this.originalExternalId = originalExternalId;
      this.serviceCode = serviceCode;
      this.transactionDate = transactionDate;
      this.amount = amount; // instance of AmountDto
      this.merchantId = merchantId;
      this.subMerchantId = subMerchantId;
      this.externalStoreId = externalStoreId;
      this.additionalInfo = additionalInfo; // instance of AdditionalInfoDto
    }
    validateCheckStatusRequestDto() {
        const schema = Joi.object({
            additionalInfo: Joi.object({
                channel: Joi.string().min(1).max(30).required()
            })
        })
        const { error } = schema.validate(this, { abortEarly: false });
        if (error) {
            throw new Error(`Validation failed: ${error.details.map(x => x.message).join(', ')}`);
        }
    }
    validateCheckStatusRequestDto(){
        const amountSchema = Joi.object({
          value: Joi.string().optional(),
          currency: Joi.string().optional(),
        });
      
        const additionalInfoSchema = Joi.object({
          deviceId: Joi.string().optional(),
          channel: Joi.string().optional(),
        });
      
        const schema = Joi.object({
          originalPartnerReferenceNo: Joi.string().optional(),
          originalReferenceNo: Joi.string().optional(),
          originalExternalId: Joi.string().optional(),
          serviceCode: Joi.string().required(),
          transactionDate: Joi.string().optional(),
          amount: amountSchema.optional(),
          merchantId: Joi.string().optional(),
          subMerchantId: Joi.string().optional(),
          externalStoreId: Joi.string().optional(),
          additionalInfo: additionalInfoSchema.optional(),
        });
      
        const { error } = schema.validate(this, { abortEarly: false });
        if (error) {
            throw new Error(`Validation failed: ${error.details.map(x => x.message).join(', ')}`);
        }
      };
  
    toObject() {
      return {
        originalPartnerReferenceNo: this.originalPartnerReferenceNo,
        originalReferenceNo: this.originalReferenceNo,
        originalExternalId: this.originalExternalId,
        serviceCode: this.serviceCode,
        transactionDate: this.transactionDate,
        amount: this.amount.toObject(),
        merchantId: this.merchantId,
        subMerchantId: this.subMerchantId,
        externalStoreId: this.externalStoreId,
        additionalInfo: this.additionalInfo.toObject(),
      };
    }
  }
  module.exports = CheckStatusDirectDebitDTO;