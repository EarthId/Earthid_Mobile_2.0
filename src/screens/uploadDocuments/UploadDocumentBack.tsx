import { useTheme } from "@react-navigation/native";
import React, { useRef, useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
  Modal,
  PermissionsAndroid,
  Pressable,
  Alert,
  Text,
  Dimensions,
  TouchableWithoutFeedback
} from "react-native";
import { RNCamera } from "react-native-camera";
import DocumentPicker from "react-native-document-picker";
import Button from "../../components/Button";
import { LocalImages } from "../../constants/imageUrlConstants";
import { Screens } from "../../themes/index";
import DocumentMasks from "../uploadDocuments/DocumentMasks";
import RNFS from "react-native-fs";
import GenericText from "../../components/Text";
import { useFetch } from "../../hooks/use-fetch";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import SuccessPopUp from "../../components/Loader";
import { encodeBase64 } from "react-native-image-base64";
import Spinner from "react-native-loading-spinner-overlay/lib";
import { saveDocuments } from "../../redux/actions/authenticationAction";
import { dateTime } from "../../utils/encryption";
const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;
const UploadDocumentBack = (props: any) => {
  const {fileUri} = props.route.params
  const { colors } = useTheme();
  const [visible, setVisible] = useState(false);
  console.log('FileUri', fileUri)
  const camRef: any = useRef();
  const { loading } = useFetch();
  const [successResponse, setsuccessResponse] = useState(false);
  const getHistoryReducer = useAppSelector((state) => state.getHistoryReducer);
  const [message, Setmessage] = useState<string>("ooo");
  const [source, setSource] = useState({});
  const [filePath, setFilePath] = useState();

  const [url, setUrl] = useState("");
  const [isLoading, setisLoading] = useState(false);
  const documentsDetailsList = useAppSelector((state) => state.Documents);
  const dispatch = useAppDispatch();

  const _takePicture = async () => {
    const options = { quality: 0.1, base64: true };
    const data = await camRef.current.takePictureAsync(options);
    console.log('FileUri')
    console.log('FileUri', fileUri)
    if (data) {
      props.navigation.navigate("DocumentPreviewScreenBack", { fileUriBack: data, fileUri: fileUri });
    }
  };
  const requestPermission = async () => {
    try {
    } catch (err) {
      console.log(err);
    }
  };

  const _handleBarCodeRead = async (barCodeData: any) => {
    let barcodeData = await barCodeData.data;
    console.log("barcodeData", barcodeData);
    setUrl(barcodeData);
  };

  const fetchData = async () => {
    setisLoading(true);
    try {
      const response = await fetch(url);
      console.log("response", response);

      if (response) {
        setisLoading(false);
        const data = await response.json();
        console.log("Fetched data:", data);

        var date = dateTime();
        var documentDetails: IDocumentProps = {
          id: `ID_VERIFICATION${Math.random()}${"selectedDocument"}${Math.random()}`,
          name: "Transcript VC Token",
          path: "filePath",
          date: date?.date,
          time: date?.time,
          txId: "data?.result",
          docType: "pdf",
          docExt: ".jpg",
          processedDoc: "",
          isVc: true,
          vc: JSON.stringify({
            name: "Transcript VC Token",
            documentName: "Transcript VC Token",
            path: "filePath",
            date: date?.date,
            time: date?.time,
            txId: "data?.result",
            docType: "pdf",
            docExt: ".jpg",
            processedDoc: "",
            isVc: true,
          }),
          documentName: "",
          docName: "",
          base64: undefined,
          transcriptVc: data,
        };

        var DocumentList = documentsDetailsList?.responseData
          ? documentsDetailsList?.responseData
          : [];

        DocumentList.push(documentDetails);
        dispatch(saveDocuments(DocumentList));
        props.navigation.goBack();
      } else {
        setisLoading(false);
        console.log("Error fetching data:", response);
      }
    } catch (error) {
      setisLoading(false);
      console.log("Error:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [url]);

  async function requestMediaPermission() {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        {
          title: "Media Permission",
          message: "App needs access to your media files.",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK",
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("Media permission granted");
      } else {
        console.log("Media permission denied");
      }
    } catch (err) {
      console.warn(err);
    }
  }

  const openFilePicker = async () => {
    if (Platform.OS == "android") {
      requestMediaPermission();
    }
    try {
      const resp: any = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
        readContent: true,
      });
      console.log("resp===>", resp);
      let decodedFileName = resp[0].uri;
      decodedFileName = resp[0]?.uri?.replaceAll("%20", " ");
      if (Platform.OS == "android") {
      } else {
        decodedFileName = decodeURIComponent(decodedFileName);
      }

      if (
        resp[0]?.type === "image/jpeg" ||
        resp[0]?.type === "image/jpg" ||
        resp[0]?.type === "image/png" ||
        resp[0]?.type === "application/pdf"
      ) {
        RNFS.readFile(decodedFileName, "base64")
          .then(async (res) => {
            console.log("res", resp);
            console.log("typePDF", resp[0].uri);

            if (resp[0].type == "application/pdf") {
              props.navigation.navigate("DocumentPreviewScreenBack", {
                fileUriBack: {
                  uri: `data:image/png;base64,${res}`,
                  base64: res,
                  file: resp[0],
                  type: "application/pdf",
                  imageName: resp[0]?.name,
                  route: "gallery",
                  typePDF: resp[0].uri,
                }, fileUri: fileUri
              });
            } else if (resp[0].type == "application/msword") {
              props.navigation.navigate("DocumentPreviewScreenBack", {
                fileUriBack: {
                  uri: `data:image/png;base64,${res}`,
                  base64: res,
                  file: resp[0],
                  type: "application/msword",
                  imageName: resp[0]?.name,
                  route: "gallery",
                  typePDF: resp[0].uri,
                },fileUri: fileUri
              });
            } else if (
              resp[0].type ===
              "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            ) {
              props.navigation.navigate("DocumentPreviewScreenBack", {
                fileUriBack: {
                  uri: `data:image/png;base64,${res}`,
                  base64: res,
                  file: resp[0],
                  type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                  imageName: resp[0]?.name,
                  route: "gallery",
                  typePDF: resp[0].uri,
                },fileUri: fileUri
              });
            } else {
              console.log("check==>####", resp[0]);
              props.navigation.navigate("DocumentPreviewScreenBack", {
                fileUriBack: {
                  uri: `data:image/png;base64,${res}`,
                  base64: res,
                  file: resp[0],
                  type: "qrRreader",
                  imageName: resp[0]?.name,
                  route: "gallery",
                },fileUri: fileUri
              });
            }
          })
          .catch((out) => {
            console.log("real error====>", out);
          });
      } else {
        // Alert.alert("Warning", "This format is not supported", [
        //   {
        //     text: "Cancel",
        //     onPress: () => console.log("Cancel Pressed"),
        //     style: "cancel",
        //   },
        //   { text: "OK", onPress: () => console.log("OK Pressed") },
        // ]);

        setVisible(true);
      }
    } catch (err) {
      console.log("data==>", err);
    }
  };

  // const openFilePicker = async () => {
  //   let options:any = {
  //     title: 'Select Image',
  //     customButtons: [
  //       {
  //         name: 'customOptionKey',
  //         title: 'Choose Photo from Custom Option'
  //       },
  //     ],
  //     storageOptions: {
  //       skipBackup: true,
  //       path: 'images',
  //     },
  //   };
  //   launchImageLibrary(options,(response: { didCancel: any; }) => {
  //     console.log('Response = ', response);

  //     if (response.didCancel) {
  //       console.log('User cancelled image picker');
  //     }else {
  //       let items:any=""
  //       let source :any =response;
  //       var item =source.assets.map((i:any)=>{
  //         Setmessage(i.bitrate)
  //         setFilePath(i.uri);
  //         items=i.uri
  //       })
  //       // You can also display the image using data:
  //       // let source = {
  //       //   uri: 'data:image/jpeg;base64,' + response.data
  //       // };

  //       console.log(item)

  //       props.navigation.navigate("DocumentPreviewScreen", {
  //                  value: {
  //                     path:items
  //                  },
  //                });
  //     }
  //   });
  // };

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
        onBarCodeRead={(data) => _handleBarCodeRead(data)}
      >
        <DocumentMasks />
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
        {"placethedocback"}
      </GenericText>
      <TouchableOpacity onPress={() => _takePicture()}>
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
      {loading ||
        (getHistoryReducer?.isLoading && (
          <View style={styles.loading}>
            <ActivityIndicator color={Screens.colors.primary} size="large" />
          </View>
        ))}

      <SuccessPopUp
        isLoaderVisible={successResponse}
        loadingText={"Pdf uploaded successfully"}
      />

      <Spinner
        visible={isLoading}
        textContent={"Loading..."}
        textStyle={styles.spinnerTextStyle}
      />

      <Modal
        animationType="slide"
        transparent={true}
        visible={visible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setVisible(!visible);
        }}
      >
        {/* <TouchableWithoutFeedback
        onPress={()=>setVisible(!visible)}
        > */}
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Image
              resizeMode="contain"
              style={{ height: "35%", width: "40%" }}
              source={LocalImages.condition}
            ></Image>
            <Text
              style={{
                fontFamily: "Roboto",
                fontSize: 20,
                fontWeight: "bold",
                color: "#000",
                top: 2,
              }}
            >
              Unsupported File Type
            </Text>
            <Text
              style={{
                fontFamily: "Roboto",
                fontSize: 13,
                fontWeight: "200",
                color: "#000",
                top: 4,
              }}
            >
              The file type is not supported.Supported {"\n"}
            </Text>
            <Text
              style={{
                fontFamily: "Roboto",
                fontSize: 12,
                fontWeight: "200",
                color: "#000",
                bottom: 10,
              }}
            >
              types are PDF, JPG, and PNG.
            </Text>

            <TouchableOpacity
              style={{
                top: 10,
                height: (windowHeight / 80) * 3.5,
                width: (windowWidth / 80) * 9,
                borderColor: "#357AB4",
                borderRadius: 6,
                borderWidth: 1,
                justifyContent: "center",
                backgroundColor: "#357AB4",
              }}
              onPress={() => setVisible(!visible)}
            >
              <Text
                style={{
                  fontFamily: "Roboto",
                  fontSize: 12,
                  fontWeight: "bold",
                  color: "#fff",
                  textAlign: "center",
                }}
              >
                OK
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        {/* </TouchableWithoutFeedback> */}
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    flex: 1,
    backgroundColor: Screens.black,
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
  //Modal
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 30,
    padding: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: (windowWidth / 6) * 4.8,
    height: (windowHeight / 20) * 6,
  },

  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
});

export default UploadDocumentBack;
