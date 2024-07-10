"use strict"
const { default: axios } = require('axios');
const KJUR = require('jsrsasign');
const config = require('../_commons/config');
const TokenService = require('./tokenService');
const CreateVAResponseDTO = require('../_models/createVaResponseDTO');
const UpdateVaResponseDto = require('../_models/updateVaResponseDTO');
const DeleteVaResponseDto = require('../_models/deleteVaResponseDTO');
const CheckStatusVaResponseDTO = require('../_models/checkStatusVaResponseDTO');

module.exports = {
    generateExternalId() {
        const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0;
            const v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
        const timestamp = Date.now();
        return `${uuid}-${timestamp}`;
    },
    generateRequestHeaderDto(channelId, privateKey, clientId, tokenB2B,timestamp){
    
        return {
            xTimestamp:timestamp,
            xSignature:TokenService.generateSignature(privateKey, clientId, timestamp),
            xPartnerId:clientId,
            xExternalId:this.generateExternalId(),
            channelId:channelId,
            authorization: tokenB2B
        }
    },
    createVaRequesHeaderDto(channelId, clientId, tokenB2B,timestamp,externalId,signature){
        return {
            xTimestamp:timestamp,
            xSignature:signature,
            xPartnerId:clientId,
            xExternalId:externalId,
            channelId:"SDK",
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
        // console.log(header)
        return await new Promise((resolve, reject) => {
            axios({
                method: 'post',
                url: base_url_api,
                headers: header,
                data:createVaRequestDto.toObject()
            })
            .then((res) => {
                console.log(res.data)
                let response = new CreateVAResponseDTO(res.data);
                resolve(response);
            })
            .catch((err) => {
                console.log(err)
                reject(err);
            });
        });
    },
    async doUpdateVa(requestHeaderDto, updateVaRequestDto,isProduction){
        // console.log(updateVaRequestDto)
        const base_url_api = config.getBaseUrl(isProduction) + config.PUT_UPDATE_VA;

        let header= {
            "X-PARTNER-ID": requestHeaderDto.xPartnerId,
            "X-TIMESTAMP": requestHeaderDto.xTimestamp,
            "X-SIGNATURE": requestHeaderDto.xSignature,
            "Authorization":"Bearer " + requestHeaderDto.authorization,
            "X-EXTERNAL-ID": requestHeaderDto.xExternalId,
            "CHANNEL-ID":requestHeaderDto.channelId
        }
        // console.log(header)
        return await new Promise((resolve, reject) => {
            axios({
                method: 'put',
                url: base_url_api,
                headers: header,
                data:updateVaRequestDto.toObject()
            })
            .then((res) => {
                console.log(res)
                let response = new UpdateVaResponseDto(res.data);
                resolve(response);
            })
            .catch((err) => {
                console.log(err)
                reject(err);
            });
        });
    },
    async doDeletePaymentCode(requestHeaderDto, deleteVaRequestDto,isProduction){
        //call api
        const base_url_api = config.getBaseUrl(isProduction) + config.DELETE_VA;
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
                method: 'delete',
                url: base_url_api,
                headers: header,
                data:deleteVaRequestDto.toObject()
            })
            .then((res) => {
                let response = new DeleteVaResponseDto(res.data);
                resolve(response);
            })
            .catch((err) => {
                reject(err);
            });
        });
    },
    async doCheckStatusVa(requestHeaderDto, checkVARequestDTO,isProduction){
        const base_url_api = config.getBaseUrl(isProduction) + config.CHECK_STATUS_VA;
        let header= {
            "X-PARTNER-ID": requestHeaderDto.xPartnerId,
            "X-TIMESTAMP": requestHeaderDto.xTimestamp,
            "X-SIGNATURE": requestHeaderDto.xSignature,
            "Authorization":"Bearer " + requestHeaderDto.authorization,
            "X-EXTERNAL-ID": requestHeaderDto.xExternalId,
            "CHANNEL-ID":requestHeaderDto.channelId
        }
        // console.log(header)
        return await new Promise((resolve, reject) => {
            axios({
                method: 'post',
                url: base_url_api,
                headers: header,
                data:checkVARequestDTO
            })
            .then((res) => {
                let response = new CheckStatusVaResponseDTO(res.data);
                resolve(response);
            })
            .catch((err) => {
                console.log(err)
                reject(err);
            });
        });
    }
    
};