import { Platform, Alert } from "react-native";
import CryptoJS from "react-native-crypto-js";
import { EARTHID_DEV_BASE } from "../constants/URLContstants";
export const isTestnet = true;
export const BASE_URL = EARTHID_DEV_BASE;

export const api = BASE_URL + "/verification/sendEmailOTP";
export const superAdminApi = BASE_URL + "/admin/getSuperAdmin";
export const phoneOtp = BASE_URL + "/verification/sendPhoneOTP";
export const updatephoneOtp = BASE_URL + "/verification/sendVerifiedPhoneOTP";
export const updateEmailOtp = BASE_URL + "/verification/sendVerifiedEmailOTP";
export const updateEmail = BASE_URL + "/verification/verifiedEmailVerify";
export const getCategoriesApi = BASE_URL + "/user/getCategories";
export const facialDataLivenessAPI = BASE_URL + "/user/liveness";
export const CreateHistory = BASE_URL + "/history/createHistory";
export const updatePhone = BASE_URL + "/verification/verifiedPhoneVerify";
export const QrcodeApis = BASE_URL + "/customer/shareDoc";
export const generateCredientials = `https://ssi-gbg.myearth.id/api/issuer/schemas`;
export const CreateVarifiableCredientails = `https://ssi-gbg.myearth.id/api/issuer/verifiableCredential`;
export const unVerifiedPhone =`https://stage-apiv2.myearth.id/user/updatePhoneMail`

export const createAccountApi = BASE_URL + "/authorize/createAccount";
export const getRecordByTxApi = BASE_URL + "/authorize/getRecordByTx?txId";
export const cryptoTransferApi = BASE_URL + "/authorize/cryptoTransfer";
export const validateDocsApi = BASE_URL + "/authorize/userDoc";
export const getTxRecordAPI = BASE_URL + "/authorize/gettxresult";
export const selfieeverifyAPI = BASE_URL + "/authorize/liveness";
export const getOffersAPI = BASE_URL + "/partner/getOffers";
export const accountUpdate = BASE_URL + "/authorize/accountUpdate";
export const issuerGenerateCredentials = BASE_URL + "/ssi/generateCredentials";
export const verifyshareCredentials = BASE_URL + "/ssi/shareCredentials";
export const ssiApiKey = "Api-Key 01a41742-aa8e-4dd6-8c71-d577ac7d463c";
export const newssiApiKey = "01a41742-aa8e-4dd6-8c71-d577ac7d463c";
export const generateIssuerDid = "https://ssi-test.myearth.id/api/issuer/did";
export const generateKeyPair = "https://ssi-test.myearth.id/api/user/generateKeyPair";
export const generateUserDid = "https://ssi-test.myearth.id/api/user/did";
export const generateCryptograph = BASE_URL + "/tech5/cryptoEncode";
export const apiAuthorization = "fae2622d-7b73-4fc6-a536-202cabe75187";
export const deleteUserApi = BASE_URL + "/user/deleteUser";
export const uploadDocument = BASE_URL + "/user/upload";
export const uploadRegisterDocument = "https://stage-apiv2.myearth.id/user/upload";


// icca api to post specific data
export const iccaPostApi = "https://icca.flexsin.org/api/user_key_data";
// verifier website url for verifying the shared link
// export const verifierWebsite = "http://192.168.0.108:3006"
export const verifierWebsite = "https://verifier.icca.flexsin.org/";
//firebaseAnalytics

//Scan QR always on mainnet only
export const serviceProviderApi = `${BASE_URL}/customer/serviceProvider`;
export const userDataApi = "https://api-stage.myearth.id/authorize/userData/";

// Last Mainnet - 0.0.43407
const SMART_CONTRACT_ADDR_MAIN = 53874; //mainnet
const SMART_CONTRACT_ADDR_TEST = 16427438; //testnet

export const SMART_CONTRACT_ADDR =
  isTestnet === true ? SMART_CONTRACT_ADDR_TEST : SMART_CONTRACT_ADDR_MAIN;


export const accountInfo =
  isTestnet === true
    ? {
        nodeAccountShard: 0,
        nodeAccountRealm: 0,
        nodeAccountNum: 9,
        payingAccountShard: 0,
        payingAccountRealm: 0,
        nodeAddress: "6.testnet.hedera.com:50211",
        txFee: 400000000,
        maxTxFee: 400000000,
        gasFee: 280,
        testnet: true,
      }
    : {
        nodeAccountShard: 0,
        nodeAccountRealm: 0,
        nodeAccountNum: 3,
        payingAccountShard: 0,
        payingAccountRealm: 0,
        nodeAddress: "35.237.200.180:50211",
        txFee: 400000000,
        maxTxFee: 400000000,
        gasFee: 280,
        testnet: false,
      };

export const accountInfoOriginal =
  isTestnet === true
    ? {
        nodeAccountShard: 0,
        nodeAccountRealm: 0,
        nodeAccountNum: 9,
        payingAccountShard: 0,
        payingAccountRealm: 0,
        nodeAddress: "6.testnet.hedera.com:50211",
        txFee: 400000000,
        maxTxFee: 400000000,
        gasFee: 280,
        testnet: true,
      }
    : {
        nodeAccountShard: 0,
        nodeAccountRealm: 0,
        nodeAccountNum: 3,
        payingAccountShard: 0,
        payingAccountRealm: 0,
        nodeAddress: "35.237.200.180:50211",
        txFee: 400000000,
        maxTxFee: 400000000,
        gasFee: 280,
        testnet: false,
      };

export const AES_ENCRYPTION_SALT = "qaszxswedcvfrtgbnhyujmkik";
export const AES_HEX_KEY = "f6d0318a8d522820a4b603f9506248d5";
export const keyutf = CryptoJS.enc.Utf8.parse(AES_HEX_KEY);
export const iv = CryptoJS.enc.Base64.parse(AES_HEX_KEY);
export const functioNames = [
  "createIdentity",
  "importAccount",
  "getMyData",
  "getMyEarthId",
];

export const hexToString = (hexStr: { toString: () => any }) => {
  if (Platform.OS === "android") {
    return hexToStringAndroid(hexStr);
  } else {
    var hex = hexStr.toString(); //force conversion
    var str = "";
    for (var n = 2; n < hex.length; n += 2) {
      str += String.fromCharCode(parseInt(hex.substr(n, 2), 16));
    }
    return str;
  }
};

export const hexToStringAndroid = (hexx: { toString: any }) => {
  var hex = hexx.toString(); //force conversion
  var str = "";
  for (var i = 0; i < hex.length && hex.substr(i, 2) !== "00"; i += 2)
    str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
  return str;
};

export const SMART_CONTRACT_ABI = {
  createIdentity: `[{
    "inputs": [
        {
            "internalType": "string",
            "name": "name",
            "type": "string"
        },
        {
            "internalType": "string",
            "name": "mobileNo",
            "type": "string"
        },
        {
            "internalType": "string",
            "name": "emailId",
            "type": "string"
        }
    ],
    "name": "createIdentity",
    "outputs": [
        {
            "internalType": "string",
            "name": "",
            "type": "string"
        },
        {
          "internalType": "uint32",
          "name": "newEarthID",
          "type": "uint32"
        }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
}]`,
  getMyData: `[{
    "inputs": [],
    "name": "getMyData",
    "outputs": [
        {
            "internalType": "string",
            "name": "",
            "type": "string"
        },
        {
            "internalType": "string",
            "name": "",
            "type": "string"
        },
        {
            "internalType": "string",
            "name": "",
            "type": "string"
        },
        {
            "internalType": "uint32",
            "name": "",
            "type": "uint32"
        },
        {
            "internalType": "bool",
            "name": "",
            "type": "bool"
        },
        {
            "internalType": "bool",
            "name": "",
            "type": "bool"
        },
        {
            "internalType": "uint256",
            "name": "newScore",
            "type": "uint256"
        },
        {
            "internalType": "uint256",
            "name": "points",
            "type": "uint256"
        }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
}]`,
  approveOTP: `[{
    "inputs": [
        {
            "internalType": "uint32",
            "name": "_earthId",
            "type": "uint32"
        },
        {
            "internalType": "uint32",
            "name": "_OtpType",
            "type": "uint256"
        },
        {
            "internalType": "string",
            "name": "_otpValue",
            "type": "string"
        }
    ],
    "name": "approveOTP",
    "outputs": [
        {
            "internalType": "string",
            "name": "",
            "type": "string"
        },
        {
            "internalType": "bool",
            "name": "isApproved",
            "type": "bool"
        },
        {
            "internalType": "bool",
            "name": "expired",
            "type": "bool"
        }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
}]`,
  approveMobile: `[{
  "inputs": [
    {
      "internalType": "uint32",
      "name": "_earthId",
      "type": "uint32"
    },
    {
      "internalType": "string",
      "name": "_otpValue",
      "type": "string"
    }
  ],
  "name": "approveMobile",
  "outputs": [
    {
      "internalType": "string",
      "name": "",
      "type": "string"
    },
    {
      "internalType": "bool",
      "name": "isApproved",
      "type": "bool"
    },
    {
      "internalType": "bool",
      "name": "expired",
      "type": "bool"
    }
  ],
  "stateMutability": "nonpayable",
  "type": "function"
}]`,
  approveEmail: `[{
  "inputs": [
    {
      "internalType": "uint32",
      "name": "_earthId",
      "type": "uint32"
    },
    {
      "internalType": "string",
      "name": "_otpValue",
      "type": "string"
    }
  ],
  "name": "approveEmail",
  "outputs": [
    {
      "internalType": "string",
      "name": "",
      "type": "string"
    },
    {
      "internalType": "bool",
      "name": "isApproved",
      "type": "bool"
    },
    {
      "internalType": "bool",
      "name": "expired",
      "type": "bool"
    }
  ],
  "stateMutability": "nonpayable",
  "type": "function"
}]`,
  isMobileVerified: `[ {
    "inputs": [],
    "name": "isMobileVerified",
    "outputs": [
        {
            "internalType": "string",
            "name": "",
            "type": "string"
        },
        {
            "internalType": "bool",
            "name": "",
            "type": "bool"
        }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
}]`,
  isEmailVerified: `[{
    "inputs": [],
    "name": "isEmailVerified",
    "outputs": [
        {
            "internalType": "string",
            "name": "",
            "type": "string"
        },
        {
            "internalType": "bool",
            "name": "",
            "type": "bool"
        }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
}]`,
  approveChangeOTP: `[{
    "inputs": [
        {
            "internalType": "uint32",
            "name": "earthId",
            "type": "uint32"
        },
        {
            "internalType": "uint256",
            "name": "OtpType",
            "type": "uint256"
        },
        {
            "internalType": "string",
            "name": "otpValue",
            "type": "string"
        },
        {
            "internalType": "string",
            "name": "newEmailPhone",
            "type": "string"
        }
    ],
    "name": "approveChangeOTP",
    "outputs": [
        {
            "internalType": "string",
            "name": "",
            "type": "string"
        },
        {
            "internalType": "bool",
            "name": "",
            "type": "bool"
        }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
}]`,
  checkAccountExist: `[{
  //   "constant": true,
  //   "inputs": [
      
  //   ],
  //   "name": "checkAccountExist",
  //   "outputs": [
  //     {
  //       "internalType": "bool",
  //       "name": "",
  //       "type": "bool"
  //     }
  //   ],
  //   "payable": false,
  //   "stateMutability": "view",
  //   "type": "function"
  // }]`,
  getScore: `[{
    "inputs": [],
    "name": "getScore",
    "outputs": [
        {
            "internalType": "uint16",
            "name": "scre",
            "type": "uint16"
        },
        {
            "internalType": "uint16",
            "name": "",
            "type": "uint16"
        }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
}]`,
  getMyEarthId: `[{
    "inputs": [],
    "name": "getMyEarthId",
    "outputs": [
        {
            "internalType": "string",
            "name": "",
            "type": "string"
        },
        {
            "internalType": "uint32",
            "name": "",
            "type": "uint32"
        }
    ],
    "stateMutability": "view",
    "type": "function"
}]`,
  deleteMyData: `[{
    "inputs": [],
    "name": "deleteMyData",
    "outputs": [
        {
            "internalType": "string",
            "name": "",
            "type": "string"
        },
        {
            "internalType": "bool",
            "name": "",
            "type": "bool"
        }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
}]`,
  getRewardPoints: `[{
    "inputs": [
        {
            "internalType": "uint32",
            "name": "earthId",
            "type": "uint32"
        }
    ],
    "name": "getRewardPoints",
    "outputs": [
        {
            "internalType": "uint16",
            "name": "",
            "type": "uint16"
        }
    ],
    "stateMutability": "view",
    "type": "function"
}]`,
  editProfile: `[{
    "inputs": [
        {
            "internalType": "uint32",
            "name": "earthId",
            "type": "uint32"
        },
        {
            "internalType": "string",
            "name": "name",
            "type": "string"
        }
    ],
    "name": "editProfile",
    "outputs": [
        {
            "internalType": "string",
            "name": "",
            "type": "string"
        },
        {
            "internalType": "bool",
            "name": "",
            "type": "bool"
        }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
}]`,
  importAccount: `[{{
    "inputs": [],
    "name": "importAccount",
    "outputs": [
        {
            "internalType": "string",
            "name": "",
            "type": "string"
        },
        {
            "internalType": "string",
            "name": "",
            "type": "string"
        },
        {
            "internalType": "string",
            "name": "",
            "type": "string"
        },
        {
            "internalType": "uint32",
            "name": "",
            "type": "uint32"
        },
        {
            "internalType": "bool",
            "name": "",
            "type": "bool"
        },
        {
            "internalType": "bool",
            "name": "",
            "type": "bool"
        },
        {
            "internalType": "uint256",
            "name": "newScore",
            "type": "uint256"
        },
        {
            "internalType": "uint256",
            "name": "points",
            "type": "uint256"
        }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
}]`,
  deleteIdentity: `[ {
    "inputs": [
        {
            "internalType": "uint256",
            "name": "typeInt",
            "type": "uint256"
        },
        {
            "internalType": "string",
            "name": "value",
            "type": "string"
        },
        {
            "internalType": "uint32",
            "name": "_earthID",
            "type": "uint32"
        }
    ],
    "name": "deleteIdentity",
    "outputs": [
        {
            "internalType": "bool",
            "name": "",
            "type": "bool"
        }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
}]`,
};

export const toHexString = (
  byteArray: Iterable<unknown> | ArrayLike<unknown>
) => {
  return Array.from(byteArray, function (byte) {
    return ("0" + (byte & 0xff).toString(16)).slice(-2);
  }).join("");
};

export const decryption = (encryptedString: string) => {
  return CryptoJS.AES.decrypt(
    { ciphertext: CryptoJS.enc.Base64.parse(encryptedString) },
    keyutf,
    {
      iv: iv,
    }
  );
};
export const MD5 = function (string: string) {
  function RotateLeft(lValue: number, iShiftBits: number) {
    return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits));
  }
  function AddUnsigned(lX: number, lY: number) {
    var lX4, lY4, lX8, lY8, lResult;
    lX8 = lX & 0x80000000;
    lY8 = lY & 0x80000000;
    lX4 = lX & 0x40000000;
    lY4 = lY & 0x40000000;
    lResult = (lX & 0x3fffffff) + (lY & 0x3fffffff);
    if (lX4 & lY4) {
      return lResult ^ 0x80000000 ^ lX8 ^ lY8;
    }
    if (lX4 | lY4) {
      if (lResult & 0x40000000) {
        return lResult ^ 0xc0000000 ^ lX8 ^ lY8;
      } else {
        return lResult ^ 0x40000000 ^ lX8 ^ lY8;
      }
    } else {
      return lResult ^ lX8 ^ lY8;
    }
  }
  function F(x: number, y: number, z: number) {
    return (x & y) | (~x & z);
  }
  function G(x: number, y: number, z: number) {
    return (x & z) | (y & ~z);
  }
  function H(x: number, y: number, z: number) {
    return x ^ y ^ z;
  }
  function I(x: number, y: number, z: number) {
    return y ^ (x | ~z);
  }
  function FF(
    a: number,
    b: number,
    c: number,
    d: number,
    x: any,
    s: number,
    ac: number
  ) {
    a = AddUnsigned(a, AddUnsigned(AddUnsigned(F(b, c, d), x), ac));
    return AddUnsigned(RotateLeft(a, s), b);
  }
  function GG(
    a: number,
    b: number,
    c: number,
    d: number,
    x: any,
    s: number,
    ac: number
  ) {
    a = AddUnsigned(a, AddUnsigned(AddUnsigned(G(b, c, d), x), ac));
    return AddUnsigned(RotateLeft(a, s), b);
  }
  function HH(
    a: number,
    b: number,
    c: number,
    d: number,
    x: any,
    s: number,
    ac: number
  ) {
    a = AddUnsigned(a, AddUnsigned(AddUnsigned(H(b, c, d), x), ac));
    return AddUnsigned(RotateLeft(a, s), b);
  }
  function II(
    a: number,
    b: number,
    c: number,
    d: number,
    x: any,
    s: number,
    ac: number
  ) {
    a = AddUnsigned(a, AddUnsigned(AddUnsigned(I(b, c, d), x), ac));
    return AddUnsigned(RotateLeft(a, s), b);
  }
  function ConvertToWordArray(string: string) {
    var lWordCount;
    var lMessageLength = string.length;
    var lNumberOfWords_temp1 = lMessageLength + 8;
    var lNumberOfWords_temp2 =
      (lNumberOfWords_temp1 - (lNumberOfWords_temp1 % 64)) / 64;
    var lNumberOfWords = (lNumberOfWords_temp2 + 1) * 16;
    var lWordArray = Array(lNumberOfWords - 1);
    var lBytePosition = 0;
    var lByteCount = 0;
    while (lByteCount < lMessageLength) {
      lWordCount = (lByteCount - (lByteCount % 4)) / 4;
      lBytePosition = (lByteCount % 4) * 8;
      lWordArray[lWordCount] =
        lWordArray[lWordCount] |
        (string.charCodeAt(lByteCount) << lBytePosition);
      lByteCount++;
    }
    lWordCount = (lByteCount - (lByteCount % 4)) / 4;
    lBytePosition = (lByteCount % 4) * 8;
    lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80 << lBytePosition);
    lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
    lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
    return lWordArray;
  }
  function WordToHex(lValue: number) {
    var WordToHexValue = "",
      WordToHexValue_temp = "",
      lByte,
      lCount;
    for (lCount = 0; lCount <= 3; lCount++) {
      lByte = (lValue >>> (lCount * 8)) & 255;
      WordToHexValue_temp = "0" + lByte.toString(16);
      WordToHexValue =
        WordToHexValue +
        WordToHexValue_temp.substr(WordToHexValue_temp.length - 2, 2);
    }
    return WordToHexValue;
  }
  function Utf8Encode(string: string) {
    string = string.replace(/\r\n/g, "\n");
    var utftext = "";
    for (var n = 0; n < string.length; n++) {
      var c = string.charCodeAt(n);
      if (c < 128) {
        utftext += String.fromCharCode(c);
      } else if (c > 127 && c < 2048) {
        utftext += String.fromCharCode((c >> 6) | 192);
        utftext += String.fromCharCode((c & 63) | 128);
      } else {
        utftext += String.fromCharCode((c >> 12) | 224);
        utftext += String.fromCharCode(((c >> 6) & 63) | 128);
        utftext += String.fromCharCode((c & 63) | 128);
      }
    }
    return utftext;
  }
  var x = Array();
  var k, AA, BB, CC, DD, a, b, c, d;
  var S11 = 7,
    S12 = 12,
    S13 = 17,
    S14 = 22;
  var S21 = 5,
    S22 = 9,
    S23 = 14,
    S24 = 20;
  var S31 = 4,
    S32 = 11,
    S33 = 16,
    S34 = 23;
  var S41 = 6,
    S42 = 10,
    S43 = 15,
    S44 = 21;
  string = Utf8Encode(string);
  x = ConvertToWordArray(string);
  a = 0x67452301;
  b = 0xefcdab89;
  c = 0x98badcfe;
  d = 0x10325476;
  for (k = 0; k < x.length; k += 16) {
    AA = a;
    BB = b;
    CC = c;
    DD = d;
    a = FF(a, b, c, d, x[k + 0], S11, 0xd76aa478);
    d = FF(d, a, b, c, x[k + 1], S12, 0xe8c7b756);
    c = FF(c, d, a, b, x[k + 2], S13, 0x242070db);
    b = FF(b, c, d, a, x[k + 3], S14, 0xc1bdceee);
    a = FF(a, b, c, d, x[k + 4], S11, 0xf57c0faf);
    d = FF(d, a, b, c, x[k + 5], S12, 0x4787c62a);
    c = FF(c, d, a, b, x[k + 6], S13, 0xa8304613);
    b = FF(b, c, d, a, x[k + 7], S14, 0xfd469501);
    a = FF(a, b, c, d, x[k + 8], S11, 0x698098d8);
    d = FF(d, a, b, c, x[k + 9], S12, 0x8b44f7af);
    c = FF(c, d, a, b, x[k + 10], S13, 0xffff5bb1);
    b = FF(b, c, d, a, x[k + 11], S14, 0x895cd7be);
    a = FF(a, b, c, d, x[k + 12], S11, 0x6b901122);
    d = FF(d, a, b, c, x[k + 13], S12, 0xfd987193);
    c = FF(c, d, a, b, x[k + 14], S13, 0xa679438e);
    b = FF(b, c, d, a, x[k + 15], S14, 0x49b40821);
    a = GG(a, b, c, d, x[k + 1], S21, 0xf61e2562);
    d = GG(d, a, b, c, x[k + 6], S22, 0xc040b340);
    c = GG(c, d, a, b, x[k + 11], S23, 0x265e5a51);
    b = GG(b, c, d, a, x[k + 0], S24, 0xe9b6c7aa);
    a = GG(a, b, c, d, x[k + 5], S21, 0xd62f105d);
    d = GG(d, a, b, c, x[k + 10], S22, 0x2441453);
    c = GG(c, d, a, b, x[k + 15], S23, 0xd8a1e681);
    b = GG(b, c, d, a, x[k + 4], S24, 0xe7d3fbc8);
    a = GG(a, b, c, d, x[k + 9], S21, 0x21e1cde6);
    d = GG(d, a, b, c, x[k + 14], S22, 0xc33707d6);
    c = GG(c, d, a, b, x[k + 3], S23, 0xf4d50d87);
    b = GG(b, c, d, a, x[k + 8], S24, 0x455a14ed);
    a = GG(a, b, c, d, x[k + 13], S21, 0xa9e3e905);
    d = GG(d, a, b, c, x[k + 2], S22, 0xfcefa3f8);
    c = GG(c, d, a, b, x[k + 7], S23, 0x676f02d9);
    b = GG(b, c, d, a, x[k + 12], S24, 0x8d2a4c8a);
    a = HH(a, b, c, d, x[k + 5], S31, 0xfffa3942);
    d = HH(d, a, b, c, x[k + 8], S32, 0x8771f681);
    c = HH(c, d, a, b, x[k + 11], S33, 0x6d9d6122);
    b = HH(b, c, d, a, x[k + 14], S34, 0xfde5380c);
    a = HH(a, b, c, d, x[k + 1], S31, 0xa4beea44);
    d = HH(d, a, b, c, x[k + 4], S32, 0x4bdecfa9);
    c = HH(c, d, a, b, x[k + 7], S33, 0xf6bb4b60);
    b = HH(b, c, d, a, x[k + 10], S34, 0xbebfbc70);
    a = HH(a, b, c, d, x[k + 13], S31, 0x289b7ec6);
    d = HH(d, a, b, c, x[k + 0], S32, 0xeaa127fa);
    c = HH(c, d, a, b, x[k + 3], S33, 0xd4ef3085);
    b = HH(b, c, d, a, x[k + 6], S34, 0x4881d05);
    a = HH(a, b, c, d, x[k + 9], S31, 0xd9d4d039);
    d = HH(d, a, b, c, x[k + 12], S32, 0xe6db99e5);
    c = HH(c, d, a, b, x[k + 15], S33, 0x1fa27cf8);
    b = HH(b, c, d, a, x[k + 2], S34, 0xc4ac5665);
    a = II(a, b, c, d, x[k + 0], S41, 0xf4292244);
    d = II(d, a, b, c, x[k + 7], S42, 0x432aff97);
    c = II(c, d, a, b, x[k + 14], S43, 0xab9423a7);
    b = II(b, c, d, a, x[k + 5], S44, 0xfc93a039);
    a = II(a, b, c, d, x[k + 12], S41, 0x655b59c3);
    d = II(d, a, b, c, x[k + 3], S42, 0x8f0ccc92);
    c = II(c, d, a, b, x[k + 10], S43, 0xffeff47d);
    b = II(b, c, d, a, x[k + 1], S44, 0x85845dd1);
    a = II(a, b, c, d, x[k + 8], S41, 0x6fa87e4f);
    d = II(d, a, b, c, x[k + 15], S42, 0xfe2ce6e0);
    c = II(c, d, a, b, x[k + 6], S43, 0xa3014314);
    b = II(b, c, d, a, x[k + 13], S44, 0x4e0811a1);
    a = II(a, b, c, d, x[k + 4], S41, 0xf7537e82);
    d = II(d, a, b, c, x[k + 11], S42, 0xbd3af235);
    c = II(c, d, a, b, x[k + 2], S43, 0x2ad7d2bb);
    b = II(b, c, d, a, x[k + 9], S44, 0xeb86d391);
    a = AddUnsigned(a, AA);
    b = AddUnsigned(b, BB);
    c = AddUnsigned(c, CC);
    d = AddUnsigned(d, DD);
  }
  var temp = WordToHex(a) + WordToHex(b) + WordToHex(c) + WordToHex(d);
  return temp.toLowerCase();
};

export const alertBox = (
  title: string,
  message: string | undefined,
  action: () => void
) => {
  Alert.alert(
    title,
    message,
    [
      {
        text: "OK",
        onPress: () => {
          action();
        },
      },
    ],
    { cancelable: false }
  );
};

export const sleep = (ms: number | undefined) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const errorStrings = [
  "Email and Mobile both are already verified!",
  "Invalid OTP type!",
  "You are not authorized, please use owner account!",
  "EarthID does not exists with this wallet!",
  "You are not authorized!",
  "Account already exists with this wallet!",
  "EarthID already exists with this email!",
  "EarthID already exists with this mobile number!",
  "EarthID already exists with this deviceId!",
];

export const decryptQRCode = (
  encryptedData: string | CryptoJS.lib.CipherParams
) => {
  return new Promise((resolve, reject) => {
    var bytes = CryptoJS.AES.decrypt(encryptedData, AES_ENCRYPTION_SALT);
    var decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    console.log("decryptedData: ", decryptedData);
    resolve(decryptedData);
  });
};
