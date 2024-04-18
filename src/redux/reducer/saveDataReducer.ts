import { ACTION_TYPES } from "../actions/types";

export const SavedQrData = (state = {}, { type, qrListData }: any) => {
  switch (type) {
    case ACTION_TYPES.SAVE_QR:
      return { ...state, qrListData, isLoading: true };
    default:
      return { ...state };
  }
};

export const SavedCredVerify = (
  state = {},
  { type, credVerifydata }: any
) => {
  switch (type) {
    case ACTION_TYPES.SAVE_CREDVERIFY:
      return { ...state, credVerifydata };
    default:
      return { ...state };
  }
};

export const SavedSecurityDatas = (state = {}, { type, securityData }: any) => {

  switch (type) {
    case ACTION_TYPES.SAVE_SECURITY:
    
      return { ...state, securityData };
    default:
      return { ...state };
  }
};

const initialState = {
  isToggleOn: false,
};


export const toggleReducer = (state = {}, { type, index }: any) => {
  switch (type) {
    case ACTION_TYPES.SAVE_TOGGLE:
      return {
        ...state,
        index,
      };
    default:
      return state;
  }
};

export const EditProfileReducer = (state = [], action:any) => {
  switch (action.type) {
    case 'EDIT_PROFILE_DATA':
      return [...state, ...action.payload];
    default:
      return state;
  }
};



