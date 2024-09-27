import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert
} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';

import Button from "../../components/Button";
import GenericText from "../../components/Text";
import { LocalImages } from "../../constants/imageUrlConstants";
import { Screens } from "../../themes/index";

import Loader from "../../components/Loader";
import { StackActions } from "@react-navigation/native";
import TouchID from "react-native-touch-id";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { SaveSecurityConfiguration } from "../../redux/actions/LocalSavingActions";
import { ESecurityTypes } from "../../typings/enums/Security";
import CustomPopup from "../../components/Loader/customPopup";

const FingerPrintInstructionScreen = (props: any) => {

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

  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useAppDispatch();
  const securityReducer: any = useAppSelector((state) => state.security);
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
  const saveSelectionSecurities = () => {
    let payLoad = [];
    if (
      securityReducer &&
      securityReducer?.securityData &&
      securityReducer?.securityData?.length > 0
    )
      payLoad = securityReducer?.securityData;
    if (payLoad[0].types !== ESecurityTypes.FINGER) {
      payLoad.push({
        types: ESecurityTypes.FINGER,
        enabled: true,
      });
    } else {
      payLoad = payLoad.map(
        (item: { types: ESecurityTypes; enabled: boolean }) => {
          if (item.types === ESecurityTypes.FINGER) {
            item.enabled = true;
          }
          return item;
        }
      );
    }

    dispatch(SaveSecurityConfiguration(payLoad));
  };
  const aunthenticateBioMetricInfo = () => {
    TouchID.isSupported(optionalConfigObject)
      .then(async (biometryType) => {
        // Success code
        if (biometryType === "FaceID") {
          console.log("FaceID is supported.");
        } 
        else {
          TouchID.authenticate("", optionalConfigObject)
            .then(async (success: any) => {
              saveSelectionSecurities();
              await AsyncStorage.setItem("fingerprint", "enabled");
              actionToNavigate();
            })
            .catch((e: any) => console.log(e));
          console.log("TouchID is supported.");
        }
        
      })
      .catch((error) => {
        // Failure code
        console.log(error,"Not Support");
        console.log(error);
      });
  };
  const actionToNavigate = () => {
    if (securityReducer && securityReducer?.securityData) {
      console.log(
        "securityReducer?.securityData",
        securityReducer?.securityData
      );
      if (
        securityReducer?.securityData?.length === 2 &&
        securityReducer?.securityData?.some(
          (item: { types: any }) => item.types === ESecurityTypes.PASSCORD
        ) &&
        securityReducer?.securityData?.every(
          (item: { enabled: boolean }) => item.enabled
        )
      ) {
        props.navigation.dispatch(StackActions.replace("DrawerNavigator"));
      } else {
        props.navigation.goBack(null);
      }
    } else {
      props.navigation.goBack(null);
    }
  };


  // const _isSupported = () => {
  //   try {
  //     const data = TouchID.isSupported();
  //     console.log("data", data);
  //     if (data === "TouchID") {
  //     aunthenticateBioMetricInfo()
  //     }
  //   } catch (e) {
  //     Alert.alert("TouchID is not supported!");
  //     console.log("datae==>", e);
  //   }
  // };

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
        Status={"status"}
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
