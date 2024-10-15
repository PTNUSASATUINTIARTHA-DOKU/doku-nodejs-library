const CheckStatusResponsePaymentFlagReason = require('./checkStatusResponsePaymentFlagReasonDTO');
const TotalAmount = require('./totalAmount');

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
    billDetails
  }) {
    this.paymentFlagReason = new CheckStatusResponsePaymentFlagReason(paymentFlagReason);
    this.partnerServiceId = partnerServiceId;
    this.customerNo = customerNo;
    this.virtualAccountNo = virtualAccountNo;
    this.inquiryRequestId = inquiryRequestId;
    this.paymentRequestId = paymentRequestId;
    this.virtualAccountNumber = virtualAccountNumber;
    this.paidAmount = new TotalAmount(paidAmount);
    this.billDetails =billDetails;
  }
}

module.exports = CheckStatusVirtualAccountData;
