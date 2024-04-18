import { useTheme } from "@react-navigation/native";
import React, { useRef, useState } from "react";
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Text,
} from "react-native";
import { RNCamera } from "react-native-camera";
import AsyncStorage from '@react-native-async-storage/async-storage';

import { SnackBar } from "../../components/SnackBar";
import GenericText from "../../components/Text";
import { LocalImages } from "../../constants/imageUrlConstants";
import { useAppSelector } from "../../hooks/hooks";
import { Screens } from "../../themes/index";
import { getDeviceId } from "../../utils/encryption";
import { SERVICE } from "../../utils/securityServices";
import DocumentMask from "../uploadDocuments/DocumentMask";

const LivenessCameraScreen = (props: any) => {
  const [maskedColor, setmaskedColor] = useState("#fff");
  const [data, setData] = useState();
  const userDetails = useAppSelector((state) => state.contract);
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
        var threshold = avg / 5;
        var hasMoved = false;
        for (let index = 0; index < faceOrigin.length - 1; index++) {
          var displacement = distance(
            faceOrigin[index].x,
            faceOrigin[index].y,
            faceOrigin[index + 1].x,
            faceOrigin[index + 1].y
          );

          if (displacement < 0) {
            console.log("displacement", displacement);
            hasMoved = true;
            if (stillToast) {
              setmaskedColor("red");
            }
            break;
          }
        }
        if ( avg > 0.5) {
          console.log("ReadData",avg, min);
          SnackBar({
            indicationMessage: "I can still see you moving",
          });
          
          if (faceId === faceArray.faces[0].faceID) {
            setmaskedColor("green");
            SnackBar({
              indicationMessage: "Thank you",
            });

            faceDetected = true;
            const options = {
              quality: 0.2,
              base64: true,
            };
            const data = await camRef.current.takePictureAsync(options);
            if (data) {
              setData(data);
              props.navigation.navigate("UpdateAuthentication");
      
            }
          } else {
          }
        }
        faceOrigin = [];
        faceId = null;
        faceCount = 0;
        rightEyeOpen = [];
      }
    }
  };
  const handleFaceDetected = async (data: { base64: any }) => {
    const detectedFace = data.base64;
    const deviceId = getDeviceId();
    const requestBody = {
      earthId: userDetails?.responseData?.earthId,
      deviceId: deviceId,
      faceImage: detectedFace,
    };
    console.log("requestBody====>", JSON.stringify(requestBody));
    const res = await SERVICE.REGISTER_FACE(requestBody);
    console.log("facedata====>", res);
    let facedata = res.data.result.faceId;
    console.log("facedata====>", facedata);
    AsyncStorage.setItem("facedata", facedata);
    const test = "success";
    AsyncStorage.setItem("setFaceid", test);

    if (facedata) {
      props.navigation.navigate("Home");
    }
  };

  const { colors } = useTheme();
  const camRef: any = useRef();

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
        Capture
      </GenericText>
      <GenericText
        style={{ textAlign: "center", paddingVertical: 5, color: "#fff" }}
      >
        Place your face inside the live box!
      </GenericText>
      {/* <Button
        onPress={() => {
          setData(undefined);
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
