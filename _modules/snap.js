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
    
    constructor(options={isProduction:false,privateKey:'',clientID:'',publicKey:'',issuer:''}){
        this.isProduction = options.isProduction;
        this.privateKey = options.privateKey;
        this.clientId = options.clientID;
        this.publicKey = options.publicKey;
        this.issuer = options.issuer;
        this.getTokenB2B() 
    }
   
    
    async getTokenB2B() {
        var tokenController = new TokenController();
        const tokenB2BResponseDto = await tokenController.getTokenB2B(this.privateKey, this.clientId, this.isProduction);
        this.setTokenB2B(tokenB2BResponseDto);
    }
    
    setTokenB2B(tokenB2BResponseDto){
        this.tokenB2B = tokenB2BResponseDto.accessToken;
        this.tokenExpiresIn = tokenB2BResponseDto.expiresIn;
        this.tokenGeneratedTimestamp = Date.now();
    }

    async createVa(createVARequestDto){
        createVARequestDto.validateVaRequestDto();
        
        var tokenController = new TokenController();
        var isTokenInvalid = tokenController.isTokenInvalid(this.tokenB2B, this.tokenExpiresIn, this.tokenGeneratedTimestamp);
        if(isTokenInvalid){
            await this.getTokenB2B();
        }
        
        let vaController = new VaController()
        let a = await vaController.createVa(createVARequestDto, this.privateKey, this.clientId, this.tokenB2B,this.isProduction);
        return a
    }
    async createVa(createVARequestDto){
        createVARequestDto.validateVaRequestDto();
        var tokenController = new TokenController();
        var isTokenInvalid = tokenController.isTokenInvalid(this.tokenB2B, this.tokenExpiresIn, this.tokenGeneratedTimestamp);
        if(isTokenInvalid){
            await this.getTokenB2B();
        }
        
        let vaController = new VaController()
        let a = await vaController.createVa(createVARequestDto, this.privateKey, this.clientId, this.tokenB2B,this.isProduction);
        return a
    }
    async createVaV1(createVaRequestDtoV1){
        var createVARequestDto = createVaRequestDtoV1.convertToCreateVaRequestDto();
        createVARequestDto.validateVaRequestDto();
        var tokenController = new TokenController();
        var isTokenInvalid = tokenController.isTokenInvalid(this.tokenB2B, this.tokenExpiresIn, this.tokenGeneratedTimestamp);
        if(isTokenInvalid){
            await this.getTokenB2B();
        }
        let vaController = new VaController()
        let a = await vaController.createVa(createVARequestDto, this.privateKey, this.clientId, this.tokenB2B,this.isProduction);
        return a
    }
    validateSignature(requestSignature,requestTimestamp){
        var tokenController = new TokenController();
        return tokenController.validateSignature(requestSignature,requestTimestamp,this.privateKey,this.clientId)
    }
    generateTokenB2B(isSignatureValid){
        var tokenController = new TokenController();
        if(isSignatureValid){
            return tokenController.generateTokenB2B(this.tokenExpiresIn, this.issuer, this.privateKey, this.clientId);
        }else{
            return tokenController.generateInvalidSignatureResponse()
        }
    }
    validateSignatureAndGenerateToken(requestSignature,requestTimestamp){
        const isSignatureValid = this.validateSignature(requestSignature, requestTimestamp)
        return this.generateTokenB2B(isSignatureValid)
    }
    validateTokenB2B(requestTokenB2B){
        var tokenController = new TokenController();
        return tokenController.validateTokenB2B(requestTokenB2B,this.publicKey)
    }
    generateNotificationResponse(isTokenValid, PaymentNotificationRequestBodyDto){
        var notificationController = new NotificationController();
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
}
module.exports = Snap;