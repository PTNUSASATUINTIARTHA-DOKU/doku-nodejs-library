const Snap = require("../_modules/snap");
const TokenController = require('../_controllers/tokenController');
const DirectDebitController = require('../_controllers/directDebitController');

jest.mock('../_controllers/tokenController');
jest.mock('../_controllers/directDebitController');

describe('Snap class - doAccountUnbinding', () => {
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

    test('should call DirectDebitController.doAccountUnbinding with correct parameters when token is valid (Positive Test)', async () => {
        TokenController.prototype.isTokenInvalid.mockReturnValue(false);
        const AccountUnbindingRequestDto = { validateAccountUnbindingRequestDto: jest.fn() };
        const expectedResponse = { status: 'SUCCESS' };
        DirectDebitController.prototype.doAccountUnbinding.mockResolvedValue(expectedResponse);

        const result = await snap.doAccountUnbinding(AccountUnbindingRequestDto, ipAddress);
        expect(AccountUnbindingRequestDto.validateAccountUnbindingRequestDto).toHaveBeenCalled();
        expect(DirectDebitController.prototype.doAccountUnbinding).toHaveBeenCalledWith(
            AccountUnbindingRequestDto,
            snap.privateKey,
            snap.clientId,
            snap.tokenB2B,
            ipAddress,
            snap.secretKey,
            snap.isProduction
        );
        expect(result).toEqual(expectedResponse);
    });

    test('should throw error when DirectDebitController.doAccountUnbinding fails (Negative Test)', async () => {
        TokenController.prototype.isTokenInvalid.mockReturnValue(false);
        const AccountUnbindingRequestDto = { validateAccountUnbindingRequestDto: jest.fn() };
        DirectDebitController.prototype.doAccountUnbinding.mockRejectedValue(new Error('Failed to unbind account'));

        await expect(snap.doAccountUnbinding(AccountUnbindingRequestDto, ipAddress)).rejects.toThrow('Failed to unbind account');
        expect(AccountUnbindingRequestDto.validateAccountUnbindingRequestDto).toHaveBeenCalled();
        expect(DirectDebitController.prototype.doAccountUnbinding).toHaveBeenCalled();
    });
});
