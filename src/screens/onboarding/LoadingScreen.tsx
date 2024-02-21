import { StackActions } from "@react-navigation/native";
import React, { useEffect } from "react";
import {
  ActivityIndicator,
  Alert,
  AsyncStorage,
  Platform,
  StyleSheet,
  View,
} from "react-native";
import TouchID from "react-native-touch-id";
import { useAppSelector } from "../../hooks/hooks";
import SplashScreen from "react-native-splash-screen";
import ReactNativeBiometrics, { BiometryTypes } from "react-native-biometrics";
import { isEmpty } from "lodash";

interface ILoadingScreen {
  navigation: any;
}
const optionalConfigObject = {
  title: "Authentication Required", // Android
  imageColor: "#2AA2DE", // Android
  imageErrorColor: "#ff0000", // Android
  sensorDescription: "Touch sensor", // Android
  sensorErrorDescription: "Failed", // Android
  cancelText: "Cancel", // Android
  fallbackLabel: "Show Passcode", // iOS (if empty, then label is hidden)
  unifiedErrors: false, // use unified error messages (default false)
  passcodeFallback: false, // iOS - allows the device to fall back to using the passcode, if faceid/touch is not available. this does not mean that if touchid/faceid fails the first few times it will revert to passcode, rather that if the former are not enrolled, then it will use the passcode.
};
const LoadingScreen = ({ navigation }: ILoadingScreen) => {
  const userDetails = useAppSelector((state) => state.account);
  const securityReducer: any = useAppSelector((state) => state.security);
  console.log("securityReducer====>", securityReducer?.securityData);
  const rnBiometrics = new ReactNativeBiometrics();

  const AsyncPass = AsyncStorage.getItem("passcode");

  const aunthenticateBioMetricInfo = () => {
    if (Platform.OS === "ios") {
      rnBiometrics.isSensorAvailable().then((resultObject) => {
        let epochTimeSeconds = Math.round(
          new Date().getTime() / 1000
        ).toString();
        let payload = epochTimeSeconds + "some message";
        const { available, biometryType } = resultObject;
        if (available && biometryType === BiometryTypes.FaceID) {
          rnBiometrics
            .simplePrompt({ promptMessage: "Confirm fingerprint" })
            .then((resultObject) => {
              const { success } = resultObject;
              console.log("resultObject===>", resultObject);
              if (success) {
                navigation.dispatch(StackActions.replace("PasswordCheck"));
              } else {
                console.log("user cancelled biometric prompt");
              }
            })
            .catch(() => {
              console.log("biometrics failed");
            });
        } else {
          navigation.dispatch(StackActions.replace("FaceCheck"));
        }
      });
    } else {
      TouchID.isSupported(optionalConfigObject)
        .then(async (biometryType) => {
          console.log("biometryType123-->", biometryType);
          // Success code
          if (biometryType === "FaceID") {
          } else {
            TouchID.authenticate("", optionalConfigObject)
              .then(async (success: any) => {
                console.log("success", success);
                const getItem = await AsyncStorage.getItem("passcode");
                if (getItem) {
                  navigation.dispatch(StackActions.replace("PasswordCheck"));
                } else {
                  navigation.dispatch(StackActions.replace("DrawerNavigator"));
                }
              })
              .catch((e: any) => {
                aunthenticateBioMetricInfo();
              });
            console.log("TouchID is supported.");
          }
        })
        .catch((error) => {
          // Failure code
          console.log(error);
        });
    }
  };

  const fingerwopasscode = () => {
    if (Platform.OS === "ios") {
      rnBiometrics.isSensorAvailable().then((resultObject) => {
        let epochTimeSeconds = Math.round(
          new Date().getTime() / 1000
        ).toString();
        let payload = epochTimeSeconds + "some message";
        const { available, biometryType } = resultObject;
        if (available && biometryType === BiometryTypes.FaceID) {
          rnBiometrics
            .simplePrompt({ promptMessage: "Confirm fingerprint" })
            .then((resultObject) => {
              const { success } = resultObject;
              console.log("resultObject===>", resultObject);
              if (success) {
                navigation.dispatch(StackActions.replace("PasswordCheck"));
              } else {
                console.log("user cancelled biometric prompt");
              }
            })
            .catch(() => {
              console.log("biometrics failed");
            });
        } else {
          navigation.dispatch(StackActions.replace("FaceCheck"));
        }
      });
    } else {
      TouchID.isSupported(optionalConfigObject)
        .then(async (biometryType) => {
          console.log("biometryType123-->", biometryType);
          // Success code
          if (biometryType === "FaceID") {
          } else {
            TouchID.authenticate("", optionalConfigObject)
              .then(async (success: any) => {
                console.log("success", success);

                navigation.dispatch(StackActions.replace("DrawerNavigator"));
              })
              .catch((e: any) => {
                aunthenticateBioMetricInfo();
              });
            console.log("TouchID is supported.");
          }
        })
        .catch((error) => {
          // Failure code
          console.log(error);
        });
    }
  };

  const checkAuth = async () => {
    const fingerPrint = await AsyncStorage.getItem("fingerprint");
    const passcode = await AsyncStorage.getItem("passcode");
    const FaceID = await AsyncStorage.getItem("FaceID");

    console.log("FaceID===>", FaceID);
    console.log("fingerprint===>", fingerPrint);
    console.log("passcode===>", passcode);

    if (fingerPrint) {
      if (fingerPrint && passcode) {
        aunthenticateBioMetricInfo();
      } else {
        fingerwopasscode();
      }
    } else if (FaceID) {
      if (FaceID && passcode) {
        navigation.dispatch(StackActions.replace("FaceCheck"));
      } else {

        navigation.dispatch(StackActions.replace("FaceCheck"));
      }
      // navigation.dispatch(StackActions.replace("FaceCheck"));
    } else if (passcode) {
      navigation.dispatch(StackActions.replace("PasswordCheck"));
    } else {
      navigation.dispatch(StackActions.replace("AuthStack"));
      //Alert.alert('hi')
    }
  };

  useEffect(() => {
    if (userDetails?.responseData) {
      console.log("userDetails===>", userDetails);
      checkAuth();
    } else {
      navigation.dispatch(StackActions.replace("AuthStack"));
    }
  }, [userDetails]);
  useEffect(() => {
    SplashScreen.hide();
  }, []);
  return (
    <View style={[styles.container, styles.horizontal]}>
      <ActivityIndicator size="large" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  horizontal: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10,
  },
});

export default LoadingScreen;
