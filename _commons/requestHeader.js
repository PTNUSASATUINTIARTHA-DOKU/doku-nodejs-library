"use strict";

module.exports = {
    generateRequestHeader: function ({
        timestamp, signature, clientId, externalId, ipAddress, channelId, tokenB2B, tokenB2b2c, deviceId, endPointUrl, requestDto
    }) {
        const header = {
            xTimestamp: timestamp,
            xSignature: signature,
            xPartnerId: clientId,
            xExternalId: externalId,
            authorization: tokenB2B,
        };

        if (ipAddress) {
            if(requestDto.additionalInfo.channel === "DIRECT_DEBIT_ALLO_SNAP"){
                header.xIpAddres = ipAddress;
            }
        }

        if (channelId) {
            header.xChannelId = channelId;
        }

        if (tokenB2b2c) {
            header.xAuthorizationCustomer = tokenB2b2c;
        }

        // Menambahkan deviceId jika sesuai kondisi
        if (deviceId && requestDto?.additionalInfo?.channel &&
            (requestDto.additionalInfo.channel === "EMONEY_SHOPEE_PAY_SNAP" ||
                requestDto.additionalInfo.channel === "EMONEY_DANA_SNAP") &&
            (endPointUrl === "DIRECT_DEBIT_PAYMENT_URL" || endPointUrl === "DIRECT_DEBIT_REFUND_URL")) {
            header.xDeviceId = deviceId;
        }

        return header;
    }
};
