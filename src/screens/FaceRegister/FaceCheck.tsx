import { StackActions, useTheme } from "@react-navigation/native";
import React, { useEffect, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Text,
  Alert,
  Platform,
  AsyncStorage,
} from "react-native";
import { RNCamera } from "react-native-camera";

import Button from "../../components/Button";
import { SnackBar } from "../../components/SnackBar";
import GenericText from "../../components/Text";
import { LocalImages } from "../../constants/imageUrlConstants";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { SaveSecurityConfiguration } from "../../redux/actions/LocalSavingActions";
import { Screens } from "../../themes/index";
import { ESecurityTypes } from "../../typings/enums/Security";
import { getDeviceId } from "../../utils/encryption";
import { SERVICE } from "../../utils/securityServices";
import DocumentMask from "../uploadDocuments/DocumentMask";

const LivenessCameraScreen = (props: any) => {
  const [maskedColor, setmaskedColor] = useState("#fff");
  const passcodes = AsyncStorage.getItem("passcode");

  const [data, setData] = useState();
  const dispatch = useAppDispatch();
  const userDetails = useAppSelector((state) => state.contract);
  const securityReducer: any = useAppSelector((state) => state.security);
  // Initial state of variables
  let rightEyeOpen: any[] = [];
  let camera: {
    takePictureAsync: (arg0: { quality: number; base64: boolean }) => any;
  } | null = null;
  let faceCount = 0;
  let faceId: null = null;
  let faceOrigin: any[] = [];
  let stillToast = true;
  let faceDetected = false;

  // Averaging Function
  const average = (array: any[]) =>
    array && array.length > 0
      ? array.reduce((a: any, b: any) => a + b) / array.length
      : 0;

  // Face Distance Calculator
  const distance = (x0: number, y0: number, x1: number, y1: number) =>
    Math.hypot(x1 - x0, y1 - y0);

  const _handleBarCodeRead = async (faceArray: any) => {
    if (!faceDetected) {
      // Face Recognition algorithm
      if (faceArray.faces.length === 1 && faceCount < 2) {
        var id = faceArray.faces[0].faceID;
        if (faceId === null) {
          faceId = id;
        }

        if (faceArray.faces[0].faceID === id) {
          rightEyeOpen.push(faceArray.faces[0].rightEyeOpenProbability);
          faceOrigin.push(faceArray.faces[0].bounds.origin);
        }
        faceCount += 1;
      } else {
        var avg = average(rightEyeOpen);
        var min = Math.min(...rightEyeOpen);
        var threshold = avg / 2;
        var hasMoved = false;
        for (let index = 0; index < faceOrigin.length - 1; index++) {
          var displacement = distance(
            faceOrigin[index].x,
            faceOrigin[index].y,
            faceOrigin[index + 1].x,
            faceOrigin[index + 1].y
          );
          if (displacement > 30) {
            hasMoved = true;
            if (stillToast) {
              SnackBar({
                indicationMessage: "Be still like a stone !",
              });
              setmaskedColor("red");
            } else {
              setmaskedColor("red");
              SnackBar({
                indicationMessage: "I can still see you moving",
              });
            }
            break;
          }
        }
        if (avg > 0.5) {
          console.log(avg, min);
          if (faceId === faceArray.faces[0].faceID) {
            setmaskedColor("green");
            SnackBar({
              indicationMessage: "Aww, Thank you",
            });

            faceDetected = true;
            const options = {
              quality: 0.5,
              base64: true,
            };
            const data = await camRef.current.takePictureAsync(options);
            if (data) {
             saveSelectionSecurities();
            } 
          } else {
            SnackBar({
              indicationMessage: "I can still see you moving",
            });
          }
        }
        faceOrigin = [];
        faceId = null;
        faceCount = 0;
        rightEyeOpen = [];
      }
    }
  };

  const saveSelectionSecurities = async () => {
    const passcode = await AsyncStorage.getItem("passcode");
    if (passcode) {
      props.navigation.dispatch(StackActions.replace("PasswordCheck"));
    } else {
      props.navigation.dispatch(
        StackActions.replace("DrawerNavigator", { type: "Faceid" })
      );
    }
  };

  // const faceidonly = () => {
  //   props.navigation.dispatch(
  //     StackActions.replace("DrawerNavigator", { type: "Faceid" })
  //   );
  // };

  const { colors } = useTheme();
  const camRef: any = useRef();

  useEffect(() => {
    console.log("route==>", props.route);
  }, []);

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

      <RNCamera
        ref={camRef}
        onMountError={(errr) => {
          console.log("onmount error", errr);
        }}
        style={styles.preview}
        androidCameraPermissionOptions={null}
        type={RNCamera.Constants.Type.front}
        focusDepth={1.0}
        trackingEnabled={true}
        faceDetectionClassifications={
          RNCamera.Constants.FaceDetection.Classifications.all
        }
        faceDetectionLandmarks={RNCamera.Constants.FaceDetection.Landmarks.all}
        faceDetectionMode={RNCamera.Constants.FaceDetection.Mode.accurate}
        onFacesDetected={!data && _handleBarCodeRead}
        captureAudio={false}
      >
        <DocumentMask color={maskedColor} />
      </RNCamera>
      <GenericText
        style={{
          textAlign: "center",
          paddingVertical: 5,
          fontWeight: "bold",
          fontSize: 16,
          color: "#fff",
        }}
      >
        {"capture"}
      </GenericText>
      <GenericText
        style={{ textAlign: "center", paddingVertical: 5, color: "#fff" }}
      >
        {"placeurfacelivebox"}
      </GenericText>
      {/* <Button
        onPress={() => {
          setData(undefined);
        //  props.navigation.goBack()
        }}
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
        title={"Retry"}
      ></Button> */}
    </View>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    flex: 1,
    backgroundColor: Screens.black,
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

export default LivenessCameraScreen;
