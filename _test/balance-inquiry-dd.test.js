const Snap = require("../_modules/snap");
const TokenController = require('../_controllers/tokenController');
const DirectDebitController = require('../_controllers/directDebitController');
const BalanceInquiryRequestDto = require('../_models/balanceInquiryRequestDTO');
const BalanceInquiryResponseDto = require('../_models/balanceInquiryResponseDTO');

jest.mock('../_controllers/tokenController');
jest.mock('../_controllers/directDebitController');

describe('Balance Inquiry - Validation request', () => {
    let validAdditionalInfo;

    beforeEach(() => {
        validAdditionalInfo = {
            channel: 'DIRECT_DEBIT_BRI_SNAP'
        };
    });

    test('should successfully hit Balance Inquiry when all params are valid', () => {
        const dto = new BalanceInquiryRequestDto(validAdditionalInfo);
        expect(() => dto.validateBalanceInquiryRequestDto()).not.toThrow();
    });

    test('should throw an error when additionalInfo.channel is null', () => {
        const invalidAdditionalInfo = {
            channel: null
        };
        const dto = new BalanceInquiryRequestDto(invalidAdditionalInfo);

        expect(() => dto.validateBalanceInquiryRequestDto()).toThrow('Validation failed: "additionalInfo.channel" must be a string');
    });

    test('should throw an error when additionalInfo.channel is invalid (exceeds max length)', () => {
        const invalidAdditionalInfo = {
            channel: 'A'.repeat(31) 
        };
        const dto = new BalanceInquiryRequestDto(invalidAdditionalInfo);

        expect(() => dto.validateBalanceInquiryRequestDto()).toThrow('Validation failed: "additionalInfo.channel" length must be less than or equal to 30 characters long');
    });

    test('should throw an error when additionalInfo.channel is empty', () => {
        const invalidAdditionalInfo = {
            channel: ''
        };
        const dto = new BalanceInquiryRequestDto(invalidAdditionalInfo);

        expect(() => dto.validateBalanceInquiryRequestDto()).toThrow('Validation failed: "additionalInfo.channel" is not allowed to be empty');
    });
});

describe("Balance Inquiry - Process", () => {
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
        const expectedResponse = new BalanceInquiryResponseDto( 
            '2000100',
            'Balance Inquiry Successful',
            [{ accountNumber: '1234567890', balance: 1000000 }] 
        );
        controller.doBalanceInquiry = jest.fn().mockResolvedValue(expectedResponse);
        return controller;
    };

    const createBalanceInquiryRequestDto = () => {
        return new BalanceInquiryRequestDto({
            channel: 'DIRECT_DEBIT_BRI_SNAP'
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

    test('should successfully perform balance inquiry when all params are valid', async () => {
        const balanceInquiryRequestDto = createBalanceInquiryRequestDto();
        balanceInquiryRequestDto.validateBalanceInquiryRequestDto = jest.fn();
    
        const response = await snap.doBalanceInquiry(balanceInquiryRequestDto, 'authCode123', '192.168.1.1');
    
        expect(balanceInquiryRequestDto.validateBalanceInquiryRequestDto).toHaveBeenCalled();
        expect(mockTokenController.isTokenInvalid).toHaveBeenCalledWith(snap.tokenB2B, snap.tokenExpiresIn, snap.tokenGeneratedTimestamp);
        
        expect(mockDirectDebitController.doBalanceInquiry).toHaveBeenCalledWith(
            balanceInquiryRequestDto,
            snap.privateKey,         
            snap.clientId,          
            '192.168.1.1',         
            snap.tokenB2b2c,  
            snap.tokenB2B,        
            snap.secretKey,        
            snap.isProduction       
        );
    
        expect(response).toEqual(expect.objectContaining({
            responseCode: '2000100',
            responseMessage: 'Balance Inquiry Successful',
            accountInfos: expect.any(Array), 
        }));
        expect(response.accountInfos).toEqual([{ accountNumber: '1234567890', balance: 1000000 }]); 
    });
    
    
});