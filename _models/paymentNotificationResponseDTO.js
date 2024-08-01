const PaymentNotificationResponseBodyDto = require("./paymentNotificationRequestBodyDTO");
const PaymentNotificationResponseHeaderDto = require("./paymentNotificationResponseHeaderDTO");

class PaymentNotificationResponseDTO {
    constructor(header, body) {
        this.header = new PaymentNotificationResponseHeaderDto(header);
        this.body = new PaymentNotificationResponseBodyDto(body);
    }

    toObject() {
        return {
            header: this.header.toObject(),
            body: this.body.toObject()
        };
    }
}
module.exports = PaymentNotificationResponseDTO;