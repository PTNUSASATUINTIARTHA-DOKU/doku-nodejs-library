const Snap = require("../_modules/snap");
const TokenController = require('../_controllers/tokenController');
const DirectDebitController = require('../_controllers/directDebitController');
const CardRegistrationRequestDTO = require('../_models/cardRegistrationRequestDTO');
const { CardRegistrationResponseDTO } = require('../_models/cardRegistrationResponseDTO'); 

jest.mock('../_controllers/tokenController');
jest.mock('../_controllers/directDebitController');

describe('Card Registration - Validate request', () => {
    let cardData, custIdMerchant, phoneNo, additionalInfo;

    beforeEach(() => {
        cardData = {
            bankCardNo: '1234567890123456',
            bankCardType: 'Visa',
            expiryDate: '0526'  
        };
        custIdMerchant = 'CUST123456';
        phoneNo = '6281234567890';
        additionalInfo = {
            channel: 'DIRECT_DEBIT_BRI_SNAP',
            successRegistrationUrl: 'https://success.url',
            failedRegistrationUrl: 'https://fail.url',
            customerName: 'John Doe',
            email: 'john.doe@example.com',
            idCard: '1234567890123456',
            country: 'Indonesia',
            address: '123 Street Name, City, Country',
            dateOfBirth: '01011990'
        };
    });

    test('should validate successfully with valid data', () => {
        const dto = new CardRegistrationRequestDTO(
            cardData,
            custIdMerchant,
            phoneNo,
            additionalInfo
        );
        
        expect(() => dto.validateCardRegistrationRequestDto()).not.toThrow();
    });

    test('should throw an error when cardData is missing', () => {
        cardData = {};

        const dto = new CardRegistrationRequestDTO(
            cardData,
            custIdMerchant,
            phoneNo,
            additionalInfo
        );

        expect(() => dto.validateCardRegistrationRequestDto()).toThrow("Validation failed: \"cardData.bankCardNo\" is required, \"cardData.bankCardType\" is required, \"cardData.expiryDate\" is required");
    });

    test('should throw an error when custIdMerchant is missing', () => {
        custIdMerchant = '';

        const dto = new CardRegistrationRequestDTO(
            cardData,
            custIdMerchant,
            phoneNo,
            additionalInfo
        );

        expect(() => dto.validateCardRegistrationRequestDto()).toThrow("Validation failed: \"custIdMerchant\" is not allowed to be empty");
    });

    test('should throw an error when custIdMerchant is invalid', () => {
        custIdMerchant = '!@#InvalidID';

        const dto = new CardRegistrationRequestDTO(
            cardData,
            custIdMerchant,
            phoneNo,
            additionalInfo
        );

        expect(() => dto.validateCardRegistrationRequestDto()).toThrow('Validation failed: "custIdMerchant" must only contain alpha-numeric characters');
    });

    test('should throw an error when custIdMerchant length is more than 64 characters', () => {
        custIdMerchant = 'C'.repeat(65);

        const dto = new CardRegistrationRequestDTO(
            cardData,
            custIdMerchant, 
            phoneNo,
            additionalInfo
        );

        expect(() => dto.validateCardRegistrationRequestDto()).toThrow('Validation failed: "custIdMerchant" length must be less than or equal to 64 characters long');
    });

    test('should throw an error when additionalInfo.channel is missing required fields', () => {
        additionalInfo.channel = ""
        const dto = new CardRegistrationRequestDTO(
            cardData,
            custIdMerchant,
            phoneNo,
            additionalInfo
        );

        expect(() => dto.validateCardRegistrationRequestDto()).toThrow("Validation failed: \"additionalInfo.channel\" must be [DIRECT_DEBIT_BRI_SNAP], \"additionalInfo.channel\" is not allowed to be empty");
    });

    test('should throw an error when additionalInfo.successRegistrationUrl is missing required fields', () => {
        additionalInfo.successRegistrationUrl = ""
        const dto = new CardRegistrationRequestDTO(
            cardData,
            custIdMerchant,
            phoneNo,
            additionalInfo
        );

        expect(() => dto.validateCardRegistrationRequestDto()).toThrow("Validation failed: \"additionalInfo.successRegistrationUrl\" is not allowed to be empty");
    });

    test('should throw an error when additionalInfo.failedRegistrationUrl is missing required fields', () => {
        additionalInfo.failedRegistrationUrl = ""
        const dto = new CardRegistrationRequestDTO(
            cardData,
            custIdMerchant,
            phoneNo,
            additionalInfo
        );

        expect(() => dto.validateCardRegistrationRequestDto()).toThrow("Validation failed: \"additionalInfo.failedRegistrationUrl\" is not allowed to be empty");
    });

   
});

describe("Card Registration - Process", () => {
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
        const expectedResponse = new CardRegistrationResponseDTO('2000100', 'Successful', '560692500000', 'https://example.com/redirect', null);
        controller.doRegistrationCardBind =  jest.fn().mockResolvedValue(expectedResponse);
        return controller;
    };

    const createCardRegistrationRequestDto = () => new CardRegistrationRequestDTO({
        cardData: {
            bankCardNo: '4111111111111111', 
            bankCardType: '02', 
            expiryDate: '12/25' 
        },
        custIdMerchant: '1234567890123412345678901234', 
        phoneNo: '081234567890', 
        additionalInfo: {
            channel: 'DIRECT_DEBIT_BRI_SNAP', 
            successRegistrationUrl: 'https://example.com/success', 
            failedRegistrationUrl: 'https://example.com/failed', 
        }
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
    
    test('should successfully card registration', async () => {
        const cardRegistrationRequestDTO = createCardRegistrationRequestDto();
        cardRegistrationRequestDTO.validateCardRegistrationRequestDto = jest.fn();
        const response = await snap.doRegistrationCardBind(cardRegistrationRequestDTO);
        expect(cardRegistrationRequestDTO.validateCardRegistrationRequestDto).toHaveBeenCalled();
        expect(mockTokenController.isTokenInvalid).toHaveBeenCalledWith(snap.tokenB2B, snap.tokenExpiresIn, snap.tokenGeneratedTimestamp); 
        expect(mockDirectDebitController.doRegistrationCardBind).toHaveBeenCalledWith(cardRegistrationRequestDTO, snap.clientId, snap.tokenB2B, snap.secretKey, snap.isProduction);
        expect(response).toEqual(expect.objectContaining({
            responseCode: '2000100',
            responseMessage: 'Successful',
            referenceNo: '560692500000',
            redirectUrl: 'https://example.com/redirect',
        }));
    })

})
