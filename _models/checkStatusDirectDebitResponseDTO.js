class RefundHistoryDTO {
    constructor(refundNo, partnerReferenceNo, refundAmount, refundStatus, refundDate, reason) {
        this.refundNo = refundNo;
        this.partnerReferenceNo = partnerReferenceNo;
        this.refundAmount = refundAmount;
        this.refundStatus = refundStatus;
        this.refundDate = refundDate;
        this.reason = reason;
    }
}

class CheckStatusAdditionalInfoResponseDTO {
    constructor(deviceId, channel, acquirer) {
        this.deviceId = deviceId;
        this.channel = channel;
        this.acquirer = acquirer; 
    }
}

class CheckStatusResponseDTO {
    constructor(
        responseCode,
        responseMessage,
        originalPartnerReferenceNo,
        originalReferenceNo,
        approvalCode,
        originalExternalId,
        serviceCode,
        latestTransactionStatus,
        transactionStatusDesc,
        originalResponseCode,
        originalResponseMessage,
        sessionId,
        requestID,
        refundHistory = [], 
        transAmount,
        feeAmount,
        paidTime,
        additionalInfo
    ) {
        this.responseCode = responseCode;
        this.responseMessage = responseMessage;
        this.originalPartnerReferenceNo = originalPartnerReferenceNo;
        this.originalReferenceNo = originalReferenceNo;
        this.approvalCode = approvalCode;
        this.originalExternalId = originalExternalId;
        this.serviceCode = serviceCode;
        this.latestTransactionStatus = latestTransactionStatus;
        this.transactionStatusDesc = transactionStatusDesc;
        this.originalResponseCode = originalResponseCode;
        this.originalResponseMessage = originalResponseMessage;
        this.sessionId = sessionId;
        this.requestID = requestID;
        this.refundHistory = new RefundHistoryDTO(refundHistory); 
        this.transAmount = transAmount;
        this.feeAmount = feeAmount;
        this.paidTime = paidTime;
        this.additionalInfo = new CheckStatusAdditionalInfoResponseDTO(additionalInfo);
    }
}

module.exports = {
    CheckStatusResponseDTO,
    CheckStatusAdditionalInfoResponseDTO,
    RefundHistoryDTO,
};
