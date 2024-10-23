const Joi = require("joi");
class AccountUnbindingAdditionalInfo {
    constructor(channel) {
        this.channel =channel;
    }
}
class AccountUnbindingRequestDto {
    constructor(tokenId,additionalInfo) {
        this.tokenId = tokenId;
        this.additionalInfo = additionalInfo;
    }
    validateAccountUnbindingRequestDto() {
        const schema = Joi.object({
            tokenId:Joi.string().required(),
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
            tokenId: this.tokenId,
            additionalInfo: this.additionalInfo
        };
    }
}

module.exports = {AccountUnbindingRequestDto,AccountUnbindingAdditionalInfo};
