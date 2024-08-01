const doku = require('../index');
const CreateVARequestDto = require('../_models/createVaRequestDto');
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
// let privateKey = `-----BEGIN PRIVATE KEY-----
// MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCvuA0S+R8RGEoT
// xZYfksdNam3/iNrKzY/RqGbN4Gf0juIN8XnUM8dGv4DVqmXQwRMMeQ3N/Y26pMDJ
// 1v/i6E5BwWasBAveSk7bmUBQYMURzxrvBbvfRNvIwtYDa+cx39HamfiYYOHq4hZV
// S6G2m8SqDEhONxhHQmEP9FPHSOjPQWKSlgxrT3BKI9ESpQofcxKRX3hyfh6MedWT
// lZpXUJrI9bd6Azg3Fd5wpfHQlLcKSR8Xr2ErH7dNS4I21DTHR+6qx02Tocv5D30O
// DamA6yG9hxnFERLVE+8GnJE52Yjjsm5otGRwjHS4ngSShc/Ak1ZyksaCTFl0xEwT
// J1oeESffAgMBAAECggEAHv9fxw4NTe2z+6LqZa113RE+UEqrFgWHLlv/rqe8jua5
// t+32KNnteGyF5KtHhLjajGO6bLEi1F8F51U3FKcYTv84BnY8Rb1kBdcWAlffy9F2
// Fd40EyHJh7PfHwFk6mZqVZ69vNuyXsX9XJSX9WerHLhH9QxBCykJiE/4i3owH4dF
// Cd/7ervsP32ukGY3rs/mdcO8ThAWffF5QyGd/A3NMf8jRCZ3FwYfEPrgaj9IHV2f
// UrwgVc7JqQaCJTvvjrm4Epjp+1mca036eoDj40H+ImF9qQ80jZee/vvqRXjfU5Qx
// ys/MHD6S2aGEG5N5VnEuHLHvT51ytTpKA+mAY/armQKBgQDrQVtS8dlfyfnPLRHy
// p8snF/hpqQQF2k1CDBJTaHfNXG37HlccGzo0vreFapyyeSakCdA3owW7ET8DBiO5
// WN2Qgb7Vab/7vEiGltK4YU/62+g4F0LjWPp25wnbVj81XXW95QrWKjytjU/tgO2p
// h47qr8C+3HqMPj1pQ5tcKpJXCwKBgQC/Nrkn0kT+u4KOxXix5RkRDxwfdylCvuKc
// 3EfMHFs4vELi1kOhwXEbVTIsbFpTmsXclofqZvjkhepeu9CM6PN2T852hOaI+1Wo
// 4v57UTW/nkpyo8FZ09PtBvOau5B6FpQU0uaKWrZ0dX/f0aGbQKUxJnFOq++7e7mi
// IBfX1QCm/QKBgHtVWkFT1XgodTSuFji2ywSFxo/uMdO3rMUxevILVLNu/6GlOFnd
// 1FgOnDvvtpLCfQWGt4hTiQ+XbQdy0ou7EP1PZ/KObD3XadZVf8d2DO4hF89AMqrp
// 3PU1Dq/UuXKKus2BJHs+zWzXJs4Gx5IXJU/YMB5fjEe14ZAsB2j8UJgdAoGANjuz
// MFQ3NXjBgvUHUo2EGo6Kj3IgxcmWRJ9FzeKNDP54ihXzgMF47yOu42KoC+ZuEC6x
// xg4Gseo5mzzx3cWEqB3ilUMEj/2ZQhl/zEIwWHTw8Kr5gBzQkv3RwiVIyRf2UCGx
// ObSY41cgOb8fcwVW1SXuJT4m9KoW8KDholnLoZECgYEAiNpTvvIGOoP/QT8iGQkk
// r4GK50j9BoPSJhiM6k236LSc5+iZRKRVUCFEfyMPx6AY+jD2flfGxUv2iULp92XG
// 2eE1H6V1gDZ4JJw3s5847z4MNW3dj9nIi2bpFssnmoS5qP2IpmJW0QQmRmJZ8j2j
// OrzKGlO90/6sNzIDd2DbRSM=
// -----END PRIVATE KEY-----`
// let clientID = 'BRN-0221-1693209567392'
// let publicKey = `-----BEGIN PUBLIC KEY-----
// MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAr7gNEvkfERhKE8WWH5LHTWpt/4jays2P0ahmzeBn9I7iDfF51DPHRr+A1apl0METDHkNzf2NuqTAydb/4uhOQcFmrAQL3kpO25lAUGDFEc8a7wW730TbyMLWA2vnMd/R2pn4mGDh6uIWVUuhtpvEqgxITjcYR0JhD/RTx0joz0FikpYMa09wSiPREqUKH3MSkV94cn4ejHnVk5WaV1CayPW3egM4NxXecKXx0JS3CkkfF69hKx+3TUuCNtQ0x0fuqsdNk6HL+Q99Dg2pgOshvYcZxRES1RPvBpyROdmI47JuaLRkcIx0uJ4EkoXPwJNWcpLGgkxZdMRMEydaHhEn3wIDAQAB
// -----END PUBLIC KEY-----`
// let secretKey = 'SK-tDzY6MSLBWlNXy3qCsUU';


// sandbox clientID
let clientID = 'BRN-0239-1718858559993';
let privateKey = `-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC3GitkLtRzD9yp
fZqyTG/ECbFw15t73wzCzU8fM9u2hZjtBpvbDJvC8WuB+gwNKdM5azSm8rrTaZh8
e4ycX6xqIDHhB8MBI5Z63B7nCgPMAy5Itop4EPOkLBszftSisbNYeBk0SlTB3PYe
lHxDuapfwkdjrN/sL0UNb23Pj/kWAgz2FZtE1Vu+0JZLo51Vh7+c/93k2n3zvMi0
ZP4lVgSOI2wzNcPNZsfrqdVtA1P0OXHgA+dwa/OmAZ1ag7GAIwy+Nr/+c/eqRrlV
12H8k+veewq3YKBztqPqQPov5FcmvgiKDwVcXCuOj1ae0MGWgOqq6VThFlw13fLl
eF8hxhMTAgMBAAECggEABLVnkuv2tVQdwz4M/F4lgaUTgGi1rDnQL4eYFp/+xnLT
u+9aPV0q+Zhma1vtc2k1RVoRwI6oFJ0NOXuejLw+ctGLzChRm3XkKMSrBsX7KFlB
7MdvnXwncnwFNw3L6g3SeYlHx1B3XYTmeg2CJJEMZeoDwUxwywzBedb5EUgNNRj3
7kogfB2+tLN218m47isajwMgEs5SoBYfSSnVOCYL2T40pV6BfMev4kdEsyRfs9Rp
djEKa4OC7prsZrvFAHQFsX0/Fd5TiByaj2DMiKHgyYnuJlEMXgxv7gCgdRIRM0uO
UCoAzu7yv1L1QANRgUSVni091Ucnby25KOnq9nsWAQKBgQDdkYJew/awfOWcnTJT
sVphEnK5KBGueOOoSQL4VhiwphyNYNyR67WWqlEXrIfy5uOwvM6hlfnlws6hxz0T
v2jOv6PiAIB+/WIACO3yS9qviTQIZC+Eb2v5ogx4e72LLzvUlbaa9U7HBx3TDXwl
E6r86f7rz6CCpv4dRoe8uHHdhwKBgQDTjmOgAsJKextzHIisFpo4jIX9wrLsE3GG
mpr6KrFg+fFRUQ898IBIC5ock1taIpVbEjhrpHszpFXEPClKEszAZdLHpTr0dPlh
m2OThgcyf2Vvp5EbWAR9wnMe0B9c+Z8fipNoPCcPumzEvJYARSa0oBOF2Z08PeNt
ugRMejuhFQKBgAUEYnta3J8qdNiTBqy2e2FvVYGz0pKs0hrhbFvLN0votwTMiLIV
MEt1F9j9Yyaw6774x4UJLFtzidJH/K4Ry4HC/ScE8+PsQOfXS+wMo6sN5Eu8WQca
rss8TCP+SVB5hVVO/o+LtnjzRE2fJIyCYYDQm6EjVnMe7OokyrYPRyTJAoGAK7bS
cy/ewdEqXODahOSuvVycG1Ft80YZQT0VJPhJasZ6zNi5E41slHaBQ8JXMArRXd4n
9mYoZwVgC4p65al40ZC4uzQzOGwrU7XuH3+kYRTd+vJfE41ecDYL36QVtvqFnNjf
mLxFPgTBkO1++VNQqiYhopjS2q3XHsc/OCZRx/kCgYEAmfeuYsmCLTArbWvTPw+d
1GawOpTKn32yfU6mH87b2E6ceqq/xBJ14urNb4Ba6IgMnuPgnmpuQWT3awUC7QbS
11dyOGH8Ivk1GyVVe/ko71l0CnnCUaMInlqv+VNojX0TwkXqh6p3i4vxbfT9Q8qV
Vp57Geujf16ViNl9kSvIEuw=
-----END PRIVATE KEY-----`;
let publicKey =`-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAtxorZC7Ucw/cqX2askxv
xAmxcNebe98Mws1PHzPbtoWY7Qab2wybwvFrgfoMDSnTOWs0pvK602mYfHuMnF+s
aiAx4QfDASOWetwe5woDzAMuSLaKeBDzpCwbM37UorGzWHgZNEpUwdz2HpR8Q7mq
X8JHY6zf7C9FDW9tz4/5FgIM9hWbRNVbvtCWS6OdVYe/nP/d5Np987zItGT+JVYE
jiNsMzXDzWbH66nVbQNT9Dlx4APncGvzpgGdWoOxgCMMvja//nP3qka5Vddh/JPr
3nsKt2Cgc7aj6kD6L+RXJr4Iig8FXFwrjo9WntDBloDqqulU4RZcNd3y5XhfIcYT
EwIDAQAB
-----END PUBLIC KEY-----`;
let secretKey = 'SK-A9AntaFPDDBOS7So1pem'

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

    createVaRequestDto.partnerServiceId = "  123626";
    createVaRequestDto.customerNo =`12123`;
    createVaRequestDto.virtualAccountNo = createVaRequestDto.partnerServiceId+createVaRequestDto.customerNo;
    
    
    createVaRequestDto.virtualAccountName = "T_"+Date.now();
    createVaRequestDto.virtualAccountEmail = "test.bnc."+Date.now()+"@test.com";
    createVaRequestDto.virtualAccountPhone = "62"+Date.now();
    createVaRequestDto.trxId = "INV_BRI_"+Date.now();

    let totalAmount = new TotalAmount();
    totalAmount.value = "10000.00";
    totalAmount.currency = "IDR";

    createVaRequestDto.totalAmount = totalAmount;

    let virtualAccountConfig = new VirtualAccountConfig();
    virtualAccountConfig.reusableStatus = false;
    let additionalInfo = new AdditionalInfo("VIRTUAL_ACCOUNT_BRI", virtualAccountConfig);
    additionalInfo.channel = "VIRTUAL_ACCOUNT_BRI";
    additionalInfo.virtualAccountConfig = virtualAccountConfig;
    createVaRequestDto.additionalInfo = additionalInfo;
    createVaRequestDto.virtualAccountTrxType ='C';
    createVaRequestDto.expiredDate = "2024-08-24T09:54:04+07:00";
    console.log(createVaRequestDto)
    await snap.createVa(createVaRequestDto).then(va=>{
        console.log(va)
    }).catch(err=>{
        console.log(err)
    })

}

async function createVaV1(){

    
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
    updateVaRequestDto.partnerServiceId = "  123626"; 
    updateVaRequestDto.customerNo = "0000000597";
    updateVaRequestDto.virtualAccountNo = updateVaRequestDto.partnerServiceId+updateVaRequestDto.customerNo;
    
    
    updateVaRequestDto.virtualAccountName = "test name";
    updateVaRequestDto.virtualAccountEmail = "test.bnc.1722486935641@test.com";
    updateVaRequestDto.trxId = "INV_BRI_1722486935641"

    let totalAmount = new TotalAmount();
    totalAmount.value = "12000.00";
    totalAmount.currency = "IDR";

    updateVaRequestDto.totalAmount = totalAmount;
    let virtualAccountConfig = new UpdateVaVirtualAccountConfigDto();
    virtualAccountConfig.status = "INACTIVE";

    let additionalInfo = new UpdateVaAdditionalInfoDto("VIRTUAL_ACCOUNT_BRI", virtualAccountConfig);
    additionalInfo.channel = "VIRTUAL_ACCOUNT_BRI";
    additionalInfo.virtualAccountConfig = virtualAccountConfig;
    updateVaRequestDto.additionalInfo = additionalInfo;
    updateVaRequestDto.virtualAccountTrxType = "C";
    updateVaRequestDto.expiredDate = "2024-08-24T09:54:04+07:00";
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
    deleteVaRequestDto.partnerServiceId =  "  123626"; 
    deleteVaRequestDto.customerNo =  "0000000597";
    deleteVaRequestDto.virtualAccountNo = deleteVaRequestDto.partnerServiceId+deleteVaRequestDto.customerNo
   
    deleteVaRequestDto.trxId = "INV_BRI_1722486935641"
    let additionalInfo = new DeleteVaRequestAdditionalInfo("VIRTUAL_ACCOUNT_BRI");
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
    checkVaRequestDto.partnerServiceId =  "  123626"; 
    checkVaRequestDto.customerNo =  "0000000513";
    checkVaRequestDto.virtualAccountNo = checkVaRequestDto.partnerServiceId+checkVaRequestDto.customerNo
    console.log(checkVaRequestDto)
    await snap.checkStatusVa(checkVaRequestDto).then(response=>{
        console.log(response)
    }).catch((err)=>{
        console.log(err)
    })
}
function inquiry(){
    snap.validateTokenB2B(req.headers['Authorization']);
    snap.generateRequestHeader()
}
function v1SNAPConverter(){
    const xmlString = `
<INQUIRY_RESPONSE>
    <PAYMENTCODE>8975011200005642</PAYMENTCODE>
    <AMOUNT>100000.00</AMOUNT>
    <PURCHASEAMOUNT>100000.00</PURCHASEAMOUNT>
    <MINAMOUNT>10000.00</MINAMOUNT>
    <MAXAMOUNT>550000.00</MAXAMOUNT>
    <TRANSIDMERCHANT>1396430482839</TRANSIDMERCHANT>
    <WORDS>b5a22f37ad0693ebac1bf03a89a8faeae9e7f390</WORDS>
    <REQUESTDATETIME>20140402162122</REQUESTDATETIME>
    <CURRENCY>360</CURRENCY>
    <PURCHASECURRENCY>360</PURCHASECURRENCY>
    <SESSIONID>dxgcmvcbywhu3t5mwye7ngqhpf8i6edu</SESSIONID>
    <NAME>Nama Lengkap</NAME>
    <EMAIL>nama@xyx.com</EMAIL>
    <BASKET>ITEM 1,10000.00,2,20000.00;ITEM 2,20000.00,4,80000.00</BASKET>
    <ADDITIONALDATA>BORNEO TOUR AND TRAVEL</ADDITIONALDATA>
    <RESPONSECODE>0000</RESPONSECODE>
</INQUIRY_RESPONSE>`;
snap.v1SNAPConverter(xmlString).then((res)=>{
    console.log(res)
    let data = snap.SNAV1Converter(res);
    console.log(data)
}).catch(err=>console.log(err))
   
}

// createVaV1();
// getToken()
createVa()
// v1SNAPConverter()
// deletePaymentCode()
// checkStatusVa()
// updateVa()
// getToken()