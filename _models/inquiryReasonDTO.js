class InquiryReasonDto{
    constructor(data){
        this.english = data.english;
        this.indonesia = data.indonesia;
    }
    toObject(){
        return{
            english:this.english,
            indonesia:this.indonesia
        }
    }
}
module.exports = InquiryReasonDto;