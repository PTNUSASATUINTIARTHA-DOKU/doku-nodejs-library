const Snap = require("../_modules/snap");
const TokenController = require('../_controllers/tokenController');
const DirectDebitController = require('../_controllers/directDebitController');
const CheckStatusDirectDebitRequestDTO = require('../_models/checkStatusDirectDebitRequestDTO');
const {CheckStatusResponseDTO} = require('../_models/checkStatusDirectDebitResponseDTO');

jest.mock('../_controllers/tokenController');
jest.mock('../_controllers/directDebitController');

describe("Check Status - Validation request", () => {
    test('Should successfully validate check status Direct Debit when all params are valid', () => {
        const validDto = new CheckStatusDirectDebitRequestDTO(
            "2020102900000000000001",
            "2020102977770000000009",
            "30443786930722726463280097920912",
            "55",
            "2020-12-21T14:56:11+07:00",
            { value: "12345678.00", currency: "IDR" }, 
            "23489182303312",
            "23489182303312",
            "183908924912387",
            { deviceId: "12345679237", channel: "DIRECT_DEBIT_ALLO_SNAP" } 
        );

        expect(() => validDto.validateCheckStatusRequestDto()).not.toThrow();
    });

    test('Should throw an error when serviceCode is null', () => {
        const invalidDto = new CheckStatusDirectDebitRequestDTO(
            "2020102900000000000001",
            "2020102977770000000009",
            "30443786930722726463280097920912",
            null, 
            "2020-12-21T14:56:11+07:00",
            { value: "12345678.00", currency: "IDR" }, 
            "23489182303312",
            "23489182303312",
            "183908924912387",
            { deviceId: "12345679237", channel: "DIRECT_DEBIT_ALLO_SNAP" } 
        );

        expect(() => invalidDto.validateCheckStatusRequestDto()).toThrow("Validation failed: \"serviceCode\" must be a string");
    });
});

describe("Check Status - Process", () => {
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
        const expectedResponse = new CheckStatusResponseDTO(
            "2005500",
        );
    
        controller.doCheckStatus = jest.fn().mockResolvedValue(expectedResponse);
        return controller;
    };
    

    const createCheckStatusRequestDto = () => {
        return new CheckStatusDirectDebitRequestDTO({
            OriginalPartnerReferenceNo: "2020102900000000000001",
            OriginalReferenceNo: "2020102977770000000009",
            OriginalExternalId: "30443786930722726463280097920912",
            ServiceCode: "55",
            TransactionDate: "2020-12-21T14:56:11+07:00",
            Amount: { value: "12345678.00", currency: "IDR" },
            MerchantId: "23489182303312",
            SubMerchantId: "23489182303312",
            ExternalStoreId: "183908924912387",
            AdditionalInfo: {
                DeviceId: "2020-12-21T14:56:11+07:00",
                Channel: "DIRECT_DEBIT_ALLO_SNAP",
            },
        });
    };

    beforeEach(() => {
        snap = new Snap({
            tokenB2B: 'validToken',
            tokenB2b2c: 'validTokenB2B2C',
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

    test('should successfully perform check status when all params are valid', async () => {
        const checkStatusRequestDto = createCheckStatusRequestDto();
        checkStatusRequestDto.validateCheckStatusRequestDto = jest.fn();

        const response = await snap.doCheckStatus(checkStatusRequestDto);

        expect(checkStatusRequestDto.validateCheckStatusRequestDto).toHaveBeenCalled();
        expect(mockTokenController.isTokenInvalid).toHaveBeenCalledWith(snap.tokenB2B, snap.tokenExpiresIn, snap.tokenGeneratedTimestamp);

        expect(mockDirectDebitController.doCheckStatus).toHaveBeenCalledWith(
            checkStatusRequestDto,
            snap.clientId,
            snap.tokenB2B,
            snap.secretKey,
            snap.isProduction
        );

        expect(response).toEqual(expect.objectContaining({
            responseCode: '2005500',
        }));
    });
});

