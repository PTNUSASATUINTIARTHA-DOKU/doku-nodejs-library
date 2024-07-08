const CheckStatusResponsePaymentFlagReason = require('./checkStatusResponsePaymentFlagReasonDTO');
const TotalAmount = require('./totalAmount');
const CheckStatusResponseAdditionalInfo = require('./checkStatusResponseAdditionalInfoDTO');

class CheckStatusVirtualAccountData {
  constructor({
    paymentFlagReason,
    partnerServiceId,
    customerNo,
    virtualAccountNo,
    inquiryRequestId,
    paymentRequestId,
    virtualAccountNumber,
    paidAmount,
    billAmount,
    additionalInfo
  }) {
    this.paymentFlagReason = new CheckStatusResponsePaymentFlagReason(paymentFlagReason);
    this.partnerServiceId = partnerServiceId;
    this.customerNo = customerNo;
    this.virtualAccountNo = virtualAccountNo;
    this.inquiryRequestId = inquiryRequestId;
    this.paymentRequestId = paymentRequestId;
    this.virtualAccountNumber = virtualAccountNumber;
    this.paidAmount = new TotalAmount(paidAmount);
    this.billAmount = new TotalAmount(billAmount);;
    this.additionalInfo = new CheckStatusResponseAdditionalInfo(additionalInfo);
  }
}

module.exports = CheckStatusVirtualAccountData;
