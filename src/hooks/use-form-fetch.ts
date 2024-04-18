import { useState } from "react";
import { postFormData } from "../utils/service";

export type IResponse = {
  data?: any;
  loading?: boolean;
  error?: string;
  fetch?: any;
};

const useFormData = (): IResponse => {
  const [loading, setloading] = useState<boolean>(false);
  const [data, setData] = useState<any>(undefined);
  const [error, serError] = useState<any>(undefined);

  const fetch = async (url: string, requestData?: any, methodName = "POST") => {
    setloading(true);
    try {
      const response = await postFormData(url, requestData);

      if (response.status === 201 || response.status === 200) {
        const JsonResponse = await response.json();
     
        setData(JsonResponse);
      } else {
        const JsonResponse = await response.json();
        throw new Error(JsonResponse.message);
      }
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

export { useFormData };
