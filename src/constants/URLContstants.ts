// @ts-ignore
//export const EARTHID_DEV_BASE = "https://apiv2.myearth.id";
export const EARTHID_DEV_BASE = "https://stage-apiv2.myearth.id";
export const SSI_BASE_URL = "https://ssi-gbg.myearth.id/api";
export const EARTHID_NEW_DEV_BASE = "https://apitest.myearth.id";

export const URI = {
  ACCOUNT: {
    GENERATE_KEYS: `${EARTHID_DEV_BASE}/contract/generateKeys`,
    CREATE_ACCOUNT: `${EARTHID_DEV_BASE}/user/registration`,
    APPROVE_EMAIL_OTP: `${EARTHID_DEV_BASE}/verification/emailVerify`,
    APPROVE_PHONE_OTP: `${EARTHID_DEV_BASE}/verification/phoneVerify`,
    APPROVE_REGQR_OTP: `${EARTHID_NEW_DEV_BASE}/verification/regQrPhoneVerify`,
    CONTRACT_CALL: `${EARTHID_DEV_BASE}/contract/functionCall`,
    GET_HISTORY: `${EARTHID_DEV_BASE}/history/getHistory`,
    GET_USERDID: `${SSI_BASE_URL}/user/did`,
  },
};

// export const AWS_API_BASE = "192.168.1.12:3000/api2/";
//export const AWS_API_BASE = "54.210.18.24:3000/api2/";
export const AWS_API_BASE = "space.myearth.id/api2/";

export const OPEN_BANK_BASE_URL = "https://api-auth.4wrd.tech";
export const OPEN_BANK_BASE2_URL = "https://api.sandbox.4wrd.tech"

export const OPEN_BANK_KEYS_MASTERCARD = {
  "Client_Id": "5nh3jig6u5gui43q15hpidtarv",
  "Client_Secret": "c0tq5pnea25gmpedtr569dfbtub6ee38a6faasduhornt9oan4c"
}

export const OPEN_BANK_KEYS_WOCCU = {
  "Client_Id": "4plvjtgqol2m3unoo472og1892",
  "Client_Secret": "1d2pc7a209m6njsrffaj652dak4ks3edgpqfb4qvdai34adplij3"
}

export const ALLOWED_DOMAINS = [
  ".amazon.in",
  ".amazon.com",
  ".media-amazon.com",
];

export const PARAM_KEYS = {
  DEFAULT_STORE_NAME: "storeName",
  DISBURSEMENT_PAYMENT_METHOD: "paymentMethod",
  PIN_CODE: "pinCode",
  COUNTRY_CODE: "countryCode",
  PAGE_ID: "pageId",
  LOCALE: "locale",
};

export const HEADER_KEYS = {
  USER_AGENT: "User-Agent",
};
