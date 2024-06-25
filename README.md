
Welcome to the DOKU Node.js library! This powerful tool simplifies access to the DOKU API for your server-side JavaScript applications.

## Documentation
For detailed information, visit the full [DOKU API Docs](https://developers.doku.com/accept-payment/direct-api/snap).

## Requirements
- Node 18 or higher.

## Installation
Get started by installing the library:
```sh
npm install doku
```

## Usage
This section will guide you through setting up the DOKU Node.js library, creating payment requests, and handling notifications. Let’s get started!

### 1. Configuration
To configure the library, you'll need your account's Client ID, Secret Key, and Private Key. Here’s how:

1. **Client ID and Secret Key:** Retrieve these from the Integration menu in your [DOKU Dashboard](https://dashboard.doku.com/bo/login).
2. **Private Key:** Generate your Private Key following DOKU’s guide and insert the corresponding Public Key into the same menu.

> [!info]
> Your private key will not be transmitted or shared with DOKU. It remains on your server and is only used to sign the requests you send to DOKU.

```js
function initializeSnap() {
  snap = new doku.Snap({
    isProduction: false,
    clientId: 'your_client_id_here'
    secretKey: 'your_secret_key_here'
    privateKey: 'your_private_key_here',
  });
}
```

### 2. Payment Flow
This section guides you through the steps to process payments using the DOKU Node.js library. You'll learn how to create a payment request and call the payment function.
#### a. Virtual Account
DOKU offers three ways to use a virtual account: DOKU-Generated Payment Code (DGPC), Merchant-Generated Payment Code (MGPC), and Direct Inquiry Payment Code (DIPC). You can find the full details [here](https://developers.doku.com/accept-payment/direct-api/snap/integration-guide/virtual-account).

> [!Important!]
>Each transaction can use only one feature at a time, but you can use multiple features across different transactions.

##### DGPC and MGPC
###### createVaRequestDto Function
Create the request object to generate a VA number. Specify the acquirer in the request object. This function is applicable for DGPC and MGPC.

```js
let createVaRequestDto = new CreateVARequestDto();

createVaRequestDto.partnerServiceId = "999999";
createVaRequestDto.customerNo = "0000000";
createVaRequestDto.virtualAccountNo = "9999990000000000";

createVaRequestDto.virtualAccountName = "Sukhito Tanawal";
createVaRequestDto.virtualAccountEmail = "sukhito.tanawal@gmail.com";
createVaRequestDto.virtualAccountPhone = "082191358706";
createVaRequestDto.trxId = "TRX-0001";

let totalAmount = new TotalAmount();
totalAmount.value = "12500.00";
totalAmount.currency = "IDR";
createVaRequestDto.totalAmount = totalAmount;

let virtualAccountConfig = new VirtualAccountConfig();
virtualAccountConfig.reusableStatus = false;

let additionalInfo = new AdditionalInfo("VIRTUAL_ACCOUNT_BANK_CIMB", virtualAccountConfig);
additionalInfo.channel = "VIRTUAL_ACCOUNT_BANK_CIMB";
additionalInfo.virtualAccountConfig = virtualAccountConfig;
createVaRequestDto.additionalInfo = additionalInfo;
createVaRequestDto.virtualAccountTrxType = "1";
createVaRequestDto.expiredDate = "2024-06-22T09:54:04+07:00";

```

###### createVa Function
Call the `createVa` function to request the paycode from DOKU. You’ll receive the paycode and payment instructions to display to your customers. This function is applicable for DGPC and MGPC.

```js
await snap.createVa(createVaRequestDto).then(createVaResponseDto => {
    // You can get your payment code from variable createVaResponseDto
});
```

##### DIPC
###### #coming-soon inquiryResponse Function
If you use the DIPC feature, you can generate your own paycode and allow your customers to pay without direct communication with DOKU. After customers initiate the payment via the acquirer's channel, DOKU sends an inquiry request to you for validation. This function is applicable for DIPC.

> [!Important!]
>Before sending the inquiry, DOKU sends a token request. Use the `generateToken` function found in the Handling Payment Notification section.

### #coming-soon 3. Handling Payment Notification
After your customers make a payment, you’ll receive a notification from DOKU to update the payment status on your end. DOKU first sends a token request (as with DIPC), then uses that token to send the payment notification.
##### validateSignatureAndGenerateToken function
Generate the response to DOKU, including the required token, by calling this function.

##### validateTokenAndGenerateNotificationReponse function
Deserialize the raw notification data into a structured object using a Data Transfer Object (DTO). This allows you to update the order status, notify customers, or perform other necessary actions based on the notification details.

##### generateNotificationResponse function
DOKU requires a response to the notification. Use this function to serialize the response data to match DOKU’s format.

### #coming-soon 4. Additional Features
Need to use our functions independently? No problem! Here’s how:
#### - v1 to SNAP converter
If you're one of our earliest users, you might still use our v1 APIs. In order to simplify your re-integration process to DOKU's SNAP API specification, DOKU provides you with a helper tools to directly convert v1 APIs to SNAP APIs specification
##### a. convertRequestV1
Convert DOKU's inquiry and notification from SNAP format (JSON) to v1 format (XML). Feed the inquiry and notification directly to your app without manually mapping parameters or converting file formats.
##### b. convertResponseV1
Convert your inquiry response to DOKU from v1 format (XML) to SNAP format (JSON). Our library handles response code mapping, allowing you to directly use the converted response and send it to DOKU.