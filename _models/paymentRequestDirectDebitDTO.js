const Joi = require("joi");
const DIRECT_DEBIT_CHANNEL = require("../_commons/ddChannelEnum")

class TotalAmountDto {
    constructor(value, currency) {
        this.value = value;
        this.currency = currency;
    }

    toObject() {
        return {
            value: this.value,
            currency: this.currency,
        };
    }
}

class LineItemsDto {
    constructor(name, price, quantity) {
        this.name = name;
        this.price = price;
        this.quantity = quantity;
    }

    toObject() {
        return {
            name: this.name,
            price: this.price,
            quantity: this.quantity,
        };
    }
}

class PayOptionDetailsDto {
    constructor(payMethod, transAmount, feeAmount) {
        this.payMethod = payMethod;
        this.transAmount = transAmount instanceof TotalAmountDto ? transAmount : null;
        this.feeAmount = feeAmount instanceof TotalAmountDto ? feeAmount : null;
    }

    toObject() {
        return {
            payMethod: this.payMethod,
            transAmount: this.transAmount ? this.transAmount.toObject() : null,
            feeAmount: this.feeAmount ? this.feeAmount.toObject() : null,
        };
    }
}

class PaymentAdditionalInfoRequestDto {
    constructor(channel, remarks, successPaymentUrl, failedPaymentUrl, lineItems) {
        this.channel = channel;
        this.remarks = remarks;
        this.successPaymentUrl = successPaymentUrl;
        this.failedPaymentUrl = failedPaymentUrl;
        this.lineItems = Array.isArray(lineItems)
            ? lineItems.map(item => new LineItemsDto(item.name, item.price, item.quantity))
            : [];
    }

    toObject() {
        return {
            channel: this.channel,
            remarks: this.remarks,
            successPaymentUrl: this.successPaymentUrl,
            failedPaymentUrl: this.failedPaymentUrl,
            lineItems: this.lineItems.map(item => item.toObject()),
        };
    }
}

class PaymentRequestDto {
    constructor(partnerReferenceNo, amount, payOptionDetails, additionalInfo, chargeToken) {
        this.partnerReferenceNo = partnerReferenceNo;
        this.amount = amount instanceof TotalAmountDto ? amount : null;
        this.payOptionDetails = Array.isArray(payOptionDetails)
            ? payOptionDetails.map(detail => new PayOptionDetailsDto(detail.payMethod, detail.transAmount, detail.feeAmount))
            : [];
        this.additionalInfo = additionalInfo instanceof PaymentAdditionalInfoRequestDto
            ? additionalInfo
            : null;
        this.chargeToken = chargeToken;    
    }
  
    validatePaymentRequestDto(){
        const validChannels = Object.values(DIRECT_DEBIT_CHANNEL);
        let  schema = Joi.object({
            partnerReferenceNo:Joi.string().min(1).max(64).required(),
            feetype: Joi.string().valid('OUR', 'BEN', 'SHA').optional(),
            amount: Joi.object({
                value: Joi.string().min(4).max(19).pattern(/^(0|[1-9]\d{0,15})(\.\d{2})?$/).required(),
                currency: Joi.string().length(3).default('IDR').required()
            }).required(),
            transAmount: Joi.object({
                value: Joi.string().min(4).max(19).pattern(/^(0|[1-9]\d{0,15})(\.\d{2})?$/).optional(),
                currency: Joi.string().length(3).default('IDR').optional()
            }).optional,
            payOptionDetails: Joi.array().items(Joi.object({
                payMethod: Joi.string().valid('CASH', 'POINTS').optional(),
                transAmount: Joi.object({
                    value: Joi.string().min(4).max(16).pattern(/^(0|[1-9]\d{0,15})(\.\d{2})?$/).required(),
                    currency: Joi.string().length(3).default('IDR').required()
                }).optional(),
                feeAmount: Joi.object({
                    value: Joi.string().min(4).max(16).pattern(/^(0|[1-9]\d{0,15})(\.\d{2})?$/).required(),
                    currency: Joi.string().length(3).default('IDR').required()
                }).optional()
            })).optional(),
            additionalInfo: Joi.object({
                channel: Joi.string().valid(...validChannels).required().messages({
                    'any.only': 'additionalInfo.channel is not valid. Ensure that additionalInfo.channel is one of the valid channels. Example: DIRECT_DEBIT_ALLO_SNAP'
                  }),
                successPaymentUrl:Joi.string().required().messages({
                    "any.required": "additionalInfo.successRegistrationUrl cannot be null. Please provide a additionalInfo.successRegistrationUrl. Example: 'https://www.doku.com'.",
                }),
                failedPaymentUrl:Joi.string().required().messages({
                    "any.required": "additionalInfo.failedRegistrationUrl cannot be null. Please provide a additionalInfo.failedRegistrationUrl. Example: 'https://www.doku.com'."
                }),
                remarks:Joi.string().max(40).optional(),
                lineItems: Joi.array().items(
                    Joi.object({
                        name: Joi.string().required(),
                        price: Joi.number().required(),
                        quantity: Joi.number().required(),
                    })
                ).optional(),
                merchantTrxId: Joi.string().max(64).optional(),
                otpStatus: Joi.string().valid('YES', 'NO').optional(),
                paymentType: Joi.string().valid("SALE", "RECURRING").optional()
            }),
            chargeToken: Joi.string().optional()
        })
        if(this.additionalInfo.channel === "DIRECT_DEBIT_CIMB_SNAP") {
            schema = schema.keys({
                partnerReferenceNo: Joi.string().max(12).required()
            })
        } else if(this.additionalInfo.channel === "DIRECT_DEBIT_BRI_SNAP" || this.additionalInfo.channel === "EMONEY_OVO_SNAP") {
            schema = schema.keys({
                partnerReferenceNo: Joi.string().max(64).required()
            })
        } else if(this.additionalInfo.channel === "DIRECT_DEBIT_ALLO_SNAP") {
            schema = schema.keys({
                partnerReferenceNo: Joi.string().min(32).max(64).required()
            })
        }
        const { error } = schema.validate(this, { abortEarly: true });
        if (error) {
            throw new Error(`${error.details.map(x => x.message).join(', ')}`);
        }
    }

    toObject() {
        return {
            partnerReferenceNo: this.partnerReferenceNo,
            amount: this.amount ? this.amount.toObject() : null,
            payOptionDetails: this.payOptionDetails.map(detail => detail.toObject()),
            additionalInfo: this.additionalInfo ? this.additionalInfo.toObject() : null,
        };
    }
}

module.exports = {
    PaymentRequestDto,
    TotalAmountDto,
    LineItemsDto,
    PayOptionDetailsDto,
    PaymentAdditionalInfoRequestDto
};
