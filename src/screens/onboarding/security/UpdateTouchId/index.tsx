import React, { useState ,useEffect} from "react";
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  AsyncStorage,
  Alert
} from "react-native";

import Button from "../../../../components/Button";
import GenericText from "../../../../components/Text";
import { LocalImages } from "../../../../constants/imageUrlConstants";
import { Screens } from "../../../../themes/index";

import Loader from "../../../../components/Loader";
import { StackActions } from "@react-navigation/native";
import TouchID from "react-native-touch-id";
import CustomPopup from "../../../../components/Loader/customPopup";

const FingerPrintInstructionScreen = (props: any) => {
  const [isLoading, setIsLoading] = useState(false);

  const [isPopupVisible, setPopupVisible] = useState(false);
  const [popupContent, setPopupContent] = useState({
    title: '',
    message: '',
    buttons: []
  });

  const showPopup = (title, message, buttons) => {
    setPopupContent({ title, message, buttons });
    setPopupVisible(true);
  };

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

  const aunthenticateBioMetricInfo = () => {
    TouchID.isSupported(optionalConfigObject)
      .then(async (biometryType:any) => {
        // Success code
        if (biometryType === "FaceID") {
          console.log("FaceID is supported.");
        } else {
          TouchID.authenticate("", optionalConfigObject)
            .then(async (success: any) => {
              console.log("success", success);
              await AsyncStorage.setItem("fingerprint", "enabled");

              props.navigation.navigate("Home");
            })
            .catch((e: any) => console.log(e));
          console.log("TouchID is supported.");
        }
      })
      .catch((error:any) => {
        // Failure code
        console.log(error,"Not Support");
        showPopup(
          "No TouchID",
          "TouchID is not supported!",
          [
            {
              text: "OK",
              onPress: () => {
                console.log("OK Pressed");
                setPopupVisible(false);
              },
            },
          ]
        );
      });
  };

  useEffect(()=>{
    aunthenticateBioMetricInfo()
  },[])

  return (
    <View style={styles.sectionContainer}>
      <View style={{ position: "absolute", top: 20, right: 20, zIndex: 100 }}>
        <TouchableOpacity onPress={() => props.navigation.goBack()}>
          <Image
            resizeMode="contain"
            style={[styles.logoContainer]}
            source={LocalImages.closeImage}
          ></Image>
        </TouchableOpacity>
      </View>
      <View></View>
      <View style={{ justifyContent: "center", alignItems: "center" ,flex:1}}>
        <Image
          resizeMode="contain"
          style={{ width: 300, height: 300 }}
          source={LocalImages.fingerprint}
        ></Image>
        <GenericText
          style={[
            {
              fontSize: 20,

              color: Screens.pureWhite,
              fontWeight: "500",
            },
          ]}
        >
          {"authenticatedevicefinger"}
        </GenericText>

        <GenericText
          style={[
            {
              fontSize: 14,
              textAlign: "center",
              marginHorizontal: 30,
              marginVertical: 20,
              color: Screens.pureWhite,
              fontWeight: "100",
            },
          ]}
        >
          {"plsauthenticatenablefinger"}
        </GenericText>
      </View>

      {/* <Button
        onPress={() => aunthenticateBioMetricInfo()}
        style={{
          buttonContainer: {
            elevation: 5,
            marginHorizontal: 10,
          },
          text: {
            color: Screens.pureWhite,
          },
          iconStyle: {
            tintColor: Screens.pureWhite,
          },
        }}
        title={"continue"}
      ></Button> */}
      <Loader
        loadingText="Finger Print authenticated successfully !"
        Status="Success !"
        isLoaderVisible={isLoading}
      ></Loader>
       <CustomPopup
      isVisible={isPopupVisible}
      title={popupContent.title}
      message={popupContent.message}
      buttons={popupContent.buttons}
      onClose={() => setPopupVisible(false)}
    />
    </View>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    flex: 1,
    backgroundColor: Screens.black,
    justifyContent: "space-between",
  },
  loading: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  preview: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  logoContainer: {
    width: 15,
    height: 15,
    tintColor: "#fff",
  },
});

export default FingerPrintInstructionScreen;
