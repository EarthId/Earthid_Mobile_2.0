import { newssiApiKey, ssiApiKey } from "./earthid_account";


export const postFormData = async (requestURI: string, payload: any) => {
  try {
    const formData = new FormData();
    formData.append('image', { uri: payload?.uri, name: payload?.name, type: payload?.type });
    
    const response = await fetch(requestURI, {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "multipart/form-data",
      },
      body: formData,
    });

    if (!response.ok) {
      // Handle non-successful HTTP responses (e.g., 404, 500, etc.)
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return response; // Assuming you want to work with JSON responses
  } catch (error) {
    // Handle and log the error
    console.error("Error in postFormData:", error);
    throw error; // You can choose to re-throw the error or handle it differently
  }
};


export const postCall = (
  uri: string,
  payload?: any,
  method: string = "POST"
): Promise<any> => {


  return fetch(uri, {
    method,
    headers: {
      "Content-Type": "application/json",
      authkey: "fae2622d-7b73-4fc6-a536-202cabe75187",
    },
    body: JSON.stringify(payload),
  });
};

export const fetchParams = (
  uri: string,
  payload: any,
  method: string = "DELETE"
): Promise<any> => {

  return fetch(uri, {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
};


export const getCall = (uri: string, method: string = "GET"): any => {
  return fetch(uri);
};

export const getCallWithHeader = (uri: string, method: string = "GET"): any => {
  return fetch(uri, {
    method: "GET", // or 'PUT'
    headers: {
      "Content-Type": "application/json",
      authkey: "fae2622d-7b73-4fc6-a536-202cabe75187",
    },
  });
};

export const ssiGetCall = async (
  uri: string,
  method: string = "GET",
  key: string
): Promise<any> => {
  try {
    const response = await fetch(uri, {
      method,
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": ssiApiKey,
        publicKey: key,
      },
    });

    if (!response.ok) {
      // Handle non-successful HTTP responses (e.g., 404, 500, etc.)
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return response; // Assuming you want to work with JSON responses
  } catch (error) {
    // Handle and log the error
    console.error("Error in ssiGetCall:", error);
    throw error; // You can choose to re-throw the error or handle it differently
  }
};


export const newssiGetCall = async (
  uri: string,
  method: string = "GET",
  key: string
): Promise<any> => {
  console.log('uri=========>', uri);
  console.log('key=========>', key);

  try {
    const response = await fetch(uri, {
      method,
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": newssiApiKey,
        publicKey: key,
      },
    });

    if (!response.ok) {
      // Handle non-successful HTTP responses (e.g., 404, 500, etc.)
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return response; // Assuming you want to work with JSON responses
  } catch (error) {
    // Handle and log the error
    console.error("Error in newssiGetCall:", error);
    throw error; // You can choose to re-throw the error or handle it differently
  }
};

export const ssiPostCall = async (
  uri: string,
  payload?: any,
  method: string = "POST"
): Promise<any> => {
  try {
    const response = await fetch(uri, {
      method,
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": ssiApiKey,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      // Handle non-successful HTTP responses (e.g., 404, 500, etc.)
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return response; // Assuming you want to work with JSON responses
  } catch (error) {
    // Handle and log the error
    console.error("Error in ssiPostCall:", error);
    throw error; // You can choose to re-throw the error or handle it differently
  }
};


export const newssiPostCall = async (
  uri: string,
  payload?: any,
  method: string = "POST",
  key?: any
): Promise<any> => {
  try {
    const response = await fetch(uri, {
      method,
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": newssiApiKey,
        privateKey: key,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      // Handle non-successful HTTP responses (e.g., 404, 500, etc.)
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return response; // Assuming you want to work with JSON responses
  } catch (error) {
    // Handle and log the error
    console.error("Error in newssiPostCall:", error);
    throw error; // You can choose to re-throw the error or handle it differently
  }
};

