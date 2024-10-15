const Joi = require("joi");

class AccountBindingRequestDto {
    constructor(phoneNo,additionalInfo) {
        this.phoneNo = phoneNo;
        this.additionalInfo = additionalInfo;
    }
    validateAccountBindingRequestDto() {
        const schema = Joi.object({
            phoneNo:Joi.string().required(),
            additionalInfo: Joi.object({
                channel: Joi.string().min(1).max(30).required(),
                custIdMerchant:Joi.string().required(),
                customerName:Joi.string(),
                email:Joi.string(),
                idCard:Joi.string(),
                country:Joi.string(),
                address:Joi.string(),
                dateOfBirth:Joi.string(),
                successRegistrationUrl:Joi.string().required(),
                failedRegistrationUrl:Joi.string().required(),
                deviceModel:Joi.string(),
                osType:Joi.string(),
                channelId:Joi.string()
            })
        })
        console.log(this)
        const { error } = schema.validate(this, { abortEarly: false });
        if (error) {
            throw new Error(`Validation failed: ${error.details.map(x => x.message).join(', ')}`);
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
