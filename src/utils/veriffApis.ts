
import axios from 'axios';
import CryptoJS from 'crypto-js';


const BASE_URL = 'https://stationapi.veriff.com';
const privateKey = "aa4ff163-8d5f-46ad-8cfa-fa26f885dec3";
const publicKey = "c9faf941-ea5e-40d3-8dc5-387c5fc23b8c"


export const createVerification = async () => {
    try {
      const data = {
        verification: {
          callback: 'https://session.myearth.id/earthid/api/status',
          vendorData: 'Postman test',
          timestamp: new Date().toISOString() // Current timestamp in ISO format
        }
      };
  
      const config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: `${BASE_URL}/v1/sessions/`,
        headers: {
          'Content-Type': 'application/json',
          'X-AUTH-CLIENT': publicKey
        },
        data: JSON.stringify(data) // Ensure data is stringified
      };
  
      const response = await axios.request(config);
      console.log('SessionCreated', response.data)
      return response.data;
    } catch (error) {
      throw new Error(`Error fetching data from createVerification: ${error}`);
    }
  };
  

export const uploadImage = async (content: string, context: string, sessionId: string) => {
  try {
    const timestamp = Date.now(); // Get current timestamp in milliseconds
    const dateObj = new Date(timestamp);
    
    const formattedTimestamp = dateObj.toISOString();
    
    console.log("Formatted timestamp is:", formattedTimestamp);


    const data = {
      image: {
        context: context,
        content: content,
        timestamp: formattedTimestamp
      }
    };

    var requestDataString = JSON.stringify(data);   
//console.log('UploadData#############################', data)
//hmac signature
const signature = await generateSignature(requestDataString)
console.log('hmacSignature:', signature)

    const config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `${BASE_URL}/v1/sessions/${sessionId}/media`,
      headers: {
        'Content-Type': 'application/json',
        'X-AUTH-CLIENT': publicKey,
        'X-HMAC-SIGNATURE': signature
      },
      data: data
    };

    const response = await axios.post(config.url, data, config); // Pass URL, data, and config separately
    console.log('ImageUploaded', response.data)
    return response.data;
  } catch (error: Error) {
    if (error.response) {
      // The request was made and the server responded with a status code that falls out of the range of 2xx
      console.log('Server Error:', error.response.data);
      console.log('Status Code:', error.response.status);
      console.log('Headers:', error.response.headers);
    } else if (error.request) {
      // The request was made but no response was received
      console.log('Request Error:', error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.log('General Error:', error.message);
    }
    throw new Error(`Error fetching data from uploadImage: ${error}`);
  }
};

export const updateVerificationStatus = async (sessionId: string) => {
    try {

    const timestamp = Date.now(); // Get current timestamp in milliseconds
    const dateObj = new Date(timestamp);
    
    const formattedTimestamp = dateObj.toISOString();
    
    console.log("Formatted timestamp is:", formattedTimestamp);

      const data = {
        verification: {
          status: 'submitted',
          timestamp: formattedTimestamp // Current timestamp in ISO format
        }
      };
      var requestDataString = JSON.stringify(data); 
      //hmac signature
const signature = await generateSignature(requestDataString)
console.log('hmacSignature:', signature)
  
      const config = {
        method: 'patch',
        maxBodyLength: Infinity,
        url: `${BASE_URL}/v1/sessions/${sessionId}`,
        headers: {
          'Content-Type': 'application/json',
          'X-AUTH-CLIENT': publicKey,
          'X-HMAC-SIGNATURE': signature
        },
        data: JSON.stringify(data) // Ensure data is stringified
      };
  
      const response = await axios.request(config);
      console.log('VerificationSubmitted', response.data)
      return response.data;
    } catch (error: Error) {
        if (error.response) {
          // The request was made and the server responded with a status code that falls out of the range of 2xx
          console.log('Server Error:', error.response.data);
          console.log('Status Code:', error.response.status);
          console.log('Headers:', error.response.headers);
        } else if (error.request) {
          // The request was made but no response was received
          console.log('Request Error:', error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log('General Error:', error.message);
        }
      throw new Error(`Error fetching data from updateVerificationStatus: ${error}`);
    }
  };


  export const getMediaData = async (sessionId: string) => {
    try {

      //hmac signature
      const signature = await generateSignature(sessionId)
      console.log('hmacSignature:', signature)

      const config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `${BASE_URL}/v1/sessions/${sessionId}/media`,
        headers: {
          'Content-Type': 'application/json',
          'X-AUTH-CLIENT': publicKey,
          'X-HMAC-SIGNATURE': signature
        }
      };
  
      const response = await axios.request(config);
      return response.data;
    } catch (error) {
      throw new Error(`Error fetching data from getMediaData: ${error}`);
    }
  };

  export const getPersonData = async (sessionId: string) => {
    try {

      //hmac signature
      const signature = await generateSignature(sessionId)
      console.log('hmacSignature:', signature)

      const config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `${BASE_URL}/v1/sessions/${sessionId}/person`,
        headers: {
          'Content-Type': 'application/json',
          'X-AUTH-CLIENT': publicKey,
          'X-HMAC-SIGNATURE': signature
        },
        data: '' // No data to send in a GET request
      };
  
      const response = await axios.request(config);
      console.log('ImageData', response.data)
      return response.data;
    } catch (error) {
      throw new Error(`Error fetching data from getPersonData: ${error}`);
    }
  };


  export const getSessionDecision = async (sessionId: string) => {
    try {

      //hmac signature
      const signature = await generateSignature(sessionId)
      console.log('hmacSignature:', signature)

      const config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `${BASE_URL}/v1/sessions/${sessionId}/decision/fullauto?version=1.0.0`,
        headers: {
          'Content-Type': 'application/json',
          'X-AUTH-CLIENT': publicKey,
          'X-HMAC-SIGNATURE': signature
        },
        data: '' // No data to send in a GET request
      };

      // Add a delay of 1 second (1000 milliseconds)
    await new Promise(resolve => setTimeout(resolve, 5000));
  
      const response = await axios.request(config);
      return response.data;
    } catch (error) {
      throw new Error(`Error fetching data from getSessionDecision: ${error}`);
    }
  };


  const generateSignature = (data: any) => {
    return CryptoJS.HmacSHA256(data, privateKey).toString();
  };