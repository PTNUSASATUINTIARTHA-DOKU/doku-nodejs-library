const Joi = require('joi');

class PaymentNotifDirectDebitRequestDto {
    constructor(
       {
        originalPartnerReferenceNo,
        originalReferenceNo,
        originalExternalId,
        latestTransactionStatus,
        transactionStatusDesc,
        amount,
        additionalInfo,
        lineItems,
        origin
       }
    ) {
        this.originalPartnerReferenceNo = originalPartnerReferenceNo;
        this.originalReferenceNo = originalReferenceNo;
        this.originalExternalId = originalExternalId;
        this.latestTransactionStatus = latestTransactionStatus;
        this.transactionStatusDesc = transactionStatusDesc;
        this.amount = amount;
        this.additionalInfo = additionalInfo;
        this.lineItems = lineItems;
        this.origin = origin;
    }
}

// Skema validasi menggunakan Joi
const paymentNotifDirectDebitRequestSchema = Joi.object({
    originalPartnerReferenceNo: Joi.string().min(1).max(64).required(),
    originalReferenceNo: Joi.string().min(1).max(64).required(),
    originalExternalId: Joi.string().min(1).max(64).required(),
    latestTransactionStatus: Joi.string().valid('00', '03', '04', '05', '06').required(),
    transactionStatusDesc: Joi.string().optional(),
    amount: Joi.object({
        value: Joi.string().min(1).max(16).required(),
        currency: Joi.string().valid('IDR').required(),
    }).required(),
    additionalInfo: Joi.object({
        channelId: Joi.string().required(),
        acquirerId: Joi.string().required(),
        custIdMerchant: Joi.string().min(1).max(64).required(),
        accountType: Joi.string().valid('DIRECT_DEBIT', 'EMONEY').required(),
    }).required(),
    lineItems: Joi.array().items(
        Joi.object({
            name: Joi.string().min(1).max(32).required(),
            price: Joi.string().pattern(/^\d+(\.\d{1,2})?$/).required(), // Format: numeric amount
            quantity: Joi.number().integer().min(1).required(),
        })
    ).required(),
    origin: Joi.object({
        source: Joi.string().optional(),
        system: Joi.string().optional(),
        product: Joi.string().optional(),
        apiFormat: Joi.string().optional(),
    }).optional(),
});

validatePaymentNotifDirectDebitRequest = () => {
    const { error, value } = paymentNotifDirectDebitRequestSchema.validate(this);
    if (error) {
        throw new Error(`Validation error: ${error.details.map(x => x.message).join(', ')}`);
    }
    return value;
};

module.exports = PaymentNotifDirectDebitRequestDto;
