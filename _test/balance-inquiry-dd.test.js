const Snap = require("../_modules/snap");
const TokenController = require('../_controllers/tokenController');
const DirectDebitController = require('../_controllers/directDebitController');

jest.mock('../_controllers/tokenController');
jest.mock('../_controllers/directDebitController');

describe('Snap class - doBalanceInquiry', () => {
    let snap;
    let privateKey = 'private_key';
    let clientId = 'client_id';
    let secretKey = 'secret_key';
    let ipAddress = '127.0.0.1';
    let authCode = 'auth_code';
    let tokenB2B = 'tokenB2B';
    let tokenB2b2c = 'tokenB2b2c';
    beforeEach(() => {
        snap = new Snap({
            isProduction: false,
            privateKey: privateKey,
            clientID: clientId,
            secretKey: secretKey
        });
        snap.tokenB2B = tokenB2B;
        snap.tokenB2b2c = tokenB2b2c;
    });

    test('should call DirectDebitController.doBalanceInquiry with correct parameters when token is valid (Positive Test)', async () => {
        TokenController.prototype.isTokenInvalid.mockReturnValue(false);
        const balanceInquiryRequestDto = { validateBalanceInquiryRequestDto: jest.fn() };
        const expectedResponse = { status: 'SUCCESS' };
        DirectDebitController.prototype.doBalanceInquiry.mockResolvedValue(expectedResponse);

        const result = await snap.doBalanceInquiry(balanceInquiryRequestDto, authCode, ipAddress);
        expect(balanceInquiryRequestDto.validateBalanceInquiryRequestDto).toHaveBeenCalled();
        expect(DirectDebitController.prototype.doBalanceInquiry).toHaveBeenCalledWith(
            balanceInquiryRequestDto,
            snap.privateKey,
            snap.clientId,
            ipAddress,
            snap.tokenB2b2c,
            snap.tokenB2B,
            snap.secretKey,
            snap.isProduction
        );
        expect(result).toEqual(expectedResponse);
    });

    test('should throw error when DirectDebitController.doBalanceInquiry fails (Negative Test)', async () => {
        TokenController.prototype.isTokenInvalid.mockReturnValue(false);
        const balanceInquiryRequestDto = { validateBalanceInquiryRequestDto: jest.fn() };
        DirectDebitController.prototype.doBalanceInquiry.mockRejectedValue(new Error('Failed to inquire balance'));

        await expect(snap.doBalanceInquiry(balanceInquiryRequestDto, authCode, ipAddress)).rejects.toThrow('Failed to inquire balance');
        expect(balanceInquiryRequestDto.validateBalanceInquiryRequestDto).toHaveBeenCalled();
    });
});