class VirtualAccountConfig {
    constructor(reusableStatus) {
        this.reusableStatus = reusableStatus;
    }

    toObject() {
        return {
            reusableStatus: this.reusableStatus
        };
    }
}

module.exports = VirtualAccountConfig;
