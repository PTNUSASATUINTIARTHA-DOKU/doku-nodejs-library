const Snap = require("../_modules/snap");
const TokenController = require('../_controllers/tokenController');
const DirectDebitController = require('../_controllers/directDebitController');
const AccountBindingRequestDto = require('../_models/accountBindingRequestDTO');
const AccountBindingResponseDto = require('../_models/accountBindingResponseDTO');

jest.mock('../_controllers/tokenController');
jest.mock('../_controllers/directDebitController');


describe('Account Binding - Validate request', () => {
    let validData;

    beforeEach(() => {
        validData = new AccountBindingRequestDto('081234567890', {
            channel: 'DIRECT_DEBIT_CIMB_SNAP',
            custIdMerchant: '12345',
            customerName: 'John Doe',
            email: 'john.doe@example.com',
            idCard: '1234567890',
            country: 'Indonesia',
            address: 'Jl. Merdeka No. 1',
            dateOfBirth: '1990-01-01',
            successRegistrationUrl: 'https://example.com/success',
            failedRegistrationUrl: 'https://example.com/failed',
            deviceModel: 'iPhone 12',
            osType: 'iOS',
            channelId: 'app'
        });
    });

    test('should validate successfully with valid data', () => {
        expect(() => validData.validateAccountBindingRequestDto()).not.toThrow();
    });

    test('should throw error when phoneNo is missing', () => {
        validData.phoneNo = ""; 
        expect(() => validData.validateAccountBindingRequestDto()).toThrow("Validation failed: \"phoneNo\" is not allowed to be empty");
    });

    test('should throw error when phoneNo is less than 9', () => {
        validData.phoneNo = "1212"; 
        expect(() => validData.validateAccountBindingRequestDto()).toThrow("Validation failed: \"phoneNo\" length must be at least 9 characters long");
    });

    test('should throw error when phoneNo is more than 16', () => {
        validData.phoneNo = "081234567890123456"; 
        expect(() => validData.validateAccountBindingRequestDto()).toThrow("Validation failed: \"phoneNo\" length must be less than or equal to 16 characters long");
    });

    test('should throw error when additionalInfo.channel is missing', () => {
        validData.additionalInfo.channel = ""; 
        expect(() => validData.validateAccountBindingRequestDto()).toThrow("Validation failed: \"additionalInfo.channel\" is not allowed to be empty");
    });

    test('should throw error when additionalInfo.custIdMerchant is missing', () => {
        validData.additionalInfo.custIdMerchant = ''; 
        expect(() => validData.validateAccountBindingRequestDto()).toThrow('Validation failed: "additionalInfo.custIdMerchant" is not allowed to be empty');
    });

    test('should throw error when additionalInfo.custIdMerchant is more than 64', () => {
        validData.additionalInfo.custIdMerchant = 'merchant1234567890123456789012345678901234567890123456789012345678901234'; 
        expect(() => validData.validateAccountBindingRequestDto()).toThrow('Validation failed: \"additionalInfo.custIdMerchant\" length must be less than or equal to 64 characters long');
    });

    test('should throw error when additionalInfo.successRegistrationUrl is missing', () => {
        validData.additionalInfo.successRegistrationUrl = ''; 
        expect(() => validData.validateAccountBindingRequestDto()).toThrow('Validation failed: \"additionalInfo.successRegistrationUrl\" is not allowed to be empty');
    });

    test('should throw error when additionalInfo.failedRegistrationUrl is missing', () => {
        validData.additionalInfo.failedRegistrationUrl = ''; 
        expect(() => validData.validateAccountBindingRequestDto()).toThrow('Validation failed: \"additionalInfo.failedRegistrationUrl\" is not allowed to be empty');
    });
    

});


describe('Account Binding - Process', () => {
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
        controller.doAccountBinding = jest.fn().mockResolvedValue(new AccountBindingResponseDto(
            '200', 'Success', 'REF123', 'https://example.com/redirect', {}
        ));
        return controller;
    };

    const createAccountBindingRequestDto = () => new AccountBindingRequestDto('081234567890', {
        channel: 'DIRECT_DEBIT_CIMB_SNAP',
        custIdMerchant: '1234567890123412345678901234',
        customerName: 'John Doe',
        email: 'john.doe@example.com',
        idCard: '1234567890',
        country: 'Indonesia',
        address: 'Jl. Merdeka No. 1',
        dateOfBirth: '1990-01-01',
        successRegistrationUrl: 'https://example.com/success',
        failedRegistrationUrl: 'https://example.com/failed',
        deviceModel: 'iPhone 12',
        osType: 'iOS',
        channelId: 'app'
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

    test('should successfully bind account', async () => {
        const accountBindingRequestDto = createAccountBindingRequestDto();
        accountBindingRequestDto.additionalInfo = {
            channel: 'DIRECT_DEBIT_ALLO_SNAP',
        };
        accountBindingRequestDto.validateAccountBindingRequestDto = jest.fn();
        
        const ipAddress = '192.168.0.1';
        const deviceId = 'deviceId';
        
        const response = await snap.doAccountBinding(accountBindingRequestDto, ipAddress, deviceId);
        
        expect(accountBindingRequestDto.validateAccountBindingRequestDto).toHaveBeenCalled();
        
        expect(mockTokenController.isTokenInvalid).toHaveBeenCalledWith(snap.tokenB2B, snap.tokenExpiresIn, snap.tokenGeneratedTimestamp);
        
        expect(mockDirectDebitController.doAccountBinding).toHaveBeenCalledWith(
            accountBindingRequestDto, 
            snap.privateKey, 
            snap.clientId, 
            snap.tokenB2B, 
            ipAddress, 
            deviceId, 
            snap.secretKey, 
            snap.isProduction
        );
    
        expect(response).toEqual(expect.objectContaining({
            responseCode: '200',
            responseMessage: 'Success',
            referenceNo: 'REF123',
            redirectUrl: 'https://example.com/redirect',
        }));
    });
});