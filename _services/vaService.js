"use strict"
const { default: axios } = require('axios');
const KJUR = require('jsrsasign');
const config = require('../_commons/config');
const TokenService = require('./tokenService');

module.exports = {
    generateExternalId() {
        // Generate UUID
        const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0;
            const v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    
        // Get current timestamp
        const timestamp = Date.now();
    
        // Combine UUID and timestamp
        return `${uuid}-${timestamp}`;
    },
    createVaRequestHeaderDto(createVaRequestDto, privateKey, clientId, tokenB2B){
        let timestamp = TokenService.generateTimestamp();
        return {
            xTimestamp:timestamp,
            xSignature:TokenService.generateSignature(privateKey,privateKey, clientId, timestamp),
            xPartnerId:clientId,
            xExternalId:this.generateExternalId(),
            channelId:createVaRequestDto.additionalInfo.channel,
            authorization: tokenB2B
        }
    },
    async createVa(requestHeaderDto, createVaRequestDto,isProduction) {
        const base_url_api = config.getBaseUrl(isProduction) + config.CREATE_VA;

        let header= {
            "X-PARTNER-ID": requestHeaderDto.xPartnerId,
            "X-TIMESTAMP": requestHeaderDto.xTimestamp,
            "X-SIGNATURE": requestHeaderDto.xSignature,
            "Authorization":"Bearer " + requestHeaderDto.authorization,
            "X-EXTERNAL-ID": requestHeaderDto.xExternalId,
            "CHANNEL-ID":requestHeaderDto.channelId
        }

        return await new Promise((resolve, reject) => {
            axios({
                method: 'post',
                url: base_url_api,
                headers: header,
                data:createVaRequestDto.toObject()
            })
            .then((res) => {
                resolve(res.data);
            })
            .catch((err) => {
                reject(err);
            });
        });
    },

    
};