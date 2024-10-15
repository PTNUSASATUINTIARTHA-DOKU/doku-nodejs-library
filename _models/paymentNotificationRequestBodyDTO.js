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
    validateSimulator(){
        if (this.trxId.startsWith("1110")) {
            return {
                "responseCode": "2002500",
                "responseMessage": "success"
            };
        }else if(this.trxId.startsWith("1111")){
            return {
                "responseCode": "4042512",
                "responseMessage": "Bill not found"
            };
        }else if(this.trxId.startsWith("1112")){
            return {
                "responseCode": "4042513",
                "responseMessage": "Invalid Amount"
            };
        }
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