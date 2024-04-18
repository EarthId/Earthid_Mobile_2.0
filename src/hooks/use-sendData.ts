import { useState } from "react";
import { getCall, postCall } from "../utils/service";

export type IResponse = {
  data?: any;
  loading?: boolean;
  error?: string;
  fetch?: any;
};

const useSendData = (): IResponse => {
  const [loading, setloading] = useState<boolean>(false);
  const [data, setData] = useState<any>(undefined);
  const [error, serError] = useState<any>(undefined);

  const fetch = async (url: string, reuestData?: any, methodName = "POST") => {
    setloading(true);
    try {
      const response =
        methodName === "POST"
          ? await postCall(url, reuestData)
          : await getCall(url);
   
      const JsonResponse = await response.json();
   
      setData(JsonResponse);
    } catch (error) {

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

export { useSendData };
