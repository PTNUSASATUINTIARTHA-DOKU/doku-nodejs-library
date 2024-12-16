const Joi = require("joi");
const DIRECT_DEBIT_CHANNEL = require("../_commons/ddChannelEnum")

class BalanceInquiryRequestDto {
    constructor(additionalInfo) {
        this.additionalInfo = additionalInfo;
    }
    validateBalanceInquiryRequestDto() {
        const validChannels = Object.values(DIRECT_DEBIT_CHANNEL);
        const schema = Joi.object({
            additionalInfo: Joi.object({
                channel: Joi.string().valid(...validChannels).optional().messages({
                    'any.only': 'additionalInfo.channel is not valid. Ensure that additionalInfo.channel is one of the valid channels. Example: DIRECT_DEBIT_ALLO_SNAP'
                  }),
            })
        })
        const { error } = schema.validate(this, { abortEarly: false });
        if (error) {
            throw new Error(`Validation failed: ${error.details.map(x => x.message).join(', ')}`);
        }
    }
    toObject() {
        return {
            additionalInfo: this.additionalInfo
        };
    }
}

module.exports = BalanceInquiryRequestDto;
