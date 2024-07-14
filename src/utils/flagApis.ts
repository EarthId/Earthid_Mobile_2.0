import axios, { AxiosRequestConfig} from 'axios';


export const appEnableFlag = async (data: any) => {

    const requestData: AxiosRequestConfig = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://apitest.myearth.id/consents',
        headers: { 
          'Content-Type': 'application/json'
        },
        data: JSON.stringify(data)
      };
    
      try {
        const response = await axios.request(requestData);
        console.log("Consent Api response============================",JSON.stringify(response.data));
        return response.data
      } catch (error) {
        console.error(error);
      }
}