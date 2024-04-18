import { useState } from "react";
import { SnackBar } from "../components/SnackBar";
import { fetchParams, getCall, postCall, postFormData } from "../utils/service";

export type IResponse = {
  data?: any;
  loading?: boolean;
  error?: string;
  fetch?: any;
};

const useFetch = (): IResponse => {
  const [loading, setloading] = useState<boolean>(false);
  const [data, setData] = useState<any>(undefined);
  const [error, serError] = useState<any>(undefined);

  const fetch = async (url: string, payLoad?: any, methodName = "POST") => {

    try {
      let response;
      switch (methodName) {
        case "POST":
          response = await postCall(url, payLoad);
          break;
        case "DELETE":
          response = await fetchParams(url, payLoad, methodName);
          break;
        case "GET":
          response = await getCall(url, payLoad);
          break;
        case "FORM-DATA":
          response = await postFormData(url, payLoad);
          break;
      }

      if ((response && response?.status === 201) || response?.status === 200) {
        const JsonResponse = await response.json();
      
        setData(JsonResponse);
      } else {
        const JsonResponse = await response.json();

        throw new Error(JsonResponse?.message);
      }
    } catch (error: any) {
   
      SnackBar({
        indicationMessage: error?.message,
      });
      serError(error);
    }
    setloading(false);
  };

  return {
    data,
    loading,
    error,
    fetch,
  };
};

export { useFetch };
