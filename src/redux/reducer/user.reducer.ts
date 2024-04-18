import { SnackBar } from "../../components/SnackBar";
import { ACTION_TYPES } from "../actions/types";
const initialState = {
  isLoading: false,
};
export const SavedProfilePictures = (
  state = {},
  { type, profileData }: any
) => {
  switch (type) {
    case ACTION_TYPES.SAVE_PROFILE_PIC:
      return { ...state, profileData };
    default:
      return { ...state };
  }
};

export const SaveProfileDetails = (state = {}, { type, payload }: any) => {
  switch (type) {
    case ACTION_TYPES.PROFILEDETAILS:
      return { ...state, ...payload };
    default:
      return state;
  }
}

export const saveFeatures = (state = {}, { type, payload }: any) => {
  switch (type) {
    case ACTION_TYPES.SAVEFEATURE:
      return { ...state, ...payload };
    default:
      return state;
  }
}

export const userReducer = (state = initialState, { type, payload }: any) => {
  switch (type) {
    case ACTION_TYPES.GENERATED_KEYS_LOADING:
      return {
        ...state,
        isLoading: true,
        isGeneratedKeySuccess: false,
        isGeneratedKeyError: false,
      };
    case ACTION_TYPES.GENERATED_KEYS_RESPONSE:
      return {
        ...state,
        ...payload,
        isLoading: false,
        isGeneratedKeySuccess: true,
        isGeneratedKeyError: false,
      };
    case ACTION_TYPES.GENERATED_KEYS_ERROR:
      return {
        ...state,
        ...payload,
        isLoading: false,
        isGeneratedKeySuccess: false,
        isGeneratedKeyError: true,
      };
    default:
      return state;
  }
};
export const accountReducer = (state = {}, { type, payload }: any) => {
  switch (type) {
    case ACTION_TYPES.CREATEDACCOUNT:
      return {
        ...state,
        isLoading: true,
        isAccountCreatedSuccess: false,
        isAccountCreatedFailure: false,
      };
    case ACTION_TYPES.CREATED_ACCOUNT_RESPONSE:
      return {
        ...state,
        ...payload,
        isAccountCreatedSuccess: true,
        isLoading: false,
        isAccountCreatedFailure: false,
      };
    case ACTION_TYPES.CREATED_ACCOUNT_ERROR:
      return {
        ...state,
        ...payload,
        isLoading: false,
        isAccountCreatedSuccess: false,
        isAccountCreatedFailure: true,
      };
    default:
      return state;
  }
};

export const schemaReducer = (state = {}, { type, payload }: any) => {
  switch (type) {
    case ACTION_TYPES.CREATEDSCHEMA:
      return {
        ...state,
        isLoading: true,
        isAccountCreatedSuccess: false,
        isAccountCreatedFailure: false,
      };
    case ACTION_TYPES.CREATED_SCHEMA_RESPONSE:
      return {
        ...state,
        ...payload,
        isAccountCreatedSuccess: true,
        isLoading: false,
        isAccountCreatedFailure: false,
      };
    case ACTION_TYPES.CREATED_SCHEMA_ERROR:
      return {
        ...state,
        ...payload,
        isLoading: false,
        isAccountCreatedSuccess: false,
        isAccountCreatedFailure: true,
      };
    default:
      return state;
  }
};

//create signature reducer

export const createSignatureReducer = (state = {}, { type, payload }: any) => {
  switch (type) {
    case ACTION_TYPES.CREATEUSERSIGNATURE:
      return {
        ...state,
        isLoading: true,
        isAccountCreatedSuccess: false,
        isAccountCreatedFailure: false,
      };
    case ACTION_TYPES.CREATED_USERSIGNATURE_RESPONSE:
      return {
        ...state,
        ...payload,
        isAccountCreatedSuccess: true,
        isLoading: false,
        isAccountCreatedFailure: false,
      };
    case ACTION_TYPES.CREATED_USERSIGNATURE_ERROR:
      return {
        ...state,
        ...payload,
        isLoading: false,
        isAccountCreatedSuccess: false,
        isAccountCreatedFailure: true,
      };
    default:
      return state;
  }
};

export const contractReducer = (state = {}, { type, payload }: any) => {
  switch (type) {
    case ACTION_TYPES.CONTRACT_CALL:
      return {
        ...state,
        isLoading: true,
        isUserDetailsCreatedSuccessfull: false,
        isUserDetailsCreatedFailure: false,
      };
    case ACTION_TYPES.CONTRACT_CALL_RESPONSE:
      return {
        ...state,
        ...payload,
        isUserDetailsCreatedSuccessfull: true,
        isUserDetailsCreatedFailure: false,
      };
    case ACTION_TYPES.CONTRACT_CALL_ERROR:
      return {
        ...state,
        ...payload,
        isUserDetailsCreatedSuccessfull: false,
        isUserDetailsCreatedFailure: true,
      };
    default:
      return state;
  }
};

export const approveOTPReducer = (state = {}, { type, payload }: any) => {
  switch (type) {
    case ACTION_TYPES.APPROVE_OTP:
      return {
        ...state,
        isApproveLoading: true,
        isApproveOtpSuccess: false,
        isApproveOtpFailure: false,
      };
    case ACTION_TYPES.APPROVEOTP_RESPONSE:
      return {
        ...state,
        ...payload,
        isApproveLoading: false,
        isApproveOtpSuccess: true,
        isApproveOtpFailure: false,
      };
    case ACTION_TYPES.APPROVEOTP_ERROR:
      return {
        ...state,
        ...payload,
        isApproveLoading: false,
        isApproveOtpSuccess: false,
        isApproveOtpFailure: true,
      };
    default:
      return state;
  }
};

export const getHistoryReducer = (state = {}, { type, payload }: any) => {
  switch (type) {
    case ACTION_TYPES.GET_HISTORY_CALL:
      return {
        ...state,
        isLoading: true,
        isSuccess: false,
        isError: false,
      };
    case ACTION_TYPES.GET_HISTORY_CALL_RESPONSE:
      return {
        ...state,
        ...payload,
        isLoading: false,
        isSuccess: true,
        isError: false,
      };
    case ACTION_TYPES.GET_HISTORY_CALL_ERROR:
      return {
        ...state,
        ...payload,
        isLoading: false,
        isSuccess: false,
        isError: true,
      };
    default:
      return state;
  }
};

export const documentListReducer = (state = {}, { type, payload }: any) => {
  switch (type) {
    case ACTION_TYPES.SAVE_DOCUMENTS:
      return { ...state, ...payload };
      case ACTION_TYPES.UPDATE_DOCUMENTS:
        return { ...state, ...payload };
    default:
      return state;
  }
};
