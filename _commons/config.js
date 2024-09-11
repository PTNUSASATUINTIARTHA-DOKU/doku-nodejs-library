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
  static CHECK_STATUS_VA = '/orders/v1.0/transfer-va/status';
  static DIRECT_DEBIT_ACCOUNT_UNBINDING_URL = '/direct-debit/core/v1/registration-account-unbinding';
  static DIRECT_DEBIT_ACCOUNT_BINDING_URL = '/direct-debit/core/v1/registration-account-binding';
  static DIRECT_DEBIT_PAYMENT_URL = '/direct-debit/core/v1/debit/payment-host-to-host';
  static ACCESS_TOKEN_B2B2C = '/authorization/v1/access-token/b2b2c';
  static DIRECT_DEBIT_BALANCE_INQUIRY_URL = '/direct-debit/core/v1/balance-inquiry';
  static DIRECT_DEBIT_CARD_BINDING_URL = '/direct-debit/core/v1/registration-card-bind';
  static DIRECT_DEBIT_REFUND_URL = '/direct-debit/core/v1/debit/refund';
  static DIRECT_DEBIT_CHECK_STATUS_URL = '/orders/v1.0/debit/status';
  static DIRECT_DEBIT_CARD_UNBINDING_URL = '/direct-debit/core/v1/registration-card-unbind';
}
module.exports = Config;