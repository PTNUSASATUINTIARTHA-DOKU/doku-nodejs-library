const Joi = require("joi");
const DIRECT_DEBIT_CHANNEL = require("../_commons/ddChannelEnum")

class AccountBindingRequestDto {
    constructor(phoneNo,additionalInfo) {
        this.phoneNo = phoneNo;
        this.additionalInfo = additionalInfo;
    }
    validateAccountBindingRequestDto() {
        const validChannels = Object.values(DIRECT_DEBIT_CHANNEL);
        let schema = Joi.object({
            phoneNo:Joi.string().min(9).max(16).required().messages({
                "any.required": "phoneNo cannot be null. Please provide a phoneNo. Example: '62813941306101'.",
                "string.min": "phoneNo must be at least 9 digits. Ensure that phoneNo is not empty. Example: '62813941306101'.",
                "string.max": "phoneNo must be 16 characters or fewer. Ensure that phoneNo is no longer than 16 characters. Example: '62813941306101'."
            }),
            additionalInfo: Joi.object({
                channel: Joi.string().valid(...validChannels).optional().messages({
                    'any.only': 'additionalInfo.channel is not valid. Ensure that additionalInfo.channel is one of the valid channels. Example: DIRECT_DEBIT_ALLO_SNAP'
                  }),
                custIdMerchant:Joi.string().max(64).required().messages({
                    "string.max": "additionalInfo.custIdMerchant must be 64 characters or fewer. Ensure that additionalInfo.custIdMerchant is no longer than 64 characters. Example: 'cust-001'.",
                    "any.required": "additionalInfo.custIdMerchant cannot be null. Please provide a additionalInfo.custIdMerchant. Example: 'cust-001'."
                }),
                customerName:Joi.string().max(70).optional(),
                email:Joi.string().email().max(256).optional(),
                idCard:Joi.string().max(20).optional(),
                country:Joi.string().max(60).optional(),
                address:Joi.string().max(255).optional(),
                dateOfBirth:Joi.string().max(64).optional(),
                successRegistrationUrl:Joi.string().required().messages({
                    "any.required": "additionalInfo.successRegistrationUrl cannot be null. Please provide a additionalInfo.successRegistrationUrl. Example: 'https://www.doku.com'.",
                }),
                failedRegistrationUrl:Joi.string().required().messages({
                    "any.required": "additionalInfo.failedRegistrationUrl cannot be null. Please provide a additionalInfo.failedRegistrationUrl. Example: 'https://www.doku.com'."
                }),
                deviceModel: Joi.string().min(1).max(64).optional(),
                osType: Joi.string().valid('ios', 'android').optional(),
                channelId: Joi.string().valid('web', 'app').optional()
            }).required()
        })
        if (this.additionalInfo.channel === "DIRECT_DEBIT_ALLO_SNAP") {
            schema = schema.keys({
            additionalInfo: Joi.object({
                channel: Joi.string().valid(...validChannels).optional().messages({
                    'any.only': 'additionalInfo.channel is not valid. Ensure that additionalInfo.channel is one of the valid channels. Example: DIRECT_DEBIT_ALLO_SNAP'
                  }),
                custIdMerchant:Joi.string().max(64).required().messages({
                    "string.max": "additionalInfo.custIdMerchant must be 64 characters or fewer. Ensure that additionalInfo.custIdMerchant is no longer than 64 characters. Example: 'cust-001'.",
                    "any.required": "additionalInfo.custIdMerchant cannot be null. Please provide a additionalInfo.custIdMerchant. Example: 'cust-001'."
                }),
                customerName:Joi.string().max(70),
                email:Joi.string().email().max(256),
                idCard:Joi.string().max(20),
                country:Joi.string().max(60),
                address:Joi.string().max(255),
                dateOfBirth:Joi.string().max(64),
                successRegistrationUrl:Joi.string().required().messages({
                    "any.required": "additionalInfo.successRegistrationUrl cannot be null. Please provide a additionalInfo.successRegistrationUrl. Example: 'https://www.doku.com'.",
                }),
                failedRegistrationUrl:Joi.string().required().messages({
                    "any.required": "additionalInfo.failedRegistrationUrl cannot be null. Please provide a additionalInfo.failedRegistrationUrl. Example: 'https://www.doku.com'."
                }),
                deviceModel: Joi.string().min(1).max(64).required(),
                osType: Joi.string().valid('ios', 'android').required(),
                channelId: Joi.string().valid('web', 'app').required()
              }), // More strict validation
            });
        }
        const { error } = schema.validate(this, { abortEarly: true });
        if (error) {
            throw new Error(`${error.details.map(x => x.message).join(', ')}`);
        }
    }
    toObject() {
        return {
            phoneNo: this.phoneNo,
            additionalInfo: this.additionalInfo
        };
    }
}

module.exports = AccountBindingRequestDto;
