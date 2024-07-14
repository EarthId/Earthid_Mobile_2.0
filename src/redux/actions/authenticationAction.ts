import {
  getCall,
  getCallWithHeader,
  newssiGetCall,
  newssiPostCall,
  postCall,
  ssiPostCall,
} from "../../utils/service";
import { ACTION_TYPES } from "./types";
import { URI } from "../../constants/URLContstants";
import { SnackBar } from "../../components/SnackBar";
import { IUserAccountRequest } from "../../typings/AccountCreation/IUserAccount";
import { IUserSchemaRequest } from "../../typings/AccountCreation/IUserSchema";
import { generateIssuerDid, generateKeyPair, generateUserDid } from "../../utils/earthid_account";;
const {
  ACCOUNT: {
    CREATE_ACCOUNT: createAccountUrl,
    APPROVE_EMAIL_OTP: approveOTPEmail,
    APPROVE_PHONE_OTP: approvePhoneOtp,
    APPROVE_REGQR_OTP: approveRegQrPhoneOTP,
    GET_HISTORY: get_History,
  },
} = URI;

let createSchemaUrl = "https://ssi-gbg.myearth.id/api/issuer/createSchema";

export const GeneratedKeysAction = () => async (dispatch: any): Promise<any> => {
  try {
    dispatch({
      type: ACTION_TYPES.GENERATED_KEYS_LOADING,
    });

    const response = await getCallWithHeader(
      "https://api-stage.myearth.id/contract/generateKeys"
    );
    const responseData = await _responseHandler(response);
    console.log('responseData from response handler',responseData)

    // Use Promise.all to parallelize the API calls
    const [responseIssuerDid, responseGenerateKeyPair, responseNewUserDid] = await Promise.all([
      newssiGetCall(generateIssuerDid, "GET", responseData?.result?.publicKey),
      newssiGetCall(generateKeyPair, "GET", responseData?.result?.publicKey),
      newssiGetCall(generateUserDid, "GET", responseData?.result?.publicKey),
    ]);

    const [issuerData, generateKeyPairs, newUserDid] = await Promise.all([
      _responseHandler(responseIssuerDid),
      _responseHandler(responseGenerateKeyPair),
      _responseHandler(responseNewUserDid),
    ]);

    const data = {
      issuerDid: issuerData.data,
      generateKeyPair: generateKeyPairs.data,
      newUserDid: newUserDid.data,
    };

    dispatch({
      type: ACTION_TYPES.GENERATED_KEYS_RESPONSE,
      payload: {
        responseData: { ...responseData, ...data },
      },
    });
  } catch (error) {
    console.error('Error:', error);

    dispatch({
      type: ACTION_TYPES.GENERATED_KEYS_ERROR,
    });
    SnackBar({
      indicationMessage: "Internal Server Error, please try again later",
      actionMessage: "Internal Server Error",
    });
  }
};



// export const dispatchExistingKeys = async (keysData: any, dispatch: any) => {
 
 
   

//     const issuerDid = 

//     dispatch({
//       type: ACTION_TYPES.GENERATED_KEYS_RESPONSE,
//       payload: {
//         responseData: { ...responseData, ...data },
//       },
//     });
// };


export const createAccount = (requestPayload: IUserAccountRequest) => async (dispatch: any): Promise<any> => {
  try {
    dispatch({
      type: ACTION_TYPES.CREATEDACCOUNT,
    });
    console.log('requestPayload',JSON.stringify(requestPayload))
    // Define the array of promises for parallel execution
    const promises = [
      postCall(createAccountUrl, requestPayload),
      // Add other API calls here if needed
    ];

    // Execute the promises in parallel
    const [response] = await Promise.all(promises);
    console.log('response-===>',response)

    // Handle the response
    const responseData = await _responseHandler(response);

    dispatch({
      type: ACTION_TYPES.CREATED_ACCOUNT_RESPONSE,
      payload: {
        responseData,
        isLoading: false,
        errorMesssage: "",
      },
    });
  } catch (error: any) {
    console.error('Error:', error);

    dispatch({
      type: ACTION_TYPES.CREATED_ACCOUNT_ERROR,
      payload: {
        errorMesssage: error,
        isLoading: false,
      },
    });
  }
};

//create schema

export const createSchema =
  (requestPayload: IUserSchemaRequest) =>
  async (dispatch: any): Promise<any> => {
    let responseData;
    try {
      dispatch({
        type: ACTION_TYPES.CREATEDSCHEMA,
      });
      const response = await ssiPostCall(createSchemaUrl, requestPayload);
      responseData = await _responseHandler(response);
   
      dispatch({
        type: ACTION_TYPES.CREATED_SCHEMA_RESPONSE,
        payload: {
          responseData,
          isLoading: false,
          errorMesssage: "",
        },
      });
    } catch (error) {
     
      dispatch({
        type: ACTION_TYPES.CREATED_SCHEMA_ERROR,
        payload: {
          errorMesssage: error,
        },
      });
    }
  };


  //create user signature


  export const createUserSignature =
  (requestPayload: any, url:string , key:any) =>
  async (dispatch: any): Promise<any> => {
    let responseData;
    try {
      dispatch({
        type: ACTION_TYPES.CREATEUSERSIGNATURE,
      });
      const response = await newssiPostCall(url, requestPayload , key);
      responseData = await _responseHandler(response);
  
      dispatch({
        type: ACTION_TYPES.CREATED_USERSIGNATURE_RESPONSE,
        payload: {
          responseData,
          isLoading: false,
          errorMesssage: "",
        },
      });
    } catch (error) {

      dispatch({
        type: ACTION_TYPES.CREATED_USERSIGNATURE_ERROR,
        payload: {
          errorMesssage: error,
        },
      });
    }
  };

export const  approveOTP =
  (requestPayload: any, type: string) =>
  async (dispatch: any): Promise<any> => {

    let responseData;
    try {
      dispatch({
        type: ACTION_TYPES.APPROVE_OTP,
      });
      let response;
      if (type === "phone") {
        response = await postCall(approvePhoneOtp, requestPayload);
        SnackBar({
          indicationMessage: "Verify Mobile number should be verified successfully",
        });
      } else {
        response = await postCall(approveOTPEmail, requestPayload);
        SnackBar({
          indicationMessage: "Verify Email id should be verified successfully",
        });
      }

      responseData = await _responseHandler(response);


      dispatch({
        type: ACTION_TYPES.APPROVEOTP_RESPONSE,
        payload: {
          responseData,
          errorMesssage: "",
        },
      });
    } catch (error) {
   
      dispatch({
        type: ACTION_TYPES.APPROVEOTP_ERROR,
        payload: {
          errorMesssage: error,
        },
      });
      SnackBar({
        indicationMessage: "Please enter a correct OTP",
      });
    }
  };


  export const  approveRegQrOTP =
  (requestPayload: any, type: string) =>
  async (dispatch: any): Promise<any> => {

    let responseData;
    try {
      dispatch({
        type: ACTION_TYPES.APPROVE_OTP,
      });
      let response;
      if (type === "phone") {
        response = await postCall(approveRegQrPhoneOTP, requestPayload);
        // SnackBar({
        //   indicationMessage: "Verify Mobile number should be verified successfully",
        // });
      } else {
        response = await postCall(approveOTPEmail, requestPayload);
        // SnackBar({
        //   indicationMessage: "Verify Email id should be verified successfully",
        // });
      }

      responseData = await _responseHandler(response);


      dispatch({
        type: ACTION_TYPES.APPROVEOTP_RESPONSE,
        payload: {
          responseData,
          errorMesssage: "",
        },
      });
    } catch (error) {
   
      dispatch({
        type: ACTION_TYPES.APPROVEOTP_ERROR,
        payload: {
          errorMesssage: error,
        },
      });
      SnackBar({
        indicationMessage: "Please enter a correct OTP",
      });
    }
  };

export const getHistory =
  (requestPayload: any) =>
  async (dispatch: any): Promise<any> => {
    let responseData;
    try {
      dispatch({
        type: ACTION_TYPES.GET_HISTORY_CALL,
      });
      const response = await getCall(
        `${get_History}?userId=${requestPayload?.userId}&publicKey=${requestPayload?.publicKey}`
      );
      responseData = await _responseHandler(response);


      dispatch({
        type: ACTION_TYPES.GET_HISTORY_CALL_RESPONSE,
        payload: {
          responseData,
          errorMesssage: "",
        },
      });
    } catch (error) {
    
      dispatch({
        type: ACTION_TYPES.GET_HISTORY_CALL_ERROR,
        payload: {
          errorMesssage: error,
        },
      });
    }
  };

export const byPassUserDetailsRedux =
  (userDetails: any,responseUserSpecificBucket: string) =>
  async (dispatch: any): Promise<any> => {
    dispatch({
      type: ACTION_TYPES.CREATED_ACCOUNT_RESPONSE,
      payload: {
        isLoading: false,
        responseData: userDetails,
        responseUserSpecificBucket:responseUserSpecificBucket
      },
    });
  };


export const saveProfileDetails =
(profileDetails: any) =>
async (dispatch: any): Promise<any> => {
  dispatch({
    type: ACTION_TYPES.PROFILEDETAILS,
    payload: {
      isLoading: false,
      profileDetails,
    },
  });
};

export const saveFeature =
(isVCFeatureEnabled: any) =>
async (dispatch: any): Promise<any> => {
  dispatch({
    type: ACTION_TYPES.SAVEFEATURE,
    payload: {
      isLoading: false,
      isVCFeatureEnabled,
    },
  });
};

export const saveDocuments =
  (documentsDetails: any) =>
  async (dispatch: any): Promise<any> => {
    dispatch({
      type: ACTION_TYPES.SAVE_DOCUMENTS,
      payload: {
        isLoading: false,
        responseData: documentsDetails,
      },
    });
  };

  export const updateDocuments =
  (originalArrayOfDocuments:any,index: number,updatedObject:any) =>
  async (dispatch: any): Promise<any> => {
    originalArrayOfDocuments?.splice(index,1,updatedObject)
    dispatch({
      type: ACTION_TYPES.UPDATE_DOCUMENTS,
      payload: {
        isLoading: false,
        responseData: originalArrayOfDocuments,
      },
    });
  };

export const FlushData =
  () =>
  async (dispatch: any): Promise<any> => {
    dispatch({
      type: "DELETE",
    });
  };

const _responseHandler = async (response: any): Promise<any> => {
  return new Promise(async (resolve, reject) => {
    if (response.status === 200 || response.status === 201) {
      const responseData = await response.json();

      return resolve(responseData);
    } else {
      const responseData = await response.json();
      reject(responseData.message);
    }
  });
};
 

export const _s3responseHandler = async (response: any): Promise<any> => {
  return new Promise(async (resolve, reject) => {
    if (response) {
     // const responseData = await response.json();

      return resolve(response);
    } else {
      const responseData = await response.json();
      reject(responseData.message);
    }
  });
};
