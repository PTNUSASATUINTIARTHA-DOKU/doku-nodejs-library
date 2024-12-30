# DOKU NODE JS SDK Documentation

## Introduction
Welcome to the DOKU NODE JS SDK! This SDK simplifies access to the DOKU API for your server-side NODE JS applications, enabling seamless integration with payment and virtual account services.

If your looking for another language  [PHP](https://github.com/PTNUSASATUINTIARTHA-DOKU/doku-php-library), [Go](https://github.com/PTNUSASATUINTIARTHA-DOKU/doku-golang-library), [Python](https://github.com/PTNUSASATUINTIARTHA-DOKU/doku-python-library), [Java](https://github.com/PTNUSASATUINTIARTHA-DOKU/doku-java-library)

## Table of Contents
- [DOKU NODE JS SDK Documentation](#doku-nodejs-sdk-documentation)
  - [1. Getting Started](#1-getting-started)
  - [2. Usage](#2-usage)
    - [Virtual Account](#virtual-account)
      - [I. Virtual Account (DGPC \& MGPC)](#i-virtual-account-dgpc--mgpc)
      - [II. Virtual Account (DIPC)](#ii-virtual-account-dipc)
      - [III. Check Virtual Account Status](#iii-check-virtual-account-status)
    - [B. Binding / Registration Operations](#b-binding--registration-operations)
      - [I. Account Binding](#i-account-binding)
      - [II. Card Registration](#ii-card-registration)
    - [C. Direct Debit and E-Wallet](#c-direct-debit-and-e-wallet)
      - [I. Request Payment](#i-request-payment)
      - [II. Request Payment Jump APP ](#ii-request-payment-jump-app)
  - [3. Other Operation](#3-other-operation)
    - [Check Transaction Status](#a-check-transaction-status)
    - [Refund](#b-refund)
    - [Balance Inquiry](#c-balance-inquiry)
  - [4. Error Handling and Troubleshooting](#4-error-handling-and-troubleshooting)




## 1. Getting Started

### Requirements
- NODE JS version 18 or higher

### Installation
To install the Doku Snap SDK, use Composer:
```bash
npm install doku
```

### Configuration
Before using the Doku Snap SDK, you need to initialize it with your credentials:
1. **Client ID** and **Secret Key**: Retrieve these from the Integration menu in your Doku Dashboard
2. **Private Key** and **Public Key** : Generate your Private Key and Public Key

How to generate Merchant privateKey and publicKey :
1. generate private key RSA : openssl genrsa -out private.key 2048
2. set passphrase your private key RSA : openssl pkcs8 -topk8 -inform PEM -outform PEM -in private.key -out pkcs8.key -v1 PBE-SHA1-3DES
3. generate public key RSA : openssl rsa -in private.key -outform PEM -pubout -out public.pem

The encryption model applied to messages involves both asymmetric and symmetric encryption, utilizing a combination of Private Key and Public Key, adhering to the following standards:

  1. Standard Asymmetric Encryption Signature: SHA256withRSA dengan Private Key ( Kpriv ) dan Public Key ( Kpub ) (256 bits)
  2. Standard Symmetric Encryption Signature HMAC_SHA512 (512 bits)
  3. Standard Symmetric Encryption AES-256 dengan client secret sebagai encryption key.

| **Parameter**       | **Description**                                    | **Required** |
|-----------------|----------------------------------------------------|--------------|
| `privateKey`    | The private key for the partner service.           | ✅          |
| `publicKey`     | The public key for the partner service.            | ✅           |
| `clientId`      | The client ID associated with the service.         | ✅           |
| `secretKey`     | The secret key for the partner service.            | ✅           |
| `isProduction`  | Set to true for production environment             | ✅           |
| `issuer`        | Optional issuer for advanced configurations.       | ❌           |
| `authCode`      | Optional authorization code for advanced use.      | ❌           |


```nodejs
const doku = require('doku-nodejs-library');

let privateKey = `-----BEGIN PRIVATE KEY-----
your privatekey
-----END PRIVATE KEY-----`;
let issuer = "your issuer";
let clientID = "your client id";
let publicKey = `-----BEGIN PUBLIC KEY-----
your public key
-----END PUBLIC KEY-----`;
let dokuPublicKey = `-----BEGIN PUBLIC KEY-----
doku public key
-----END PUBLIC KEY-----`;
let secretKey = 'SK-VknOxwR4xZSEPnG7fpJo';
let snap = new doku.Snap({
    isProduction : false,
    privateKey : privateKey,
    clientID : clientID,
    publicKey :publicKey,
    dokuPublicKey:dokuPublicKey,
    issuer:issuer,
    secretKey:secretKey
});
```

## 2. Usage

**Initialization**
Always start by initializing the Snap object.

```nodejs
let snap = new doku.Snap({
    isProduction : false,
    privateKey : privateKey,
    clientID : clientID,
    publicKey :publicKey,
    dokuPublicKey:dokuPublicKey,
    issuer:issuer,
    secretKey:secretKey
});
```
### Virtual Account
#### I. Virtual Account (DGPC & MGPC)
##### DGPC
- **Description:** A pre-generated virtual account provided by DOKU.
- **Use Case:** Recommended for one-time transactions.
##### MGPC
- **Description:** Merchant generated virtual account.
- **Use Case:** Recommended for top up business model.

Parameters for **createVA** and **updateVA**
<table>
  <thead>
    <tr>
      <th><strong>Parameter</strong></th>
      <th colspan="2"><strong>Description</strong></th>
      <th><strong>Data Type</strong></th>
      <th><strong>Required</strong></th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>partnerServiceId</code></td>
      <td colspan="2">The unique identifier for the partner service.</td>
      <td>String(20)</td>
      <td>✅</td>
    </tr>
    <tr>
      <td><code>customerNo</code></td>
      <td colspan="2">The customer's identification number.</td>
      <td>String(20)</td>
      <td>✅</td>
    </tr>
    <tr>
      <td><code>virtualAccountNo</code></td>
      <td colspan="2">The virtual account number associated with the customer.</td>
      <td>String(20)</td>
      <td>✅</td>
    </tr>
    <tr>
      <td><code>virtualAccountName</code></td>
      <td colspan="2">The name of the virtual account associated with the customer.</td>
      <td>String(255)</td>
      <td>✅</td>
    </tr>
    <tr>
      <td><code>virtualAccountEmail</code></td>
      <td colspan="2">The email address associated with the virtual account.</td>
      <td>String(255)</td>
      <td>❌</td>
    </tr>
    <tr>
      <td><code>virtualAccountPhone</code></td>
      <td colspan="2">The phone number associated with the virtual account.</td>
      <td>String(9-30)</td>
      <td>❌</td>
    </tr>
    <tr>
      <td><code>trxId</code></td>
      <td colspan="2">Invoice number in Merchants system.</td>
      <td>String(64)</td>
      <td>✅</td>
    </tr>
    <tr>
      <td rowspan="2"><code>totalAmount</code></td>
      <td colspan="2"><code>value</code>: Transaction Amount (ISO 4217) <br> <small>Example: "11500.00"</small></td>
      <td>String(16.2)</td>
      <td>✅</td>
    </tr>
    <tr>
      <td colspan="2"><code>Currency</code>: Currency <br> <small>Example: "IDR"</small></td>
      <td>String(3)</td>
      <td>✅</td>
    </tr>
    <tr>
      <td rowspan="4"><code>additionalInfo</code></td>
      <td colspan="2"><code>channel</code>: Channel that will be applied for this VA <br> <small>Example: VIRTUAL_ACCOUNT_BANK_CIMB</small></td>
      <td>String(20)</td>
      <td>✅</td>
    </tr>
    <tr>
      <td rowspan="3"><code>virtualAccountConfig</code></td>
      <td><code>reusableStatus</code>: Reusable Status For Virtual Account Transaction <br><small>value TRUE or FALSE</small></td>
      <td>Boolean</td>
      <td>❌</td>
    </tr>
    <tr>
      <td><code>minAmount</code>: Minimum Amount can be used only if <code>virtualAccountTrxType</code> is Open Amount (O). <br><small>Example: "10000.00"</small></td>
      <td>String(16.2)</td>
      <td>❌</td>
    </tr>
    <tr>
      <td><code>maxAmount</code>: Maximum Amount can be used only if <code>virtualAccountTrxType</code> is Open Amount (O). <br><small>Example: "5000000.00"</small></td>
      <td>String(16.2)</td>
      <td>❌</td>
    </tr>
    <tr>
      <td><code>virtualAccountTrxType</code></td>
      <td colspan="2">Transaction type for this transaction. C (Closed Amount), O (Open Amount)</td>
      <td>String(1)</td>
      <td>✅</td>
    </tr>
    <tr>
      <td><code>expiredDate</code></td>
      <td colspan="2">Expiration date for Virtual Account. ISO-8601 <br><small>Example: "2023-01-01T10:55:00+07:00"</small></td>
      <td>String</td>
      <td>❌</td>
    </tr>
  </tbody>
</table>


1. **Create Virtual Account**
    - **Function:** `createVa`
    ```nodejs
    const CreateVARequestDto = require('doku-nodejs-library/_models/createVaRequestDto');
    const VirtualAccountConfig = require('doku-nodejs-library/_models/virtualAccountConfig');
    const TotalAmount = require('doku-nodejs-library/_models/totalAmount');
    const AdditionalInfo = require('doku-nodejs-library/_models/additionalInfo');
    
    app.post('/create-va', async (req,res) => {
      let createVaRequestDto = new CreateVARequestDto();
        createVaRequestDto.partnerServiceId = req.body.partnerServiceId;
        createVaRequestDto.customerNo =req.body.customerNo;
        createVaRequestDto.virtualAccountNo = req.body.partnerServiceId+req.body.customerNo;
        createVaRequestDto.virtualAccountName = req.body.virtualAccountName;
        createVaRequestDto.virtualAccountEmail = req.body.virtualAccountEmail;
        createVaRequestDto.virtualAccountPhone = req.body.virtualAccountPhone;
        createVaRequestDto.trxId =  req.body.trxId;
    
        let totalAmount = new TotalAmount();
        totalAmount.value = req.body.totalAmount.value;
        totalAmount.currency = req.body.totalAmount.currency;
    
        createVaRequestDto.totalAmount = totalAmount;
    
        let virtualAccountConfig = new VirtualAccountConfig();
        virtualAccountConfig.reusableStatus = req.body.additionalInfo.virtualAccountConfig.reusableStatus;
        let additionalInfo = new AdditionalInfo("VIRTUAL_ACCOUNT_BANK_CIMB", virtualAccountConfig);
        additionalInfo.channel = req.body.additionalInfo.channel;
        additionalInfo.virtualAccountConfig = virtualAccountConfig;
        createVaRequestDto.additionalInfo = additionalInfo;
        createVaRequestDto.virtualAccountTrxType =req.body.virtualAccountTrxType;
        createVaRequestDto.expiredDate = req.body.expiredDate;
      await snap.createVa(createVaRequestDto).then(va=>{
        res.status(200).send(va);
      }).catch(err=>{
          if(err.response){
              res.status(400).send(err.response.data)
          }else{
            res.status(400).send({
              responseCode:"400",
              responseMessage:err.message
            })
          }
        
      })
    })
   ```

2. **Update Virtual Account**
    - **Function:** `updateVa`

    ```nodejs
    const UpdateVaVirtualAccountConfigDto = require('doku-nodejs-library/_models/updateVaVirtualAccountConfigDTO');
    const VirtualAccountConfig = require('doku-nodejs-library/_models/virtualAccountConfig');
    const TotalAmount = require('doku-nodejs-library/_models/totalAmount');
    const UpdateVaAdditionalInfoDto = require('doku-nodejs-library/_models/updateVaAdditionalInfoDTO');
    
      app.post('/update-va', async (req,res) => {
        let updateVaRequestDto = new UpdateVaDto()
        updateVaRequestDto.partnerServiceId = req.body.partnerServiceId; 
        updateVaRequestDto.customerNo = req.body.customerNo;
        updateVaRequestDto.virtualAccountNo =     updateVaRequestDto.partnerServiceId+updateVaRequestDto.customerNo;
        updateVaRequestDto.virtualAccountName = req.body.virtualAccountName;
        updateVaRequestDto.virtualAccountEmail = req.body.virtualAccountEmail;
        updateVaRequestDto.trxId = req.body.trxId
    
        let totalAmount = new TotalAmount();
        totalAmount.value = req.body.totalAmount.value;
        totalAmount.currency = req.body.totalAmount.currency;
    
        updateVaRequestDto.totalAmount = totalAmount;
        let virtualAccountConfig = new UpdateVaVirtualAccountConfigDto();
        virtualAccountConfig.status = "INACTIVE";

        let additionalInfo = new UpdateVaAdditionalInfoDto(req.body.additionalInfo.channel, virtualAccountConfig);
        additionalInfo.channel = req.body.additionalInfo.channel;
        additionalInfo.virtualAccountConfig = virtualAccountConfig;
        updateVaRequestDto.additionalInfo = additionalInfo;
        updateVaRequestDto.virtualAccountTrxType = "C";
        updateVaRequestDto.expiredDate = req.body.expiredDate;
        console.log(updateVaRequestDto)
        await snap.updateVa(updateVaRequestDto).then(va=>{
          res.status(200).send(va);
        }).catch((err)=>{
          if(err.response){
            res.status(400).send(err.response.data)
          }else{
            res.status(400).send({
              responseCode:"400",
              responseMessage:err.message
            })
          }
        })
    })
    ```

3. **Delete Virtual Account**

    | **Parameter**        | **Description**                                                             | **Data Type**       | **Required** |
    |-----------------------|----------------------------------------------------------------------------|---------------------|--------------|
    | `partnerServiceId`    | The unique identifier for the partner service.                             | String(8)        | ✅           |
    | `customerNo`          | The customer's identification number.                                      | String(20)       | ✅           |
    | `virtualAccountNo`    | The virtual account number associated with the customer.                   | String(20)       | ✅           |
    | `trxId`               | Invoice number in Merchant's system.                                       | String(64)       | ✅           |
    | `additionalInfo`      | `channel`: Channel applied for this VA.<br><small>Example: VIRTUAL_ACCOUNT_BANK_CIMB</small> | String(30)       | ✅    |

    
  - **Function:** `deletePaymentCode`

    ```nodejs
    const DeleteVaRequestDto = require('doku-nodejs-library/_models/deleteVaRequestDTO');
    const DeleteVaRequestAdditionalInfo = require('doku-nodejs-library/_models/deleteVaRequestAdditionalInfoDTO');
    
    app.post('/delete-va', async (req,res) => {
      let deleteVaRequestDto = new DeleteVaRequestDto()
      deleteVaRequestDto.partnerServiceId =  req.body.partnerServiceId; 
      deleteVaRequestDto.customerNo =  req.body.customerNo;
      deleteVaRequestDto.virtualAccountNo = req.body.virtualAccountNo
     
      deleteVaRequestDto.trxId = req.body.trxId
      let additionalInfo = new DeleteVaRequestAdditionalInfo(req.body.additionalInfo.channel);
      deleteVaRequestDto.additionalInfo = additionalInfo;
      await snap.deletePaymentCode(deleteVaRequestDto).then(response=>{
        res.status(200).send(response);
      }).catch((err)=>{
        if(err.response){
          res.status(400).send(err.response.data)
        }else{
          res.status(400).send({
            responseCode:"400",
            responseMessage:err.message
          })
        }
      })
    })
    ```


#### II. Virtual Account (DIPC)
- **Description:** The VA number is registered on merchant side and DOKU will forward Acquirer inquiry request to merchant side when the customer make payment at the acquirer channel

- **Function:** `directInquiryVa`

    ```nodejs
    const InquiryResponseVirtualAccountDataDTO = require('doku-nodejs-library/_models/InquiryResponseVirtualAccountDataDTO');
    const InquiryResponseBodyDTO = require('doku-nodejs-library/_models/inquiryResponseBodyDTO');
    const TotalAmount = require('doku-nodejs-library/_models/totalAmount');
    const InquiryResponseAdditionalInfoDTO = require('doku-nodejs-library/_models/inquiryResponseAdditionalInfoDTO');
    const VirtualAccountConfig = require('doku-nodejs-library/_models/virtualAccountConfig');
    const InquiryReasonDto = require('doku-nodejs-library/_models/inquiryReasonDTO');
      app.post("/v1.1/transfer-va/inquiry",(req,res)=>{
        let data = new InquiryRequestDTO();
        data.partnerServiceId = req.body.partnerServiceId;
        data.customerNo = req.body.customerNo;
        data.virtualAccountNo = req.body.virtualAccountNo;
        data.trxDateInit = req.body.trxDateInit;
        data.inquiryRequestId = req.body.inquiryRequestId;
        data.additionalInfo = req.body.additionalInfo;
        let isvalid = snap.validateTokenB2B(req.headers['authorization']);
        if(isvalid){
            <!--validate yout virtualAccountNo in your database-->
            let bodyData = new InquiryResponseBodyDTO()
                  bodyData.responseCode = "2002400";
                  bodyData.responseMessage = "Successful"
                  let vaData = new InquiryResponseVirtualAccountDataDTO()
                  vaData.partnerServiceId = req.body.partnerServiceId;
                  vaData.customerNo = req.body.customerNo;
                  vaData.virtualAccountNo = req.body.virtualAccountNo;
                  vaData.virtualAccountName = "Nama "+Date.now();
                  vaData.virtualAccountEmail ="email."+Date.now()+"@gmail.com";
                  vaData.virtualAccountPhone = `${Date.now()}`;
                  let totalAmount = new TotalAmount()
                  totalAmount.currency = "IDR";
                  totalAmount.value = "25000.00"
                  vaData.totalAmount = totalAmount;
                  vaData.virtualAccountTrxType = "C"
                  let additionalInfo = new InquiryResponseAdditionalInfoDTO()
                  additionalInfo.channel = req.body.additionalInfo.channel;
                  additionalInfo.trxId = "INV_MERCHANT_"+Date.now();
                  let virtualAccountConfig = new VirtualAccountConfig()
                  virtualAccountConfig.reusableStatus = true;
                  virtualAccountConfig.maxAmount = "100000.00";
                  virtualAccountConfig.minAmount = "10000.00"
                  additionalInfo.virtualAccountConfig = virtualAccountConfig;
                  vaData.additionalInfo = additionalInfo;
                  vaData.inquiryStatus ="00";
                  let inquiryReason = new InquiryReasonDto()
                  inquiryReason.english = "Success";
                  inquiryReason.indonesia = "Sukses";
                  vaData.inquiryReason = inquiryReason;
                  vaData.inquiryRequestId = req.body.inquiryRequestId;
                  vaData.freeText = [
                          {
                            "english": "Free text",
                            "indonesia": "Tulisan Bebas"
                          }
                  ]
                  bodyData.virtualAccountData = vaData;
        }else{
          let body ={
            "responseCode": "4010000",
            "responseMessage": "Unauthorized",
          }
           res.status(401).send(body);
        }})
    ```

#### III. Check Virtual Account Status
 | **Parameter**        | **Description**                                                             | **Data Type**       | **Required** |
|-----------------------|----------------------------------------------------------------------------|---------------------|--------------|
| `partnerServiceId`    | The unique identifier for the partner service.                             | String(8)        | ✅           |
| `customerNo`          | The customer's identification number.                                      | String(20)       | ✅           |
| `virtualAccountNo`    | The virtual account number associated with the customer.                   | String(20)       | ✅           |
| `inquiryRequestId`    | The customer's identification number.                                      | String(128)       | ❌           |
| `paymentRequestId`    | The virtual account number associated with the customer.                   | String(128)       | ❌           |
| `additionalInfo`      | The virtual account number associated with the customer.                   | String      | ❌           |

  - **Function:** `checkStatusVa`
    ```nodejs
    const CheckStatusVARequestDto = require('doku-nodejs-library/_models/checkStatusVARequestDTO');
    
    app.post('/check-status', async (req,res) => {
      let checkVaRequestDto = new CheckStatusVARequestDto()
      checkVaRequestDto.partnerServiceId = req.body.partnerServiceId; 
      checkVaRequestDto.customerNo =  req.body.customerNo;
      checkVaRequestDto.virtualAccountNo = checkVaRequestDto.partnerServiceId+checkVaRequestDto.customerNo;
      await snap.checkStatusVa(checkVaRequestDto).then(response=>{
           res.status(200).send(response);
      }).catch((err)=>{
      if(err.response){
          res.status(400).send(err.response.data)
      }else{
          res.status(400).send({
            responseCode:"400",
            responseMessage:err.message
          })
      }
     })
    })
    ```

### B. Binding / Registration Operations
The card registration/account binding process must be completed before payment can be processed. The merchant will send the card registration request from the customer to DOKU.

Each card/account can only registered/bind to one customer on one merchant. Customer needs to verify OTP and input PIN.

| **Services**     | **Binding Type**      | **Details**                        |
|-------------------|-----------------------|-----------------------------------|
| Direct Debit      | Account Binding       | Supports **Allo Bank** and **CIMB** |
| Direct Debit      | Card Registration     | Supports **BRI**                    |
| E-Wallet          | Account Binding       | Supports **OVO**                    |

#### I. Account Binding 
1. **Binding**

<table>
  <thead>
    <tr>
      <th><strong>Parameter</strong></th>
      <th colspan="2"><strong>Description</strong></th>
      <th><strong>Data Type</strong></th>
      <th><strong>Required</strong></th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>phoneNo</code></td>
      <td colspan="2">Phone Number Customer. <br> <small>Format: 628238748728423</small> </td>
      <td>String(9-16)</td>
      <td>✅</td>
    </tr>
    <tr>
      <td rowspan="13"><code>additionalInfo</code></td>
      <td colspan="2"><code>channel</code>: Payment Channel<br></td>
      <td>String</td>
      <td>✅</td>
    </tr>
    <tr>
      <td colspan="2"><code>custIdMerchant</code>: Customer id from merchant</td>
      <td>String(64)</td>
      <td>✅</td>
    </tr>
    <tr>
      <td colspan="2"><code>customerName</code>: Customer name from merchant</td>
      <td>String(70)</td>
      <td>❌</td>
    </tr>
    <tr>
      <td colspan="2"><code>email</code>: Customer email from merchant </td>
      <td>String(64)</td>
      <td>❌</td>
    </tr>
    <tr>
      <td colspan="2"><code>idCard</code>: Customer id card from merchant</td>
      <td>String(20)</td>
      <td>❌</td>
    </tr>
    <tr>
      <td colspan="2"><code>country</code>: Customer country </td>
      <td>String</td>
      <td>❌</td>
    </tr>
    <tr>
      <td colspan="2"><code>address</code>: Customer Address</td>
      <td>String(255)</td>
      <td>❌</td>
    </tr>
        <tr>
      <td colspan="2"><code>dateOfBirth</code> </td>
      <td>String(YYYYMMDD)</td>
      <td>❌</td>
    </tr>
    <tr>
      <td colspan="2"><code>successRegistrationUrl</code>: Redirect URL when binding is success </td>
      <td>String</td>
      <td>✅</td>
    </tr>
    <tr>
      <td colspan="2"><code>failedRegistrationUrl</code>: Redirect URL when binding is success fail</td>
      <td>String</td>
      <td>✅</td>
    </tr>
    <tr>
      <td colspan="2"><code>deviceModel</code>: Device Model customer </td>
      <td>String</td>
      <td>✅</td>
    </tr>
    <tr>
      <td colspan="2"><code>osType</code>: Format: ios/android </td>
      <td>String</td>
      <td>✅</td>
    </tr>
    <tr>
      <td colspan="2"><code>channelId</code>: Format: app/web </td>
      <td>String</td>
      <td>✅</td>
    </tr>
    </tbody>
  </table> 

  - **Function:** `doAccountBinding`

    ```nodejs
    const AccountBindingRequestDto = require('doku-nodejs-library/_models/accountBindingRequestDTO');
    
    app.post("/account-binding", async (req,res)=>{
      let request = new AccountBindingRequestDto()
      request.phoneNo = req.body.phoneNo
      request.additionalInfo = req.body.additionalInfo;
      let ipAddress = req.headers['x-ip-address'];
      let deviceId = req.headers['x-device-id'];
      await snap.doAccountBinding(request,ipAddress,deviceId).then((response)=>{
        res.status(200).send(response);
      }).catch((err)=>{
        if(err.response?.data){
          res.status(parseInt(err.response.data.responseCode.substring(0, 3))).send(err.response.data);
        }else{
          res.status(500).send({"message":err.message});
        }
       
      })
      
    })
    ```

1. **Unbinding**
     - **Function:** `getTokenB2B2C`
    ```nodejs
    app.post('/token-b2b2c', async (req,res) => {
        <!--YOUR_AUTH_CODE_FROM_ACCOUNT_BINDING-->
      let authCode = req.body['authCode'];
      await snap.getTokenB2B2c(authCode).then((response)=>{
    
        res.status(200).send(response);
      }).catch((err)=>{
        if(err.response?.data){
          res.status(err.response.status).send(err.response.data);
        }else{
          res.status(500).send({"message":err.message});
        }
      })
     })
   ```
    - **Function:** `doAccountUnbinding`
    ```nodejs
    const {AccountUnbindingRequestDto,AccountUnbindingAdditionalInfo} = require('doku-nodejs-library/_models/accountUnbindingRequestDTO');
    
    app.post("/account-unbinding", async (req,res)=>{
      let request = new AccountUnbindingRequestDto()
      let additionalInfo = new AccountUnbindingAdditionalInfo(req.body.additionalInfo.channel)
      request.tokenId = req.body.tokenId;
      request.additionalInfo = additionalInfo;
      let ipAddress = req.headers['x-ip-address'];
      await snap.doAccountUnbinding(request,ipAddress).then((response)=>{
    
        res.status(200).send(response);
      }).catch((err)=>{
        if(err.response?.data){
          res.status(err.response.status).send(err.response.data);
        }else{
          res.status(500).send({"message":err.message});
        }
      })
    })
    ```

#### II. Card Registration
1. **Registration**
    - **Function:** `doCardRegistration`

    ```nodejs
    const CardRegistrationRequestDTO = require('doku-nodejs-library/_models/cardRegistrationRequestDTO');
    
    app.post("/card-registration", async (req,res)=>{
      let request = new CardRegistrationRequestDTO()
      request.cardData = req.body.cardData;
      request.custIdMerchant = req.body.custIdMerchant;
      request.phoneNo = req.body.phoneNo;
      request.additionalInfo = req.body.additionalInfo;
      console.log(request)
      await snap.doRegistrationCardBind(request).then((response)=>{
        res.status(200).send(response.data);
      }).catch((err)=>{
        if(err.response?.data){
          res.status(err.response.status).send(err.response.data);
        }else{
          console.log(err)
          res.status(500).send({"message":err.message});
        }
       
      })
    })
    ```

2. **UnRegistration**
    - **Function:** `getTokenB2B2C`
    ```nodejs
    app.post('/token-b2b2c', async (req,res) => {
        <!--YOUR_AUTH_CODE_FROM_ACCOUNT_BINDING-->
      let authCode = req.body['authCode'];
      await snap.getTokenB2B2c(authCode).then((response)=>{
    
        res.status(200).send(response);
      }).catch((err)=>{
        if(err.response?.data){
          res.status(err.response.status).send(err.response.data);
        }else{
          res.status(500).send({"message":err.message});
        }
      })
     })
   ```
    - **Function:** `doCardUnbinding`

    ```nodejs
    const CardUnRegistUnbindRequestDTO= require('doku-nodejs-library/_models/cardUnregistUnbindRequestDTO');
      
    app.post("/card-unbinding", async (req,res)=>{
      let request = new CardUnRegistUnbindRequestDTO(req.body.tokenId,
        req.body.additionalInfo
      )
      
      await snap.doUnRegistCardUnBind(request).then((response)=>{
        res.status(200).send(response);
      }).catch((err)=>{
        if(err.response?.data){
          res.status(err.response.status).send(err.response.data);
        }else{
          console.log(err)
          res.status(500).send({"message":err.message});
        }
       
      })
    })
    ```

### C. Direct Debit and E-Wallet 

#### I. Request Payment
  Once a customer’s account or card is successfully register/bind, the merchant can send a payment request. This section describes how to send a unified request that works for both Direct Debit and E-Wallet channels.

| **Acquirer**       | **Channel Name**         | 
|-------------------|--------------------------|
| Allo Bank         | DIRECT_DEBIT_ALLO_SNAP   | 
| BRI               | DIRECT_DEBIT_BRI_SNAP    | 
| CIMB              | DIRECT_DEBIT_CIMB_SNAP   |
| OVO               | EMONEY_OVO_SNAP   | 

##### Common parameter
<table>
  <thead>
    <tr>
      <th><strong>Parameter</strong></th>
      <th colspan="2"><strong>Description</strong></th>
      <th><strong>Data Type</strong></th>
      <th><strong>Required</strong></th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>partnerReferenceNo</code></td>
      <td colspan="2"> Reference No From Partner <br> <small>Format: 628238748728423</small> </td>
      <td>String(9-16)</td>
      <td>✅</td>
    </tr>
    <tr>
      <td rowspan="2"><code>amount</code></td>
      <td colspan="2"><code>value</code>: Transaction Amount (ISO 4217) <br> <small>Example: "11500.00"</small></td>
      <td>String(16.2)</td>
      <td>✅</td>
    </tr>
    <tr>
      <td colspan="2"><code>Currency</code>: Currency <br> <small>Example: "IDR"</small></td>
      <td>String(3)</td>
      <td>✅</td>
    </tr>
    <tr>
      <td rowspan="4"><code>additionalInfo</code> </td>
      <td colspan = "2" ><code>channel</code>: payment channel</td>
      <td>String</td>
      <td>✅</td>
    </tr>
    <tr>
      <td colspan="2"><code>remarks</code>:Remarks from Partner</td>
      <td>String(40)</td>
      <td>✅</td>
    </tr>
    <tr>
      <td colspan="2"><code>successPaymentUrl</code>: Redirect Url if payment success</td>
      <td>String</td>
      <td>✅</td>
    </tr>
        <tr>
      <td colspan="2"><code>failedPaymentUrl</code>: Redirect Url if payment fail
      </td>
      <td>String</td>
      <td>✅</td>
    </tr>
    </tbody>
  </table> 

 ##### Allo Bank Specific Parameters

| **Parameter**                        | **Description**                                               | **Required** |
|--------------------------------------|---------------------------------------------------------------|--------------|
| `additionalInfo.remarks`             | Remarks from the partner                                      | ✅           |
| `additionalInfo.lineItems.name`      | Item name (String)                                            | ✅           |
| `additionalInfo.lineItems.price`     | Item price (ISO 4217)                                         | ✅           |
| `additionalInfo.lineItems.quantity`  | Item quantity (Integer)                                      | ✅           |
| `payOptionDetails.payMethod`         | Balance type (options: BALANCE/POINT/PAYLATER)                | ✅           |
| `payOptionDetails.transAmount.value` | Transaction amount                                            | ✅           |
| `payOptionDetails.transAmount.currency` | Currency (ISO 4217, e.g., "IDR")                             | ✅           |


#####  CIMB Specific Parameters

| **Parameter**                        | **Description**                                               | **Required** |
|--------------------------------------|---------------------------------------------------------------|--------------|
| `additionalInfo.remarks`             | Remarks from the partner                                      | ✅           |


#####  OVO Specific Parameters

| **Parameter**                           | **Description**                                                | **Required** |
|------------------------------------------|---------------------------------------------------------------|--------------|
| `feeType`                                | Fee type from partner (values: OUR, BEN, SHA)                  | ❌           |
| `payOptionDetails.payMethod`             | Payment method format: CASH, POINTS                            | ✅           |
| `payOptionDetails.transAmount.value`    | Transaction amount (ISO 4217)                                  | ✅           |
| `payOptionDetails.transAmount.currency` | Currency (ISO 4217, e.g., "IDR")                               | ✅           |
| `payOptionDetails.feeAmount.value`      | Fee amount (if applicable)                                     | ✅           |
| `payOptionDetails.feeAmount.currency`   | Currency for the fee                                          | ✅           |
| `additionalInfo.paymentType`            | Transaction type (values: SALE, RECURRING)                     | ✅           |

  
Here’s how you can use the `doPayment` function for both payment types:
  - **Function:** `doPayment`
    
    ```nodejs
    const { PaymentRequestDto } = require('doku-nodejs-library/_models/paymentRequestDirectDebitDTO');
    
     app.post("/debit-payment", async (req,res)=>{
          let request = new PaymentRequestDto()
          request.payOptionDetails = req.body.payOptionDetails;
          request.partnerReferenceNo = req.body.partnerReferenceNo;
          request.amount = req.body.amount;
          request.additionalInfo = req.body.additionalInfo;
          let ipAddress = req.headers['x-ip-address'];
          let authCode = req.body['authCode'];
          await snap.doPayment(request,authCode,ipAddress).then((response)=>{
            res.status(200).send(response);
          }).catch((err)=>{
            if(err.response?.data){
              res.status(err.response.status).send(err.response.data);
            }else{
              res.status(500).send({"message":err.message});
            }
           
          })
        })
      ```

#### II. Request Payment Jump APP
| **Acquirer**       | **Channel Name**        | 
|-------------------|--------------------------|
| DANA              | EMONEY_DANA_SNAP   | 
| ShopeePay         | EMONEY_SHOPEE_PAY_SNAP  |

The following fields are common across **DANA and ShopeePay** requests:
<table>
  <thead>
    <tr>
      <th><strong>Parameter</strong></th>
      <th colspan="2"><strong>Description</strong></th>
      <th><strong>Data Type</strong></th>
      <th><strong>Required</strong></th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>partnerReferenceNo</code></td>
      <td colspan="2"> Reference No From Partner <br> <small>Examplae : INV-0001</small> </td>
      <td>String(9-16)</td>
      <td>✅</td>
    </tr>
    <tr>
      <td><code>validUpto</code></td>
      <td colspan = "2" >Expired time payment url </td>
      <td>String</td>
      <td>❌</td>
    </tr>
    <tr>
      <td><code>pointOfInitiation</code></td>
      <td colspan = "2" >Point of initiation from partner,<br> value: app/pc/mweb </td>
      <td>String</td>
      <td>❌</td>
    </tr>
    <tr>
      <td rowspan = "3" > <code>urlParam</code></td>
      <td colspan = "2"><code>url</code>: URL after payment sucess </td>
      <td>String</td>
      <td>✅</td>
    </tr>
    <tr>
      <td colspan="2"><code>type</code>: Pay Return<br> <small>always PAY_RETURN </small></td>
      <td>String</td>
      <td>✅</td>
    </tr>
    <tr>
      <td colspan="2"><code>isDeepLink</code>: Is Merchant use deep link or not<br> <small>Example: "Y/N"</small></td>
      <td>String(1)</td>
      <td>✅</td>
    </tr>
    <tr>
      <td rowspan="2"><code>amount</code></td>
      <td colspan="2"><code>value</code>: Transaction Amount (ISO 4217) <br> <small>Example: "11500.00"</small></td>
      <td>String(16.2)</td>
      <td>✅</td>
    </tr>
    <tr>
      <td colspan="2"><code>Currency</code>: Currency <br> <small>Example: "IDR"</small></td>
      <td>String(3)</td>
      <td>✅</td>
    </tr>
    <tr>
      <td><code>additionalInfo</code> </td>
      <td colspan = "2" ><code>channel</code>: payment channel</td>
      <td>String</td>
      <td>✅</td>
    </tr>
    </tbody>
  </table> 

##### DANA

DANA spesific parameters
<table>
    <thead>
    <tr>
      <th><strong>Parameter</strong></th>
      <th colspan="2"><strong>Description</strong></th>
      <th><strong>Data Type</strong></th>
      <th><strong>Required</strong></th>
    </tr>
    </thead>
    <tbody>
    <tr>
      <td rowspan = "2" ><code>additionalInfo</code></td>
      <td colspan = "2" ><code>orderTitle</code>: Order title from merchant</td>
      <td>String</td>
      <td>❌</td>
    </tr>
    <tr>
      <td colspan = "2" ><code>supportDeepLinkCheckoutUrl</code> : Value 'true' for Jumpapp behaviour, 'false' for webview, false by default</td>
      <td>String</td>
      <td>❌</td>
    </tr>
    </tbody>
  </table> 
For Shopeepay and Dana you can use the `doPaymentJumpApp` function for for Jumpapp behaviour

- **Function:** `doPaymentJumpApp`

```nodejs
    const PaymentJumpAppRequestDto = require('doku-nodejs-library/_models/paymentJumpAppRequestDTO');
    
    app.post("/payment-jump-app", async (req,res)=>{
      let request = new PaymentJumpAppRequestDto()
      request.partnerReferenceNo = req.body.partnerReferenceNo;
      request.pointOfInitiation = req.body.pointOfInitiation;
      request.urlParam = req.body.urlParam;
      request.amount = req.body.amount;
      request.additionalInfo = req.body.additionalInfo;
      request.validUpto = req.body.validUpto;
      let ipAddress = req.headers['x-ip-address'];
      let deviceId = req.headers['x-device-id'];
      await snap.doPaymentJumpApp(request,ipAddress,deviceId).then((response)=>{
        res.status(200).send(response);
      }).catch((err)=>{
        if(err.response?.data){
          res.status(err.response.status).send(err.response.data);
        }else{
          res.status(500).send({"message":err.message});
        }
       
      })
    })
```

  
      
## 3. Other Operation

### A. Check Transaction Status

  ```nodejs
  const CheckStatusDirectDebitDTO = require('doku-nodejs-library/_models/checkStatusDirectDebitRequestDTO');
  
   app.post('/debit-status', async (req,res) => {
      let request = new CheckStatusDirectDebitDTO()
      request.originalExternalId = req.body.originalExternalId
      request.originalPartnerReferenceNo= req.body.originalPartnerReferenceNo
      request.originalReferenceNo = req.body.originalReferenceNo
      request.serviceCode = req.body.serviceCode
      request.transactionDate= req.body.transactionDate
      request.amount = req.body.amount
      request.merchantId = req.body.merchantId
      request.subMerchantId = req.body.subMerchantId
      request.externalStoreId= req.body.externalStoreId
      request.additionalInfo= req.body.additionalInfo
      await snap.doCheckStatus(request).then(response=>{
        res.status(200).send(response);
      }).catch((err)=>{
        if(err.response){
          res.status(400).send(err.response.data)
        }else{
          res.status(400).send({
            responseCode:"400",
            responseMessage:err.message
          })
        }
      })
})
  ```

### B. Refund

  ```nodejs
  const RefundRequestDto = require('doku-nodejs-library/_models/refundRequestDTO');
  
  app.post("/refund", async (req,res)=>{
      let request = new RefundRequestDto();
      request.originalPartnerReferenceNo = req.body.originalPartnerReferenceNo;
      request.refundAmount = req.body.refundAmount;
      request.partnerRefundNo = req.body.partnerRefundNo;
      request.originalExternalId = req.body.originalExternalId;
      request.reason = req.body.reason;
      request.additionalInfo = req.body.additionalInfo;
      let ipAddress = req.headers['x-ip-address'];
      let authCode = req.body['authCode'];
      let deviceId = req.headers['deviceId'];
      await snap.doRefund(request,authCode,ipAddress,deviceId).then((response)=>{
        res.status(200).send(response);
      }).catch((err)=>{
        if(err.response?.data){
          res.status(err.response.status).send(err.response.data);
        }else{
          res.status(500).send({"message":err.message});
        }
       
      })
})
  ```

### C. Balance Inquiry

  ```nodejs
  const BalanceInquiryRequestDto = require('doku-nodejs-library/_models/balanceInquiryRequestDTO');
  
  app.post("/balance-inquiry", async (req,res)=>{
      let request = new BalanceInquiryRequestDto();
      request.additionalInfo = req.body.additionalInfo
      let ipAddress = req.headers['x-ip-address'];
      let authCode = req.body['authCode'];
      await snap.doBalanceInquiry(request,authCode,ipAddress).then((response)=>{
        res.status(200).send(response);
      }).catch((err)=>{
        if(err.response?.data){
          res.status(err.response.status).send(err.response.data);
        }else{
          res.status(500).send({"message":err.message});
        }
       
      })
})
  ```

## 4. Error Handling and Troubleshooting

The SDK throws exceptions for various error conditions. Always wrap your API calls in try-catch blocks:
 ```nodejs
  await snap.createVa(createVaRequestDto).then(va=>{
    res.status(200).send(va);
  }).catch(err=>{
      if(err.response){
          res.status(400).send(err.response.data)
      }else{
        res.status(400).send({
          responseCode:"400",
          responseMessage:err.message
        })
      }
    
  })
 ```

This section provides common errors and solutions:

| Error Code | Description                           | Solution                                     |
|------------|---------------------------------------|----------------------------------------------|
| `4010000`  | Unauthorized                          | Check if Client ID and Secret Key are valid. |
| `4012400`  | Virtual Account Not Found             | Verify the virtual account number provided.  |
| `2002400`  | Successful                            | Transaction completed successfully.          |


