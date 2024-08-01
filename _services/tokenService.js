"use strict"
const { default: axios } = require('axios');
const KJUR = require('jsrsasign');
const config = require('../_commons/config');
const jwt = require('jsonwebtoken');
const jsonminify = require('jsonminify');
const { createHmac } = require('crypto');
const NotificationTokenDto = require('../_models/notificationTokenDTO');
const NotificationTokenBodyDto = require('../_models/notificationTokenBodytDTO');
const NotificationTokenHeaderDto = require('../_models/notificationTokenHeaderDTO');
const crypto = require('crypto');
const CryptoJS = require('crypto-js');
const TokenB2BResponseDTO = require('../_models/tokenB2BResponseDTO');

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
    generateSignature(privateKey, clientID, xTimestamp) {
        try {
            const signatureElements = `${clientID}|${xTimestamp}`;
            console.log('Signature Elements:', signatureElements);
            const sign = crypto.createSign('RSA-SHA256');
            sign.update(signatureElements);
            sign.end();
            const signatureResult = sign.sign(privateKey, 'base64');
            console.log("Generated Signature: " + signatureResult);
            return signatureResult;
        } catch (error) {
            throw error;
        }
    },
    asymmetricSignature(privateKey,clientID,xTimestamp) {
        let stringToSign = `${clientID}|${xTimestamp}`
        const sign = crypto.createSign('RSA-SHA256');
        sign.update(stringToSign);
        sign.end();
        const signature = sign.sign(privateKey);
        console.log("AsymmetricXSignature: " + signature.toString('base64'));
        console.log("raw stringToSign: " + stringToSign);
    
        return signature.toString('base64');
    },
    compareSignatures(requestSignature,newSignature,publicKey,clientID,xTimestamp){
        console.log("compare signature")
        console.log("req signature: "+requestSignature)
        console.log("new signature: "+newSignature);
        const data = Buffer.from(`${clientID}|${xTimestamp}`);
        try {
            // Buat verifikasi
            const isVerified = crypto.verify(
                'RSA-SHA256',
                Buffer.from(data),
                {
                    key: publicKey,
                    padding: crypto.constants.RSA_PKCS1_PADDING,
                },
                Buffer.from(newSignature, 'base64')
            );

            if (isVerified) {
                console.log('Tanda tangan valid');
            } else {
                console.log('Tanda tangan tidak valid');
            }
            console.log(isVerified)
            return isVerified
        } catch (error) {
            console.error('Error during verification:', error);
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
                let response = new TokenB2BResponseDTO(res.data)
                resolve(response);
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
            throw new Error('Invalid token', err);
        }
    },
    minifyJSON(jsonString) {
        // This function removes all unnecessary whitespace from JSON string.
        const minifiedJson = jsonminify(JSON.stringify(jsonString));
    
        // Calculate the SHA-256 hash
        const hash = crypto.createHash('sha256').update(minifiedJson).digest('hex');
        
        return hash;
    },
    createSignature(rawData, secretKey){
        let signatureUtf8 = CryptoJS.enc.Utf8.parse(rawData);
        var secretUtf8 = CryptoJS.enc.Utf8.parse(secretKey);
        console.log("secretKey: " + secretKey);
        var signatureBytes = CryptoJS.HmacSHA512(signatureUtf8,secretUtf8);
        var requestSignatureBase64String = CryptoJS.enc.Base64.stringify(signatureBytes);
        return requestSignatureBase64String;
    },
    generateSymmetricSignature(symetricSignatureComponentDTO) {
        const body = symetricSignatureComponentDTO.requestBody;
        var minifyJsonObject = JSON.stringify(body, null, 0)
        console.log('minifyJsonObject: ' + minifyJsonObject);
        const bodySha256 = CryptoJS.enc.Base64.stringify(CryptoJS.SHA256(minifyJsonObject)).toLowerCase();
        console.log('bodySha256: ' + bodySha256);
        const data = `${symetricSignatureComponentDTO.httpMethod}:${symetricSignatureComponentDTO.endpointUrl}:${symetricSignatureComponentDTO.accessToken}:${bodySha256}:${symetricSignatureComponentDTO.timestamp}`;
        console.log('stringtosign: ' + data);
        
        // const minifiedJson = this.minifyJSON(symetricSignatureComponentDTO.requestBody);
        // const lowercaseHexHash = minifiedJson;
        // const stringToSign = `${symetricSignatureComponentDTO.httpMethod}:${symetricSignatureComponentDTO.endpointUrl}:${symetricSignatureComponentDTO.accessToken}:${lowercaseHexHash}:${symetricSignatureComponentDTO.timestamp}`;
        // var signature = this.createSignature(stringToSign,symetricSignatureComponentDTO.clientSecret);
        // return signature;
        var signatureHash = this.createSignature(data,symetricSignatureComponentDTO.clientSecret);
        console.log("Signature: " + signatureHash);
        return signatureHash
    }
};