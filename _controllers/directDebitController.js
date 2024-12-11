"use strict";

const commonFunction = require("../_commons/commonFunction");
const Config = require("../_commons/config");
const requestHeader = require("../_commons/requestHeader");
const directDebitService = require("../_services/directDebitService");
const tokenService = require("../_services/tokenService");
const OriginDto = require("../_models/originDTO");

class DirectDebitController {
    async doAccountUnbinding(AccountUnbindingRequestDto, privateKey, clientId, tokenB2B, ipAddress, secretKey, isProduction) {
        AccountUnbindingRequestDto.additionalInfo["origin"] = new OriginDto().toObject();
        let timestamp = tokenService.generateTimestamp();
        let endPointUrl = Config.DIRECT_DEBIT_ACCOUNT_UNBINDING_URL;
        let httpMethod = "POST";
        let signature = tokenService.generateSymmetricSignature(httpMethod, endPointUrl, tokenB2B, AccountUnbindingRequestDto, timestamp, secretKey);
        let externalId = Date.now().toString();
        let header = requestHeader.generateRequestHeader({
            timestamp, signature, clientId, externalId, ipAddress, tokenB2B, endPointUrl, requestDto: AccountUnbindingRequestDto
        });
        return await directDebitService.doAccountUnBindingProcess(header, AccountUnbindingRequestDto, isProduction);
    }

    async doAccountBinding(AccountBindingRequestDto, privateKey, clientId, tokenB2B, ipAddress,deviceId, secretKey, isProduction) {
        AccountBindingRequestDto.additionalInfo["origin"] = new OriginDto().toObject()
        let timestamp = tokenService.generateTimestamp();
        let endPointUrl = Config.DIRECT_DEBIT_ACCOUNT_BINDING_URL;
        let httpMethod = "POST";
        let signature = tokenService.generateSymmetricSignature(httpMethod, endPointUrl, tokenB2B, AccountBindingRequestDto, timestamp, secretKey);
        let externalId = Date.now().toString();
        let header = requestHeader.generateRequestHeader({
            timestamp, signature, clientId, externalId, ipAddress,deviceId, tokenB2B, endPointUrl, requestDto: AccountBindingRequestDto
        });
        return await directDebitService.doAccountBindingProcess(header, AccountBindingRequestDto, isProduction);
    }

    async doPaymentJumpApp(paymentJumpAppRequestDto, privateKey, clientId, tokenB2B, ipAddress,deviceId, secretKey, isProduction) {
        paymentJumpAppRequestDto.additionalInfo["origin"] = new OriginDto().toObject()
        let timestamp = tokenService.generateTimestamp();
        let endPointUrl = Config.DIRECT_DEBIT_PAYMENT_URL;
        let httpMethod = "POST";
        let signature = tokenService.generateSymmetricSignature(httpMethod, endPointUrl, tokenB2B, paymentJumpAppRequestDto, timestamp, secretKey);
        let externalId = Date.now().toString();
        let header = requestHeader.generateRequestHeader({
            timestamp, signature, clientId, externalId, ipAddress, channelId: "DH", tokenB2B, endPointUrl, requestDto: paymentJumpAppRequestDto,deviceId
        });
        return await directDebitService.doPaymentJumpAppProcess(header, paymentJumpAppRequestDto, isProduction);
    }

    async doBalanceInquiry(balanceInquiryRequestDto, privateKey, clientId, ipAddress, tokenB2b2c, tokenB2B, secretKey, isProduction) {
        balanceInquiryRequestDto.additionalInfo["origin"] = new OriginDto().toObject()
        let timestamp = tokenService.generateTimestamp();
        let endPointUrl = Config.DIRECT_DEBIT_BALANCE_INQUIRY_URL;
        let httpMethod = "POST";
        let signature = tokenService.generateSymmetricSignature(httpMethod, endPointUrl, tokenB2B, balanceInquiryRequestDto, timestamp, secretKey);
        let externalId = Date.now().toString();
        let header = requestHeader.generateRequestHeader({
            timestamp, signature, clientId, externalId, ipAddress, tokenB2B, tokenB2b2c, endPointUrl, requestDto: balanceInquiryRequestDto
        });
        return await directDebitService.doBalanceInquiryProcess(header, balanceInquiryRequestDto, isProduction);
    }

    async doPayment(paymentRequestDto, privateKey, clientId, tokenB2B, tokenB2b2c, secretKey, isProduction, ipAddress, deviceId) {
        paymentRequestDto.additionalInfo["origin"] = new OriginDto().toObject()
        let timestamp = tokenService.generateTimestamp();
        let endPointUrl = Config.DIRECT_DEBIT_PAYMENT_URL;
        let httpMethod = "POST";
        let signature = tokenService.generateSymmetricSignature(httpMethod, endPointUrl, tokenB2B, paymentRequestDto, timestamp, secretKey);
        let externalId = Date.now().toString();
        let header = requestHeader.generateRequestHeader({
            timestamp, signature, clientId, externalId, tokenB2B, tokenB2b2c, deviceId, endPointUrl, requestDto: paymentRequestDto, ipAddress
        });
        return await directDebitService.doPaymentProcess(header, paymentRequestDto, isProduction);
    }

    async doRegistrationCardBind(cardRegistrationRequestDto, clientId, tokenB2B, secretKey, isProduction) {
        let cardData = JSON.stringify(cardRegistrationRequestDto.cardData)
        let encryptCbc = directDebitService.encryptCbc(cardData,secretKey)
        // let decryptCbc = directDebitService.decryptCbc("VwpZPud1/Q4Q0h5V+boNsOMhR3fr/QBXPAEV1BG4aoeoRmP8gREs8gpfffyqAl2skDrPnkhu0Ybm87MGEJv0hmBd3PrZ8b9ikROwRDfanrOUYeiVEakNvhmsHPfUK+3QOS2Ant6FcpuZN7QR43Yz5qMnxr4VvSyDxAwDDZsR/NFdGcadCqCUsCo6E/Dk2/yNStOz5jautV+NiWQyV93rWQ==|KwSyyaNTNeMruKgWj97Jsg==",secretKey)
        // console.log("encryptCbc: "+encryptCbc)
        // console.log("decryptCbc: "+decryptCbc)
        cardRegistrationRequestDto.cardData = encryptCbc;
        cardRegistrationRequestDto.additionalInfo["origin"] = new OriginDto().toObject()
        let timestamp = tokenService.generateTimestamp();
        let endPointUrl = Config.DIRECT_DEBIT_CARD_BINDING_URL;
        let httpMethod = "POST";
        let signature = tokenService.generateSymmetricSignature(httpMethod, endPointUrl, tokenB2B, cardRegistrationRequestDto, timestamp, secretKey);
        let externalId = Date.now().toString();
        let header = requestHeader.generateRequestHeader({
            timestamp, signature, clientId, externalId, tokenB2B, endPointUrl, requestDto: cardRegistrationRequestDto
        });
        return await directDebitService.doRegistrationCardBindProcess(header, cardRegistrationRequestDto, isProduction);
    }
    async doUnRegistCardUnBind(cardUnRegistUnbindRequestDTO, clientId,tokenB2B, secretKey, isProduction){
        cardUnRegistUnbindRequestDTO.additionalInfo["origin"] = new OriginDto().toObject()
        let timestamp = tokenService.generateTimestamp();
        let endPointUrl = Config.DIRECT_DEBIT_CARD_UNBINDING_URL;
        let httpMethod = "POST";
        let signature = tokenService.generateSymmetricSignature(httpMethod, endPointUrl, tokenB2B, cardUnRegistUnbindRequestDTO, timestamp, secretKey);
        let externalId = Date.now().toString();
        let header = requestHeader.generateRequestHeader({
            timestamp, signature, externalId,clientId, tokenB2B, endPointUrl, requestDto: cardUnRegistUnbindRequestDTO
        });
        return await directDebitService.doUnRegisterCardUnBindProcess(header, cardUnRegistUnbindRequestDTO, isProduction);
    }

    async doRefund(refundRequestDto, privateKey, clientId, tokenB2B, tokenB2b2c, secretKey, isProduction,ipAddress,deviceId) {
        refundRequestDto.additionalInfo["origin"] = new OriginDto().toObject()
        let timestamp = tokenService.generateTimestamp();
        let endPointUrl = Config.DIRECT_DEBIT_REFUND_URL;
        let httpMethod = "POST";
        let signature = tokenService.generateSymmetricSignature(httpMethod, endPointUrl, tokenB2B, refundRequestDto, timestamp, secretKey);
        let externalId = Date.now().toString();
        let header = requestHeader.generateRequestHeader({
            timestamp, signature, clientId, externalId, tokenB2B, tokenB2b2c, endPointUrl, requestDto: refundRequestDto, deviceId,ipAddress
        });
        return await directDebitService.doRefundProcess(header, refundRequestDto, isProduction);
    }

    async doCheckStatus(checkStatusRequestDto, clientId, tokenB2B, secretKey, isProduction) {
        checkStatusRequestDto.additionalInfo["origin"] = new OriginDto().toObject()
        let timestamp = tokenService.generateTimestamp();
        let endPointUrl = Config.DIRECT_DEBIT_CHECK_STATUS_URL;
        let httpMethod = "POST";
        let signature = tokenService.generateSymmetricSignature(httpMethod, endPointUrl, tokenB2B, checkStatusRequestDto, timestamp, secretKey);
        let externalId = Date.now().toString();
        let header = requestHeader.generateRequestHeader({
            timestamp, signature, clientId, externalId, tokenB2B, endPointUrl, requestDto: checkStatusRequestDto
        });
        return await directDebitService.doCheckStatusProccess(header, checkStatusRequestDto, isProduction);
    }
}

module.exports = DirectDebitController;
