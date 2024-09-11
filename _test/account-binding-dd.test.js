const Snap = require("../_modules/snap");
const TokenController = require('../_controllers/tokenController');
const DirectDebitController = require('../_controllers/directDebitController');

jest.mock('../_controllers/tokenController');
jest.mock('../_controllers/directDebitController');

describe('Snap class - doAccountBinding', () => {
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

    test('should call DirectDebitController.doAccountBinding with correct parameters when token is valid (Positive Test)', async () => {
        TokenController.prototype.isTokenInvalid.mockReturnValue(false);
        const accountBindingRequestDto = { someField: 'value' };
        const expectedResponse = { status: 'SUCCESS' };
        DirectDebitController.prototype.doAccountBinding.mockResolvedValue(expectedResponse);

        const result = await snap.doAccountBinding(accountBindingRequestDto, ipAddress);
        expect(DirectDebitController.prototype.doAccountBinding).toHaveBeenCalledWith(
            accountBindingRequestDto,
            snap.privateKey,
            snap.clientId,
            snap.tokenB2B,
            ipAddress,
            snap.secretKey,
            snap.isProduction
        );
        expect(result).toEqual(expectedResponse);
    });

    test('should throw error when DirectDebitController.doAccountBinding fails (Negative Test)', async () => {
        TokenController.prototype.isTokenInvalid.mockReturnValue(false);
        const accountBindingRequestDto = { someField: 'value' };
        DirectDebitController.prototype.doAccountBinding.mockRejectedValue(new Error('Failed to bind account'));

        await expect(snap.doAccountBinding(accountBindingRequestDto, ipAddress)).rejects.toThrow('Failed to bind account');
        expect(DirectDebitController.prototype.doAccountBinding).toHaveBeenCalled();
    });
});
