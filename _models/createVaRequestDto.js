const Joi = require('joi');

class CreateVARequestDto {

    constructor(partnerServiceId, customerNo, virtualAccountNo, virtualAccountName, virtualAccountEmail, virtualAccountPhone, trxId, totalAmount, additionalInfo, virtualAccountTrxType, expiredDate, freeText= null) {
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
        this.freeText = freeText;
    }

    validateVaRequestDto() {
        const schema = Joi.object({
            partnerServiceId: Joi.string().length(8).pattern(/^\s{0,7}\d{1,8}$/).required(),
            customerNo: Joi.string().max(20).pattern(/^\d+$/).required(),
            virtualAccountNo: Joi.string().required().custom((value, helpers) => {
            const { partnerServiceId, customerNo } = helpers.state.ancestors[0];
            const expectedValue = `${partnerServiceId}${customerNo}`;
            if (value !== expectedValue) {
                throw new Error(`virtualAccountNo must be equal to partnerServiceId + customerNo (${expectedValue})`);
            }
            return value;
            }),
            virtualAccountName: Joi.string().min(1).max(255).pattern(/^[a-zA-Z0-9.\\\-\/+,=_:'@% ]*$/).required(),
            virtualAccountEmail: Joi.string().email().max(255).required(),
            virtualAccountPhone: Joi.string().min(9).max(30).required(),
            trxId: Joi.string().min(1).max(64).required(),
            totalAmount: Joi.object({
            value: Joi.string().min(4).max(19).pattern(/^(0|[1-9]\d{0,15})(\.\d{2})?$/).required(),
            currency: Joi.string().length(3).default('IDR').required()
            }).required(),
            additionalInfo: Joi.object({
            channel: Joi.string().min(1).max(30).required(),
            virtualAccountConfig: Joi.object({
                reusableStatus: Joi.boolean(),
                maxAmount: Joi.string().pattern(/^\d+(\.\d{2})?$/),
                minAmount: Joi.string().pattern(/^\d+(\.\d{2})?$/)
            }).custom((value, helpers) => {
                const minAmount = parseFloat(value.minAmount);
                const maxAmount = parseFloat(value.maxAmount);
                if (minAmount >= maxAmount) {
                throw new Error('maxAmount must be greater than minAmount');
                }
                return value;
            }),
            origin: Joi.object().optional()
            }).required(),
            virtualAccountTrxType: Joi.string().length(1).required(),
            expiredDate: Joi.string().pattern(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}[+-]\d{2}:\d{2}$/).required(),
            freeText: Joi.array().items(
                Joi.object({
                    english: Joi.string().max(64).required(),
                    indonesia: Joi.string().max(64).required()
                })
            ).optional()
        });
        
        const { error } = schema.validate(this, { abortEarly: false });
        if (error) {
            throw new Error(`Validation failed: ${error.details.map(x => x.message).join(', ')}`);
        }
    }
    validateSimulator(){
        if(this.trxId.startsWith("1110") || this.trxId.startsWith("1114")){
            return {
                "responseCode": "2002700",
                "responseMessage": "Successful",
                "virtualAccountData": {
                    "partnerServiceId": "90341589",
                    "customerNo": "00000077",
                    "virtualAccountNo": "9034153700000077",
                    "virtualAccountName": "Jokul Doe 001",
                    "virtualAccountEmail": "jokul@email.com",
                    "virtualAccountPhone": "",
                    "trxId": "PGPWF167",
                    "totalAmount": {
                        "value": "13000.00",
                        "currency": "IDR"
                    },
                    "virtualAccountTrxType": "C",
                    "expiredDate": "2024-02-02T15:02:29+07:00"
                }
            };
        }else if (this.trxId.startsWith("1111")) {
            return {
                "responseCode": "4042512",
                "responseMessage": "Bill not found"
            };
        }else if (this.trxId.startsWith("1112")) {
            return {
                "responseCode": "4042513",
                "responseMessage": "Invalid Amount"
            };
        }else if (this.trxId.startsWith("111") && this.trxId[3] !== '4') {
            return {
                "responseCode": "4012701",
                "responseMessage": "Access Token Invalid (B2B)"
            };
        }
        else if (this.trxId.startsWith("112")) {
            return {
                "responseCode": "4012700",
                "responseMessage": "Unauthorized. Signature Not Match"
            };
        }
        else if (this.trxId.startsWith("113")) {
            return {
                "responseCode": "4002702",
                "responseMessage": "Invalid Mandatory Field {partnerServiceId}",
                "virtualAccountData": {
                    "partnerServiceId": "",
                    "customerNo": "00000000000000000000",
                    "virtualAccountNo": "0000000000000000000000000000",
                    "virtualAccountName": "Jokul Doe 001",
                    "virtualAccountEmail": "jokul@email.com",
                    "virtualAccountPhone": "",
                    "trxId": "PGPWF123",
                    "totalAmount": {
                        "value": "13000.00",
                        "currency": "IDR"
                    },
                    "virtualAccountTrxType": "1",
                    "expiredDate": "2023-10-31T23:59:59+07:00"
                }
            };
        }
        else if (this.trxId.startsWith("114")) {
            return {
                "responseCode": "4002701",
                "responseMessage": "Invalid Field Format {totalAmount.currency}",
                "virtualAccountData": {
                    "partnerServiceId": "90341537",
                    "customerNo": "00000000000000000000",
                    "virtualAccountNo": "0000000000000000000000000000",
                    "virtualAccountName": "Jokul Doe 001",
                    "virtualAccountEmail": "jokul@email.com",
                    "virtualAccountPhone": "",
                    "trxId": "PGPWF123",
                    "totalAmount": {
                        "value": "13000.00",
                        "currency": "1"
                    },
                    "virtualAccountTrxType": "1",
                    "expiredDate": "2023-10-31T23:59:59+07:00"
                }
            };
        }
        else if (this.trxId.startsWith("115")) {
            return {
                "responseCode": "4092700",
                "responseMessage": "Conflict"
            };
        }
    }
    toObject() {
        const obj = {
            partnerServiceId: this.partnerServiceId,
            customerNo: this.customerNo,
            virtualAccountNo: this.virtualAccountNo,
            virtualAccountName: this.virtualAccountName,
            virtualAccountEmail: this.virtualAccountEmail,
            virtualAccountPhone: this.virtualAccountPhone,
            trxId: this.trxId,
            totalAmount: this.totalAmount,
            additionalInfo: this.additionalInfo,
            virtualAccountTrxType: this.virtualAccountTrxType,
            expiredDate: this.expiredDate,
        };
        if (this.freeText !== null && this.freeText !== undefined) {
            obj.freeText = this.freeText;
        }
        return obj;
    }

}

module.exports = CreateVARequestDto;
