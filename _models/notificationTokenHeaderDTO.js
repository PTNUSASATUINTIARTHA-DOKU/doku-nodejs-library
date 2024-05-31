class NotificationTokenHeaderDto {
    constructor(XClientKey, XTimeStamp) {
        this.XClientKey = XClientKey;
        this.XTimeStamp = XTimeStamp;
    }

    toObject() {
        return {
            XClientKey: this.XClientKey,
            XTimeStamp: this.XTimeStamp
        };
    }
}

module.exports = NotificationTokenHeaderDto;
