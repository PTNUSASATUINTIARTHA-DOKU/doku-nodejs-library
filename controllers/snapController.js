"use strict"

const ApiConfig = require("../commons/apiConfig");
const TokenConfig = require("../commons/tokenConfig");
const SnapService = require("../services/snapService");

class Snap{
    
    constructor(options={isProduction:false,privateKey:'',clientID:''}){
        this.apiConfig = new ApiConfig(options);
        this.tokenVariables = new TokenConfig();
    }
    
    tokenB2B() {
        const xTimestamp = SnapService.generateTimestamp(); 
        return SnapService.generateTokenB2B(this.apiConfig,xTimestamp);
    }
    createVA(params){
        const xTimestamp = SnapService.generateTimestamp(); 
        if(!this.tokenVariables.get().tokenB2B){
            console.log("Token tidak tersedia, membuat token baru");
            this.tokenB2B().then((token) => {
                this.tokenVariables.set({tokenB2B:token.accessToken,tokenB2BExpiresIn:token.expiresIn})
                console.log("Token B2B telah diatur: " + this.tokenVariables.get().tokenB2B);
            })
        }else{
            console.log("Token tersedia: " + this.tokenVariables.get().tokenB2B);
        }
        return SnapService.createVA(this.apiConfig,xTimestamp,params);
    }
  }
  
module.exports = Snap;