// @ts-ignore
//export const EARTHID_DEV_BASE = "https://apiv2.myearth.id";
export const EARTHID_DEV_BASE = "https://stage-apiv2.myearth.id";
export const SSI_BASE_URL = "https://ssi-gbg.myearth.id/api";

export const URI = {
  ACCOUNT: {
    GENERATE_KEYS: `${EARTHID_DEV_BASE}/contract/generateKeys`,
    CREATE_ACCOUNT: `${EARTHID_DEV_BASE}/user/registration`,
    APPROVE_EMAIL_OTP: `${EARTHID_DEV_BASE}/verification/emailVerify`,
    APPROVE_PHONE_OTP: `${EARTHID_DEV_BASE}/verification/phoneVerify`,
    CONTRACT_CALL: `${EARTHID_DEV_BASE}/contract/functionCall`,
    GET_HISTORY: `${EARTHID_DEV_BASE}/history/getHistory`,
    GET_USERDID: `${SSI_BASE_URL}/user/did`,
  },
};

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
