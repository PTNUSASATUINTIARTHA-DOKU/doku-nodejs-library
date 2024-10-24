const Snap = require("../_modules/snap");
const TokenController = require('../_controllers/tokenController');
const DirectDebitController = require('../_controllers/directDebitController');
const AccountUnbindingRequestDto = require('../_models/accountUnbindingRequestDTO');
const AccountUnbindingResponseDto = require('../_models/accountUnbindingResponseDTO');


jest.mock('../_controllers/tokenController');
jest.mock('../_controllers/directDebitController');


describe('Account Unbinding - Validate request', () => {
    let validData;

    beforeEach(() => {
        validData = new AccountUnbindingRequestDto(
            "eyJhbGciOiJSUzI1NiJ9.eyJleHAiOjE3Mjk4Mjg4MzYsImlzcyI6IkRPS1UiLCJjbGllbnRJZCI6IkJSTi0wMjA4LTE3MjcyMzU4NDU1MDciLCJhY2NvdW50SWQiOiJiNTExNmIzZDNkZTY1ZTE3MjUzYzIzNGEwM2YzMjI3YyJ9.SKWOZLsQeiGXNKnRVxZb4WBHAWFoN2RroeJ81PrSwH8dVUhmF3VgGjyn7xlRHInqerYC2O-5O_vit8L0u4kVfomh_VYUHbOknp-FX1FoHiyXzp5hF7IbXqaUZnwbKIpQJYPEvOE2_7WA3m-7INQOi9d-kjpg5vXZjn-Z6A04Zj4Le7JGO6BJvBoCrUNw7Bl2-zUEHyBQOtYuyQrW0bsN2G9J89X8zNgpO6gRgn6EMMTpaSnqm-tQgY2carDDGqTFPgjf9enbcljwrmRARSHLuHBsAin9HrhaDBzqvVnUi4X9rRYgestSsxnYrv6I5plws44ORtYV5oGEG0kkKdIjqg",
            {
                channel: "DIRECT_DEBIT_CIMB_SNAP"
            }
        );
    });

    test('should validate successfully with valid data', () => {
        expect(() => validData.validateAccountUnbindingRequestDto()).not.toThrow();
    });

    test('should throw error when tokenId is missing (invalid tokenId)', () => {
        validData.tokenId = ""; 
        expect(() => validData.validateAccountUnbindingRequestDto()).toThrow("Validation failed: \"tokenId\" is not allowed to be empty");
    });

    test('should throw error when additionalInfo.channel is missing', () => {
        validData.additionalInfo.channel = ""; 
        expect(() => validData.validateAccountUnbindingRequestDto()).toThrow("Validation failed: \"additionalInfo.channel\" is not allowed to be empty");
    });
});


describe('Account Unbinding - Process', () => {
    let snap;
    let mockTokenController;
    let mockDirectDebitController;

    const createMockTokenController = () => {
        const controller = new TokenController();
        controller.isTokenInvalid = jest.fn().mockReturnValue(false);
        return controller;
    };

    const createMockDirectDebitController = () => {
        const controller = new DirectDebitController();
        controller.doAccountUnbinding = jest.fn().mockResolvedValue(new AccountUnbindingResponseDto(
            '200', 'Success', 'REF123'
        ));
        return controller;
    };

    const createAccountUnbindingRequestDto = () => new AccountUnbindingRequestDto('tokenId123', {
        channel: 'DIRECT_DEBIT_ALLO_SNAP'
    });

    beforeEach(() => {
        snap = new Snap({
            tokenB2B: 'validToken',
            tokenExpiresIn: 3600,
            tokenGeneratedTimestamp: Date.now(),
            privateKey: 'privateKey',
            clientId: 'clientId',
            secretKey: 'secretKey',
            isProduction: false,
        });

        mockTokenController = createMockTokenController();
        mockDirectDebitController = createMockDirectDebitController();

        TokenController.mockImplementation(() => mockTokenController);
        DirectDebitController.mockImplementation(() => mockDirectDebitController);
    });

    test('should successfully unbind account', async () => {
        const accountUnbindingRequestDto = createAccountUnbindingRequestDto();
        accountUnbindingRequestDto.validateAccountUnbindingRequestDto = jest.fn();

        const ipAddress = '192.168.0.1';

        const response = await snap.doAccountUnbinding(accountUnbindingRequestDto, ipAddress);

        expect(accountUnbindingRequestDto.validateAccountUnbindingRequestDto).toHaveBeenCalled();

        expect(mockTokenController.isTokenInvalid).toHaveBeenCalledWith(snap.tokenB2B, snap.tokenExpiresIn, snap.tokenGeneratedTimestamp);

        expect(mockDirectDebitController.doAccountUnbinding).toHaveBeenCalledWith(
            accountUnbindingRequestDto,
            snap.privateKey,
            snap.clientId,
            snap.tokenB2B,
            ipAddress,
            snap.secretKey,
            snap.isProduction
        );

        expect(response).toEqual(expect.objectContaining({
            responseCode: '200',
            responseMessage: 'Success',
            referenceNo: 'REF123'
        }));
    });
});
