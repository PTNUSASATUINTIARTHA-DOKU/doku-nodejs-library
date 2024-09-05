"use strict";

const commonFunction = require("../_commons/commonFunction");
const Config = require("../_commons/config");
const requestHeader = require("../_commons/requestHeader");
const directDebitService = require("../_services/directDebitService");
const tokenService = require("../_services/tokenService");

class DirectDebitController {
    async doAccountUnbinding(AccountUnbindingRequestDto, privateKey, clientId, tokenB2B, ipAddress, secretKey, isProduction) {
        let timestamp = tokenService.generateTimestamp();
        let endPointUrl = Config.DIRECT_DEBIT_ACCOUNT_UNBINDING_URL;
        let httpMethod = "POST";
        let signature = tokenService.generateSymmetricSignature(httpMethod, endPointUrl, tokenB2B, AccountUnbindingRequestDto, timestamp, secretKey);
        let externalId = commonFunction.generateExternalId();
        let header = requestHeader.generateRequestHeader({
            timestamp, signature, clientId, externalId, ipAddress, tokenB2B, endPointUrl, requestDto: AccountUnbindingRequestDto
        });
        return await directDebitService.doAccountUnBindingProcess(header, AccountUnbindingRequestDto, isProduction);
    }

    async doAccountBinding(AccountBindingRequestDto, privateKey, clientId, tokenB2B, ipAddress, secretKey, isProduction) {
        let timestamp = tokenService.generateTimestamp();
        let endPointUrl = Config.DIRECT_DEBIT_ACCOUNT_BINDING_URL;
        let httpMethod = "POST";
        let signature = tokenService.generateSymmetricSignature(httpMethod, endPointUrl, tokenB2B, AccountBindingRequestDto, timestamp, secretKey);
        let externalId = commonFunction.generateExternalId();
        let header = requestHeader.generateRequestHeader({
            timestamp, signature, clientId, externalId, ipAddress, tokenB2B, endPointUrl, requestDto: AccountBindingRequestDto
        });
        return await directDebitService.doAccountBindingProcess(header, AccountBindingRequestDto, isProduction);
    }

    async doPaymentJumpApp(paymentJumpAppRequestDto, privateKey, clientId, tokenB2B, ipAddress, secretKey, isProduction) {
        let timestamp = tokenService.generateTimestamp();
        let endPointUrl = Config.DIRECT_DEBIT_PAYMENT_URL;
        let httpMethod = "POST";
        let signature = tokenService.generateSymmetricSignature(httpMethod, endPointUrl, tokenB2B, paymentJumpAppRequestDto, timestamp, secretKey);
        let externalId = commonFunction.generateExternalId();
        let header = requestHeader.generateRequestHeader({
            timestamp, signature, clientId, externalId, ipAddress, channelId: "H2H", tokenB2B, endPointUrl, requestDto: paymentJumpAppRequestDto
        });
        return await directDebitService.doPaymentJumpAppProcess(header, paymentJumpAppRequestDto, isProduction);
    }

    async doBalanceInquiry(balanceInquiryRequestDto, privateKey, clientId, ipAddress, tokenB2b2c, tokenB2B, secretKey, isProduction) {
        let timestamp = tokenService.generateTimestamp();
        let endPointUrl = Config.DIRECT_DEBIT_BALANCE_INQUIRY_URL;
        let httpMethod = "POST";
        let signature = tokenService.generateSymmetricSignature(httpMethod, endPointUrl, tokenB2B, balanceInquiryRequestDto, timestamp, secretKey);
        let externalId = commonFunction.generateExternalId();
        let header = requestHeader.generateRequestHeader({
            timestamp, signature, clientId, externalId, ipAddress, tokenB2B, tokenB2b2c, endPointUrl, requestDto: balanceInquiryRequestDto
        });
        return await directDebitService.doBalanceInquiryProcess(header, balanceInquiryRequestDto, isProduction);
    }

    async doPayment(paymentRequestDto, privateKey, clientId, tokenB2B, tokenB2b2c, secretKey, isProduction, deviceId) {
        let timestamp = tokenService.generateTimestamp();
        let endPointUrl = Config.DIRECT_DEBIT_PAYMENT_URL;
        let httpMethod = "POST";
        let signature = tokenService.generateSymmetricSignature(httpMethod, endPointUrl, tokenB2B, paymentRequestDto, timestamp, secretKey);
        let externalId = commonFunction.generateExternalId();
        let header = requestHeader.generateRequestHeader({
            timestamp, signature, clientId, externalId, tokenB2B, tokenB2b2c, endPointUrl, requestDto: paymentRequestDto, deviceId
        });
        return await directDebitService.doPaymentProcess(header, paymentRequestDto, isProduction);
    }

    async doRegistrationCardBind(cardRegistrationRequestDto, channelId, privateKey, clientId, tokenB2B, secretKey, isProduction) {
        let timestamp = tokenService.generateTimestamp();
        let endPointUrl = Config.DIRECT_DEBIT_CARD_BINDING_URL;
        let httpMethod = "POST";
        let signature = tokenService.generateSymmetricSignature(httpMethod, endPointUrl, tokenB2B, cardRegistrationRequestDto, timestamp, secretKey);
        let externalId = commonFunction.generateExternalId();
        let header = requestHeader.generateRequestHeader({
            timestamp, signature, clientId, externalId, channelId, tokenB2B, endPointUrl, requestDto: cardRegistrationRequestDto
        });
        return await directDebitService.doRegistrationCardBindProcess(header, cardRegistrationRequestDto, isProduction);
    }

    async doRefund(refundRequestDto, privateKey, clientId, tokenB2B, tokenB2b2c, secretKey, isProduction, deviceId) {
        let timestamp = tokenService.generateTimestamp();
        let endPointUrl = Config.DIRECT_DEBIT_REFUND_URL;
        let httpMethod = "POST";
        let signature = tokenService.generateSymmetricSignature(httpMethod, endPointUrl, tokenB2B, refundRequestDto, timestamp, secretKey);
        let externalId = commonFunction.generateExternalId();
        let header = requestHeader.generateRequestHeader({
            timestamp, signature, clientId, externalId, tokenB2B, tokenB2b2c, endPointUrl, requestDto: refundRequestDto, deviceId
        });
        return await directDebitService.doRefundProcess(header, refundRequestDto, isProduction);
    }

    async doCheckStatus(checkStatusRequestDto, clientId, tokenB2B, secretKey, isProduction) {
        let timestamp = tokenService.generateTimestamp();
        let endPointUrl = Config.DIRECT_DEBIT_CHECK_STATUS_URL;
        let httpMethod = "POST";
        let signature = tokenService.generateSymmetricSignature(httpMethod, endPointUrl, tokenB2B, checkStatusRequestDto, timestamp, secretKey);
        let externalId = commonFunction.generateExternalId();
        let header = requestHeader.generateRequestHeader({
            timestamp, signature, clientId, externalId, tokenB2B, endPointUrl, requestDto: checkStatusRequestDto
        });
        return await directDebitService.doCheckStatusProcess(header, checkStatusRequestDto, isProduction);
    }
}

module.exports = DirectDebitController;
