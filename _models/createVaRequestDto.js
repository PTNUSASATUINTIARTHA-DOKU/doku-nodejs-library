const Joi = require('joi');
class CreateVARequestDto {

    constructor(partnerServiceId, customerNo, virtualAccountNo, virtualAccountName, virtualAccountEmail, virtualAccountPhone, trxId, totalAmount, additionalInfo, virtualAccountTrxType, expiredDate) {
        this.partnerServiceId = partnerServiceId;
        
        if(customerNo != ''){
            this.customerNo = customerNo;
        }

        if(virtualAccountNo != ''){
            this.virtualAccountNo = virtualAccountNo;
        }
        
        this.virtualAccountName = virtualAccountName;
        this.virtualAccountEmail = virtualAccountEmail;
        this.virtualAccountPhone = virtualAccountPhone;
        this.trxId = trxId;
        this.totalAmount = totalAmount;
        this.additionalInfo = additionalInfo;
        this.virtualAccountTrxType = virtualAccountTrxType;
        this.expiredDate = expiredDate;
    }

    validateVaRequestDto() {
        const commonSchema = {
            partnerServiceId: Joi.string().length(8).pattern(/^\s{0,7}\d{1,8}$/).required(),
            virtualAccountName: Joi.string().min(1).max(255).pattern(/^[a-zA-Z0-9.\\\-\/+,=_:'@% ]*$/).required(),
            virtualAccountEmail: Joi.string().email().max(255).required(),
            virtualAccountPhone: Joi.string().required(),
            trxId: Joi.string().min(1).max(64).required(),
            totalAmount: Joi.object({
                value: Joi.string().min(4).max(19).pattern(/^(0|[1-9]\d{0,15})(\.\d{2})?$/).required(),
                currency: Joi.string().length(3).default('IDR').required()
            }).required(),
            additionalInfo: Joi.object({
                channel: Joi.string().min(1).max(30).required(),
                virtualAccountConfig: Joi.object({
                    reusableStatus: Joi.boolean()
                })
            }).required(),
            virtualAccountTrxType: Joi.string().length(1).required(),
            expiredDate: Joi.string().pattern(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}[+-]\d{2}:\d{2}$/).required(),
        };
    
        let schema;
        if (this.customerNo && this.virtualAccountNo) {
            schema = Joi.object({
                ...commonSchema,
                customerNo: Joi.string().max(20).pattern(/^\d+$/).required(),
                virtualAccountNo: Joi.string().required(),
            });
        } else {
            schema = Joi.object({
                ...commonSchema,
                customerNo: Joi.string(),
                virtualAccountNo: Joi.string()
            });
        }
    
        const { error } = schema.validate(this, { abortEarly: false });
        if (error) {
            console.log(error);
            throw new Error(`Validation failed: ${error.details.map(x => x.message).join(', ')}`);
        }
    }
    

    toObject() {
        return {
            partnerServiceId: this.partnerServiceId,
            customerNo: this.customerNo,
            virtualAccountNo: this.virtualAccountNo,
            virtualAccountName: this.virtualAccountName,
            virtualAccountEmail: this.virtualAccountEmail,
            virtualAccountPhone: this.virtualAccountPhone,
            trxId: this.trxId,
            totalAmount: this.totalAmount.toObject(),
            additionalInfo: this.additionalInfo.toObject(),
            virtualAccountTrxType: this.virtualAccountTrxType,
            expiredDate: this.expiredDate
        };
    }

}

module.exports = CreateVARequestDto;