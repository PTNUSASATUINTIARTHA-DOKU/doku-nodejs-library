"use strict"

const NotificationController = require("../_controllers/notificationController");
const TokenController = require("../_controllers/tokenController");
const VaController = require("../_controllers/vaController");

class Snap{
    privateKey = ''
    clientId = '';
    isProduction = false;
    tokenB2B = '';
    tokenExpiresIn=900;
    tokenGeneratedTimestamp='';
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
        let tokenController = new TokenController();
        const tokenB2BResponseDto = await tokenController.getTokenB2B(this.privateKey, this.clientId, this.isProduction);
        console.log("token : "+tokenB2BResponseDto.accessToken)
        this.setTokenB2B(tokenB2BResponseDto);
        return tokenB2BResponseDto;
    }
    
    setTokenB2B(tokenB2BResponseDto){
        this.tokenB2B = tokenB2BResponseDto.accessToken;
        this.tokenExpiresIn = tokenB2BResponseDto.expiresIn;
        this.tokenGeneratedTimestamp = Date.now();
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
    async validateSignature(request){
        let tokenController = new TokenController();
        return tokenController.validateSignature(this.privateKey, this.clientId, request)
        // return tokenController.validateSignatureSymmetric(request, this.tokenB2B,this.secretKey,endPointUrl)
    }
    generateTokenB2B(isSignatureValid){
        let tokenController = new TokenController();
        if(isSignatureValid){
            return tokenController.generateTokenB2B(this.tokenExpiresIn, this.issuer, this.privateKey, this.clientId);
        }else{
            return tokenController.generateInvalidSignatureResponse()
        }
    }
    async validateSignatureAndGenerateToken(request){
        const isSignatureValid = await this.validateSignature(request)
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
}
module.exports = Snap;