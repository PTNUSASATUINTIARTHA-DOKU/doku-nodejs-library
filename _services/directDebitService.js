"use strict"

const { default: axios } = require("axios");
const crypto = require('crypto');

const AES = 'aes-128-cbc';
const AES_CBC_PADDING = 'aes-128-cbc';
const Config = require("../_commons/config");
const CardUnRegistUnbindResponseDto = require("../_models/cardUnregistUnbindResponseDTO");

module.exports = {
    async  doAccountUnBindingProcess(requestHeaderDto, accountUnbindingRequestDto, isProduction) {
        const base_url_api = Config.getBaseUrl(isProduction) + Config.DIRECT_DEBIT_ACCOUNT_UNBINDING_URL;

        let header= {
            "X-PARTNER-ID": requestHeaderDto.xPartnerId,
            "X-TIMESTAMP": requestHeaderDto.xTimestamp,
            "X-SIGNATURE": requestHeaderDto.xSignature,
            "Authorization":"Bearer " + requestHeaderDto.authorization,
            "X-EXTERNAL-ID": requestHeaderDto.xExternalId,
            "X-IP-ADDRESS":requestHeaderDto.xIpAddres
        }
        return await new Promise((resolve, reject) => {
            axios({
                method: 'post',
                url: base_url_api,
                headers: header,
                data:accountUnbindingRequestDto
            })
            .then((res) => {
                let response = res.data;
                resolve(response);
            })
            .catch((err) => {
                reject(err);
            });
        });
    },
    async  doAccountBindingProcess(requestHeaderDto, accountBindingRequestDto, isProduction) {
        const base_url_api = Config.getBaseUrl(isProduction) + Config.DIRECT_DEBIT_ACCOUNT_BINDING_URL;

        let header= {
            "X-PARTNER-ID": requestHeaderDto.xPartnerId,
            "X-TIMESTAMP": requestHeaderDto.xTimestamp,
            "X-SIGNATURE": requestHeaderDto.xSignature,
            "Authorization":"Bearer " + requestHeaderDto.authorization,
            "X-EXTERNAL-ID": requestHeaderDto.xExternalId,
            "X-IP-ADDRESS":requestHeaderDto.xIpAddres,
            "X-DEVICE-ID":requestHeaderDto.xDeviceId
        }
        return await new Promise((resolve, reject) => {
            axios({
                method: 'post',
                url: base_url_api,
                headers: header,
                data:accountBindingRequestDto
            })
            .then((res) => {
                let response = res.data;
                resolve(response);
            })
            .catch((err) => {
                reject(err);
            });
        });
    },
    async  doPaymentJumpAppProcess(requestHeaderDto, paymentJumpAppRequestDto, isProduction) {
        const base_url_api = Config.getBaseUrl(isProduction) + Config.DIRECT_DEBIT_PAYMENT_URL;

        let header= {
            "X-PARTNER-ID": requestHeaderDto.xPartnerId,
            "X-TIMESTAMP": requestHeaderDto.xTimestamp,
            "X-SIGNATURE": requestHeaderDto.xSignature,
            "Authorization":"Bearer " + requestHeaderDto.authorization,
            "X-EXTERNAL-ID": requestHeaderDto.xExternalId,
            "X-IP-ADDRESS":requestHeaderDto.xIpAddres,
            "X-DEVICE-ID":requestHeaderDto.deviceId,
            "X-CHANNEL-ID":requestHeaderDto.xChannelId
        }
        return await new Promise((resolve, reject) => {
            axios({
                method: 'post',
                url: base_url_api,
                headers: header,
                data:paymentJumpAppRequestDto
            })
            .then((res) => {
                let response = res.data;
                resolve(response);
            })
            .catch((err) => {
                reject(err);
            });
        });
    },
    async doBalanceInquiryProcess(header, balanceInquiryRequestDto, isProduction){
        const base_url_api = Config.getBaseUrl(isProduction) + Config.DIRECT_DEBIT_BALANCE_INQUIRY_URL;
        let headerObj= {
            "X-PARTNER-ID": header.xPartnerId,
            "X-TIMESTAMP": header.xTimestamp,
            "X-SIGNATURE": header.xSignature,
            "Authorization":"Bearer " + header.authorization,
            "X-EXTERNAL-ID": header.xExternalId,
            "X-IP-ADDRESS":header.xIpAddres,
            "Authorization-customer":header.xAuthorizationCustomer
        }
        return await new Promise((resolve, reject) => {
            axios({
                method: 'post',
                url: base_url_api,
                headers: headerObj,
                data:balanceInquiryRequestDto
            })
            .then((res) => {
                let response = res.data;
                resolve(response);
            })
            .catch((err) => {
                reject(err);
            });
        });
    },
    async doPaymentProcess(header,paymentRequestDto,isProduction){
        const base_url_api = Config.getBaseUrl(isProduction) + Config.DIRECT_DEBIT_PAYMENT_URL;
        let headerObj= {
            "X-PARTNER-ID": header.xPartnerId,
            "X-TIMESTAMP": header.xTimestamp,
            "X-SIGNATURE": header.xSignature,
            "Authorization":"Bearer " + header.authorization,
            "X-EXTERNAL-ID": header.xExternalId,
            "X-IP-ADDRESS":header.xIpAddres,
            "Authorization-customer":header.xAuthorizationCustomer
        }
        if (paymentRequestDto.additionalInfo.channel === "EMONEY_SHOPEE_PAY_SNAP" ||
            paymentRequestDto.additionalInfo.channel === "EMONEY_DANA_SNAP") {
            headerObj["X-DEVICE-ID"] = header.xDeviceId;
        }
        return await new Promise((resolve, reject) => {
            axios({
                method: 'post',
                url: base_url_api,
                headers: headerObj,
                data:paymentRequestDto
            })
            .then((res) => {
                let response = res.data;
                resolve(response);
            })
            .catch((err) => {
                reject(err);
            });
        });
    },
    async doRegistrationCardBindProcess(header,cardRegistrationRequestDto,isProduction){
        const base_url_api = Config.getBaseUrl(isProduction) + Config.DIRECT_DEBIT_CARD_BINDING_URL;
        let headerObj= {
            "X-PARTNER-ID": header.xPartnerId,
            "X-TIMESTAMP": header.xTimestamp,
            "X-SIGNATURE": header.xSignature,
            "Authorization":"Bearer " + header.authorization,
            "X-EXTERNAL-ID": header.xExternalId,
            "Content-Type": "application/json",
            "CHANNEL-ID":"DH"
        }
        return await new Promise((resolve, reject) => {
            axios({
                method: 'post',
                url: base_url_api,
                headers: headerObj,
                data:cardRegistrationRequestDto
            })
            .then((res) => {
                let response = res;
                resolve(response);
            })
            .catch((err) => {
                reject(err);
            });
        });
    },
    async doUnRegisterCardUnBindProcess(header,cardUnRegistUnbindRequestDTO,isProduction){
        const base_url_api = Config.getBaseUrl(isProduction) + Config.DIRECT_DEBIT_CARD_UNBINDING_URL;
        let headerObj= {
            "X-PARTNER-ID": header.xPartnerId,
            "X-TIMESTAMP": header.xTimestamp,
            "X-SIGNATURE": header.xSignature,
            "Authorization":"Bearer " + header.authorization,
            "X-EXTERNAL-ID": header.xExternalId,
            "Authorization":header.xAuthorization
        }
        return await new Promise((resolve, reject) => {
            axios({
                method: 'post',
                url: base_url_api,
                headers: headerObj,
                data:cardUnRegistUnbindRequestDTO
            })
            .then((res) => {
                let response = new CardUnRegistUnbindResponseDto(res.data)
                resolve(response);
            })
            .catch((err) => {
                reject(err);
            });
        });
    },
    async doRefundProcess(header, refundRequestDto, isProduction){
        const base_url_api = Config.getBaseUrl(isProduction) + Config.DIRECT_DEBIT_REFUND_URL;
        let headerObj= {
            "X-PARTNER-ID": header.xPartnerId,
            "X-TIMESTAMP": header.xTimestamp,
            "X-SIGNATURE": header.xSignature,
            "Authorization":"Bearer " + header.authorization,
            "X-EXTERNAL-ID": header.xExternalId,
            "X-IP-ADDRESS":header.xIpAddres,
            "Authorization-customer":header.xAuthorizationCustomer
        }
        if (refundRequestDto.additionalInfo.channel === "EMONEY_SHOPEE_PAY_SNAP" ||
            refundRequestDto.additionalInfo.channel === "EMONEY_DANA_SNAP") {
            headerObj["X-DEVICE-ID"] = header.xDeviceId;
        }
        return await new Promise((resolve, reject) => {
            axios({
                method: 'post',
                url: base_url_api,
                headers: headerObj,
                data:refundRequestDto
            })
            .then((res) => {
                let response = res.data;
                resolve(response);
            })
            .catch((err) => {
                reject(err);
            });
        });
    },
    async doCheckStatusProccess(header, checkStatusRequestDto, isProduction){
        const base_url_api = Config.getBaseUrl(isProduction) + Config.DIRECT_DEBIT_CHECK_STATUS_URL;
        let headerObj= {
            "X-PARTNER-ID": header.xPartnerId,
            "X-TIMESTAMP": header.xTimestamp,
            "X-SIGNATURE": header.xSignature,
            "Authorization":"Bearer " + header.authorization,
            "X-EXTERNAL-ID": header.xExternalId
        }
        return await new Promise((resolve, reject) => {
            axios({
                method: 'post',
                url: base_url_api,
                headers: headerObj,
                data:checkStatusRequestDto
            })
            .then((res) => {
                let response = res.data;
                resolve(response);
            })
            .catch((err) => {
                reject(err);
            });
        });
    },
    decryptCbc(encryptedData, secretKey) {
        try {
          secretKey = this.getSecretKey(secretKey);
          
          // Pisahkan ciphertext dan IV
          const [cipherText, ivString] = encryptedData.split('|');
          const iv = Buffer.from(ivString, 'base64');
          
          // Dekripsi
          const decipher = crypto.createDecipheriv(AES_CBC_PADDING, Buffer.from(secretKey, 'utf8'), iv);
          let decryptedText = decipher.update(cipherText, 'base64', 'utf8');
          decryptedText += decipher.final('utf8');
          
          return decryptedText;
        } catch (error) {
          // throw error or handle it
          console.error('Decryption error:', error);
        }
      },
    encryptCbc(input, secretKey) {
        try {
          secretKey = this.getSecretKey(secretKey);
          const iv = this.generateIv();
          const cipher = crypto.createCipheriv(AES_CBC_PADDING, Buffer.from(secretKey, 'utf8'), iv);
          let cipherText = cipher.update(input, 'utf8', 'base64');
          cipherText += cipher.final('base64');
          const ivString = iv.toString('base64');
          return `${cipherText}|${ivString}`;
        } catch (error) {
          // throw error or handle it
          console.error('Encryption error:', error);
        }
    },
    encryptData(data, encryptionKey) {
        // Hash key menjadi 32 byte (256 bit) menggunakan SHA-256
        const hashedKey = crypto.createHash('sha256').update(encryptionKey).digest();
      
        // Mengubah objek menjadi string JSON
        const dataString = JSON.stringify(data);
      
        // Membuat IV (Initialization Vector) 16 byte untuk CBC
        const iv = crypto.randomBytes(16);
      
        // Fungsi untuk mengenkripsi teks
        const cipher = crypto.createCipheriv('aes-256-cbc', hashedKey, iv);
        let encrypted = cipher.update(dataString, 'utf-8', 'hex');
        encrypted += cipher.final('hex');
      
        // Hasil yang akan dikembalikan, termasuk nilai terenkripsi dan IV
        return encrypted
      },
    getSecretKey(secretKey) {
        if (secretKey.length > 16) {
          return secretKey.substring(0, 16);
        } else if (secretKey.length < 16) {
          return secretKey.padEnd(16, '-');
        } else {
          return secretKey;
        }
    },
    generateIv() {
        return crypto.randomBytes(16); // 16-byte IV
    }
}