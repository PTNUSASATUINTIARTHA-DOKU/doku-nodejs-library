"use strict"
const { default: axios } = require('axios');
const xml2js = require('xml2js');
const KJUR = require('jsrsasign');
const config = require('../_commons/config');
const TokenService = require('./tokenService');
const CreateVAResponseDTO = require('../_models/createVaResponseDTO');
const UpdateVaResponseDto = require('../_models/updateVaResponseDTO');
const DeleteVaResponseDto = require('../_models/deleteVaResponseDTO');
const CheckStatusVaResponseDTO = require('../_models/checkStatusVaResponseDTO');
const PaymentNotificationResponseBodyDTO = require('../_models/paymentNotificationResponseBodyDTO');
const FormData = require('form-data');

module.exports = {
    generateExternalId() {
        const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0;
            const v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
        const timestamp = Date.now();
        return `${uuid}-${timestamp}`;
    },
    generateRequestHeaderDto(channelId, privateKey, clientId, tokenB2B,timestamp){
    
        return {
            xTimestamp:timestamp,
            xSignature:TokenService.generateSignature(privateKey, clientId, timestamp),
            xPartnerId:clientId,
            xExternalId:this.generateExternalId(),
            channelId:channelId,
            authorization: tokenB2B
        }
    },
    createVaRequesHeaderDto(channelId, clientId, tokenB2B,timestamp,externalId,signature){
        return {
            xTimestamp:timestamp,
            xSignature:signature,
            xPartnerId:clientId,
            xExternalId:externalId,
            channelId:"SDK",
            authorization: tokenB2B
        }
    },
    async createVa(requestHeaderDto, createVaRequestDto,isProduction) {
        const base_url_api = config.getBaseUrl(isProduction) + config.CREATE_VA;

        let header= {
            "X-PARTNER-ID": requestHeaderDto.xPartnerId,
            "X-TIMESTAMP": requestHeaderDto.xTimestamp,
            "X-SIGNATURE": requestHeaderDto.xSignature,
            "Authorization":"Bearer " + requestHeaderDto.authorization,
            "X-EXTERNAL-ID": requestHeaderDto.xExternalId,
            "CHANNEL-ID":requestHeaderDto.channelId
        }
        console.log(header)
        return await new Promise((resolve, reject) => {
            axios({
                method: 'post',
                url: base_url_api,
                headers: header,
                data:createVaRequestDto
            })
            .then((res) => {
                console.log(res.data)
                let response = new CreateVAResponseDTO(res.data);
                resolve(response);
            })
            .catch((err) => {
                console.log(err)
                reject(err);
            });
        });
    },
    async doUpdateVa(requestHeaderDto, updateVaRequestDto,isProduction){
        // console.log(updateVaRequestDto)
        const base_url_api = config.getBaseUrl(isProduction) + config.PUT_UPDATE_VA;

        let header= {
            "X-PARTNER-ID": requestHeaderDto.xPartnerId,
            "X-TIMESTAMP": requestHeaderDto.xTimestamp,
            "X-SIGNATURE": requestHeaderDto.xSignature,
            "Authorization":"Bearer " + requestHeaderDto.authorization,
            "X-EXTERNAL-ID": requestHeaderDto.xExternalId,
            "CHANNEL-ID":requestHeaderDto.channelId
        }
        // console.log(header)
        return await new Promise((resolve, reject) => {
            axios({
                method: 'put',
                url: base_url_api,
                headers: header,
                data:updateVaRequestDto.toObject()
            })
            .then((res) => {
                console.log(res)
                let response = new UpdateVaResponseDto(res.data);
                resolve(response);
            })
            .catch((err) => {
                console.log(err)
                reject(err);
            });
        });
    },
    async doDeletePaymentCode(requestHeaderDto, deleteVaRequestDto,isProduction){
        //call api
        const base_url_api = config.getBaseUrl(isProduction) + config.DELETE_VA;
        let header= {
            "X-PARTNER-ID": requestHeaderDto.xPartnerId,
            "X-TIMESTAMP": requestHeaderDto.xTimestamp,
            "X-SIGNATURE": requestHeaderDto.xSignature,
            "Authorization":"Bearer " + requestHeaderDto.authorization,
            "X-EXTERNAL-ID": requestHeaderDto.xExternalId,
            "CHANNEL-ID":requestHeaderDto.channelId
        }
        return await new Promise((resolve, reject) => {
            axios({
                method: 'delete',
                url: base_url_api,
                headers: header,
                data:deleteVaRequestDto.toObject()
            })
            .then((res) => {
                let response = new DeleteVaResponseDto(res.data);
                resolve(response);
            })
            .catch((err) => {
                reject(err);
            });
        });
    },
    async doCheckStatusVa(requestHeaderDto, checkVARequestDTO,isProduction){
        const base_url_api = config.getBaseUrl(isProduction) + config.CHECK_STATUS_VA;
        let header= {
            "X-PARTNER-ID": requestHeaderDto.xPartnerId,
            "X-TIMESTAMP": requestHeaderDto.xTimestamp,
            "X-SIGNATURE": requestHeaderDto.xSignature,
            "Authorization":"Bearer " + requestHeaderDto.authorization,
            "X-EXTERNAL-ID": requestHeaderDto.xExternalId,
            "CHANNEL-ID":requestHeaderDto.channelId
        }
        return await new Promise((resolve, reject) => {
            axios({
                method: 'post',
                url: base_url_api,
                headers: header,
                data:checkVARequestDTO
            })
            .then((res) => {
                let response = new CheckStatusVaResponseDTO(res.data);
                resolve(response);
            })
            .catch((err) => {
                console.log(err)
                reject(err);
            });
        });
    },
    mapResponseCodeV1Snap(responseCode){
        if(responseCode === "0000"){
            return {
                code :"2002400",
                message:"Inquiry Success"
            }
        }else if(responseCode === "3000" || responseCode === "3001"){
            return {
                code :"4042412",
                message:"Invalid Virtual Account Number"
            }
        }else if(responseCode === "3002"){
            return {
                code :"4042414",
                message:"Inquiry Decline by merchant"
            }
        }else if(responseCode === "3004"){
            return {
                code :"4032400",
                message:"Billing Was Expired"
            }
        }else if(responseCode === "3006"){
            return {
                code :"4042412",
                message:"Billing Not Found"
            }
        }else if(responseCode === "9999"){
            return {
                code :"5002401",
                message:"Unexpected Failure"
            }
        }
    },
    mapResponseCodeSnapV1(code) {
        switch (code) {
            case "2002400":
                return "0000";
            case "4042412":
                return "3000"; // or "3001", if you need to differentiate between them
            case "4042414":
                return "3002";
            case "4032400":
                return "3004";
            case "5002401":
                return "9999";
            default:
                return null; // or handle unknown codes as needed
        }
    },    
    v1ToSnap(xmlString){
        const parser = new xml2js.Parser({ explicitArray: false });
    
        return new Promise((resolve, reject) => {
            parser.parseString(xmlString, (err, res) => {
                if (err) {
                    reject(err);
                } else {
                    let response =  new PaymentNotificationResponseBodyDTO();
                    let result = res.INQUIRY_RESPONSE;
                    let responseCode = this.mapResponseCodeV1Snap(result.RESPONSECODE)
                    response.responseCode = responseCode.code;
                    response.responseMessage = responseCode.message;
                    let vaData = {
                        partnerServiceId: null,
                        customerNo: result.PAYMENTCODE || null,
                        virtualAccountNo: result.PAYMENTCODE || null,
                        virtualAccountName: result.NAME || null,
                        virtualAccountEmail: result.EMAIL || null,
                        totalAmount:{
                            value:result.AMOUNT,
                            currency:this.convertToISO4217(result.CURRENCY)
                        },
                        additionalInfo: {
                            trxId: result.TRANSIDMERCHANT,
                            virtualAccountConfig: {
                                minAmount: result.MINAMOUNT || 0,
                                maxAmount: result.MAXAMOUNT || 0
                            }
                        }
                    };
                    response.virtualAccountData = vaData;
                    resolve(response);
                }
            });
        });
    },
    mappingJsonToXmlFormat(json){
        let data = {
            PAYMENTCODE:json.virtualAccountData.virtualAccountNo,
            AMOUNT:json.virtualAccountData.totalAmount.value,
            PURCHASEAMOUNT:json.virtualAccountData.totalAmount.value,
            MINAMOUNT:json.virtualAccountData.additionalInfo.virtualAccountConfig.minAmount,
            MAXAMOUNT:json.virtualAccountData.additionalInfo.virtualAccountConfig.minAmount,
            TRANSIDMERCHANT:json.virtualAccountData.additionalInfo.trxId,
            WORDS:null,
            REQUESTDATETIME:null,
            CURRENCY:this.convertToNumericCode(json.virtualAccountData.totalAmount.currency),
            PURCHASECURRENCY:this.convertToNumericCode(json.virtualAccountData.totalAmount.currency),
            SESSIONID:null,
            NAME:json.virtualAccountData.virtualAccountName,
            EMAIL:json.virtualAccountData.virtualAccountEmail,
            BASKET:null,
            ADDITIONALDATA:null,
            RESPONSECODE:this.mapResponseCodeSnapV1(json.responseCode)
        }
        return data;
    },
    convertToISO4217(numericCode) {
        const iso4217Map = {
            '840': 'USD', // United States Dollar
            '978': 'EUR', // Euro
            '826': 'GBP', // British Pound Sterling
            '124': 'CAD', // Canadian Dollar
            '036': 'AUD', // Australian Dollar
            '392': 'JPY', // Japanese Yen
            '360': 'IDR', // Indonesian Rupiah
        };
    
        return iso4217Map[numericCode] || 'Unknown'; // Return 'Unknown' if code is not found
    },
    convertToNumericCode(currencyCode) {
        const iso4217Map = {
            'USD': '840', // United States Dollar
            'EUR': '978', // Euro
            'GBP': '826', // British Pound Sterling
            'CAD': '124', // Canadian Dollar
            'AUD': '036', // Australian Dollar
            'JPY': '392', // Japanese Yen
            'IDR': '360', // Indonesian Rupiah
        };
    
        return iso4217Map[currencyCode] || 'Unknown';
    },
    jsonToFormData(data) {
        let json = this.mappingJsonToXmlFormat(data)
        const form = new FormData();
    
        function appendFormData(data, parentKey = '') {
            for (const key in data) {
                if (data.hasOwnProperty(key)) {
                    const value = data[key];
                    const formKey = parentKey ? `${parentKey}[${key}]` : key;
    
                    if (value === null || value === undefined) {
                        continue;
                    }
                    if (typeof value === 'object' && !Array.isArray(value)) {
                        appendFormData(value, formKey);
                    } else if (Array.isArray(value)) {
                        value.forEach((item, index) => {
                            appendFormData(item, `${formKey}[${index}]`);
                        });
                    } else {
                        form.append(formKey, value);
                    }
                }
            }
        }
    
        appendFormData(json);
        return form;
    }
    
};