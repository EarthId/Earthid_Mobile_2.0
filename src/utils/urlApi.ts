const SERVER_BASE_URL =
  "https://rr6pyh6ocg.execute-api.ap-south-1.amazonaws.com";
const API_VERSION = "/api";

export const API_URL = {
  FACE_REGISTER: `${SERVER_BASE_URL}${API_VERSION}/device/registerFaceInEarthId`,
  IDENTIFY_FACE: `${SERVER_BASE_URL}${API_VERSION}/device/checkFaceAccessInEarthId`,
  DEVICE_STATUS: `${SERVER_BASE_URL}${API_VERSION}/device/status`,
  REGISTER_DEVICE: `${SERVER_BASE_URL}${API_VERSION}/device/register`,
  UNCONFIGURE_DEVICE: `${SERVER_BASE_URL}${API_VERSION}/device/unconfigure`,
};

export const DEVICE = {
  IS_REGISTERED: "isRegistered",
};
