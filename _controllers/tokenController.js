"use strict"

const commonFunction = require("../_commons/commonFunction");
const SignatureComponentDTO = require("../_models/signatureDTO");
const { createSignatureRequest } = require("../_services/signatureService");
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
    validateSignature(clientId, request,dokuPublicKey){
        let timestamp = request.get('x-timestamp');
        let requestSignature = request.get('x-signature');
        return TokenService.compareSignatures(requestSignature,dokuPublicKey,clientId,timestamp)
    }
    validateSignatureV2(clientId, request,privateKey){
        let timestamp = request.get('x-timestamp');
        const signature = TokenService.generateSignatureV2(privateKey, clientId, timestamp,request);
        let requestSignature = request.get('x-signature');
        console.log(signature)
        console.log(requestSignature)
        return TokenService.compareSignaturesV2(requestSignature,signature)
       
    }
    validateSignatureSymmetric(request, tokenB2B,secretKey,endPointUrl){
        let timestamp = request.get('x-timestamp');
        let  httpMethod= 'POST';
        let signature = TokenService.generateSymmetricSignature(httpMethod,endPointUrl,tokenB2B,request.body,timestamp,secretKey);
        let requestSignature = request.get('x-signature');
        return TokenService.compareSignaturesSymmetric(requestSignature,signature)
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
        let tokenWithoutBearer = requestTokenB2B;
        if (tokenWithoutBearer.startsWith('Bearer ')) {
            tokenWithoutBearer = tokenWithoutBearer.replace("Bearer ",""); // Menghapus 'Bearer ' (7 karakter)
        }
        return TokenService.validateTokenB2B(tokenWithoutBearer, publicKey)
    }
    doGenerateRequestHeader(privateKey, clientId, tokenB2B){
        const externalId = commonFunction.generateExternalId();
        const timestamp = TokenService.generateTimestamp();
        const signature =  TokenService.createSignature(privateKey, clientId, timestamp);
        return vaService.createVaRequesHeaderDto(channelId,clientId,tokenB2B, timestamp, externalId, signature);
    }
    async getTokenB2b2c(authCode, privateKey, clientId, isProduction){
        const timestamp =  TokenService.generateTimestamp();
        const signature = TokenService.generateSignature(privateKey, clientId, timestamp);
        const tokenB2b2cRequestDto = TokenService.createTokenB2b2cRequestDto(authCode);
	    return await TokenService.hitTokenB2b2cApi(tokenB2b2cRequestDto, timestamp, signature, clientId, isProduction);
    }

}
  
module.exports = TokenController;