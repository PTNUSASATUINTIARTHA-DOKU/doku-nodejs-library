"use strict"

const { validateHeader } = require("../_commons/validateHeader");
const DirectDebitController = require("../_controllers/directDebitController");
const NotificationController = require("../_controllers/notificationController");
const TokenController = require("../_controllers/tokenController");
const VaController = require("../_controllers/vaController");

class Snap{
    privateKey = ''
    clientId = '';
    isProduction = false;
    tokenB2B = '';
    tokenB2b2c = '';
    tokenExpiresIn=900;
    tokenB2b2cExpiresIn = 900;
    tokenGeneratedTimestamp='';
    tokenB2b2cGeneratedTimestamp='';
    publicKey = ''
    dokuPublicKey = ''
    issuer = '';
    secretKey = '';
    
    constructor(options={isProduction:false,privateKey:'',clientID:'',publicKey:'',dokuPublicKey:'',issuer:'', secretKey:''}){
        this.isProduction = options.isProduction;
        this.privateKey = options.privateKey;
        this.clientId = options.clientID;
        this.publicKey = options.publicKey;
        this.dokuPublicKey = options.dokuPublicKey
        this.issuer = options.issuer;
        this.secretKey = options.secretKey;
        this.getTokenB2B() 
    }
   
    
    async getTokenB2B() {
        try {
            let tokenController = new TokenController();
            const tokenB2BResponseDto = await tokenController.getTokenB2B(this.privateKey, this.clientId, this.isProduction);
            if (!tokenB2BResponseDto.accessToken || !tokenB2BResponseDto.expiresIn) {
                throw new Error('Invalid token response');
            }
            this.setTokenB2B(tokenB2BResponseDto);
            return tokenB2BResponseDto;
        } catch (error) {
            if(error.response){
                throw error;
            }else{
                throw new Error(`Failed to get token: ${error.message}`);
            }
        }
    }
    async getTokenB2B2c(authCode) {
        try {
            let tokenController = new TokenController();
            const tokenB2B2CResponseDto = await tokenController.getTokenB2b2c(authCode,this.privateKey, this.clientId, this.isProduction);
            if (!tokenB2B2CResponseDto.accessToken) {
                throw new Error('Invalid token response');
            }
            this.setTokenB2B2C(tokenB2B2CResponseDto);
            return tokenB2B2CResponseDto;
        } catch (error) {
            if(error.response){
                throw error;
            }else{
                throw new Error(`Failed to get token: ${error.message}`);
            }
            
        }
    }
    
    setTokenB2B(tokenB2BResponseDto){
        this.tokenB2B = tokenB2BResponseDto.accessToken;
        this.tokenExpiresIn = tokenB2BResponseDto.expiresIn;
        this.tokenGeneratedTimestamp = Date.now();
    }
    setTokenB2B2C(tokenB2B2cResponseDto){
        this.tokenB2b2c = tokenB2B2cResponseDto.accessToken;
        this.tokenExpiresIn = tokenB2B2cResponseDto.expiresIn;
        this.tokenB2b2cGeneratedTimestamp = Date.now();
    }

    async createVa(createVARequestDto){
        createVARequestDto.validateVaRequestDto();
        const simulatorResponse = createVARequestDto.validateSimulator();
        if (simulatorResponse) {
            return simulatorResponse;
        }
        
        let tokenController = new TokenController();
        let isTokenInvalid = tokenController.isTokenInvalid(this.tokenB2B, this.tokenExpiresIn, this.tokenGeneratedTimestamp);
        if(isTokenInvalid){
            await this.getTokenB2B();
        }
        
        let vaController = new VaController()
        let a = await vaController.createVa(createVARequestDto, this.privateKey, this.clientId, this.tokenB2B,this.isProduction,this.secretKey);
        return a
    }
    async createVaV1(createVaRequestDtoV1){
        let createVARequestDto = createVaRequestDtoV1.convertToCreateVaRequestDto();
        createVARequestDto.validateVaRequestDto();
        let tokenController = new TokenController();
        let isTokenInvalid = tokenController.isTokenInvalid(this.tokenB2B, this.tokenExpiresIn, this.tokenGeneratedTimestamp);
        if(isTokenInvalid){
            await this.getTokenB2B();
        }
        let vaController = new VaController()
        let a = await vaController.createVa(createVARequestDto, this.privateKey, this.clientId, this.tokenB2B,this.isProduction);
        return a
    }
    validateSignature(request){
        let tokenController = new TokenController();
        return tokenController.validateSignature(this.clientId, request,this.dokuPublicKey);
    }
    validateSymmetricSignature(request){
        let endPointUrl = request.route.path;
        let tokenController = new TokenController();
        return tokenController.validateSignatureSymmetric(request,this.tokenB2B,this.secretKey,endPointUrl);
    }
    generateTokenB2B(isSignatureValid){
        let tokenController = new TokenController();
        if(isSignatureValid){
            return tokenController.generateTokenB2B(this.tokenExpiresIn, this.issuer, this.privateKey, this.clientId);
        }else{
            return tokenController.generateInvalidSignatureResponse()
        }
    }
    validateSignatureAndGenerateToken(request){
        const isSignatureValid = this.validateSignature(request)
        return this.generateTokenB2B(isSignatureValid)
    }
    validateTokenB2B(requestTokenB2B){
        let tokenController = new TokenController();
        return tokenController.validateTokenB2B(requestTokenB2B,this.publicKey)
    }
    generateNotificationResponse(isTokenValid, PaymentNotificationRequestBodyDto){
        let notificationController = new NotificationController();
            if(isTokenValid){
                if(PaymentNotificationRequestBodyDto){
                    return notificationController.generateNotificationResponse(PaymentNotificationRequestBodyDto)
                }else{
                    throw new Error(`if token is valid, please provide PaymentNotificationRequestBodyDto`);	
                }
            }else{
               return notificationController.generateInvalidTokenResponse(PaymentNotificationRequestBodyDto)
            }
    }
    validateTokenAndGenerateNotificationResponse(requestTokenB2B,PaymentNotificationRequestBodyDto){
        const isTokenValid = this.validateTokenB2B(requestTokenB2B)
        return this.generateNotificationResponse(isTokenValid,PaymentNotificationRequestBodyDto)
    }
    async updateVa(updateVaRequestDto){
        updateVaRequestDto.validateUpdateVaRequestDto()	
        const simulatorResponse = updateVaRequestDto.validateSimulator();
        if (simulatorResponse) {
            return simulatorResponse;
        }
        let tokenController = new TokenController();
        let isTokenInvalid = tokenController.isTokenInvalid(this.tokenB2B, this.tokenExpiresIn, this.tokenGeneratedTimestamp);
        if(isTokenInvalid){
            await this.getTokenB2B();
        }
        let vaController = new VaController();
        let updateVaResponseDto = await vaController.doUpdateVa(updateVaRequestDto, this.clientId, this.tokenB2B,this.secretKey,this.isProduction);
        return updateVaResponseDto
    }
    async generateRequestHeader(){
        let tokenController = new TokenController();
        let isTokenInvalid = tokenController.isTokenInvalid(this.tokenB2B, this.tokenExpiresIn, this.tokenGeneratedTimestamp)
        if(isTokenInvalid){
            await this.getTokenB2B();
        }
        let requestHeaderDto = TokenController.doGenerateRequestHeader();
        return requestHeaderDto
    }
    async deletePaymentCode(deleteVaRequestDto){
        deleteVaRequestDto.validateDeleteVaRequest();
        const simulatorResponse = deleteVaRequestDto.validateSimulator();
        if (simulatorResponse) {
            return simulatorResponse;
        }
        let tokenController = new TokenController();
        let isTokenInvalid = tokenController.isTokenInvalid(this.tokenB2B, this.tokenExpiresIn, this.tokenGeneratedTimestamp)
        if(isTokenInvalid){
            await this.getTokenB2B();
        }
        let vaController = new VaController();
        let doDeletePaymentCode = await vaController.doDeletePaymentCode(deleteVaRequestDto, this.privateKey, this.clientId, this.tokenB2B,this.secretKey,this.isProduction);
        return doDeletePaymentCode;
    }
    async checkStatusVa(checkVARequestDTO){
        checkVARequestDTO.validateCheckStatusVaRequestDto()
        const simulatorResponse = checkVARequestDTO.validateSimulator();
        if (simulatorResponse) {
            return simulatorResponse;
        }
        let tokenController = new TokenController();
        let isTokenInvalid = tokenController.isTokenInvalid(this.tokenB2B, this.tokenExpiresIn, this.tokenGeneratedTimestamp)
        if(isTokenInvalid){
            await this.getTokenB2B();
        }
        let vaController = new VaController();
        let checkStatus = await vaController.doCheckStatusVa(checkVARequestDTO,this.privateKey,  this.clientId, this.tokenB2B, this.secretKey,this.isProduction);
        return checkStatus;
    }
   
    directInquiryRequestMapping(header,body){
        let vaController = new VaController();
        return vaController.directInquiryRequestMapping(header,body)
    }
    directInquiryResponseMapping(xmlString){
        let vaController = new VaController();
        return vaController.directInquiryResponseMapping(xmlString)
    }
    notifyRequestMapping(header,body){
        let vaController = new VaController();
        return vaController.notifyRequestMapping(header,body)
    }
    async doAccountUnbinding(AccountUnbindingRequestDto,ipAddress){
        let channel = AccountUnbindingRequestDto.additionalInfo.channel;
        try {
            validateHeader({ipAddress,channel,type:"ACCOUNT_UNBINDING"})
            AccountUnbindingRequestDto.validateAccountUnbindingRequestDto();
        } catch(error) {
            return {"responseCode": "5005400", "responseMessage": error.message}
        }
        let tokenController = new TokenController();
        let isTokenInvalid = tokenController.isTokenInvalid(this.tokenB2B, this.tokenExpiresIn, this.tokenGeneratedTimestamp);
        if(isTokenInvalid){
            await this.getTokenB2B();
        }
        
        let directDebitController = new DirectDebitController()
        let AccountUnbindingResponseDto = await directDebitController.doAccountUnbinding(AccountUnbindingRequestDto, this.privateKey, this.clientId, this.tokenB2B, ipAddress, this.secretKey, this.isProduction);
        return AccountUnbindingResponseDto
    }
    async doAccountBinding(accountBindingRequestDto,ipAddress,deviceId){
        let channel = accountBindingRequestDto.additionalInfo.channel;
        try {
            validateHeader({ipAddress,deviceId,channel,type:"ACCOUNT_BINDING"})
            accountBindingRequestDto.validateAccountBindingRequestDto();
        } catch(error) {
            return {"responseCode": "5005400", "responseMessage": error.message}
        }
        let tokenController = new TokenController();
        let isTokenInvalid = tokenController.isTokenInvalid(this.tokenB2B, this.tokenExpiresIn, this.tokenGeneratedTimestamp);
        if(isTokenInvalid){
            await this.getTokenB2B();
        }
        
        let directDebitController = new DirectDebitController()
        let AccountBindingResponseDto = await directDebitController.doAccountBinding(accountBindingRequestDto, this.privateKey, this.clientId, this.tokenB2B, ipAddress, deviceId,this.secretKey, this.isProduction);
        return AccountBindingResponseDto
    }
    async doPaymentJumpApp(paymentJumpAppRequestDto, ipAddress,deviceId) {
        let channel = paymentJumpAppRequestDto.additionalInfo.channel;
        try {
            validateHeader({ipAddress,deviceId,channel,type:"PAYMENT"})
            paymentJumpAppRequestDto.validate();
        } catch(error) {
            return {"responseCode": "5005400", "responseMessage": error.message}
        }
    
        let tokenController = new TokenController();
        let isTokenInvalid = tokenController.isTokenInvalid(this.tokenB2B, this.tokenExpiresIn, this.tokenGeneratedTimestamp);
        if(isTokenInvalid){
            await this.getTokenB2B();
        }
        
        let directDebitController = new DirectDebitController()
        let PaymentJumpAppResponseDto = await directDebitController.doPaymentJumpApp(paymentJumpAppRequestDto, this.privateKey, this.clientId, this.tokenB2B,ipAddress,deviceId, this.secretKey, this.isProduction);
        return PaymentJumpAppResponseDto
    }
    async doBalanceInquiry(balanceInquiryRequestDto, authCode,ipAddress)  {
        let channel = balanceInquiryRequestDto.additionalInfo.channel;
        try {
            validateHeader({ipAddress,channel,type:"CHECK_BALANCE"})
        balanceInquiryRequestDto.validateBalanceInquiryRequestDto();
        } catch(error) {
            return {"responseCode": "5001100", "responseMessage": error.message}
        }
        
        
        let tokenController = new TokenController();
        // check token b2b
        let isTokenInvalid = tokenController.isTokenInvalid(this.tokenB2B, this.tokenExpiresIn, this.tokenGeneratedTimestamp);
        if(isTokenInvalid){
            await this.getTokenB2B();
        }
    
        // check token b2b2c
        var isTokenB2b2cInvalid = tokenController.isTokenInvalid(this.tokenB2b2c, this.tokenB2b2cExpiresIn, this.tokenB2b2cGeneratedTimestamp);
    
        if (isTokenB2b2cInvalid) {
            await this.getTokenB2B2c(authCode)
        }
        let directDebitController = new DirectDebitController()
        let balanceInquiryResponseDto = directDebitController.doBalanceInquiry(balanceInquiryRequestDto, this.privateKey, this.clientId, ipAddress, this.tokenB2b2c, this.tokenB2B, this.secretKey, this.isProduction)
    
        return balanceInquiryResponseDto;
    }
   async doPayment(paymentRequestDto, authCode,ipAddress, deviceId) {
        let channel = paymentRequestDto.additionalInfo.channel;
        try {
            validateHeader({ipAddress, deviceId, channel,type:"PAYMENT"})
            paymentRequestDto.validatePaymentRequestDto();
        } catch(error) {
            return {"responseCode": "5005400", "responseMessage": error.message}
        }

        let tokenController = new TokenController();
        // check token b2b
        let isTokenInvalid = tokenController.isTokenInvalid(this.tokenB2B, this.tokenExpiresIn, this.tokenGeneratedTimestamp);
        if(isTokenInvalid){
            await this.getTokenB2B();
        }
    
        // check token b2b2c
        var isTokenB2b2cInvalid = tokenController.isTokenInvalid(this.tokenB2b2c, this.tokenB2b2cExpiresIn, this.tokenB2b2cGeneratedTimestamp);
        if (isTokenB2b2cInvalid) {
            await this.getTokenB2B2c(authCode)
        }
        
        let directDebitController = new DirectDebitController()
        let paymentResponseDto =  await directDebitController.doPayment(paymentRequestDto, this.privateKey, this.clientId, this.tokenB2B, this.tokenB2b2c, this.secretKey, this.isProduction,ipAddress, deviceId)
    
        return paymentResponseDto;
    }
    async doRegistrationCardBind(cardRegistrationRequestDto) {
        try {
            cardRegistrationRequestDto.validateCardRegistrationRequestDto();
        } catch(error) {
            return {"responseCode": "5005400", "responseMessage": error.message}
        }
    
        let tokenController = new TokenController();
        let isTokenInvalid = tokenController.isTokenInvalid(this.tokenB2B, this.tokenExpiresIn, this.tokenGeneratedTimestamp);
        if(isTokenInvalid){
            await this.getTokenB2B();
        }
        let directDebitController = new DirectDebitController()
        let cardBindResponseDto = directDebitController.doRegistrationCardBind(cardRegistrationRequestDto, this.clientId,this.tokenB2B, this.secretKey, this.isProduction)
    
        return cardBindResponseDto
    }
    async doUnRegistCardUnBind(cardUnRegistUnbindRequestDTO) {
        try {
            cardUnRegistUnbindRequestDTO.validateCardUnRegistRequestDTO();
        } catch(error) {
            return {"responseCode": "5005400", "responseMessage": error.message}
        }
    
        let tokenController = new TokenController();
        let isTokenInvalid = tokenController.isTokenInvalid(this.tokenB2B, this.tokenExpiresIn, this.tokenGeneratedTimestamp);
        console.log(this.tokenB2B)
        console.log(isTokenInvalid)
        if(isTokenInvalid){
            await this.getTokenB2B();
        }
        let directDebitController = new DirectDebitController()
        let cardBindResponseDto = directDebitController.doUnRegistCardUnBind(cardUnRegistUnbindRequestDTO, this.clientId,this.tokenB2B, this.secretKey, this.isProduction)
    
        return cardBindResponseDto
    }
    async doRefund(refundRequestDto, authCode,ipAddress,deviceId)  {
        let channel = refundRequestDto.additionalInfo.channel;
        try {
            validateHeader({ipAddress,deviceId,channel,type:"REFUND"})
            refundRequestDto.validateRefundRequestDto();
        } catch(error) {
            return {"responseCode": "5000700", "responseMessage": error.message}
        }
        let tokenController = new TokenController();
        // check token b2b
        let isTokenInvalid = tokenController.isTokenInvalid(this.tokenB2B, this.tokenExpiresIn, this.tokenGeneratedTimestamp);
        if(isTokenInvalid){
            await this.getTokenB2B();
        }
        // check token b2b2c
        var isTokenB2b2cInvalid = tokenController.isTokenInvalid(this.tokenB2b2c, this.tokenB2b2cExpiresIn, this.tokenB2b2cGeneratedTimestamp);
        
        if(refundRequestDto.additionalInfo.channel != "EMONEY_SHOPEE_PAY_SNAP" && refundRequestDto.additionalInfo.channel != "EMONEY_DANA_SNAP") {
            if (isTokenB2b2cInvalid) {
                await this.getTokenB2B2c(authCode)
            }
        }

        let directDebitController = new DirectDebitController()
        let refundResponseDto = directDebitController.doRefund(refundRequestDto,this.privateKey, this.clientId,this.tokenB2B, this.tokenB2b2c,this.secretKey,this.isProduction,ipAddress,deviceId)
        return refundResponseDto;
    }
    async doCheckStatus(checkStatusRequestDto){
        try {
            checkStatusRequestDto.validateCheckStatusRequestDto()
        } catch(error) {
            return {"responseCode": "5002600", "responseMessage": error.message}
        }
        
        let tokenController = new TokenController();
        let isTokenInvalid = tokenController.isTokenInvalid(this.tokenB2B, this.tokenExpiresIn, this.tokenGeneratedTimestamp);
        if(isTokenInvalid){
            await this.getTokenB2B();
        }
        let directDebitController = new DirectDebitController();
        let doCheckStatus = directDebitController.doCheckStatus(checkStatusRequestDto, this.clientId,this.tokenB2B,this.secretKey,this.isProduction);
        return doCheckStatus;
    }
}
module.exports = Snap;