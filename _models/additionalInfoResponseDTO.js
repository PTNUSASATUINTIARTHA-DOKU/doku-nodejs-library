class AdditionalInfoResponseDTO {
    constructor(data) {
       if(data.channel){
        this.channel = data.channel;
       }
        this.howToPayPage = data.howToPayPage;
        this.howToPayApi = data.howToPayApi;
    }

    toObject() {
        return {
            channel: this.channel,
            howToPayPage: this.howToPayPage,
            howToPayApi: this.howToPayApi
        };
    }
}
module.exports = AdditionalInfoResponseDTO;