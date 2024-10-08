"use strict"

const { default: axios } = require("axios");
const Config = require("../_commons/config");
const CardUnRegistUnbindResponseDto = require("../_models/cardUnregistUnbindResponseDTO");

module.exports = {
    async  doAccountUnBindingProcess(requestHeaderDto, accountUnbindingRequestDto, isProduction) {
        const base_url_api = Config.getBaseUrl(isProduction) + Config.DIRECT_DEBIT_ACCOUNT_UNBINDING_URL;

        let header= {
            "X-PARTNER-ID": requestHeaderDto.xPartnerId,
            "X-TIMESTAMP": requestHeaderDto.xTimestamp,
            "X-SIGNATURE": requestHeaderDto.xSignature,
            "Authorization":"Bearer " + requestHeaderDto.authorization,
            "X-EXTERNAL-ID": requestHeaderDto.xExternalId,
            "X-IP-ADDRESS":requestHeaderDto.xIpAddres
        }
        return await new Promise((resolve, reject) => {
            axios({
                method: 'post',
                url: base_url_api,
                headers: header,
                data:accountUnbindingRequestDto
            })
            .then((res) => {
                console.log(res.data)
                let response = res.data;
                resolve(response);
            })
            .catch((err) => {
                reject(err);
            });
        });
    },
    async  doAccountBindingProcess(requestHeaderDto, accountBindingRequestDto, isProduction) {
        const base_url_api = Config.getBaseUrl(isProduction) + Config.DIRECT_DEBIT_ACCOUNT_BINDING_URL;

        let header= {
            "X-PARTNER-ID": requestHeaderDto.xPartnerId,
            "X-TIMESTAMP": requestHeaderDto.xTimestamp,
            "X-SIGNATURE": requestHeaderDto.xSignature,
            "Authorization":"Bearer " + requestHeaderDto.authorization,
            "X-EXTERNAL-ID": requestHeaderDto.xExternalId,
            "X-IP-ADDRESS":requestHeaderDto.xIpAddres
        }
        return await new Promise((resolve, reject) => {
            axios({
                method: 'post',
                url: base_url_api,
                headers: header,
                data:accountBindingRequestDto
            })
            .then((res) => {
                let response = res.data;
                resolve(response);
            })
            .catch((err) => {
                console.log(err.response.data)
                reject(err);
            });
        });
    },
    async  doPaymentJumpAppProcess(requestHeaderDto, paymentJumpAppRequestDto, isProduction) {
        const base_url_api = Config.getBaseUrl(isProduction) + Config.DIRECT_DEBIT_PAYMENT_URL;

        let header= {
            "X-PARTNER-ID": requestHeaderDto.xPartnerId,
            "X-TIMESTAMP": requestHeaderDto.xTimestamp,
            "X-SIGNATURE": requestHeaderDto.xSignature,
            "Authorization":"Bearer " + requestHeaderDto.authorization,
            "X-EXTERNAL-ID": requestHeaderDto.xExternalId,
            "X-IP-ADDRESS":requestHeaderDto.xIpAddres,
            "X-CHANNEL-ID":requestHeaderDto.xChannelId
        }
        return await new Promise((resolve, reject) => {
            axios({
                method: 'post',
                url: base_url_api,
                headers: header,
                data:paymentJumpAppRequestDto
            })
            .then((res) => {
                let response = res.data;
                resolve(response);
            })
            .catch((err) => {
                reject(err);
            });
        });
    },
    async doBalanceInquiryProcess(header, balanceInquiryRequestDto, isProduction){
        const base_url_api = Config.getBaseUrl(isProduction) + Config.DIRECT_DEBIT_BALANCE_INQUIRY_URL;
        let headerObj= {
            "X-PARTNER-ID": header.xPartnerId,
            "X-TIMESTAMP": header.xTimestamp,
            "X-SIGNATURE": header.xSignature,
            "Authorization":"Bearer " + header.authorization,
            "X-EXTERNAL-ID": header.xExternalId,
            "X-IP-ADDRESS":header.xIpAddres,
            "Authorization-customer":header.xAuthorizationCustomer
        }
        return await new Promise((resolve, reject) => {
            axios({
                method: 'post',
                url: base_url_api,
                headers: headerObj,
                data:balanceInquiryRequestDto
            })
            .then((res) => {
                let response = res.data;
                resolve(response);
            })
            .catch((err) => {
                reject(err);
            });
        });
    },
    async doPaymentProcess(header,paymentRequestDto,isProduction){
        const base_url_api = Config.getBaseUrl(isProduction) + Config.DIRECT_DEBIT_PAYMENT_URL;
        let headerObj= {
            "X-PARTNER-ID": header.xPartnerId,
            "X-TIMESTAMP": header.xTimestamp,
            "X-SIGNATURE": header.xSignature,
            "Authorization":"Bearer " + header.authorization,
            "X-EXTERNAL-ID": header.xExternalId,
            "X-IP-ADDRESS":header.xIpAddres,
            "Authorization-customer":header.xAuthorizationCustomer
        }
        if (paymentRequestDto.additionalInfo.channel === "EMONEY_SHOPEE_PAY_SNAP" ||
            paymentRequestDto.additionalInfo.channel === "EMONEY_DANA_SNAP") {
            headerObj["X-DEVICE-ID"] = header.xDeviceId;
        }
        return await new Promise((resolve, reject) => {
            axios({
                method: 'post',
                url: base_url_api,
                headers: headerObj,
                data:paymentRequestDto
            })
            .then((res) => {
                let response = res.data;
                resolve(response);
            })
            .catch((err) => {
                reject(err);
            });
        });
    },
    async doRegistrationCardBindProcess(header,cardRegistrationRequestDto,isProduction){
        const base_url_api = Config.getBaseUrl(isProduction) + Config.DIRECT_DEBIT_CARD_BINDING_URL;
        let headerObj= {
            "X-PARTNER-ID": header.xPartnerId,
            "X-TIMESTAMP": header.xTimestamp,
            "X-SIGNATURE": header.xSignature,
            "Authorization":"Bearer " + header.authorization,
            "X-EXTERNAL-ID": header.xExternalId,
            "X-CHANNEL-ID":header.xChannelId,
            "Authorization":header.xAuthorization
        }
        return await new Promise((resolve, reject) => {
            axios({
                method: 'post',
                url: base_url_api,
                headers: headerObj,
                data:cardRegistrationRequestDto
            })
            .then((res) => {
                let response = res.data;
                resolve(response);
            })
            .catch((err) => {
                reject(err);
            });
        });
    },
    async doUnRegisterCardUnBindProcess(header,cardUnRegistUnbindRequestDTO,isProduction){
        const base_url_api = Config.getBaseUrl(isProduction) + Config.DIRECT_DEBIT_CARD_UNBINDING_URL;
        let headerObj= {
            "X-PARTNER-ID": header.xPartnerId,
            "X-TIMESTAMP": header.xTimestamp,
            "X-SIGNATURE": header.xSignature,
            "Authorization":"Bearer " + header.authorization,
            "X-EXTERNAL-ID": header.xExternalId,
            "Authorization":header.xAuthorization
        }
        return await new Promise((resolve, reject) => {
            axios({
                method: 'post',
                url: base_url_api,
                headers: headerObj,
                data:cardUnRegistUnbindRequestDTO
            })
            .then((res) => {
                let response = new CardUnRegistUnbindResponseDto(res.data)
                resolve(response);
            })
            .catch((err) => {
                reject(err);
            });
        });
    },
    async doRefundProcess(header, refundRequestDto, isProduction){
        const base_url_api = Config.getBaseUrl(isProduction) + Config.DIRECT_DEBIT_CARD_BINDING_URL;
        let headerObj= {
            "X-PARTNER-ID": header.xPartnerId,
            "X-TIMESTAMP": header.xTimestamp,
            "X-SIGNATURE": header.xSignature,
            "Authorization":"Bearer " + header.authorization,
            "X-EXTERNAL-ID": header.xExternalId,
            "X-IP-ADDRESS":header.xIpAddres,
            "Authorization-customer":header.xAuthorizationCustomer
        }
        if (refundRequestDto.additionalInfo.channel === "EMONEY_SHOPEE_PAY_SNAP" ||
            refundRequestDto.additionalInfo.channel === "EMONEY_DANA_SNAP") {
            headerObj["X-DEVICE-ID"] = header.xDeviceId;
        }
        return await new Promise((resolve, reject) => {
            axios({
                method: 'post',
                url: base_url_api,
                headers: headerObj,
                data:refundRequestDto
            })
            .then((res) => {
                let response = res.data;
                resolve(response);
            })
            .catch((err) => {
                reject(err);
            });
        });
    },
    async doCheckStatusProccess(header, checkStatusRequestDto, isProduction){
        const base_url_api = Config.getBaseUrl(isProduction) + Config.DIRECT_DEBIT_CHECK_STATUS_URL;
        let headerObj= {
            "X-PARTNER-ID": header.xPartnerId,
            "X-TIMESTAMP": header.xTimestamp,
            "X-SIGNATURE": header.xSignature,
            "Authorization":"Bearer " + header.authorization,
            "X-EXTERNAL-ID": header.xExternalId
        }
        return await new Promise((resolve, reject) => {
            axios({
                method: 'post',
                url: base_url_api,
                headers: headerObj,
                data:checkStatusRequestDto
            })
            .then((res) => {
                let response = res.data;
                resolve(response);
            })
            .catch((err) => {
                reject(err);
            });
        });
    }
}