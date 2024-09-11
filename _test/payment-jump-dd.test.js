const Snap = require("../_modules/snap");
const TokenController = require('../_controllers/tokenController');
const DirectDebitController = require('../_controllers/directDebitController');

jest.mock('../_controllers/tokenController');
jest.mock('../_controllers/directDebitController');

describe('Snap class - doPaymentJumpApp', () => {
    let snap;
    let privateKey = 'private_key';
    let clientID = 'client_id';
    let secretKey = 'secret_key';
    let ipAddress = '127.0.0.1';

    beforeEach(() => {
        snap = new Snap({
            isProduction: false,
            privateKey: privateKey,
            clientID: clientID,
            secretKey: secretKey
        });
    });

    test('should call DirectDebitController.doPaymentJumpApp with correct parameters when token is valid (Positive Test)', async () => {
        TokenController.prototype.isTokenInvalid.mockReturnValue(false);
        const paymentJumpAppRequestDto = { validate: jest.fn() };
        const expectedResponse = { status: 'SUCCESS' };
        DirectDebitController.prototype.doPaymentJumpApp.mockResolvedValue(expectedResponse);

        const result = await snap.doPaymentJumpApp(paymentJumpAppRequestDto, ipAddress);
        expect(paymentJumpAppRequestDto.validate).toHaveBeenCalled();
        expect(DirectDebitController.prototype.doPaymentJumpApp).toHaveBeenCalledWith(
            paymentJumpAppRequestDto,
            snap.privateKey,
            snap.clientId,
            snap.tokenB2B,
            ipAddress,
            snap.secretKey,
            snap.isProduction
        );
        expect(result).toEqual(expectedResponse);
    });

    test('should throw error when DirectDebitController.doPaymentJumpApp fails (Negative Test)', async () => {
        TokenController.prototype.isTokenInvalid.mockReturnValue(false);
        const paymentJumpAppRequestDto = { validate: jest.fn() };
        DirectDebitController.prototype.doPaymentJumpApp.mockRejectedValue(new Error('Payment failed'));

        await expect(snap.doPaymentJumpApp(paymentJumpAppRequestDto, ipAddress)).rejects.toThrow('Payment failed');
        expect(paymentJumpAppRequestDto.validate).toHaveBeenCalled();
    });
});
