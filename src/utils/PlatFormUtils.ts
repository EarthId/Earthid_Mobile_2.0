import { NativeModules, Platform } from "react-native";

/**
 * @description Checks if the os is andriod or not.
 */
export const isAndroid = Platform.OS === "android";

export const isEarthId = () => {
  // const outData = await getAppName();
  // console.log("getAsynOperation()", outData);
  return false;
};

export const isFeatureNeed = () => {
  // const outData = await getAppName();
  // console.log("getAsynOperation()", outData);
  return true;
};

/**
 * @description Provides the the OS platform level language on the user's device. The logic supports
 * both Android platform. Convert xx_YY to xx-YY format as that is the standard format i18next supports.
 */
export const platformLanguage =
  NativeModules?.I18nManager?.localeIdentifier?.replace(/_/, "-");
