const Snap = require("../_modules/snap");
const VaService = require('../_services/vaService'); // Ganti dengan path yang sesuai
const TokenController = require('../_controllers/tokenController'); // Ganti dengan path yang sesuai
const VaController = require('../_controllers/vaController'); // Ganti dengan path yang sesuai

jest.mock('../_controllers/tokenController');
jest.mock('../_controllers/vaController');

describe('Validate request create va', () => {
    const param = {
        "partnerServiceId": "    1899",
        "trxId": "INV_CIMB_"+Date.now(),
        "virtualAccountTrxType": "1",
        "totalAmount": {
            "value": "12500.00",
            "currency": "IDR"
        },
        "feeAmount": {
            "value": "1000.00",
            "currency": "IDR"
        },
        "expiredDate": "2024-04-22T09:54:04+07:00",
        "virtualAccountName": "T_"+Date.now(),
        "virtualAccountEmail": "test.bnc."+Date.now()+"@test.com",
        "virtualAccountPhone": "628"+Date.now(),
        "billDetails": [
            {
                "billCode": "01",
                "billNo": `${Date.now()}`,
                "billName": "Bill A for Jan",
                "billShortName": "Bill A",
                "billDescription": {
                    "english": "Maintenance",
                    "indonesia": "Pemeliharaan"
                },
                "billSubCompany": "00001",
                "billAmount": {
                    "value": "10000.00",
                    "currency": "IDR"
                },
                "additionalInfo": {}
            }
        ],
        "freeTexts": [
            {
                "english": "Free text",
                "indonesia": "Tulisan bebas"
            }
        ],
        "additionalInfo": {
            "channel": "VIRTUAL_ACCOUNT_BANK_CIMB",
            "virtualAccountConfig": {
                "reusableStatus": false
            }
        }
    }
    beforeEach(() => {
        snap = new Snap();
    });

    describe('validate request', () => {
        test('validateVirtualAccountName', () => {
            expect(param).toHaveProperty('virtualAccountName');
            expect(param.virtualAccountName).not.toBeNull();
            expect(typeof param.virtualAccountName).toBe('string');
            expect(param.virtualAccountName.length).toBeGreaterThanOrEqual(1);
            expect(param.virtualAccountName.length).toBeLessThanOrEqual(255);
            const virtualAccountNameRegex = /^[a-zA-Z0-9.\\/+,_:'@% -]*$/;
            expect(param.virtualAccountName).toMatch(/^[a-zA-Z0-9.\\/+,_:'@% -]*$/);
        });
        test('validateVirtualAccountEmail', () => {
            if (param.virtualAccountEmail) {
                expect(param).toHaveProperty('virtualAccountEmail');
                expect(typeof param.virtualAccountEmail).toBe('string');
                expect(param.virtualAccountEmail.length).toBeGreaterThanOrEqual(1);
                expect(param.virtualAccountEmail.length).toBeLessThanOrEqual(255);
                const virtualAccountEmailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                expect(param.virtualAccountEmail).toMatch(virtualAccountEmailRegex);
            }
        });
        test('validateCustomerNo', () => {
            if (param.customerNo) {
                expect(param).toHaveProperty('customerNo');
                expect(typeof param.virtualAccountEmail).toBe('string');
                expect(param.virtualAccountEmail.length).toBeGreaterThanOrEqual(1);
                expect(param.virtualAccountEmail.length).toBeLessThanOrEqual(20);
                const regex = /^\d+$/;
                expect(param.virtualAccountEmail).toMatch(regex);
            }
        });
        test('validateVirtualAccountPhone', () => {
            if (param.virtualAccountPhone) {
                expect(param).toHaveProperty('virtualAccountPhone');
                expect(typeof param.virtualAccountPhone).toBe('string');
                expect(param.virtualAccountPhone.length).toBeGreaterThanOrEqual(9);
                expect(param.virtualAccountPhone.length).toBeLessThanOrEqual(30);
                const regex = /62[0-9]+$/;
                expect(param.virtualAccountPhone).toMatch(regex);
            }
        });
        test('validatTrxId', () => {
            expect(param).toHaveProperty('trxId');
            expect(typeof param.trxId).toBe('string');
            expect(param.trxId.length).toBeGreaterThanOrEqual(1);
            expect(param.trxId.length).toBeLessThanOrEqual(64);
        });
        test('validateTotalAmountValue', () => {
            expect(param.totalAmount).toHaveProperty('value');
            expect(typeof param.totalAmount.value).toBe('string');
            expect(param.totalAmount.value.length).toBeGreaterThanOrEqual(4);
            expect(param.totalAmount.value.length).toBeLessThanOrEqual(19);
        });
        test('validateCurrency', () => {
            expect(param.totalAmount).toHaveProperty('currency', 'IDR');
            expect(typeof param.totalAmount.currency).toBe('string');
        });
        test('validateExpiredDate', () => {
            expect(param).toHaveProperty('expiredDate');
            expect(typeof param.expiredDate).toBe('string');
            const dateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:[+\-]\d{2}:\d{2})?$/;
            expect(param.expiredDate).toMatch(dateRegex);
        });
        test('validateVirtualAccountTrxType', () => {
            expect(param).toHaveProperty('virtualAccountTrxType');
            expect(typeof param.virtualAccountTrxType).toBe('string');
            expect(param.virtualAccountTrxType.length).toBeGreaterThanOrEqual(1);
            expect(param.virtualAccountTrxType.length).toBeLessThanOrEqual(2);
        });
        test('validateChannel', () => {
            expect(param.additionalInfo).toHaveProperty('channel');
            expect(typeof param.additionalInfo.channel).toBe('string');
            expect(param.additionalInfo.channel.length).toBeGreaterThanOrEqual(1);
            expect(param.additionalInfo.channel.length).toBeLessThanOrEqual(30);
        });
        test('validateReusableStatus', () => {
            expect(param.additionalInfo.virtualAccountConfig).toHaveProperty('reusableStatus');
            expect(typeof param.additionalInfo.virtualAccountConfig.reusableStatus).toBe('boolean');
        });
        
    });

});


describe('Create Va', () => {
    let snapInstance;
    let privateKey = `-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCvuA0S+R8RGEoT
xZYfksdNam3/iNrKzY/RqGbN4Gf0juIN8XnUM8dGv4DVqmXQwRMMeQ3N/Y26pMDJ
1v/i6E5BwWasBAveSk7bmUBQYMURzxrvBbvfRNvIwtYDa+cx39HamfiYYOHq4hZV
S6G2m8SqDEhONxhHQmEP9FPHSOjPQWKSlgxrT3BKI9ESpQofcxKRX3hyfh6MedWT
lZpXUJrI9bd6Azg3Fd5wpfHQlLcKSR8Xr2ErH7dNS4I21DTHR+6qx02Tocv5D30O
DamA6yG9hxnFERLVE+8GnJE52Yjjsm5otGRwjHS4ngSShc/Ak1ZyksaCTFl0xEwT
J1oeESffAgMBAAECggEAHv9fxw4NTe2z+6LqZa113RE+UEqrFgWHLlv/rqe8jua5
t+32KNnteGyF5KtHhLjajGO6bLEi1F8F51U3FKcYTv84BnY8Rb1kBdcWAlffy9F2
Fd40EyHJh7PfHwFk6mZqVZ69vNuyXsX9XJSX9WerHLhH9QxBCykJiE/4i3owH4dF
Cd/7ervsP32ukGY3rs/mdcO8ThAWffF5QyGd/A3NMf8jRCZ3FwYfEPrgaj9IHV2f
UrwgVc7JqQaCJTvvjrm4Epjp+1mca036eoDj40H+ImF9qQ80jZee/vvqRXjfU5Qx
ys/MHD6S2aGEG5N5VnEuHLHvT51ytTpKA+mAY/armQKBgQDrQVtS8dlfyfnPLRHy
p8snF/hpqQQF2k1CDBJTaHfNXG37HlccGzo0vreFapyyeSakCdA3owW7ET8DBiO5
WN2Qgb7Vab/7vEiGltK4YU/62+g4F0LjWPp25wnbVj81XXW95QrWKjytjU/tgO2p
h47qr8C+3HqMPj1pQ5tcKpJXCwKBgQC/Nrkn0kT+u4KOxXix5RkRDxwfdylCvuKc
3EfMHFs4vELi1kOhwXEbVTIsbFpTmsXclofqZvjkhepeu9CM6PN2T852hOaI+1Wo
4v57UTW/nkpyo8FZ09PtBvOau5B6FpQU0uaKWrZ0dX/f0aGbQKUxJnFOq++7e7mi
IBfX1QCm/QKBgHtVWkFT1XgodTSuFji2ywSFxo/uMdO3rMUxevILVLNu/6GlOFnd
1FgOnDvvtpLCfQWGt4hTiQ+XbQdy0ou7EP1PZ/KObD3XadZVf8d2DO4hF89AMqrp
3PU1Dq/UuXKKus2BJHs+zWzXJs4Gx5IXJU/YMB5fjEe14ZAsB2j8UJgdAoGANjuz
MFQ3NXjBgvUHUo2EGo6Kj3IgxcmWRJ9FzeKNDP54ihXzgMF47yOu42KoC+ZuEC6x
xg4Gseo5mzzx3cWEqB3ilUMEj/2ZQhl/zEIwWHTw8Kr5gBzQkv3RwiVIyRf2UCGx
ObSY41cgOb8fcwVW1SXuJT4m9KoW8KDholnLoZECgYEAiNpTvvIGOoP/QT8iGQkk
r4GK50j9BoPSJhiM6k236LSc5+iZRKRVUCFEfyMPx6AY+jD2flfGxUv2iULp92XG
2eE1H6V1gDZ4JJw3s5847z4MNW3dj9nIi2bpFssnmoS5qP2IpmJW0QQmRmJZ8j2j
OrzKGlO90/6sNzIDd2DbRSM=
-----END PRIVATE KEY-----`
let clientID = 'BRN-0221-1693209567392'
let publicKey = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAr7gNEvkfERhKE8WWH5LHTWpt/4jays2P0ahmzeBn9I7iDfF51DPHRr+A1apl0METDHkNzf2NuqTAydb/4uhOQcFmrAQL3kpO25lAUGDFEc8a7wW730TbyMLWA2vnMd/R2pn4mGDh6uIWVUuhtpvEqgxITjcYR0JhD/RTx0joz0FikpYMa09wSiPREqUKH3MSkV94cn4ejHnVk5WaV1CayPW3egM4NxXecKXx0JS3CkkfF69hKx+3TUuCNtQ0x0fuqsdNk6HL+Q99Dg2pgOshvYcZxRES1RPvBpyROdmI47JuaLRkcIx0uJ4EkoXPwJNWcpLGgkxZdMRMEydaHhEn3wIDAQAB
-----END PUBLIC KEY-----`
let secretKey = 'SK-tDzY6MSLBWlNXy3qCsUU';
    beforeEach(() => {
      // Setup instance Snap sebelum setiap test
      snapInstance = new Snap({
        isProduction: false,
        privateKey: privateKey,
        clientID: clientID,
        publicKey: publicKey,
        issuer: "issuer",
        secretKey: secretKey
      });
    });
  
    afterEach(() => {
      jest.clearAllMocks(); // Clear mocks setelah setiap test
    });
  
    test('should create VA successfully when token is valid', async () => {
      // Setup mock untuk TokenController
      TokenController.prototype.isTokenInvalid.mockReturnValue(false);
  
      // Setup mock untuk VaController
      VaController.prototype.createVa.mockResolvedValue({ success: true });
  
      const createVARequestDto = {
        validateVaRequestDto: jest.fn(),
        // Tambahkan properti dan metode lain jika diperlukan
      };
  
      const result = await snapInstance.createVa(createVARequestDto);
  
      expect(createVARequestDto.validateVaRequestDto).toHaveBeenCalled();
      expect(result).toEqual({ success: true });
    });
  
    test('should refresh token and create VA when token is invalid', async () => {
      // Setup mock untuk TokenController
      TokenController.prototype.isTokenInvalid.mockReturnValue(true);
      TokenController.prototype.getTokenB2B.mockResolvedValue({
        accessToken: 'newAccessToken',
        expiresIn: 900
      });
  
      // Setup mock untuk VaController
      VaController.prototype.createVa.mockResolvedValue({ success: true });
  
      const createVARequestDto = {
        validateVaRequestDto: jest.fn(),
        // Tambahkan properti dan metode lain jika diperlukan
      };
  
      const result = await snapInstance.createVa(createVARequestDto);
  
      expect(createVARequestDto.validateVaRequestDto).toHaveBeenCalled();
      expect(TokenController.prototype.getTokenB2B).toHaveBeenCalled();
      expect(VaController.prototype.createVa).toHaveBeenCalledWith(
        createVARequestDto,
        snapInstance.privateKey,
        snapInstance.clientId,
        'newAccessToken',
        snapInstance.isProduction,
        snapInstance.secretKey
      );
      expect(result).toEqual({ success: true });
    });
  });