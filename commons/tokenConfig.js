'use strict'

const _ = require('lodash');
class TokenConfig{
 
  constructor(options={tokenB2B:"",tokenB2BExpiresIn:0}){
    this.tokenB2B;
    this.tokenB2BExpiresIn;
    this.set(options);
  }
  
  get(){
    let currentConfig = {
      tokenB2B : this.tokenB2B,
      tokenB2BExpiresIn:this.tokenB2BExpiresIn
    };
    return currentConfig;
  }
 
  set(options){
    let currentConfig = {
        tokenB2B : this.tokenB2B,
        tokenB2BExpiresIn:this.tokenB2BExpiresIn
    };
    const parsedOptions = _.pick(options,['tokenB2B','tokenB2BExpiresIn']);
    let mergedConfig = _.merge({},currentConfig,parsedOptions);
    this.tokenB2B = mergedConfig.tokenB2B;
    this.tokenB2BExpiresIn = mergedConfig.tokenB2BExpiresIn;
  }
}
module.exports = TokenConfig;