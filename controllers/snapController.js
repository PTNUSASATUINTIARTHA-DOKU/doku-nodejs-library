"use strict"

const ApiConfig = require("../commons/apiConfig");
const TokenConfig = require("../commons/tokenConfig");
const SnapService = require("../services/snapService");

class Snap{
    
    constructor(options={isProduction:false,privateKey:'',clientID:''}){
        this.apiConfig = new ApiConfig(options);
        this.tokenB2B()
    }
    
    tokenB2B() {
        const xTimestamp = SnapService.generateTimestamp(); 
        return SnapService.generateTokenB2B(this.apiConfig,xTimestamp);
    }
    createVA(params){
        const xTimestamp = SnapService.generateTimestamp(); 
        return SnapService.createVA(this.apiConfig,xTimestamp,params);
    }
  }
  
module.exports = Snap;