"use strict"

const VaService = require("../_services/vaService");

class VaController{

    async createVa(createVaRequestDto,privateKey, clientId, tokenB2B, isProduction){
        let header = VaService.createVaRequestHeaderDto(createVaRequestDto, privateKey, clientId,tokenB2B);
        return await VaService.createVa(header, createVaRequestDto, isProduction)
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
}
  
module.exports = VaController;