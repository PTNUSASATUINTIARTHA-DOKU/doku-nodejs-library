class AdditionalInfo {
    constructor(channel, virtualAccountConfig) {
        this.channel = channel;
        this.virtualAccountConfig = virtualAccountConfig;
    }

    toObject() {
        return {
            channel: this.channel,
            virtualAccountConfig: this.virtualAccountConfig.toObject()
        };
    }
}

module.exports = AdditionalInfo;
