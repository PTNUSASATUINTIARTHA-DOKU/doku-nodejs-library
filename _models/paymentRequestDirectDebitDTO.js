const Joi = require("joi");

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
        const schema = Joi.object({
            partnerReferenceNo:Joi.string().min(32).max(64).required(),
            amount: Joi.object({
                value: Joi.string().min(4).max(19).pattern(/^(0|[1-9]\d{0,15})(\.\d{2})?$/).required(),
                currency: Joi.string().length(3).default('IDR').required()
            }).required(),
            payOptionDetails: Joi.array().items(Joi.object({
                payMethod: Joi.string().required(),
                transAmount: Joi.object({
                    value: Joi.string().min(4).max(16).pattern(/^(0|[1-9]\d{0,15})(\.\d{2})?$/).required(),
                    currency: Joi.string().length(3).default('IDR').required()
                }).required(),
                feeAmount: Joi.object({
                    value: Joi.string().min(4).max(16).pattern(/^(0|[1-9]\d{0,15})(\.\d{2})?$/).required(),
                    currency: Joi.string().length(3).default('IDR').required()
                }).required()
            })).required(),
            additionalInfo: Joi.object({
                channel: Joi.string().min(1).max(30).required(),
                successPaymentUrl:Joi.string().required(),
                failedPaymentUrl:Joi.string().required(),
                remarks:Joi.string().max(40).required(),
                lineItems: Joi.array().items(
                    Joi.object({
                        name: Joi.string().required(),
                        price: Joi.number().required(),
                        quantity: Joi.number().required(),
                    })
                ).required()
            }),
            chargeToken: Joi.string().optional()
        })
        const { error } = schema.validate(this, { abortEarly: false });
        if (error) {
            throw new Error(`Validation failed: ${error.details.map(x => x.message).join(', ')}`);
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
