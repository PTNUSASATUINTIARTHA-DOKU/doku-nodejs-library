"use strict"
const { default: axios } = require('axios');
const KJUR = require('jsrsasign');
const config = require('../_commons/config');
const jwt = require('jsonwebtoken');
const NotificationTokenDto = require('../_models/notificationTokenDTO');
const NotificationTokenBodyDto = require('../_models/NotificationTokenBodytDto');
const NotificationTokenHeaderDto = require('../_models/notificationTokenHeaderDTO');

module.exports = {
    hexToBase64(hexString) {
        const buffer = Buffer.from(hexString, 'hex');
        return buffer.toString('base64');
    },
    generateToken(expiredIn, issuer, privateKey, clientId) {
       const expiration = Math.floor(Date.now() / 1000) + expiredIn;
       const payload = {
            exp: expiration,
            issuer: issuer,
            clientId:clientId
        };
        const token = jwt.sign(payload, privateKey, { algorithm: 'RS256' });
        return token;
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
    compareSignatures(requestSignature,newSignature){
        if(requestSignature === newSignature){
            return true
        }else{
            return false
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
        const expirationTime = tokenGeneratedTimestamp + tokenExpiresIn;
        if(expirationTime <  Date.now()){
            return true
        }else{
            return false
        }
        
    },
    generateNotificationTokenDto(token,timestamp,clientId,expiresIn){
        let header = new NotificationTokenHeaderDto(clientId,timestamp)
        let body = new NotificationTokenBodyDto("2007300","Successful",token,"Bearer",expiresIn,"")
        let response = new NotificationTokenDto(header,body);
        return response
    },
    generateInvalidSignature(timestamp){
        let header = new NotificationTokenHeaderDto(null,timestamp)
        let body = new NotificationTokenBodyDto("4017300","Unauthorized.Invalid Signature",null,null,null,null)
        let response = new NotificationTokenDto(header,body);
        return response
    },
    validateTokenB2B(requestTokenB2B, publicKey){
        try {
            const claims = jwt.verify(requestTokenB2B, publicKey);
            return claims
        } catch (err) {
            console.error('Invalid token', err);
        }
    }
};