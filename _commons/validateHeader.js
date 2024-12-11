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
            deviceId: commonSchema.deviceId.required().messages({"X":"X-DEVICE-ID must be 64 characters or fewer. Ensure that X-DEVICE-ID is no longer than 64 characters."})  
        });
        const { error } = schema.validate({ ipAddress, deviceId });
        if (error) {
            throw new Error(`X-DEVICE-ID must be 64 characters or fewer. Ensure that X-DEVICE-ID is no longer than 64 characters.`);
        }
    } else {
        schema = Joi.object({
            ipAddress: commonSchema.ipAddress.required() 
        });
        const { error } = schema.validate({ ipAddress });
        if (error) {
            throw new Error(`X-IP-ADDRESS must be in 10 to 15 characters.`);
        }
    }
    const validationData = { ipAddress };
    if (needsDeviceId) {
        validationData.deviceId = deviceId;
    }

    const { error } = schema.validate(validationData);
    if (error) {
        throw new Error(`Validation error: ${error.details.map(x => x.message).join(', ')}`);
    }
}

module.exports = {
    validateHeader
};
