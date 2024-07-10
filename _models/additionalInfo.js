const OriginDto = require("./originDTO");

class AdditionalInfo {
    constructor(channel, virtualAccountConfig) {
        this.channel = channel;
        this.virtualAccountConfig = virtualAccountConfig;
        this.origin = new OriginDto()
    }

    toObject() {
        return {
            channel: this.channel,
            virtualAccountConfig: this.virtualAccountConfig.toObject(),
            origin:this.origin
        };
    }
}

module.exports = AdditionalInfo;
