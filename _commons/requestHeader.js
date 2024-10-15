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
            authorization: tokenB2B
        };

        if (ipAddress) {
            header.xIpAddres = ipAddress;
        }


        if (channelId) {
            header.xChannelId = channelId;
        }

        if (tokenB2b2c) {
            header.xAuthorizationCustomer = tokenB2b2c;
        }

        // Menambahkan deviceId jika sesuai kondisi
        if (deviceId) {
            header.xDeviceId = deviceId;
        }

        return header;
    }
};
