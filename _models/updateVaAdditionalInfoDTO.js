class UpdateVaAdditionalInfoDto {
    constructor(channel, virtualAccountConfig) {
        this.channel = channel; 
        this.virtualAccountConfig = virtualAccountConfig;
    }

    toObject() {
        return {
            channel: this.channel,
            virtualAccountConfig:this.virtualAccountConfig
        };
    }
}

module.exports = UpdateVaAdditionalInfoDto;
