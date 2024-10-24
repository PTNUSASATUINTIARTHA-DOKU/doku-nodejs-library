const Snap = require("../_modules/snap");
const TokenController = require('../_controllers/tokenController');
const DirectDebitController = require('../_controllers/directDebitController');
const { PaymentRequestDto, TotalAmountDto, PaymentAdditionalInfoRequestDto, PayOptionDetailsDto, LineItemsDto } = require('../_models/paymentRequestDirectDebitDTO');
const PaymentResponseDirectDebitDTO = require("../_models/paymentResponseDirectDebitDTO");

jest.mock('../_controllers/tokenController');
jest.mock('../_controllers/directDebitController');

describe('Payment - Validation request', () => {
    let basePaymentRequest;

    beforeEach(() => {
         basePaymentRequest = new PaymentRequestDto(
            "INV-0001",
            new TotalAmountDto("10000.00", "IDR"),
            [
                new PayOptionDetailsDto(
                    "DIRECT_DEBIT_CIMB_SNAP",
                    new TotalAmountDto("10000.00", "IDR"),
                    new TotalAmountDto("0.00", "IDR")
                )
            ],
            new PaymentAdditionalInfoRequestDto(
                "DIRECT_DEBIT_CIMB_SNAP",
                "Payment for Order INV-0001",
                "https://www.merchant.com/success",
                "https://www.merchant.com/failed",
                [
                    new LineItemsDto("Item 1", "10000.00", "1"),
                    new LineItemsDto("Item 2", "2000.00", "2")
                ]
            ),
            "chargeToken" 
        );
    });

    test('User successfully filled a payment when all params are valid', () => {
        expect(() => basePaymentRequest.validatePaymentRequestDto()).not.toThrow();
    });

    test('User failed filled a payment when amount.value\'s length is less than 1', () => {
        basePaymentRequest.amount.value = ""; 
        expect(() => basePaymentRequest.validatePaymentRequestDto()).toThrow('Validation failed: "amount.value" is not allowed to be empty');
    });

    test('User failed filled a payment when all params are valid but amount.value length is more than 16', () => {
        basePaymentRequest.amount.value = "1000000000000000000.00"; 
        expect(() => basePaymentRequest.validatePaymentRequestDto()).toThrow('Validation failed: \"amount.value\" length must be less than or equal to 19 characters long');
    });

    test('User failed filled a payment when all params are valid but amount.currency length is less than 1', () => {
        basePaymentRequest.amount.currency = ""; 
        expect(() => basePaymentRequest.validatePaymentRequestDto()).toThrow('Validation failed: \"amount.currency\" is not allowed to be empty');
    });

    test('User failed filled a payment when all params are valid but amount.currency length more than 3', () => {
        basePaymentRequest.amount.currency = "IDRX"; 
        expect(() => basePaymentRequest.validatePaymentRequestDto()).toThrow("Validation failed: \"amount.currency\" length must be 3 characters long");
    });

    test('User failed filled a payment when all params are valid but channel invalid', () => {
        basePaymentRequest.additionalInfo.channel = ""
        expect(() => basePaymentRequest.validatePaymentRequestDto()).toThrow("Validation failed: \"additionalInfo.channel\" is not allowed to be empty");
    });

    test('User failed filled a payment when all params are valid but additionalInfo.remarks is empty', () => {
        basePaymentRequest.additionalInfo.remarks = ""
        expect(() => basePaymentRequest.validatePaymentRequestDto()).toThrow("Validation failed: \"additionalInfo.remarks\" is not allowed to be empty");
    });

    test('User failed filled a payment when all params are valid but additionalInfo.remarks length is more than 40', () => {
        basePaymentRequest.additionalInfo.remarks = "1".repeat(41)
        expect(() => basePaymentRequest.validatePaymentRequestDto()).toThrow("Validation failed: \"additionalInfo.remarks\" length must be less than or equal to 40 characters long");
    });

    test('User failed filled a payment when all params are valid but additionalInfo.successPaymentUrl is null', () => {
        basePaymentRequest.additionalInfo.successPaymentUrl = ""
        expect(() => basePaymentRequest.validatePaymentRequestDto()).toThrow("Validation failed: \"additionalInfo.successPaymentUrl\" is not allowed to be empty");
    });

    test('User failed filled a payment when not all params are valid and additionalInfo.failedPaymentUrl is not null', () => {
        basePaymentRequest.additionalInfo.failedPaymentUrl = ""
        expect(() => basePaymentRequest.validatePaymentRequestDto()).toThrow("Validation failed: \"additionalInfo.failedPaymentUrl\" is not allowed to be empty");
    });
});


describe("Payment - Process", () => {
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
            controller.doPayment = jest.fn().mockResolvedValue(new PaymentResponseDirectDebitDTO(
                "2005400", "Successful", "https://app-uat.doku.com/link/283702597342040", "INV-991", "212d31983123"
            ));
            return controller;
        };


        const createPaymentRequestDTO = () => {
            const amount = new TotalAmountDto("12345678.00", "IDR");
            const transAmount = new TotalAmountDto("1000000.00", "IDR");
            const feeAmount = new TotalAmountDto("5000.00", "IDR");
            const payOptionDetails = [
                new PayOptionDetailsDto("CREDIT_CARD", transAmount, feeAmount)
            ];  
            const lineItems = [
                { name: "Product 1", price: "50000.00", quantity: "2" },
                { name: "Product 2", price: "25000.00", quantity: "1" }
            ];
            const additionalInfo = new PaymentAdditionalInfoRequestDto(
                "DIRECT_DEBIT_CIMB_SNAP",
                "Payment for order INV-0001",
                "https://www.merchant.com/success",
                "https://www.merchant.com/failed",
                lineItems
            );
            const paymentRequestDto = new PaymentRequestDto(
                "INV-0001",   
                amount,       
                payOptionDetails, 
                additionalInfo,   
                "sample-charge-token"
            );
            return paymentRequestDto.toObject();
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

        test('should successfully perform payment when all params are valid', async () => {
            const createPaymentRequestDto = createPaymentRequestDTO();
            createPaymentRequestDTO.partnerReferenceNo = "123123"
            createPaymentRequestDto.validatePaymentRequestDto = jest.fn();
            const response = await snap.doPayment(createPaymentRequestDto, 'authCode', "192.168.1.0");
        
            expect(createPaymentRequestDto.validatePaymentRequestDto).toHaveBeenCalled();
            expect(mockTokenController.isTokenInvalid).toHaveBeenCalledWith(snap.tokenB2B, snap.tokenExpiresIn, snap.tokenGeneratedTimestamp);
            expect(mockDirectDebitController.doPayment).toHaveBeenCalledWith(
                createPaymentRequestDto, 
                snap.privateKey, 
                snap.clientId, 
                snap.tokenB2B, 
                "", 
                snap.secretKey, 
                snap.isProduction,
                "192.168.1.0"
            );
            
            expect(response).toEqual(expect.objectContaining({
                responseCode: "2005400",
                responseMessage: "Successful", 
                webRedirectUrl: "https://app-uat.doku.com/link/283702597342040",
                partnerReferenceNo: "INV-991",
                referenceNo: "212d31983123"
            }));
        });
});