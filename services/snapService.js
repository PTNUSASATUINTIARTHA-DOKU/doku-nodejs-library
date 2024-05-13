"use strict"
const { default: axios } = require('axios');
const KJUR = require('jsrsasign');
const { generateTokenB2BBody } = require('../models/tokenModel');
const TokenB2BRequestDTO = require('../models/tokenB2BRequestDTO');

module.exports = {
    hexToBase64(hexString) {
        const buffer = Buffer.from(hexString, 'hex');
        return buffer.toString('base64');
    },
    generateSignature(privateKey,clientID,xTimestamp) {
        try {
            const signatureElements = `${clientID}|${xTimestamp}`;
            const kjurSignature = new KJUR.crypto.Signature({"alg": "SHA256withRSA"});
            kjurSignature.init(privateKey);
            kjurSignature.updateString(signatureElements);
            const signatureResult = this.hexToBase64(kjurSignature.sign());
            return signatureResult; 
        } catch(error) {
            throw error;
        }
    },
    generateTimestamp() {
        const now = new Date();
        const offset = now.getTimezoneOffset(); // Get timezone offset in minutes
        const offsetHours = Math.abs(offset / 60); // Convert offset to hours
        const offsetMinutes = Math.abs(offset % 60); // Get remaining minutes
        
        const sign = offset >= 0 ? '-' : '+'; // Determine sign of offset
        const pad = (num) => String(num).padStart(2, '0'); // Padding function
        
        return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}${sign}${pad(offsetHours)}:${pad(offsetMinutes)}`;
    }, 
    generateTokenB2B(apiConfig,xTimestamp) {
        const privateKey = apiConfig.get().privateKey;
        const clientID =apiConfig.get().clientID;
        const base_url_api = apiConfig.getCoreApiBaseUrl()
       
        return new Promise((resolve, reject) => {
            const signatureResult= this.generateSignature(privateKey,clientID,xTimestamp);
            const tokenRequest = new TokenB2BRequestDTO(clientID,xTimestamp,signatureResult);
            axios({
                method: 'post',
                url: `${base_url_api}/authorization/v1/access-token/b2b`,
                headers: {
                    "X-CLIENT-KEY": tokenRequest.clientID,
                    "X-TIMESTAMP": tokenRequest.xTimestamp,
                    "X-SIGNATURE": tokenRequest.signatureResult
                },
                data: generateTokenB2BBody
            })
            .then((res) => {
                resolve(res.data);
            })
            .catch((err) => {
                reject(err);
            });
        });
    },
    createVA(apiConfig,xTimestamp,params) {
        const privateKey = apiConfig.get().privateKey;
        const clientID =apiConfig.get().clientID;
        const base_url_api = apiConfig.getCoreApiBaseUrl()
        return this.generateTokenB2B(apiConfig,xTimestamp)
            .then((token) => { // Hasil generateToken() bisa diakses di sini
                const signatureResult= this.generateSignature(privateKey,clientID,xTimestamp);
                return axios({
                    method: 'post',
                    url: `${base_url_api}/virtual-accounts/bi-snap-va/v1/transfer-va/create-va`,
                    headers: {
                        "X-PARTNER-ID": clientID,
                        "X-TIMESTAMP": xTimestamp,
                        "X-SIGNATURE": signatureResult,
                        "Authorization":token.tokenType+" "+token.accessToken,
                        "X-EXTERNAL-ID":Date.now(),
                        "CHANNEL-ID":"VA011"
                    },
                    data:params
                })
        })
    }
};