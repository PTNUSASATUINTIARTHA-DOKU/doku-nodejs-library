class NotificationVirtualAccountData {
    constructor(partnerServiceId, customerNo, virtualAccountNo, virtualAccountName, paymentRequestId) {
        this.partnerServiceId = partnerServiceId;
        this.customerNo = customerNo;
        this.virtualAccountNo = virtualAccountNo;
        this.virtualAccountName = virtualAccountName;
        this.paymentRequestId = paymentRequestId;
    }

    toObject() {
        return {
            partnerServiceId: this.partnerServiceId,
            customerNo: this.customerNo,
            virtualAccountNo: this.virtualAccountNo,
            virtualAccountName: this.virtualAccountName,
            paymentRequestId: this.paymentRequestId
        };
    }
}