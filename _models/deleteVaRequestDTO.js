const Joi = require('joi');
const DeleteVaRequestAdditionalInfo = require('./deleteVaRequestAdditionalInfoDTO');

class DeleteVaRequestDto {
  constructor(partnerServiceId, customerNo, virtualAccountNo, trxId, additionalInfo) {
    this.partnerServiceId = partnerServiceId;
    this.customerNo = customerNo;
    this.virtualAccountNo = virtualAccountNo;
    this.trxId = trxId;
    this.additionalInfo = new DeleteVaRequestAdditionalInfo(additionalInfo);
  }

  validateSimulator(){
    if (this.trxId.startsWith("1118")) {
        return {
            "responseCode": "2003100",
            "responseMessage": "success"
        };
    }
}

  validateDeleteVaRequest() {
    const schema = Joi.object({
      partnerServiceId:  Joi.string().length(8).pattern(/^\s{0,7}\d{1,8}$/).required(),
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
      trxId: Joi.string().min(1).max(64).required(),
      additionalInfo: Joi.object({
        channel: Joi.string().min(1).max(30).required(),
      }).required()
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
        virtualAccountNo:this.virtualAccountNo,
        trxId:this.trxId,
        additionalInfo:this.additionalInfo
    };
}
}

module.exports = DeleteVaRequestDto;
