"use strict"
module.exports = {
    generateNotificationResponse(PaymentNotificationRequestBodyDto){
        return {
            responseCode:2002700,
            responseMessage:"success",
            partnerServiceId:PaymentNotificationRequestBodyDto.partnerServiceId,
            customerNo :PaymentNotificationRequestBodyDto.customerNo,
            virtualAccountNo : PaymentNotificationRequestBodyDto.virtualAccoutNo,
            virtualAccountName :PaymentNotificationRequestBodyDto.virtualAccountName,
            paymentRequestId : PaymentNotificationRequestBodyDto.paymentRequestId,
            additionalInfo:PaymentNotificationRequestBodyDto.additionalInfo
        }
    },
    generateInvalidTokenResponse(PaymentNotificationRequestBodyDto){
        return {
            responseCode:4012701,
            responseMessage:"invalid Token ( B2B)",
            partnerServiceId:PaymentNotificationRequestBodyDto.partnerServiceId,
            customerNo :PaymentNotificationRequestBodyDto.customerNo,
            virtualAccountNo : PaymentNotificationRequestBodyDto.virtualAccoutNo,
            virtualAccountName :PaymentNotificationRequestBodyDto.virtualAccountName,
            paymentRequestId : PaymentNotificationRequestBodyDto.paymentRequestId
        }
    }
    
}