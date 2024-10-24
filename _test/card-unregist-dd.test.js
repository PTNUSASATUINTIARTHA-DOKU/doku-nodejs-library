const Snap = require("../_modules/snap");
const TokenController = require('../_controllers/tokenController');
const DirectDebitController = require('../_controllers/directDebitController');
const CardUnRegistUnbindRequestDTO = require('../_models/cardUnregistUnbindRequestDTO');
const CardUnRegistUnbindResponseDTO = require('../_models/cardUnregistUnbindResponseDTO');

jest.mock('../_controllers/tokenController');
jest.mock('../_controllers/directDebitController');

describe('Card Unregistration - Validate request', () => {
  
    let validTokenId, validAdditionalInfo;
  
    beforeEach(() => {
      validTokenId = 'validTokenId123';
      validAdditionalInfo = {
        channel: 'DIRECT_DEBIT_BRI_SNAP'
      };
    });
  
    test('User successfully hit card unbinding when all params are valid', () => {
      const dto = new CardUnRegistUnbindRequestDTO(validTokenId, validAdditionalInfo);
  
      expect(() => dto.validateCardUnRegistRequestDTO()).not.toThrow();
    });
  
    test('should throw an error when tokenId is invalid (empty string)', () => {
      const invalidTokenId = '';
      const dto = new CardUnRegistUnbindRequestDTO(invalidTokenId, validAdditionalInfo);
  
      expect(() => dto.validateCardUnRegistRequestDTO()).toThrow('Validation failed: "tokenId" is not allowed to be empty');
    });
  
    test('should throw an error when tokenId exceeds max length', () => {
      const invalidTokenId = 'T'.repeat(2049); 
      const dto = new CardUnRegistUnbindRequestDTO(invalidTokenId, validAdditionalInfo);
  
      expect(() => dto.validateCardUnRegistRequestDTO()).toThrow('Validation failed: "tokenId" length must be less than or equal to 2048 characters long');
    });
  
    test('should throw an error when additionalInfo.channel is invalid', () => {
      const invalidAdditionalInfo = {
        channel: 'INVALID_CHANNEL'
      };
      const dto = new CardUnRegistUnbindRequestDTO(validTokenId, invalidAdditionalInfo);
  
      expect(() => dto.validateCardUnRegistRequestDTO()).toThrow('Validation failed: "additionalInfo.channel" must be [DIRECT_DEBIT_BRI_SNAP]');
    });
  
    test('should throw an error when additionalInfo.channel is an empty string', () => {
      const invalidAdditionalInfo = {
        channel: ''
      };
      const dto = new CardUnRegistUnbindRequestDTO(validTokenId, invalidAdditionalInfo);
  
      expect(() => dto.validateCardUnRegistRequestDTO()).toThrow("Validation failed: \"additionalInfo.channel\" must be [DIRECT_DEBIT_BRI_SNAP], \"additionalInfo.channel\" is not allowed to be empty");
    });
  });



describe("Card Unregistration - Process", () => {
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
        const expectedResponse = new CardUnRegistUnbindResponseDTO({
            responseCode: '2000100',
            responseMessage: 'Successful',
            referenceNo: '560692500000',
            redirectUrl: 'https://example.com/redirect',
        });
        controller.doUnRegistCardUnBind = jest.fn().mockResolvedValue(expectedResponse);
        return controller;
    };
    
    

    const createCardUnRegistUnbindRequestDto = () => {
        return new CardUnRegistUnbindRequestDTO(
            'validToken12345',
            {
                channel: 'DIRECT_DEBIT_BRI_SNAP' 
            }
        );
    };

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

    test('should successfully card unregistration', async () => {
        const cardUnregistrationRequestDTO = createCardUnRegistUnbindRequestDto();
        cardUnregistrationRequestDTO.validateCardUnRegistRequestDTO = jest.fn();
        const response = await snap.doUnRegistCardUnBind(cardUnregistrationRequestDTO);
        expect(cardUnregistrationRequestDTO.validateCardUnRegistRequestDTO).toHaveBeenCalled();
        expect(mockTokenController.isTokenInvalid).toHaveBeenCalledWith(snap.tokenB2B, snap.tokenExpiresIn, snap.tokenGeneratedTimestamp); 
        expect(mockDirectDebitController.doUnRegistCardUnBind).toHaveBeenCalledWith(cardUnregistrationRequestDTO, snap.clientId, snap.tokenB2B, snap.secretKey, snap.isProduction);
        expect(response).toEqual(expect.objectContaining({
            responseCode: '2000100',
            responseMessage: 'Successful',
            referenceNo: '560692500000',
            redirectUrl: 'https://example.com/redirect',
        }));
    })
    
})