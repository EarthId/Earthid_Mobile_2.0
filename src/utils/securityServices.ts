import axios from "react-native-axios";
import { API_URL } from "./urlApi";

const SUBSCRIPTION_KEY = "face5ak378gnHa9gnlDktat06kmUfa4nIga";

const subscribedHeader = {
  ["face-app-key"]: SUBSCRIPTION_KEY,
};

export const SERVICE = {
  REGISTER_FACE: async (reqBody: any) =>
    await axios.post(`${API_URL.FACE_REGISTER}`, reqBody, {
      headers: subscribedHeader,
    }),
  IDENTIFY_FACE: async (reqBody: any) =>
    await axios.post(`${API_URL.IDENTIFY_FACE}`, reqBody, {
      headers: subscribedHeader,
    }),
  REGISTER_DEVICE: async (reqBody: any) =>
    await axios.put(`${API_URL.REGISTER_DEVICE}`, reqBody, {
      headers: subscribedHeader,
    }),
  DEVICE_STATUS: async (params: any) =>
    await axios.get(`${API_URL.DEVICE_STATUS}`, {
      params,
      headers: subscribedHeader,
    }),
  CHECK_ACCESS: async (reqBody: any) =>
    await axios.post(`${API_URL.CHECK_ACCESS}`, reqBody, {
      headers: subscribedHeader,
    }),
  UNCONFIGURE_DEVICE: async (reqBody: any) =>
    await axios.post(`${API_URL.UNCONFIGURE_DEVICE}`, reqBody, {
      headers: subscribedHeader,
    }),
};
