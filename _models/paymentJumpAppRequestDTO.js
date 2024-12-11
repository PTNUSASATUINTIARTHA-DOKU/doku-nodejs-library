const Joi = require('joi');
const DIRECT_DEBIT_CHANNEL = require("../_commons/ddChannelEnum")

class PaymentJumpAppRequestDto {
    constructor(partnerReferenceNo, amount, urlParam, validUpTo, pointOfInitiation, additionalInfo) {
        this.partnerReferenceNo = partnerReferenceNo; // Invoice number from partner
        this.amount = amount; // Object containing value and currency
        this.urlParam = urlParam; // Object containing url, type, and isDeepLink
        this.validUpTo = validUpTo; // Expired time payment url
        this.pointOfInitiation = pointOfInitiation; // Point of initiation from partner
        this.additionalInfo = additionalInfo; // Object containing channel and orderTitle
    }

    validate() {
        const validChannels = Object.values(DIRECT_DEBIT_CHANNEL);
        const schema = Joi.object({
            partnerReferenceNo: Joi.string().allow(null, '').max(64).required(),
            amount: Joi.object({
                value: Joi.string().regex(/^\d+(\.\d{1,2})?$/).allow(null, '').required().messages(
                    {"*": "totalAmount.value is an invalid format"}
                ),
                currency: Joi.string().length(3).allow(null, '').required().messages({
                    "*": "totalAmount.currency must be 'IDR'. Ensure that totalAmount.currency is 'IDR'. Example: 'IDR'."
                })
            }).allow(null, '').optional(),
            urlParam: Joi.array().items(Joi.object({
                url: Joi.string().uri().max(255).allow(null, '').required(),
                type: Joi.string().valid('PAY_RETURN').required().messages({
                    "*": "urlParam.type must always be PAY_RETURN"
                }),
                isDeepLink: Joi.string().valid('Y', 'N').required().messages({
                    "*": "urlParam.isDeepLink must be Y/N" 
                })
            })).allow(null, '').required(),
            validUpTo: Joi.date().iso().required(),
            pointOfInitiation: Joi.string().allow(null, '').max(20).required(),
            additionalInfo: Joi.object({
                channel: Joi.string().valid(...validChannels).optional().messages({
                    'any.only': 'additionalInfo.channel is not valid. Ensure that additionalInfo.channel is one of the valid channels. Example: DIRECT_DEBIT_ALLO_SNAP'
                  }),
                orderTitle: Joi.string().optional()
            }).required()
        });

        const { error } = schema.validate(this, { abortEarly: true });

        if (error) {
            throw new Error(`${error.details.map(x => x.message)}`);
        }
    }

    toObject() {

        return {
            partnerReferenceNo: this.partnerReferenceNo,
            amount: this.amount,
            urlParam: this.urlParam,
            validUpTo: this.validUpTo,
            pointOfInitiation: this.pointOfInitiation,
            additionalInfo: this.additionalInfo
        };
    }
}
module.exports = PaymentJumpAppRequestDto;
