import { ACTION_TYPES } from "./types";

export const savingCustomQrData =
  (qrListData: any) =>
  async (dispatch: any): Promise<any> => {
    dispatch({
      type: ACTION_TYPES.SAVE_QR,
      qrListData,
    });
  };
export const savingProfilePictures =
  (profileData: any) =>
  async (dispatch: any): Promise<any> => {
    dispatch({
      type: ACTION_TYPES.SAVE_PROFILE_PIC,
      profileData: profileData,
    });
  };

export const SaveSecurityConfiguration =
  (securityData: []) =>
  async (dispatch: any): Promise<any> => {
    dispatch({
      type: ACTION_TYPES.SAVE_SECURITY,
      securityData: securityData,
    });
  };


  export const SaveVerifyCred =
  (credVerifydata: any) =>
  async (dispatch: any): Promise<any> => {
    dispatch({
      type: ACTION_TYPES.SAVE_CREDVERIFY,
      credVerifydata: credVerifydata,
    });
  };

  export const toggleAction = 
  (index: {}) =>
  async (dispatch: any): Promise<any> => {
    dispatch({
    type: ACTION_TYPES.SAVE_TOGGLE,
    index:index
  });
};