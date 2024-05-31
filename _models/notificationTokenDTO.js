const NotificationTokenHeaderDto = require('./notificationTokenHeaderDTO')
const NotificationTokenBodyDto = require('./notificationTokenHeaderDTO');

class NotificationTokenDto {
    constructor(header, body) {
        if (!(header instanceof NotificationTokenHeaderDto)) {
            throw new Error('header must be an instance of NotificationTokenHeaderDto');
        }
        if (!(body instanceof NotificationTokenBodyDto)) {
            throw new Error('body must be an instance of NotificationTokenBodyDto');
        }
        this.header = header;
        this.body = body;
    }

    validate() {
        this.header.validate();
        this.body.validate();
    }

    toObject() {
        return {
            header: this.header.toObject(),
            body: this.body.toObject()
        };
    }
}

module.exports = NotificationTokenDto;
