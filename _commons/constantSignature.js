const Constant = {
    CLIENT_ID: 'Client-Id',
    COLON_SYMBOL: ':',
    NEW_LINE: '\n',
    REQUEST_ID: 'Request-Id',
    REQUEST_TIMESTAMP: 'Request-Timestamp',
    REQUEST_TARGET: 'Request-Target',
    DIGEST: 'Digest',
    EQUALS_SIGN_SYMBOL: '='
  };
Object.freeze(Constant); // This ensures the enum values are immutable

module.exports = Constant;