class PaymentNotificationRequestBodyDto {
    constructor(partnerServiceId, customerNo, virtualAccountNo, virtualAccountName, trxId, paymentRequestId, paidAmount, virtualAccountEmail, virtualAccountPhone) {
        this.partnerServiceId = partnerServiceId;
        this.customerNo = customerNo;
        this.virtualAccountNo = virtualAccountNo;
        this.virtualAccountName = virtualAccountName;
        this.trxId = trxId;
        this.paymentRequestId = paymentRequestId;
        this.paidAmount = paidAmount;
        this.virtualAccountEmail = virtualAccountEmail;
        this.virtualAccountPhone = virtualAccountPhone;
    }

    toObject() {
        return {
            partnerServiceId: this.partnerServiceId,
            customerNo: this.customerNo,
            virtualAccountNo: this.virtualAccountNo,
            virtualAccountName: this.virtualAccountName,
            trxId: this.trxId,
            paymentRequestId: this.paymentRequestId,
            paidAmount: this.paidAmount.toObject(),
            virtualAccountEmail: this.virtualAccountEmail,
            virtualAccountPhone: this.virtualAccountPhone
        };
    }
}
module.exports = PaymentNotificationRequestBodyDto;