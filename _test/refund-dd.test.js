const Snap = require("../_modules/snap");
const TokenController = require('../_controllers/tokenController');
const DirectDebitController = require('../_controllers/directDebitController');
const RefundRequestDto = require('../_models/refundRequestDTO'); 
const {RefundResponseDTO, TotalAmount} = require('../_models/refundResponseDTO'); 

jest.mock('../_controllers/tokenController');
jest.mock('../_controllers/directDebitController');

describe('Refund - Validation request', () => {
  let validDto;

  beforeEach(() => {
    validDto = new RefundRequestDto(
      '123456789012', 
      { value: '100.00', currency: 'IDR' },
      '123456', 
      'ext-123', 
      'Test reason' 
    );
    validDto.additionalInfo = { channel: 'DIRECT_DEBIT_CIMB_SNAP' }; // valid additionalInfo
  });

  test('User successfully hit refund when all params are valid', () => {
    const { error } = validDto.validateRefundRequestDto();
    expect(error).toBeUndefined();
  });

  test('User failed to hit refund when additionalInfo.channel is null', () => {
    validDto.additionalInfo.channel = null;
    const { error } = validDto.validateRefundRequestDto();
    expect(error).toBeDefined();
    expect(error.details[0].message).toMatch("\"additionalInfo.channel\" must be a string");
  });

  test('User failed to hit refund when additionalInfo.channel is Invalid', () => {
    validDto.additionalInfo.channel = '';
    const { error } = validDto.validateRefundRequestDto();
    expect(error).toBeDefined();
    expect(error.details[0].message).toMatch("\"additionalInfo.channel\" is not allowed to be empty");
  });

  test('User failed to hit refund when originalPartnerReferenceNo is null', () => {
    validDto.originalPartnerReferenceNo = null;
    const { error } = validDto.validateRefundRequestDto();
    expect(error).toBeDefined();
    expect(error.details[0].message).toMatch(/"originalPartnerReferenceNo" must be a string/);
  });

  test('User failed to hit refund when originalPartnerReferenceNo length is more than 12', () => {
    validDto.originalPartnerReferenceNo = '1234567890123';
    const { error } = validDto.validateRefundRequestDto();
    expect(error).toBeDefined();
    expect(error.details[0].message).toMatch(/"originalPartnerReferenceNo" length must be less than or equal to 12 characters long/);
  });

  test('User failed to hit refund when refundAmount.value is null', () => {
    validDto.refundAmount.value = null;
    const { error } = validDto.validateRefundRequestDto();
    expect(error).toBeDefined();
    expect(error.details[0].message).toMatch("\"refundAmount.value\" must be a string");
  });

  test('User failed to hit refund when refundAmount.value length is less than 1', () => {
    validDto.refundAmount.value = '';
    const { error } = validDto.validateRefundRequestDto();
    expect(error).toBeDefined();
    expect(error.details[0].message).toMatch("\"refundAmount.value\" is not allowed to be empty");
  });

  test('User failed to hit refund when refundAmount.value length is more than 16 ', () => {
    validDto.refundAmount.value = '1234567890123456.78'; 
    const { error } = validDto.validateRefundRequestDto();
    expect(error).toBeDefined();
    expect(error.details[0].message).toMatch("\"refundAmount.value\" length must be less than or equal to 16 characters long");
  });

  test('User failed to hit refund when refundAmount.currency length is less than 1', () => {
    validDto.refundAmount.currency = '';
    const { error } = validDto.validateRefundRequestDto();
    expect(error).toBeDefined();
    expect(error.details[0].message).toMatch( "\"refundAmount.currency\" is not allowed to be empty");
  });

  test('User failed to hit refund when refundAmount.currency length is more than 3', () => {
    validDto.refundAmount.currency = 'IDRUSD';
    const { error } = validDto.validateRefundRequestDto();
    expect(error).toBeDefined();
    expect(error.details[0].message).toMatch("\"refundAmount.currency\" length must be less than or equal to 3 characters long");
  });

  test('User failed to hit refund when partnerRefundNo is null', () => {
    validDto.partnerRefundNo = null;
    const { error } = validDto.validateRefundRequestDto();
    expect(error).toBeDefined();
    expect(error.details[0].message).toMatch("\"partnerRefundNo\" must be a string");
  });

  test('User failed to hit refund when partnerRefundNo length is more than 12', () => {
    validDto.partnerRefundNo = '1'.repeat(13);
    const { error } = validDto.validateRefundRequestDto();
    expect(error).toBeDefined();
    expect(error.details[0].message).toMatch(/"partnerRefundNo" length must be less than or equal to 12 characters long/);
  });
});


describe("Refund - Process", () => {
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
        controller.doRefund = jest.fn().mockResolvedValue(new RefundResponseDTO(
            "2005400", "Successful"
        ));
        return controller;
    };

    const createRefundRequestDTO = () => {
        const amount = new TotalAmount("1000000.00", "IDR"); // Refund amount
        const refundRequestDto = new RefundRequestDto(
            "INV-0001", 
            amount,    
            "123456",  
            "ext-123",  
            "Refund reason",
            { channel: "DIRECT_DEBIT_CIMB_SNAP" }
        );
        return refundRequestDto.toObject();
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

    test('should successfully perform refund when all params are valid', async () => {
        const refundRequestDto = createRefundRequestDTO();
    
        refundRequestDto.validateRefundRequestDto = jest.fn();
    
        const response = await snap.doRefund(refundRequestDto, 'authCode', "192.168.1.0", "deviceId");
    
        expect(mockTokenController.isTokenInvalid).toHaveBeenCalledWith(snap.tokenB2B, snap.tokenExpiresIn, snap.tokenGeneratedTimestamp);
        expect(mockDirectDebitController.doRefund).toHaveBeenCalledWith(
            refundRequestDto, 
            snap.privateKey, 
            snap.clientId, 
            snap.tokenB2B, 
            snap.tokenB2b2c, 
            snap.secretKey, 
            snap.isProduction,
            "192.168.1.0",
            "deviceId"
        );
    
        expect(response).toEqual(expect.objectContaining({
            responseCode: "2005400",
            responseMessage: "Successful"
        }));
    });
    
});

