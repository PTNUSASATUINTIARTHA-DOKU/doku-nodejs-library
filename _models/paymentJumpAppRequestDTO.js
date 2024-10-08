const Joi = require('joi');

class PaymentJumpAppRequestDto {
    constructor(partnerReferenceNo, amount, urlParam, validUpto, pointOfInitiation, additionalInfo) {
        this.partnerReferenceNo = partnerReferenceNo; // Invoice number from partner
        this.amount = amount; // Object containing value and currency
        this.urlParam = urlParam; // Object containing url, type, and isDeepLink
        this.validUpto = validUpto; // Expired time payment url
        this.pointOfInitiation = pointOfInitiation; // Point of initiation from partner
        this.additionalInfo = additionalInfo; // Object containing channel and orderTitle
    }

    validate() {
        const schema = Joi.object({
            partnerReferenceNo: Joi.string().max(64).required(),
            amount: Joi.object({
                value: Joi.string().regex(/^\d+(\.\d{1,2})?$/).required(),
                currency: Joi.string().length(3).required()
            }).required(),
            urlParam: Joi.object({
                url: Joi.string().uri().max(255).required(),
                type: Joi.string().valid('PAY_RETURN').required(),
                isDeepLink: Joi.string().valid('Y', 'N').required()
            }).required(),
            validUpto: Joi.string().isoDate().required(),
            pointOfInitiation: Joi.string().max(20).required(),
            additionalInfo: Joi.object({
                channel: Joi.string().valid('EMONEY_DANA_SNAP').required(),
                orderTitle: Joi.string().optional()
            }).required()
        });

        const { error } = schema.validate(this, { abortEarly: false });

        if (error) {
            throw new Error(`Validation error: ${error.details.map(x => x.message).join(', ')}`);
        }
    }

    toObject() {

        return {
            partnerReferenceNo: this.partnerReferenceNo,
            amount: this.amount,
            urlParam: this.urlParam,
            validUpto: this.validUpto,
            pointOfInitiation: this.pointOfInitiation,
            additionalInfo: this.additionalInfo
        };
    }
}
module.exports = PaymentJumpAppRequestDto;
