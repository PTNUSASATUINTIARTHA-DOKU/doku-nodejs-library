"use strict"

const NotificationService = require("../_services/notificationService");

class NotificationController{
    generateNotificationResponse(PaymentNotificationRequestBodyDto){
        return NotificationService.generateNotificationResponse(PaymentNotificationRequestBodyDto)
    }
    generateInvalidTokenResponse(PaymentNotificationRequestBodyDto){
        return NotificationService.generateInvalidTokenResponse(PaymentNotificationRequestBodyDto)
    }

}
  
module.exports = NotificationController;