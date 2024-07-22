class NotificationTokenHeaderDto {
    constructor(XClientKey, XTimeStamp) {
        this.XClientKey = XClientKey;
        this.XTimeStamp = XTimeStamp;
    }

    toObject() {
        return {
            'x-client-key': this.XClientKey,
            'x-timestamp': this.XTimeStamp
        };
    }
}

module.exports = NotificationTokenHeaderDto;
