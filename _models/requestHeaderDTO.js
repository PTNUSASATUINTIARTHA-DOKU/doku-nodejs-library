class RequestHeaderDTO {
    constructor(xTimestamp, xSignature, xPartnerId, xExternalId, channelId, authorization) {
      this.xTimestamp = xTimestamp;
      this.xSignature = xSignature;
      this.xPartnerId = xPartnerId;
      this.xExternalId = xExternalId;
      this.channelId = channelId;
      this.authorization = authorization;
    }

    toObject() {
      return {
        xTimestamp: this.xTimestamp,
        xSignature: this.xSignature,
        xPartnerId: this.xPartnerId,
        xExternalId: this.xExternalId,
        channelId: this.channelId,
        authorization: this.authorization
      };
    }
  }
  
  module.exports = RequestHeaderDTO;
  