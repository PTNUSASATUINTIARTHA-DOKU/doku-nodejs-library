class CreateVARequestDto {

    constructor(partnerServiceId, customerNo, virtualAccountNo, virtualAccountName, virtualAccountEmail, virtualAccountPhone, trxId, totalAmount, additionalInfo, virtualAccountTrxType, expiredDate) {
        this.partnerServiceId = partnerServiceId;
        
        if(customerNo != ''){
            this.customerNo = customerNo;
        }

        if(virtualAccountNo != ''){
            this.virtualAccountNo = virtualAccountNo;
        }
        
        this.virtualAccountName = virtualAccountName;
        this.virtualAccountEmail = virtualAccountEmail;
        this.virtualAccountPhone = virtualAccountPhone;
        this.trxId = trxId;
        this.totalAmount = totalAmount;
        this.additionalInfo = additionalInfo;
        this.virtualAccountTrxType = virtualAccountTrxType;
        this.expiredDate = expiredDate;
    }

    validateVaRequestDto(){
        console.log('validating....');
    }

    toObject() {
        return {
            partnerServiceId: this.partnerServiceId,
            customerNo: this.customerNo,
            virtualAccountNo: this.virtualAccountNo,
            virtualAccountName: this.virtualAccountName,
            virtualAccountEmail: this.virtualAccountEmail,
            virtualAccountPhone: this.virtualAccountPhone,
            trxId: this.trxId,
            totalAmount: this.totalAmount.toObject(),
            additionalInfo: this.additionalInfo.toObject(),
            virtualAccountTrxType: this.virtualAccountTrxType,
            expiredDate: this.expiredDate
        };
    }

}

module.exports = CreateVARequestDto;