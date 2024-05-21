const VIRTUAL_ACCOUNT_CHANNELS = {
    VIRTUAL_ACCOUNT_BCA: 'VIRTUAL_ACCOUNT_BCA',
    VIRTUAL_ACCOUNT_BANK_MANDIRI: 'VIRTUAL_ACCOUNT_BANK_MANDIRI',
    VIRTUAL_ACCOUNT_BANK_SYARIAH_MANDIRI: 'VIRTUAL_ACCOUNT_BANK_SYARIAH_MANDIRI',
    VIRTUAL_ACCOUNT_BRI: 'VIRTUAL_ACCOUNT_BRI',
    VIRTUAL_ACCOUNT_BNI: 'VIRTUAL_ACCOUNT_BNI',
    VIRTUAL_ACCOUNT_DOKU: 'VIRTUAL_ACCOUNT_DOKU',
    VIRTUAL_ACCOUNT_PERMATA: 'VIRTUAL_ACCOUNT_PERMATA',
    VIRTUAL_ACCOUNT_CIMB: 'VIRTUAL_ACCOUNT_CIMB',
    VIRTUAL_ACCOUNT_DANAMON: 'VIRTUAL_ACCOUNT_DANAMON',
};

Object.freeze(VIRTUAL_ACCOUNT_CHANNELS); // This ensures the enum values are immutable

module.exports = VIRTUAL_ACCOUNT_CHANNELS;
