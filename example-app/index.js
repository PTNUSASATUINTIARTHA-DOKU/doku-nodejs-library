const doku = require('../index');
const CreateVARequestDto = require('doku-nodejs-library/_models/createVaRequestDto');
const AdditionalInfo = require('../_models/additionalInfo');
const TotalAmount = require('doku-nodejs-library/_models/totalAmount');
const VirtualAccountConfig = require('doku-nodejs-library/_models/virtualAccountConfig');
const CreateVaRequestDtoV1 = require('doku-nodejs-library/_models/createVaRequestDTOV1');
const UpdateVaDto = require('../_models/updateVaDTO.');
const UpdateVaVirtualAccountConfigDto = require('../_models/updateVaVirtualAccountConfigDTO');
const UpdateVaAdditionalInfoDto = require('../_models/updateVaAdditionalInfoDTO');
const Doku = require('doku-nodejs-library');
const DeleteVaRequestDto = require('../_models/deleteVaRequestDTO');
const DeleteVaRequestAdditionalInfo = require('../_models/deleteVaRequestAdditionalInfoDTO');
const CheckStatusVARequestDto = require('../_models/checkStatusVARequestDTO');

// UAT clientID
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


// sandbox clientID
// let clientID = 'BRN-0208-1720408264694';
// let privateKey = `-----BEGIN PRIVATE KEY-----
// MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCcitNlkg8kjOoG
// jYQZekSTiJlor8gzWrGZN18gcB6uijc7BaL7mGb67ENyz2KMXAiAq4IwnOXcVPYL
// Fs4rCJq2JkyerO79F2YKm7aDwLTTMQmYsIiBH5JIxf/qb7AxVyz50V2X0ldxCtoL
// OTIJ9VkHfQDFQECG3TJXnBfj9otRRNoJ+0uT2vDOWJrj2dF0LJN7PYcpBVEsFRJh
// spPRcSyZn7XS+XKR2oRMI2wM2CcpnyvCig1XJSIl1ybHruKvBkEPbiGkgeam1mGD
// k4d3AT40IECyTawC5ClME2eU6ALAwcT8I65DKY8uH1+oVXQNwjoDrIQ1ymDVN4mA
// XuXHckwBAgMBAAECggEACjIej6yCMPq+mVupQXGNuuA4QbHFQ9cB3z1UhEvZK7wT
// 2dPFqEZmWqx9viIUxJiP8zV4fssRS5b7CYDcP8BJN1jqP6F61WArRMCclBs+i8zT
// V68TzPkt8XB3+SB6JNSNON4yjttj15iB2B5LDIv+1vaE0NQc/8uzZjJj+fSKYWoV
// AQk3m+vn1pPsTOBiTd+yqaXra5jeVdcP1CK3vRLsGOp1Pe9aUxB3bI15OzudRyGv
// UoyvfPSIMQwwDIAeL/VrQnOFK+eBPBBrLZUsM0urgdnm5nSAbN+TFsYqaxzMLR8P
// wkBWaq7lG4e/FyeVoPf7t6/KR+Io9wJiIdvQTV6imQKBgQDRVL/g7qKMHBxGFzQd
// B9XDJMxd5gom075aR4Q5vaYv0vy9y4omlC9iYG+Y021EppyafGznM4gfoN1GQ0F0
// j0QrDga4fbzInStmKvFgQ37CvoNXy9rAdg0vX0igW4ptPpP/xfsMjOUAXxQXceCU
// J03DWDKXrdNc7HUb6nC6lqVnFQKBgQC/cTzv7gcy6ypgU5QIEmCtaXLtIvADpjED
// 5dnLtgN5DV91WgN6RBc8m6xIAwAKQoo7YHErraSOy1zy264SNX4P5VlmP0nzsRtU
// Olr6CuKK9iSld74Lhh9lvNt/3jjFwzyPqnFmfHbE0e58ueEry16uho/JWIdh4PEj
// tn/lfVTMPQKBgQDEmxWwfFE8yPYhOo/eqEo0A27SzklAmGVTQ5JD7QSWLFLnK7Ew
// dMNgYXTPE9yvutChJDXgnHzAQAUzhd2HTTvYOE9FngreXQey6KhWIm5/GBIiNrvZ
// Qcc2dAaxXejQnBLDCr601ewLgkFLl9A3NgcKbt7tqPw4bXm8Y1/HT9A/1QKBgQCT
// BUnBENGifwtqMoVqtYJdarACAWTFyKm3zps2YK/GFUkL/HbTPNuDhiIGo5cySeuS
// sfv3iUDpELBvKdpCzaXkW0QOy+flKExOoQohIJ7eDS4TjSP8AaK3JRSE3IpJBijK
// RCEWjdtAR+CZFL8iPOqXqWtfO4es2W0W+h66hUfMGQKBgAg1615yEBgSxJvU0CX2
// JuLMX9OvqBqLGeSE333/DGneZo8ZvHa+po5ntCGYKNQBRk/Mv+qA6NbhDPVhW14o
// Nae6lR1M6gEhnle8jcEd9gckfGmB6RGKcgfgqXCr1xz0AGbBLmN6pqmhbewlpOcO
// lL18rTv2hNvvzmApjjAnoA7B
// -----END PRIVATE KEY-----`;
// let publicKey =`-----BEGIN PUBLIC KEY-----
// MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAnIrTZZIPJIzqBo2EGXpEk4iZaK/IM1qxmTdfIHAeroo3OwWi+5hm+uxDcs9ijFwIgKuCMJzl3FT2CxbOKwiatiZMnqzu/RdmCpu2g8C00zEJmLCIgR+SSMX/6m+wMVcs+dFdl9JXcQraCzkyCfVZB30AxUBAht0yV5wX4/aLUUTaCftLk9rwzlia49nRdCyTez2HKQVRLBUSYbKT0XEsmZ+10vlykdqETCNsDNgnKZ8rwooNVyUiJdcmx67irwZBD24hpIHmptZhg5OHdwE+NCBAsk2sAuQpTBNnlOgCwMHE/COuQymPLh9fqFV0DcI6A6yENcpg1TeJgF7lx3JMAQIDAQAB
// -----END PUBLIC KEY-----`
// let secretKey = 'SK-VknOxwR4xZSEPnG7fpJo'

let snap = new doku.Snap({
    isProduction : false,
    privateKey : privateKey,
    clientID : clientID,
    publicKey :publicKey,
    issuer:"PT DOKU",
    secretKey:secretKey
});;

// function initializeSnap() {
//     snap = new doku.Snap({
//         isProduction : false,
//         privateKey : privateKey,
//         clientID : clientID,
//         publicKey :publicKey,
//         issuer:"PT MPE",
//         secretKey:secretKey
//     });
// }

async function createVa(){
    
    let createVaRequestDto = new CreateVARequestDto()
    // dgpc
    createVaRequestDto.partnerServiceId = "    1899"; 

    // mgpc
    // createVaRequestDto.partnerServiceId = " 8129014"
    // createVaRequestDto.customerNo = "1";
    // createVaRequestDto.virtualAccountNo = createVaRequestDto.partnerServiceId+createVaRequestDto.customerNo;
    
    
    createVaRequestDto.virtualAccountName = "T_"+Date.now();
    createVaRequestDto.virtualAccountEmail = "test.bnc."+Date.now()+"@test.com";
    createVaRequestDto.virtualAccountPhone = "00000062"+Date.now(),"INV_CIMB_"+Date.now();
    createVaRequestDto.trxId = "INV_CIMB_"+Date.now();

    let totalAmount = new TotalAmount();
    totalAmount.value = "12500.00";
    totalAmount.currency = "IDR";

    createVaRequestDto.totalAmount = totalAmount;

    let virtualAccountConfig = new VirtualAccountConfig();
    virtualAccountConfig.reusableStatus = false;

    let additionalInfo = new AdditionalInfo("VIRTUAL_ACCOUNT_BANK_CIMB", virtualAccountConfig);
    additionalInfo.channel = "VIRTUAL_ACCOUNT_BANK_CIMB";
    additionalInfo.virtualAccountConfig = virtualAccountConfig;
    createVaRequestDto.additionalInfo = additionalInfo;
    createVaRequestDto.virtualAccountTrxType = "1";
    createVaRequestDto.expiredDate = "2024-07-24T09:54:04+07:00";
    console.log(createVaRequestDto)
    await snap.createVa(createVaRequestDto).then(va=>{
        console.log(va)
    }).catch(err=>{
        console.log(err)
    })

}

async function createVaV1(){
    initializeSnap();

    
    let createVaRequestDto = new CreateVaRequestDtoV1()
    // dgpc
    createVaRequestDto.partnerServiceId = "    1899"; 
    createVaRequestDto.basket={"product":"1"}
    createVaRequestDto.country="ID"
    createVaRequestDto.name = "T_"+Date.now();
    createVaRequestDto.email = "test.bnc."+Date.now()+"@test.com";
    createVaRequestDto.mobilephone = "00000062"+Date.now(),"INV_CIMB_"+Date.now();
    createVaRequestDto.transIdMerchant = "INV_CIMB_"+Date.now();
    createVaRequestDto.amount = "12500.00";
    createVaRequestDto.currency = "IDR"
    createVaRequestDto.paymentChannel = "VIRTUAL_ACCOUNT_BANK_CIMB"
    createVaRequestDto.expiredDate = "2024-06-24T09:54:04+07:00"

    await snap.createVaV1(createVaRequestDto).then(va=>{
        console.log(va)
    })

}


async function updateVa(){
    let updateVaRequestDto = new UpdateVaDto()
    updateVaRequestDto.partnerServiceId = "    1899"; 
    updateVaRequestDto.customerNo = "000000000375";
    updateVaRequestDto.virtualAccountNo = updateVaRequestDto.partnerServiceId+updateVaRequestDto.customerNo;
    
    
    updateVaRequestDto.virtualAccountName = "T_1718867012059";
    updateVaRequestDto.virtualAccountEmail = "test.bnc.1718867012059@test.com";
    updateVaRequestDto.trxId = "INV_CIMB_1718867012059"

    let totalAmount = new TotalAmount();
    totalAmount.value = "12500.00";
    totalAmount.currency = "IDR";

    updateVaRequestDto.totalAmount = totalAmount;
    let virtualAccountConfig = new UpdateVaVirtualAccountConfigDto();
    virtualAccountConfig.status = "INACTIVE";

    let additionalInfo = new UpdateVaAdditionalInfoDto("VIRTUAL_ACCOUNT_BANK_CIMB", virtualAccountConfig);
    additionalInfo.channel = "VIRTUAL_ACCOUNT_BANK_CIMB";
    additionalInfo.virtualAccountConfig = virtualAccountConfig;
    updateVaRequestDto.additionalInfo = additionalInfo;
    updateVaRequestDto.virtualAccountTrxType = "1";
    updateVaRequestDto.expiredDate = "2024-06-24T09:54:04+07:00";
    console.log(updateVaRequestDto)
    await snap.updateVa(updateVaRequestDto).then(va=>{
        //you can get response from update va here
    }).catch((err)=>{
        //  You can manage error response here
    })

}
async function getToken(){
    await snap.getTokenB2B().then(res=>{
        console.log(res)
    }).catch((err)=>{
        console.log(err.response)
    })
}
async function deletePaymentCode(){
    let deleteVaRequestDto = new DeleteVaRequestDto()
    deleteVaRequestDto.partnerServiceId =  "    1899"; 
    deleteVaRequestDto.customerNo =  "000000000525";
    deleteVaRequestDto.virtualAccountNo = deleteVaRequestDto.partnerServiceId+deleteVaRequestDto.customerNo
   
    deleteVaRequestDto.trxId = "INV_CIMB_1720401673205"
    let additionalInfo = new DeleteVaRequestAdditionalInfo("VIRTUAL_ACCOUNT_BANK_CIMB");
    deleteVaRequestDto.additionalInfo = additionalInfo;
    await snap.deletePaymentCode(deleteVaRequestDto).then(response=>{
        console.log("ini sample")
        console.log(response)
    }).catch((err)=>{
        console.log(err.response)
    })
}
async function checkStatusVa(){
    let checkVaRequestDto = new CheckStatusVARequestDto()
    checkVaRequestDto.partnerServiceId =  "    1899"; 
    checkVaRequestDto.customerNo =  "000000000527";
    checkVaRequestDto.virtualAccountNo = checkVaRequestDto.partnerServiceId+checkVaRequestDto.customerNo
    await snap.checkStatusVa(checkVaRequestDto).then(response=>{
        // console.log("ini sample")
        console.log(response)
    }).catch((err)=>{
        console.log(err)
    })
}

// createVaV1();
// getToken()
createVa()
// deletePaymentCode()
// checkStatusVa()
// updateVa()
// getToken()