import { useTheme } from "@react-navigation/native";
import React, { useEffect, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  PermissionsAndroid,
  Platform,
  AsyncStorage,
  Alert,
} from "react-native";
import { RNCamera } from "react-native-camera";
import DocumentPicker from "react-native-document-picker";
import Button from "../../components/Button";
import ImageResizer from "react-native-image-resizer";
import Spinner from "react-native-loading-spinner-overlay/lib";
import { LocalImages } from "../../constants/imageUrlConstants";
import { Screens } from "../../themes/index";
import DocumentMask from "./DocumentMask";
import RNFS from "react-native-fs";
import GenericText from "../../components/Text";
import { useFormData } from "../../hooks/use-form-fetch";
import * as ImagePicker from "react-native-image-picker";
import { useFetch } from "../../hooks/use-fetch";
import { uploadRegisterDocument } from "../../utils/earthid_account";

const UploadDocumentBack = (props: any) => {
  const {fileUri} = props.route.params
  const _handleBarCodeRead = (barCodeData: any) => {};
  const { colors } = useTheme();
  const { type } = props.route.params;
  console.log('typee', type)
  const camRef: any = useRef();
  const {
    loading: imageLoading,
    data: imageData,
    error: imageError,
    fetch: uploadRegDoc,
  } = useFetch();
  const [imageResponse, setImageResponse] = useState<any>("");
  const [documentResponseData, setDocumentResponse] = useState(undefined);
  const { fetch: getSuperAdminApiCall } = useFetch();
  const [loginLoading, setLoginLoading] = useState(false);
  const { loading, data, error, fetch } = useFormData();
  const _takePicture = async () => {
    let options = {
      mediaType: type,
      maxWidth: 300,
      maxHeight: 550,
      quality: 1,
      videoQuality: "low",
      durationLimit: 30, //Video max duration in seconds
      saveToPhotos: true,
    };
    const data = await camRef.current.takePictureAsync(options);
    if (data) {
      const fileUriBack = { uri: data?.uri, filename: "image", type: "image/jpeg" };
      console.log('FileUri', fileUri)
      if (Platform.OS === "ios") {
        uploadDocumentImage(fileUriBack);
      } else {
        props.navigation.navigate("DocumentPreviewScreenBack", {
          fileUriBack: {
            //  uri: `data:image/png;base64,${res}`,
            uri: data?.uri,
            filename: "image",
            type: "image/jpeg",
          },
          type: "regDoc",
          fileUri: fileUri
        });
      }
    }
  };
  useEffect(() => {
    if (imageError) {
      setLoginLoading(false);
      Alert.alert("Alert", "Document not supported");
    }
  }, [imageError]);

  function uploadDocumentImage(fileUriBack: {
    uri: any;
    filename: any;
    type: any;
  }) {
    if (Platform.OS === "ios") {
      ImageResizer.createResizedImage(fileUriBack.uri, 500, 500, "JPEG", 100, 0, "")
        .then((response) => {
          let image = {
            uri: response.uri,
            name: response.name,
            type: fileUriBack.type,
          };
          try {
            console.log("image req=====", image);
            // setLoginLoading(true)
            props.navigation.navigate("DocumentPreviewScreen", {
              fileUriBack: {
                uri: response.uri,
                filename: response.name,
                type: "image/jpeg",
              },
              type: "regDoc",
            });
          } catch (e) {
            setLoginLoading(false);
            console.log("DocumentError:::::", e);
            console.log("DocumentError:::::", "ERROR");
          }
        })
        .catch((err) => {
          console.log("errorrr===>", err);
          // Oops, something went wrong. Check that the filename is correct and
          // inspect err to get more details.
        });
    } else {
    }
  }
  useEffect(() => {
    if (imageData) {
      if (imageData?.data) {
        setDocumentResponse(data?.data);
        createPayLoadFromDocumentData(data?.data);
      }
    }
  }, [data]);

  const createPayLoadFromDocumentData = async (documentResponseData: any) => {
    console.log(
      "slsls",
      documentResponseData?.ProcessedDocuments[0].ExtractedFields?.filter(
        (item: any) => item.Name === "FullName"
      )[0]
    );
    const username =
      documentResponseData?.ProcessedDocuments[0].ExtractedFields?.filter(
        (item: any) => item.Name === "FullName"
      )[0]?.Value;
    const trimmedEmail =
      documentResponseData?.ProcessedDocuments[0].ExtractedFields?.filter(
        (item: any) => item.Name === "FullName"
      )[0]?.Value +
      "ex" +
      Math.random() +
      "@gmail.com";
    await AsyncStorage.setItem("userDetails", username.toString());
    await AsyncStorage.setItem("flow", "documentflow");
    props.navigation.navigate("categoryScreen", { fileUriBack });
  };
  const requestPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        {
          title: "EarthID Storage Acess",
          message: "EarthID needs access to your storage ",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK",
        }
      );
    } catch (err) {
      console.log(err);
    }
  };
  const openFilePicker = async () => {
    if (Platform.OS == "android") {
      await requestPermission();
    }
    try {
      // const resp: any = await DocumentPicker.pick({
      //   type: [DocumentPicker.types.images, DocumentPicker.types.pdf],
      //   readContent: true,
      // });

      ImagePicker.launchImageLibrary(
        ImagePicker.ImageLibraryOptions,
        setImageResponse
      );
    } catch (err) {
      console.log("data==>", err);
    }
  };

  useEffect(() => {
    if (imageResponse != "" && !imageResponse?.didCancel) {
  
      console.log("==>result", imageResponse?.assets[0]?.uri);
      let fileUriBack = imageResponse?.assets[0]?.uri;
      // disPatch(savingProfilePictures(fileUriBack));
      RNFS.readFile(fileUriBack, "base64").then((res) => {
        console.log("res", res);
        props.navigation.navigate("DocumentPreviewScreen", {
          fileUriBack: {
            //  uri: `data:image/png;base64,${res}`,
            uri: imageResponse?.assets[0]?.uri,
            base64: res,
            file: res[0],
            filename: imageResponse?.assets[0]?.fileName,
            type: imageResponse?.assets[0]?.type,
            imgres: imageResponse,
          },
          type: "regDoc",
        });
        console.log("respic", fileUriBack);
      });
    }
  }, [imageResponse]);

  useEffect(() => {
    console.log("RegisterDoc", type.data);
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
        style={styles.preview}
        androidCameraPermissionOptions={null}
        type={RNCamera.Constants.Type.back}
        captureAudio={false}
      >
        <DocumentMask />
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
        style={{ textAlign: "center", paddingVertical: 5, color: "#696969" }}
      >
        {"placethedoc"}
      </GenericText>
      <TouchableOpacity onPress={_takePicture}>
        <View
          style={{
            width: 60,
            height: 60,
            borderRadius: 30,
            backgroundColor: colors.primary,
            alignSelf: "center",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              width: 50,
              height: 50,
              borderColor: "#fff",
              borderWidth: 1,
              borderRadius: 25,
              backgroundColor: "transparent",
            }}
          ></View>
        </View>
      </TouchableOpacity>
      <GenericText
        style={{
          textAlign: "center",
          paddingVertical: 5,
          fontWeight: "bold",
          fontSize: 18,
          color: "#fff",
        }}
      >
        {"or"}
      </GenericText>
      <Button
        onPress={openFilePicker}
        leftIcon={LocalImages.upload}
        style={{
          buttonContainer: {
            elevation: 5,
          },
          text: {
            color: Screens.pureWhite,
          },
          iconStyle: {
            tintColor: Screens.pureWhite,
          },
        }}
        title={"uploadgallery"}
      ></Button>
      <Spinner
        visible={loading || imageLoading}
        textContent={"Loading..."}
        textStyle={styles.spinnerTextStyle}
      />
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
    // justifyContent: "flex-end",
    // alignItems: "center",
  },
  logoContainer: {
    width: 15,
    height: 15,
    tintColor: "#fff",
  },
  spinnerTextStyle: {
    color: "#fff",
  },
});

export default UploadDocumentBack;
