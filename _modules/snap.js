"use strict"

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
    issuer = '';
    secretKey = '';
    
    constructor(options={isProduction:false,privateKey:'',clientID:'',publicKey:'',issuer:'', secretKey:''}){
        this.isProduction = options.isProduction;
        this.privateKey = options.privateKey;
        this.clientId = options.clientID;
        this.publicKey = options.publicKey;
        this.issuer = options.issuer;
        this.secretKey = options.secretKey;
        // this.getTokenB2B() 
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
            throw new Error(`Failed to get token: ${error.message}`);
        }
    }
    async getTokenB2B2c(authCode) {
        try {
            let tokenController = new TokenController();
            const tokenB2B2CResponseDto = await tokenController.getTokenB2b2c(authCode,this.privateKey, this.clientId, this.isProduction);
            if (!tokenB2B2CResponseDto.accessToken || !tokenB2B2CResponseDto.expiresIn) {
                throw new Error('Invalid token response');
            }
            this.setTokenB2B2C(tokenB2B2CResponseDto);
            return tokenB2B2CResponseDto;
        } catch (error) {
            throw new Error(`Failed to get token: ${error.message}`);
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
 validateSignature(request,publicKey){
        let tokenController = new TokenController();
        return tokenController.validateSignature(this.privateKey, this.clientId, request,publicKey);
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
        const isSignatureValid = this.validateSignature(request,this.publicKey)
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
        let tokenController = new TokenController();
        let isTokenInvalid = tokenController.isTokenInvalid(this.tokenB2B, this.tokenExpiresIn, this.tokenGeneratedTimestamp)
        if(isTokenInvalid){
            await this.getTokenB2B();
        }
        let vaController = new VaController();
        let doDeletePaymentCode = await vaController.doDeletePaymentCode(deleteVaRequestDto, this.privateKey, this.clientId, this.tokenB2B,this.isProduction);
        return doDeletePaymentCode;
    }
    async checkStatusVa(checkVARequestDTO){
        let tokenController = new TokenController();
        let isTokenInvalid = tokenController.isTokenInvalid(this.tokenB2B, this.tokenExpiresIn, this.tokenGeneratedTimestamp)
        if(isTokenInvalid){
            await this.getTokenB2B();
        }
        let vaController = new VaController();
        let checkStatus = await vaController.doCheckStatusVa(checkVARequestDTO,this.privateKey,  this.clientId, this.tokenB2B,this.isProduction);
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
        AccountUnbindingRequestDto.validateAccountUnbindingRequestDto();
        let tokenController = new TokenController();
        let isTokenInvalid = tokenController.isTokenInvalid(this.tokenB2B, this.tokenExpiresIn, this.tokenGeneratedTimestamp);
        if(isTokenInvalid){
            await this.getTokenB2B();
        }
        
        let directDebitController = new DirectDebitController()
        let AccountUnbindingResponseDto = await directDebitController.doAccountUnbinding(AccountUnbindingRequestDto, this.privateKey, this.clientId, this.tokenB2B, ipAddress, this.secretKey, this.isProduction);
        return AccountUnbindingResponseDto
    }
    async doAccountBinding(accountBindingRequestDto,ipAddress){
        // accountBindingRequestDto.validateAccountBindingRequestDto();
        let tokenController = new TokenController();
        let isTokenInvalid = tokenController.isTokenInvalid(this.tokenB2B, this.tokenExpiresIn, this.tokenGeneratedTimestamp);
        if(isTokenInvalid){
            await this.getTokenB2B();
        }
        
        let directDebitController = new DirectDebitController()
        let AccountBindingResponseDto = await directDebitController.doAccountBinding(accountBindingRequestDto, this.privateKey, this.clientId, this.tokenB2B, ipAddress, this.secretKey, this.isProduction);
        return AccountBindingResponseDto
    }
    async doPaymentJumpApp(paymentJumpAppRequestDto, ipAddress) {
        paymentJumpAppRequestDto.validate();
    
        let tokenController = new TokenController();
        let isTokenInvalid = tokenController.isTokenInvalid(this.tokenB2B, this.tokenExpiresIn, this.tokenGeneratedTimestamp);
        if(isTokenInvalid){
            await this.getTokenB2B();
        }
        
        let directDebitController = new DirectDebitController()
        let PaymentJumpAppResponseDto = await directDebitController.doPaymentJumpApp(paymentJumpAppRequestDto, this.privateKey, this.clientId, this.tokenB2B,ipAddress, this.secretKey, this.isProduction);
        return PaymentJumpAppResponseDto
    }
    async doBalanceInquiry(balanceInquiryRequestDto, authCode,ipAddress)  {
        balanceInquiryRequestDto.validateBalanceInquiryRequestDto();
        
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
        let balanceInquiryResponseDto = directDebitController.doBalanceInquiry(balanceInquiryRequestDto, this.privateKey, clientId, ipAddress, this.tokenB2b2c, this.tokenB2B, this.secretKey, this.isProduction)
    
        return balanceInquiryResponseDto;
    }
   async doPayment(paymentRequestDto, authCode) {
        paymentRequestDto.validatePaymentRequestDto();
    
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
        let paymentResponseDto =  await directDebitController.doPayment(paymentRequestDto, this.privateKey, this.clientId, this.tokenB2B, this.tokenB2b2c, this.secretKey, this.isProduction)
    
        return paymentResponseDto;
    }
    async doRegistrationCardBind(cardRegistrationRequestDto, channelId) {
        cardRegistrationRequestDto.validateCardRegistrationRequestDto();
    
        let tokenController = new TokenController();
        let isTokenInvalid = tokenController.isTokenInvalid(this.tokenB2B, this.tokenExpiresIn, this.tokenGeneratedTimestamp);
        if(isTokenInvalid){
            await this.getTokenB2B();
        }
        let directDebitController = new DirectDebitController()
        let cardBindResponseDto = directDebitController.doRegistrationCardBind(cardRegistrationRequestDto,channelId, this.clientId, this.privateKey,this.tokenB2B, this.secretKey, this.isProduction)
    
        return cardBindResponseDto
    }
    async doRefund(refundRequestDto, authCode)  {
        refundRequestDto.validateRefundRequestDto();
    
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
        let refundResponseDto = directDebitController.doRefund(refundRequestDto,this.privateKey, this.clientId,this.tokenB2B, this.tokenB2b2c,this.secretKey,this.isProduction)
        return refundResponseDto;
    }
    async doCheckStatus(checkStatusRequestDto){
        checkStatusRequestDto.validateCheckStatusRequestDto();
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