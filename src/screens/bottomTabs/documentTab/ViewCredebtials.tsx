import React, { useEffect, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  Platform,
  Alert,
  Pressable,
  Text,
} from "react-native";
import PDFView from "react-native-view-pdf";
import OpenFile from "react-native-doc-viewer";
import SuccessPopUp from "../../../components/Loader";
import AnimatedLoader from "../../../components/Loader/AnimatedLoader";
import GenericText from "../../../components/Text";
import { LocalImages } from "../../../constants/imageUrlConstants";
import { useFetch } from "../../../hooks/use-fetch";
import { Screens } from "../../../themes/index";
import ModalView from "../../../components/Modal";
import { isEarthId } from "../../../utils/PlatFormUtils";
import Share from "react-native-share";
import BottomSheet from "../../../components/Bottomsheet";
import { useAppDispatch, useAppSelector } from "../../../hooks/hooks";
import { saveDocuments } from "../../../redux/actions/authenticationAction";
import Header from "../../../components/Header";
import LinearGradients from "../../../components/GradientsPanel/LinearGradient";
import Button from "../../../components/Button";
import { useIsFocused } from "@react-navigation/native";

const DocumentPreviewScreen = (props: any) => {
  const dispatch = useAppDispatch();
  const { fileUri, type } = props.route.params;
  const { documentDetails } = props?.route?.params;
  // console.log("documentDetails============>", documentDetails);
  const pdfRef = useRef(null);
  const HistoryParams = props?.route?.params?.history;
  let documentsDetailsList = useAppSelector((state) => state.Documents);
  const { loading, data, error, fetch: postFormfetch } = useFetch();
  const [successResponse, setsuccessResponse] = useState(false);
  const [message, Setmessage] = useState("ooo");
  const [datas, SetData] = useState(null);
  const [source, setSource] = useState({});
  const [key, setKey] = useState(Date.now());
  const [
    isBottomSheetForSideOptionVisible,
    setisBottomSheetForSideOptionVisible,
  ] = useState<boolean>(false);
  const isFocused = useIsFocused();
  const [selectedItem, setselectedItem] = useState(documentDetails);
  // console.log("documentDetails?.base64", documentDetails?.base64);
  // console.log("documentDetails?.base64", documentDetails?.docName);
  // console.log("documentDetails?.base64", documentDetails?.isLivenessImage);
  // console.log("documentDetailsCheck", documentDetails);
  const resources = {
    file:
      Platform.OS === "ios"
        ? "documentDetails?.base64"
        : "/sdcard/Download/test-pdf.pdf",
    url: documentDetails?.base64,
    base64: documentDetails?.base64,
  };
  console.log("selectedItem?.base64===>123",`data:image/jpeg;base64,${documentDetails?.base64}`);
  const resourceType = "base64";
  const shareItem = async () => {

    if (selectedItem?.isLivenessImage === "livenessImage") {
      await Share.open({
        url: selectedItem?.base64,
      });
    } else if (selectedItem?.type === "deeplink") {
      await Share.open({
        url: selectedItem?.base64,
      });
    } else if (selectedItem?.docType === "jpg") {
      await Share.open({
        url: `data:image/jpeg;base64,${selectedItem?.base64}`,
      });
    } else {
      await Share.open({
        url: `data:image/png;base64,${selectedItem?.base64}`,
      });
    }
  };

  function deleteAlert() {
    Alert.alert(
      "Confirmation!",
      "Are you sure to delete this document?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: "OK",
          onPress: () => deleteItem(),
        },
      ],
      { cancelable: false }
    );
  }

  // const deleteItem = () => {
  //   setisBottomSheetForSideOptionVisible(false);
  //   // const newData = documentsDetailsList?.responseData.filter(function (item: {
  //   //   name: any;
  //   // }) {
  //   //   return item.name !== selectedItem?.name;
  //   // });

  //   // dispatch(saveDocuments(newData));

  //   const newData = documentsDetailsList?.responseData;
  //   const findIndex = newData?.findIndex(
  //     (item) => item.id === selectedItem?.id
  //   );
  //   findIndex >= -1 && newData?.splice(findIndex, 1);
  //   // console.log('helpArra',helpArra)
  //   dispatch(saveDocuments(newData));

  //   props.navigation.navigate("Documents");
  // };

  const handlePressb64 = (type: string) => {
    if (Platform.OS === "ios") {
      OpenFile.openDocb64(
        [
          {
            base64: documentDetails.base64,
            fileName: documentDetails?.docName,
            fileType: type === "application/msword" ? "doc" : "docx",
          },
        ],
        (error: any, url: any) => {
          if (error) {
            console.error(error);
          } else {
            console.log(url);
          }
        }
      );
    } else {
      //Android
      OpenFile.openDocb64(
        [
          {
            base64: documentDetails.base64,
            fileName: documentDetails?.docName,
            fileType: type === "application/msword" ? "doc" : "docx",
            cache: true /*Use Cache Folder Android*/,
          },
        ],
        (error: any, url: any) => {
          if (error) {
            console.error(error);
          } else {
            console.log(url);
          }
        }
      );
    }
  };

  const deleteItem = () => {
    console.log("selectedItem?.id", selectedItem);
    Alert.alert(
      "Confirmation! ",
      "Are you sure you want to delete this document ?",
      [
        {
          text: "Cancel",
          onPress: () => (
            console.log("Cancel Pressed!"),
            setisBottomSheetForSideOptionVisible(false)
          ),
        },
        {
          text: "OK",
          onPress: () => {
            setisBottomSheetForSideOptionVisible(false);
            const newData = documentsDetailsList?.responseData;
            const findIndex = newData?.findIndex(
              (item) => item.id === selectedItem?.id
            );
            findIndex >= -1 && newData?.splice(findIndex, 1);
            // console.log('helpArra',helpArra)
            dispatch(saveDocuments(newData));

            {
              HistoryParams
                ? props?.navigation.goBack()
                : props.navigation.navigate("Home");
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  const qrCodeModal = () => {
    handleUploadImage();
  };
  function editItem() {
    setisBottomSheetForSideOptionVisible(false);
    props.navigation.navigate("categoryScreen", {
      selectedItem: selectedItem,
      editDoc: "editDoc",
    });
    // var data : any =selectedItem
    // await AsyncStorage.setItem("userDetails", data);
    // await AsyncStorage.setItem("editDoc", "editDoc");

    console.log("iteName==>", selectedItem);
  }
  const handleUploadImage = async () => {
    setisBottomSheetForSideOptionVisible(false);
    props.navigation.navigate("ShareQr", { selectedItem: selectedItem });
    console.log("selectedItem", selectedItem);
  };
  const RowOption = ({ icon, title, rowAction }: any) => (
    <TouchableOpacity onPress={rowAction}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        {icon && (
          <Image
            resizeMode="contain"
            style={styles.bottomLogo}
            source={icon}
          ></Image>
        )}

        <View style={{ justifyContent: "center", alignItems: "center" }}>
          <GenericText
            style={[
              styles.categoryHeaderText,
              { fontSize: 13, marginHorizontal: 10, marginVertical: 15 },
            ]}
          >
            {title}
          </GenericText>
        </View>
      </View>
    </TouchableOpacity>
  );

  useEffect(() => {
    setKey(Date.now()); // Change the key to force a re-render
  }, [isFocused]);

  return (
    <View style={styles.sectionContainer}>
      <LinearGradients
        endColor={Screens.colors.header.endColor}
        middleColor={Screens.colors.header.middleColor}
        startColor={Screens.colors.header.startColor}
        style={styles.linearStyle}
        horizontalGradient={false}
      >
        <View style={{ flex: 1 }}>
          <View style={{ flex: 0.4 }}></View>
          <View style={{ flex: 0.6, flexDirection: "row" }}>
            <View style={{ flex: 0.2 }}>
              <View
                style={{ position: "absolute", top: 30, left: 25, zIndex: 100 }}
              >
                <Pressable onPress={() => props.navigation.goBack()}>
                  <Image
                    resizeMode="contain"
                    style={{
                      width: 15,
                      height: 15,
                      resizeMode: "contain",
                      tintColor: isEarthId()
                        ? Screens.pureWhite
                        : Screens.black,
                    }}
                    source={LocalImages.backImage}
                  ></Image>
                </Pressable>
              </View>
            </View>
            <View style={{ flex: 0.6, justifyContent: "center" }}>
              <GenericText
                style={{ color: "#fff", fontSize: 18, alignSelf: "center" }}
              >
                Details
              </GenericText>
            </View>

            <View style={{ flex: 0.2, justifyContent: "center" }}>
              <View
                style={{ position: "absolute", top: 30, left: 25, zIndex: 100 }}
              >
                <Pressable
                  onPress={() => setisBottomSheetForSideOptionVisible(true)}
                >
                  <Image
                    resizeMode="contain"
                    style={{
                      width: 15,
                      height: 15,
                      resizeMode: "contain",
                      tintColor: isEarthId()
                        ? Screens.pureWhite
                        : Screens.black,
                    }}
                    source={LocalImages.menudot}
                  ></Image>
                </Pressable>
              </View>
            </View>
          </View>
        </View>
      </LinearGradients>

      <BottomSheet
        onClose={() => setisBottomSheetForSideOptionVisible(false)}
        height={230}
        isVisible={isBottomSheetForSideOptionVisible}
      >
        <View style={{ height: 180, width: "100%", paddingHorizontal: 30 }}>
          <RowOption
            rowAction={() => editItem()}
            title={"edit"}
            icon={LocalImages.editIcon}
          />
          <RowOption
            rowAction={() => qrCodeModal()}
            title={"QR Code"}
            icon={LocalImages.qrcodeImage}
          />
          <RowOption
            rowAction={() => shareItem()}
            title={"share"}
            icon={LocalImages.shareImage}
          />
          <RowOption
            rowAction={() => deleteItem()}
            title={"delete"}
            icon={LocalImages.deleteImage}
          />
        </View>
      </BottomSheet>
      {/* <View style={{ position: "absolute", top: 20, right: 20, zIndex: 100 }}>
        
        <TouchableOpacity onPress={() => props.navigation.goBack()}>   
          <Image
            resizeMode="contain"
            style={[styles.logoContainer]}
            source={LocalImages.closeImage}
          ></Image>
        </TouchableOpacity>
      </View> */}

      <View style={{ flex: 1, marginTop: 30 }}>
        {documentDetails.pdf ? (
          <PDFView
            fadeInDuration={100.0}
            ref={pdfRef}
            key={key}
            style={{ flex: 1 }}
            resource={resources[resourceType]}
            resourceType={resourceType}
            onLoad={() => console.log(`PDF rendered from ${resourceType}`)}
            onError={() => console.log("Cannot render PDF", error)}
          />
        ) : documentDetails.base64 ? (
          documentDetails?.fileType === "application/msword" ||
          documentDetails?.fileType ===
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ? (
            <View style={{ flex: 0.8 }}>
              <View style={{ alignSelf: "center", justifyContent: "center" }}>
                <Image
                  resizeMode={"contain"}
                  style={{
                    width: 100,
                    height: "50%",
                  }}
                  source={LocalImages.wordImage}
                ></Image>
              </View>
              <GenericText
                style={{
                  textAlign: "center",
                  paddingVertical: 5,
                  fontWeight: "bold",
                  fontSize: 16,
                  color: "#000",
                }}
              >
                {
                  "To preview the .doc, .docx file please click on the preview button!"
                }
              </GenericText>
              <View style={{ justifyContent: "center", alignItems: "center" }}>
                <Button
                  onPress={() => handlePressb64(documentDetails?.fileType)}
                  style={{
                    buttonContainer: {
                      elevation: 5,
                      width: 150,
                    },
                    text: {
                      color: Screens.pureWhite,
                    },
                    iconStyle: {
                      tintColor: Screens.pureWhite,
                    },
                  }}
                  title={"Preview"}
                ></Button>
              </View>
            </View>
          ) : (
            <Image
              resizeMode={"contain"}
              style={{
                flex: 1,
              }}
              //   source={{ uri:documentDetails?.type === 'deeplink' ? `${documentDetails?.base64}`: documentDetails?.docType == "jpg"? `data:image/jpeg;base64,${documentDetails?.base64}`
              //   : documentDetails?.isLivenessImage === 'livenessImage' ? documentDetails?.base64  : `data:image/png;base64,${documentDetails?.base64}`
              // }}
              source={{
                uri:
                  documentDetails?.type === "deeplink"
                    ? `data:image/jpeg;base64,${documentDetails?.base64}`
                    : documentDetails?.isLivenessImage === "livenessImage"
                    ? documentDetails?.base64
                    : documentDetails?.docType == "jpg"
                    ? `data:image/jpeg;base64,${documentDetails?.base64}`
                    : `data:image/png;base64,${documentDetails?.base64}`,
              }}
            ></Image>
          )
        ) : (
          <GenericText
            style={{ color: "#000", marginVertical: 50, paddingHorizontal: 5 }}
          >
            {JSON.stringify(documentDetails)}
          </GenericText>
        )}
      </View>

      {/* <Image
            resizeMode={"contain"}
            style={{
              flex: 1,
            }}
            source={{ uri: documentDetails.base64 }}
          ></Image> */}

      <GenericText style={{ color: "#000", fontSize: 18, alignSelf: "center" }}>
        {documentDetails.name || documentDetails?.docName}
      </GenericText>
      <GenericText
        style={{
          color: "#696969",
          fontSize: 18,
          alignSelf: "center",
          marginTop: 5,
        }}
      >
        {`Uploaded on ${documentDetails.date} at ${documentDetails.time}`}
      </GenericText>

      <View
        style={{
          flex: 0.2,
          flexDirection: "row",
          paddingHorizontal: 10,
          justifyContent: "space-between",
        }}
      ></View>
      <AnimatedLoader
        isLoaderVisible={loading}
        loadingText="Uploading Documents..."
      />
      <SuccessPopUp
        isLoaderVisible={successResponse}
        loadingText={"Document Validated !"}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    flex: 1,
    backgroundColor: Screens.pureWhite,
  },
  text: {
    flex: 0.8,
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 20,
    color: Screens.pureWhite,
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
  pdf: {
    flex: 1,
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
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
  bottomLogo: {
    width: 25,
    height: 25,
    tintColor: "black",
  },
  categoryHeaderText: {
    marginHorizontal: 30,
    marginVertical: 20,
    color: Screens.headingtextColor,
  },
  linearStyle: {
    height: 120,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    elevation: 4,
  },
});

export default DocumentPreviewScreen;
