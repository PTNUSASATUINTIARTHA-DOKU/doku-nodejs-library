const Snap = require("../_modules/snap");
const VaController = require('../_controllers/vaController');
const TokenController = require('../_controllers/tokenController');

jest.mock('../_controllers/vaController');
jest.mock('../_controllers/tokenController');

describe('Snap class', () => {
    let snap;
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
        snap = new Snap({
            isProduction: false,
            privateKey: privateKey,
            clientID: clientID,
            publicKey: publicKey,
            issuer: "issuer",
            secretKey: secretKey
        });
    });

    describe('checkStatusVa', () => {
        test('should call VaController.doCheckStatusVa with correct parameters when token is valid', async () => {
            TokenController.prototype.isTokenInvalid.mockReturnValue(false);
            const checkVARequestDTO = { someField: 'value' ,validateCheckStatusVaRequestDto:jest.fn()};
            const expectedResponse = { status: 'SUCCESS' };
            VaController.prototype.doCheckStatusVa.mockResolvedValue(expectedResponse);

            const result = await snap.checkStatusVa(checkVARequestDTO);
            expect(checkVARequestDTO.validateCheckStatusVaRequestDto).toHaveBeenCalled();
            expect(TokenController.prototype.isTokenInvalid).toHaveBeenCalledWith(
                snap.tokenB2B, 
                snap.tokenExpiresIn, 
                snap.tokenGeneratedTimestamp
            );
            expect(VaController.prototype.doCheckStatusVa).toHaveBeenCalledWith(
                checkVARequestDTO, 
                snap.privateKey, 
                snap.clientId, 
                snap.tokenB2B, 
                snap.isProduction
            );
            expect(result).toEqual(expectedResponse);
        });

       

        test('should handle errors from VaController.doCheckStatusVa', async () => {
            TokenController.prototype.isTokenInvalid.mockReturnValue(false);
            const checkVARequestDTO = { someField: 'value' ,validateCheckStatusVaRequestDto:jest.fn()};
            VaController.prototype.doCheckStatusVa.mockRejectedValue(new Error('Failed to check status'));

            await expect(snap.checkStatusVa(checkVARequestDTO)).rejects.toThrow('Failed to check status');
            expect(checkVARequestDTO.validateCheckStatusVaRequestDto).toHaveBeenCalled();
            expect(TokenController.prototype.isTokenInvalid).toHaveBeenCalledWith(
                snap.tokenB2B, 
                snap.tokenExpiresIn, 
                snap.tokenGeneratedTimestamp
            );
            expect(VaController.prototype.doCheckStatusVa).toHaveBeenCalledWith(
                checkVARequestDTO, 
                snap.privateKey, 
                snap.clientId, 
                snap.tokenB2B, 
                snap.isProduction
            );
        });

       
    });
});
