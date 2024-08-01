"use strict"

const Config = require("../_commons/config");
const notificationService = require("../_services/notificationService");
const tokenService = require("../_services/tokenService");
const vaService = require("../_services/vaService");
const VaService = require("../_services/vaService");

class VaController{

    async createVa(createVaRequestDto,privateKey, clientId, tokenB2B, isProduction,secretKey){
        let timestamp = tokenService.generateTimestamp();
        let signature = tokenService.generateSignature(privateKey, clientId, timestamp)
        // let endPointUrl = Config.CREATE_VA;
        // let httpMethod = "POST"
        // let signature = tokenService.generateSymmetricSignature(httpMethod,endPointUrl,tokenB2B,createVaRequestDto,timestamp,secretKey);
        let externalId = vaService.generateExternalId();
        let header = vaService.createVaRequesHeaderDto(createVaRequestDto.additionalInfo.channel, clientId, tokenB2B, timestamp, externalId, signature);
        
        return VaService.createVa(header, createVaRequestDto, isProduction)
    }
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
   async doUpdateVa(updateVaRequestDto,clientId, tokenB2B, secretKey,isProduction){
        let timestamp = tokenService.generateTimestamp();
        let endPointUrl = Config.CREATE_VA;
        let httpMethod = "POST"
        let signature = tokenService.generateSymmetricSignature(httpMethod,endPointUrl,tokenB2B,updateVaRequestDto,timestamp,secretKey);
        let externalId = vaService.generateExternalId();
        let header = VaService.createVaRequesHeaderDto(updateVaRequestDto.additionalInfo.channel, clientId,tokenB2B,timestamp,externalId,signature);
        return await vaService.doUpdateVa(header,updateVaRequestDto,isProduction)
    }
    async doDeletePaymentCode(deleteVaRequestDto, privateKey, clientId, tokenB2B,isProduction){

        let timestamp = tokenService.generateTimestamp();
        let signature = tokenService.generateSignature(privateKey, clientId, timestamp)
        let externalId = vaService.generateExternalId();
        let header = vaService.createVaRequesHeaderDto(deleteVaRequestDto.additionalInfo.channel, clientId, tokenB2B, timestamp, externalId, signature)
        return vaService.doDeletePaymentCode(header, deleteVaRequestDto,isProduction)
    }
    async doCheckStatusVa(checkVARequestDTO, privateKey,clientId, tokenB2B,isProduction){
        let timestamp = tokenService.generateTimestamp();
        let signature = tokenService.generateSignature(privateKey, clientId, timestamp)
        let externalId = vaService.generateExternalId();
        let header = vaService.createVaRequesHeaderDto(checkVARequestDTO.additionalInfo?.channel, clientId, tokenB2B, timestamp, externalId, signature)
        return vaService.doCheckStatusVa(header, checkVARequestDTO,isProduction)
    }
    v1ToSnap(xmlString){
        let vaData = vaService.v1ToSnap(xmlString)
        return vaData
    }
    snapToV1(json){
        let vaData = vaService.jsonToFormData(json)
        return vaData
    }
}
  
module.exports = VaController;