import { useTheme } from "@react-navigation/native";
import React, { useEffect, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Platform,
  
} from "react-native";
import { RNCamera } from "react-native-camera";

import { SnackBar } from "../../components/SnackBar";
import GenericText from "../../components/Text";
import { LocalImages } from "../../constants/imageUrlConstants";
import { Screens } from "../../themes/index";
import DocumentMask from "../uploadDocuments/DocumentMask";
import Snackbar from "react-native-snackbar";

const LivenessCameraScreen = (props: any) => {
  const { fileUri, selectedDocument } = props.route.params;
  const { pic } = props.route.params;
  const { editDoc,selectedItem } = props.route.params;
  const { docname } = props.route.params;
  const [maskedColor, setmaskedColor] = useState("#fff");
  const [data, setData] = useState();
  const itemData = props?.route.params?.itemData;

  // console.log("picLOG",fileUri)
  // console.log("picLOG",selectedItem)
  console.log("picLOG", docname)

  useEffect(() => {
    if (data) {
      handlingFacialData();
    }
  }, [data]);
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
          Snackbar.show({
            text: 'Please look into the camera',
            duration: Snackbar.LENGTH_SHORT,
            
             
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
  const { colors } = useTheme();
  const camRef: any = useRef();

  const handlingFacialData = async () => {
  
    if (Platform.OS === "ios") {
      const options = {
        quality: 0.5,
        base64: true,
      };
      const datas = await camRef.current.takePictureAsync(options);
      if (datas || data) {
        props.navigation.navigate("VerifiDocumentScreen", {
          uploadedDocuments: fileUri,
          faceImageData: data,
          selectedDocument,
          pic:fileUri,
          selectedItem,
          editDoc,
          docname
        });
      }
    }else{
      if (data) {
        props.navigation.navigate("VerifiDocumentScreen", {
          uploadedDocuments: fileUri,
          faceImageData: data,
          selectedDocument,
          pic:fileUri,
          image:pic,
          itemData:itemData,
          editDoc,
          selectedItem,
          docname
        });
      }
    }
  };
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
        style={{ textAlign: "center", paddingVertical: 5, color: "#fff" }}
      >
        {"placeurfacelivebox"}
      </GenericText>
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
