"use strict"

const TokenService = require("../_services/tokenService");
const vaService = require("../_services/vaService");

class TokenController{

    isTokenInvalid(tokenB2B, tokenExpiresIn, tokenGeneratedTimestamp){
        if(TokenService.isTokenEmpty(tokenB2B)){
            return true
        }else{
            if(TokenService.isTokenExpired(tokenB2B, tokenExpiresIn, tokenGeneratedTimestamp)){
                return true
            }else{
                return false
            }
        }
    }

    validateSignature(requestSignature, requestTimestamp, privateKey,clientId){
        const signature = TokenService.generateSignature(privateKey, clientId, requestTimestamp);
        return TokenService.compareSignatures(requestSignature,signature)
    }

    async getTokenB2B(privateKey, clientId, isProduction){
        const xTimestamp = TokenService.generateTimestamp(); 
        const signature = TokenService.generateSignature(privateKey, clientId, xTimestamp);
        const createTokenB2BRequestDTO = TokenService.createTokenB2BRequestDTO(signature, xTimestamp, clientId);
        return await TokenService.createTokenB2B(createTokenB2BRequestDTO,isProduction);
    }
    generateInvalidSignatureResponse(){
        const xTimestamp = TokenService.generateTimestamp(); 
        return TokenService.generateInvalidSignature(xTimestamp)
    }
    generateTokenB2B(expiredIn,issuer, privateKey, clientId){
        const xTimestamp = TokenService.generateTimestamp(); 
        const token =  TokenService.generateToken(expiredIn,issuer, privateKey, clientId);
        return TokenService.generateNotificationTokenDto(token,xTimestamp,clientId,expiredIn)
    }
    validateTokenB2B(requestTokenB2B, publicKey){
        return TokenService.validateTokenB2B(requestTokenB2B, publicKey)
    }
    doGenerateRequestHeader(privateKey, clientId, tokenB2B){
        const externalId = vaService.generateExternalId();
        const timestamp = TokenService.generateTimestamp();
        const signature =  TokenService.createSignature(privateKey, clientId, timestamp);
        return vaService.createVaRequesHeaderDto(channelId,clientId,tokenB2B, timestamp, externalId, signature);
    }

}
  
module.exports = TokenController;