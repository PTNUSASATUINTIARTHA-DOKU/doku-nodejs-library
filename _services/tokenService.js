"use strict"
const { default: axios } = require('axios');
const KJUR = require('jsrsasign');
const config = require('../_commons/config');

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
    createTokenB2BRequestDTO(signature, timestamp, clientId){
        return {
            signature: signature,
            timestamp: timestamp,
            clientId: clientId,
            grantType: 'client_credentials'
        }
    },
    async createTokenB2B(createTokenB2BRequestDTO,isProduction) {
        const base_url_api = config.getBaseUrl(isProduction) + config.ACCESS_TOKEN;

        let header = {
            "X-CLIENT-KEY": createTokenB2BRequestDTO.clientId,
            "X-TIMESTAMP": createTokenB2BRequestDTO.timestamp,
            "X-SIGNATURE": createTokenB2BRequestDTO.signature
        };

        let body = {
            grantType : createTokenB2BRequestDTO.grantType
        }

        return await new Promise((resolve, reject) => {
            axios({
                method: 'post',
                url: base_url_api,
                headers: header,
                data: body
            })
            .then((res) => {
                resolve(res.data);
            })
            .catch((err) => {
                reject(err);
            });
        });
    },
    isTokenEmpty(tokenB2B){
        return tokenB2B == null || tokenB2B == "";
    },
    isTokenExpired(tokenExpiresIn, tokenGeneratedTimestamp){
        //tokenGeneratedTimestamp + tokenExpiresIn (second) < Now()
        return false
    }
};