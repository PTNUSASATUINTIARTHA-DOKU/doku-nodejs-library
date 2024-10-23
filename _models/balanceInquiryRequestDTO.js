const Joi = require("joi");
class BalanceInquiryRequestDto {
    constructor(additionalInfo) {
        this.additionalInfo = additionalInfo;
    }
    validateBalanceInquiryRequestDto() {
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
    toObject() {
        return {
            additionalInfo: this.additionalInfo
        };
    }
}

module.exports = BalanceInquiryRequestDto;
