const Joi = require("joi");

class UpdateVaDto {
    constructor(
        partnerServiceId,
        customerNo,
        virtualAccountNo,
        virtualAccountName,
        virtualAccountEmail,
        virtualAccountPhone,
        trxId,
        totalAmount,
        additionalInfo,
        virtualAccountTrxType,
        expiredDate
    ) {
        this.partnerServiceId = partnerServiceId; 
        this.customerNo = customerNo; 
        this.virtualAccountNo = virtualAccountNo; 
        this.virtualAccountName = virtualAccountName; 
        this.virtualAccountEmail = virtualAccountEmail; 
        this.virtualAccountPhone = virtualAccountPhone; 
        this.trxId = trxId; 
        this.totalAmount = totalAmount
        this.additionalInfo = additionalInfo
        this.virtualAccountTrxType = virtualAccountTrxType; 
        this.expiredDate = expiredDate;
    }
    validateUpdateVaRequestDto(){
        const commonSchema = {
            partnerServiceId: Joi.string().length(8).pattern(/^\s{0,7}\d{1,8}$/).required(),
            customerNo: Joi.alternatives().try(
                Joi.string().max(20).pattern(/^\d+$/).required(),
                Joi.allow(null)
            ),
            virtualAccountNo: Joi.alternatives().try(
                Joi.string().required().custom((value, helpers) => {
                    const { partnerServiceId, customerNo } = helpers.state.ancestors[0];
                    const expectedValue = `${partnerServiceId}${customerNo}`;
                    if (value !== expectedValue) {
                        throw new Error(`virtualAccountNo must be equal to partnerServiceId + customerNo (${expectedValue})`);
                    }
                    return value;
                }),
                Joi.allow(null)
            ),
            virtualAccountName: Joi.alternatives().try(
                Joi.string().min(1).max(255).pattern(/^[a-zA-Z0-9.\\\-\/+,=_:'@% ]*$/).required(),
                Joi.allow(null)
            ),
            virtualAccountEmail: Joi.alternatives().try(
                Joi.string().email().max(255).required(),
                Joi.allow(null)
            ),
            virtualAccountPhone: Joi.alternatives().try(
                Joi.string().min(9).max(30).required(),
                Joi.allow(null)
            ),
            trxId: Joi.string().min(1).max(64).required(),
            totalAmount: Joi.object({
                value: Joi.alternatives().try(
                    Joi.string().min(4).max(19).pattern(/^(0|[1-9]\d{0,15})(\.\d{2})?$/),
                    Joi.allow(null)
                ).required(),
                currency: Joi.alternatives().try(
                    Joi.string().length(3).default('IDR'),
                    Joi.allow(null)
                ).required()
            }).required(),
            additionalInfo: Joi.object({
                channel: Joi.string().min(1).max(30).required(),
                virtualAccountConfig: Joi.object({
                    status: Joi.allow(null),
                    minAmount: Joi.allow(null),
                    maxAmount: Joi.allow(null)
                })
            }).required(),
            virtualAccountTrxType: Joi.string().length(1).required(),
            expiredDate: Joi.alternatives().try(
                Joi.string().pattern(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}[+-]\d{2}:\d{2}$/).required(),
                Joi.allow(null)
            )
        };
    
        let schema;
        schema = Joi.object({
            ...commonSchema
        });
        const { error } = schema.validate(this, { abortEarly: false });
        if (error) {
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

module.exports = UpdateVaDto;
