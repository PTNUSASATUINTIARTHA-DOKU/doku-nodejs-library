const Joi = require("joi");

function validateHeader({ ipAddress, deviceId, channel, type }) {
    const commonSchema = {
        ipAddress: Joi.string().min(10).max(15).required(),
        deviceId: Joi.string().max(64)
    };

    let schema;

    const needsDeviceId = (
        (channel === "DIRECT_DEBIT_ALLO_SNAP" && type === "ACCOUNT_BINDING") ||
        (channel === "EMONEY_DANA_SNAP" && (type === "PAYMENT" || type === "REFUND")) ||
        (channel === "EMONEY_SHOPEE_PAY_SNAP" && (type === "PAYMENT" || type === "REFUND"))
    );
    if (needsDeviceId) {
        schema = Joi.object({
            ...commonSchema,
            deviceId: commonSchema.deviceId.required()  
        });
        const { error } = schema.validate({ ipAddress, deviceId });
        if (error) {
            throw new Error(`Validation error: ${error.details.map(x => x.message).join(', ')}`);
        }
    } else {
        schema = Joi.object({
            ipAddress: commonSchema.ipAddress.required() 
        });
        const { error } = schema.validate({ ipAddress });
        if (error) {
            throw new Error(`Validation error: ${error.details.map(x => x.message).join(', ')}`);
        }
    }

   
   
}

module.exports = {
    validateHeader
};
