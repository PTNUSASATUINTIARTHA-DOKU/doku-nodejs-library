"use strict"

const TokenController = require("../_controllers/tokenController");
const VaController = require("../_controllers/vaController");
const CreateVARequestDto = require("../_models/createVaRequestDto");

class Snap{
    privateKey = ''
    clientId = '';
    isProduction = false;
    tokenB2B = '';
    tokenExpiresIn=900;
    tokenGeneratedTimestamp='';
    
    constructor(options={isProduction:false,privateKey:'',clientID:''}){
        this.isProduction = options.isProduction;
        this.privateKey = options.privateKey;
        this.clientId = options.clientID;
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
        // console.log(createVARequestDto instanceof CreateVARequestDto);
        createVARequestDto.validateVaRequestDto();
        
        var tokenController = new TokenController();
        var isTokenInvalid = tokenController.isTokenInvalid(this.tokenB2B, this.tokenExpiresIn, this.tokenGeneratedTimestamp);

        if(isTokenInvalid){
            await this.getTokenB2B();
        }
        
        let vaController = new VaController()
        let a = await vaController.createVa(createVARequestDto, this.privateKey, this.clientId, this.tokenB2B,this.isProduction);
        return a
        // return CreateVaResponseDto
    }

  }
  
module.exports = Snap;