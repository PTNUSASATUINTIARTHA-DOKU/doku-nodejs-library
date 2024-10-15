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
            console.log("string to sign: "+signatureElements)
            const sign = crypto.createSign('RSA-SHA256');
            sign.update(signatureElements, 'utf8');
            sign.end();
            const signatureResult = sign.sign(privateKey, 'base64');
            console.log("signature get token: "+signatureResult)
            return signatureResult;
        } catch (error) {
            throw error;
        }
    },
    minifyString(str) {
        return str
            .replace(/\s+/g, '')  // Menghapus semua spasi, tab, dan baris baru
            .replace(/(\r\n|\n|\r)/gm, '');  // Menghapus karakter new line
    },
    processRequestBody(requestBody) {
        try {
            // Minify request body (misalnya JSON atau string)
            const minifiedBody = this.minifyString(JSON.stringify(requestBody));
    
            // Hitung hash SHA-256
            const hash = crypto.createHash('sha256')
                               .update(minifiedBody)
                               .digest('hex');
    
            // Convert ke lowercase
            return hash.toLowerCase();
        } catch (error) {
            console.error("Error:", error);
            throw error;
        }
    },
    generateSignatureV2(privateKey, clientID, xTimestamp,request) {
        try {
            let httpMethod = "POST"
            let endPointUrl = request.path;
            let signatureElements = httpMethod +":"+ endPointUrl +":"+this.processRequestBody(request.body) + ":" + xTimestamp
            // const signatureElements = `${clientID}|${xTimestamp}`;
            const sign = crypto.createSign('RSA-SHA256');
            sign.update(signatureElements);
            sign.end();
            const signatureResult = sign.sign(privateKey, 'base64');
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
    compareSignatures(requestSignature,dokuPublicKey,clientID,xTimestamp){
       
        const data = Buffer.from(`${clientID}|${xTimestamp}`);
        try {
            const isVerified = crypto.verify(
                'RSA-SHA256',
                Buffer.from(data),
                {
                    key: dokuPublicKey,
                    padding: crypto.constants.RSA_PKCS1_PADDING,
                },
                Buffer.from(requestSignature, 'base64')
            );
            return isVerified
        } catch (error) {
            console.error('Error during verification:', error);
            return false
            
        }
    },
    compareSignaturesV2(requestSignature,newSignature){
        try {
            if(requestSignature.toLowerCase() == newSignature.toLowerCase()){
                return true
            }else{
                return false
            }
        } catch (error) {
            console.error('Error during verification:', error);
        }
    },
    compareSignaturesSymmetric(requestSignature,newSignature){
        try {
            if(requestSignature.toLowerCase() == newSignature.toLowerCase()){
                return true
            }else{
                return false
            }
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
            console.log(err.message)
            return false
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
    generateSignatureSymmetric(stringToSign, clientSecret) {
        const hmac = crypto.createHmac('sha512', clientSecret);
        hmac.update(stringToSign);
        return hmac.digest('base64');
    },
    generateExpectedSignature(clearMessage,clientSecret) {
        const decodedKey = Buffer.from(clientSecret, 'utf-8');
        const hmac = crypto.createHmac('sha512', decodedKey);
        hmac.update(clearMessage);
        const hmacSha512DigestBytes = hmac.digest();
        const expectedSignature = hmacSha512DigestBytes.toString('base64');
        return expectedSignature;
    },
    generateSymmetricSignature(httpMethod,endPointUrl,tokenB2B,requestBody,timestamp,secretKey) {
        const body = requestBody;
        console.log(body)
        var minifyJsonObject = JSON.stringify(body);
        console.log("stringify "+minifyJsonObject)
        const sha256Hash = crypto.createHash('sha256').update(minifyJsonObject).digest('hex');
        const hexEncodedLowerCase = sha256Hash.toLowerCase();
        const data = `${httpMethod}:${endPointUrl}:${tokenB2B}:${hexEncodedLowerCase}:${timestamp}`;
        console.log('stringtosign: ' + data);
        var signatureHash = this.generateExpectedSignature(data,secretKey);
        console.log('signature: ' + signatureHash);
        return signatureHash
    },
    createTokenB2b2cRequestDto(authCode){
        const request = new TokenB2b2cRequestDto();
        request.grantType = "authorization_code";
        request.authCode = authCode
        return request;
    },
    async hitTokenB2b2cApi(tokenB2b2cRequestDto, timestamp, signature, clientId, isProduction){
        const base_url_api = config.getBaseUrl(isProduction) + config.ACCESS_TOKEN_B2B2C;
        let header = {
            "X-CLIENT-KEY": clientId,
            "X-TIMESTAMP": timestamp,
            "X-SIGNATURE": signature
        };
       
        return await new Promise((resolve, reject) => {
            axios({
                method: 'post',
                url: base_url_api,
                headers: header,
                data: tokenB2b2cRequestDto
            })
            .then((res) => {
                resolve(res.data);
            })
            .catch((err) => {
                reject(err);
            });
        });
    }
};