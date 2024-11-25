class OriginDto {
    constructor() {
      this.product = "SDK";
      this.source = "NODE JS";
      this.sourceVersion = "1.0.45";
      this.system = "doku-nodejs-library";
      this.apiFormat = "SNAP";
    }
  
    toObject() {
      return {
        product: this.product,
        source: this.source,
        sourceVersion: this.sourceVersion,
        system: this.system,
        apiFormat: this.apiFormat
      };
    }
  
  }
  
  module.exports = OriginDto;