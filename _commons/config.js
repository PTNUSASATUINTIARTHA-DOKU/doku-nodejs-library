'use strict'

class Config{

  static getBaseUrl = (isProduction=false)=>{
    return isProduction ?
      Config.CORE_PRODUCTION_BASE_URL : 
      Config.CORE_SANDBOX_BASE_URL;
      
  }
  // static CORE_SANDBOX_BASE_URL = 'https://api-sandbox.doku.com';
  static CORE_SANDBOX_BASE_URL = 'https://api-uat.doku.com';
  static CORE_PRODUCTION_BASE_URL = 'https://dashboard.doku.com';
  static ACCESS_TOKEN = '/authorization/v1/access-token/b2b';
  static CREATE_VA = '/virtual-accounts/bi-snap-va/v1.1/transfer-va/create-va';
  static UPDATE_VA = '/virtual-accounts/bi-snap-va/v1.1/transfer-va/update-va';
  static PUT_UPDATE_VA = '/virtual-accounts/bi-snap-va/v1.1/transfer-va/update-va';
  static DELETE_VA = '/virtual-accounts/bi-snap-va/v1.1/transfer-va/delete-va';
  static CHECK_STATUS_VA = '/orders/v1.0/transfer-va/status'
}
module.exports = Config;