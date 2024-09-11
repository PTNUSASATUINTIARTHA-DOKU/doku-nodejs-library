const Snap = require("../_modules/snap");
const TokenController = require('../_controllers/tokenController');
const DirectDebitController = require('../_controllers/directDebitController');
const { PaymentRequestDto, TotalAmountDto, PayOptionDetailsDto, PaymentAdditionalInfoRequestDto } = require('../_models/paymentRequestDirectDebitDTO');

jest.mock('../_controllers/tokenController');
jest.mock('../_controllers/directDebitController');

describe('Snap class - doPayment', () => {
    let snap;
    let paymentRequestDto;
    let authCode = 'validAuthCode';
    let privateKey = 'privateKey';
    let clientId = 'clientId';
    let secretKey = 'secretKey';
    let tokenB2B = 'tokenB2B';
    let tokenB2b2c = 'tokenB2b2c';
    let mockPaymentResponse;
    let deviceId = 'deviceId'

    beforeEach(() => {
        snap = new Snap({
            privateKey,
            clientID: clientId,
            secretKey,
            isProduction: false
        });

        snap.tokenB2B = tokenB2B;
        snap.tokenB2b2c = tokenB2b2c;

        // Setup DTO yang valid
        const totalAmount = new TotalAmountDto('1000', 'IDR');
        const payOptionDetails = [new PayOptionDetailsDto('bank_transfer', totalAmount, totalAmount)];
        const additionalInfo = new PaymentAdditionalInfoRequestDto('online', 'remarks', 'successUrl', 'failedUrl', [
            { name: 'item1', price: '1000', quantity: '1' }
        ]);

        paymentRequestDto = new PaymentRequestDto('ref123', totalAmount, payOptionDetails, additionalInfo);
        mockPaymentResponse = { status: 'success', message: 'Payment completed successfully' };
        TokenController.mockClear();
        DirectDebitController.mockClear();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('should successfully complete payment', async () => {
        TokenController.prototype.isTokenInvalid.mockReturnValue(false);
        const PaymentRequestDto = { validatePaymentRequestDto: jest.fn() };
        const expectedResponse = { status: 'SUCCESS' };
        DirectDebitController.prototype.doPayment.mockResolvedValue(expectedResponse);

        const result = await snap.doPayment(PaymentRequestDto, authCode,deviceId);
        expect(PaymentRequestDto.validatePaymentRequestDto).toHaveBeenCalled();
        expect(DirectDebitController.prototype.doPayment).toHaveBeenCalledWith(
            PaymentRequestDto,
            snap.privateKey,
            snap.clientId,
            snap.tokenB2B,
            snap.tokenB2b2c,
            snap.secretKey,
            snap.isProduction,
            deviceId
           
            
        );
        expect(result).toEqual(expectedResponse);
    });

    test('should fail when token is invalid', async () => {
        TokenController.prototype.isTokenInvalid.mockReturnValue(true); // Token is invalid
        const PaymentRequestDto = { validatePaymentRequestDto: jest.fn() };

        await expect(snap.doPayment(PaymentRequestDto, authCode, deviceId)).rejects.toThrow("Failed to get token: Cannot read properties of undefined (reading 'accessToken')");
        expect(TokenController.prototype.isTokenInvalid).toHaveBeenCalledWith(snap.tokenB2B,900,"");
    });
    test('should fail when DirectDebitController throws an error', async () => {
        TokenController.prototype.isTokenInvalid.mockReturnValue(false);
        const PaymentRequestDto = { validatePaymentRequestDto: jest.fn() };
        DirectDebitController.prototype.doPayment.mockRejectedValue(new Error('Payment service error'));

        await expect(snap.doPayment(PaymentRequestDto, authCode, deviceId)).rejects.toThrow('Payment service error');
        expect(DirectDebitController.prototype.doPayment).toHaveBeenCalledWith(
            PaymentRequestDto,
            snap.privateKey,
            snap.clientId,
            snap.tokenB2B,
            snap.tokenB2b2c,
            snap.secretKey,
            snap.isProduction,
            deviceId
        );
    });

});
