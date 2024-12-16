const Joi = require("joi");
const DIRECT_DEBIT_CHANNEL = require("../_commons/ddChannelEnum")

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

    validateCheckStatusRequestDto(){
        const validChannels = Object.values(DIRECT_DEBIT_CHANNEL);

        const amountSchema = Joi.object({
          value: Joi.string().allow(null, '').optional(),
          currency: Joi.string().allow(null, '').optional(),
        });
      
        const additionalInfoSchema = Joi.object({
          deviceId: Joi.string().allow(null, '').optional(),
          channel: Joi.string().valid(...validChannels).optional().messages({
            'any.only': 'additionalInfo.channel is not valid. Ensure that additionalInfo.channel is one of the valid channels. Example: DIRECT_DEBIT_ALLO_SNAP'
          }),
        });
      
        const schema = Joi.object({
          originalPartnerReferenceNo: Joi.string().allow(null, '').optional(),
          originalReferenceNo: Joi.string().allow(null, '').optional(),
          originalExternalId: Joi.string().allow(null, '').optional(),
          serviceCode: Joi.string().equal("55").required().messages({"*":"serviceCode must be 55"}),
          transactionDate: Joi.string().allow(null, '').optional(),
          amount: amountSchema.allow(null, '').optional(),
          merchantId: Joi.string().allow(null, '').optional(),
          subMerchantId: Joi.string().allow(null, '').optional(),
          externalStoreId: Joi.string().allow(null, '').optional(),
          additionalInfo: additionalInfoSchema.allow(null, '').optional(),
        });
        const { error } = schema.validate(this, { abortEarly: true });
        if (error) {
            throw new Error(`${error.details.map(x => x.message)}`);
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