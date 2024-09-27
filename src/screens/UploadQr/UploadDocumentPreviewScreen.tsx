import React, { useEffect, useState } from "react";
import { View, StyleSheet, Image, TouchableOpacity, Alert } from "react-native";

import Button from "../../components/Button";
import SuccessPopUp from "../../components/Loader";
import AnimatedLoader from "../../components/Loader/AnimatedLoader";
import { LocalImages } from "../../constants/imageUrlConstants";
import { useFetch } from "../../hooks/use-fetch";
import { Screens } from "../../themes/index";
import CryptoJS from "react-native-crypto-js";
import { BASE_URL } from "../../utils/earthid_account";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import RNQRGenerator from "rn-qr-generator";
import RNFS from "react-native-fs";
import { _s3responseHandler, byPassUserDetailsRedux } from "../../redux/actions/authenticationAction";
import DocumentPicker from "react-native-document-picker";
import { SnackBar } from "../../components/SnackBar";
import { isEarthId } from "../../utils/PlatFormUtils";
import CustomPopup from "../../components/Loader/customPopup";



const UploadDocumentPreviewScreen = (props: any) => {
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
  const { fileUri, type } = props.route.params;
  const { value } = props.route.params;
  const userDetails = useAppSelector((state) => state.account);
  const { loading, data, error, fetch: postFormfetch } = useFetch();
  const [successResponse, setsuccessResponse] = useState(false);
  const [message, Setmessage] = useState("ooo");
  const [datas, SetData] = useState(null);
  const [source, setSource] = useState({});
  const { navigation } = props;
  const dispatch = useAppDispatch();
  const {
    loading: getUserLoading,
    data: getUserResponse,
    error: getUserError,
    fetch: getUser,
  } = useFetch();

  const uploadDoc = async () => {
    console.log("fileUri?.base64", fileUri?.base64);
    RNQRGenerator.detect({
      base64: fileUri?.base64,
    })
      .then((detectedQRCodes) => {
        const { values } = detectedQRCodes; // Array of detected QR code values. Empty if nothing found.
        console.log('values',values)
        try{
          const secretKey = 'idv-sessions';
          const decryptedData = CryptoJS.AES.decrypt(values[0], secretKey).toString(CryptoJS.enc.Utf8);
          let serviceData = JSON.parse(decryptedData);
          console.log('values=====>',serviceData)
          let url = `${BASE_URL}/user/getUser?earthId=${serviceData?.earthId}`;
          console.log("values==>", url);
          getUser(url, {}, "GET");
        }
        catch (error) {
          showPopup(
            `${isEarthId() ? "EarthId" : "GlobaliD"} doesn't exist`,
            'Please upload with some valid QR Identity',
            [
              {
                text: "Back",
                onPress: async () => {
                  props.navigation.goBack(null);
                  setPopupVisible(false);
                },
              }
            ]
          );
          
        }

 
      })
      .catch((error) => {
        showPopup(
          `${isEarthId() ? "EarthId" : "GlobaliD"} doesn't exist`,
          'Please upload with some valid QR Identity',
          [
            {
              text: "Back",
              onPress: async () => {
                props.navigation.goBack(null);
                setPopupVisible(false);
              },
            }
          ]
        );
        // handle errors
      });
  };

  const goBack = () => {
    props.navigation.goBack();
  };
  const openFilePicker = async () => {
    try {
      const resp: any = await DocumentPicker.pick({
        type: [DocumentPicker.types.images, DocumentPicker.types.pdf],
        readContent: true,
      });

      let fileUri = resp[0].uri;
      RNFS.readFile(fileUri, "base64").then((res) => {
        console.log("res", resp);
        props.navigation.navigate("UploadDocumentPreviewScreen", {
          fileUri: {
            uri: `data:image/png;base64,${res}`,
            base64: res,
            file: resp[0],
            type: "qrRreader",
          },
        });
      });
    } catch (err) {
      console.log("data==>", err);
    }
  };

  //Qr Code Reader From the image

  useEffect(() => {
    if (getUserResponse) {

      getDetailsForBucket()
    }
  }, [getUserResponse]);

 const getDetailsForBucket = async()=>{
    const bucketName = `idv-sessions-${getUserResponse.username.toLowerCase()}`;
    SnackBar({
      indicationMessage: "The QR code is successfully uploaded",
    });

   navigation.navigate("RegisterOTP", { type: "phone", getUserResponse: getUserResponse, bucketName: bucketName });
    // dispatch(byPassUserDetailsRedux(getUserResponse,bucketName)).then(() => {
      
    //  // navigation.navigate("RegisterOTP", { type: "phone" })
    // });
  }

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
      <View style={{ flex: 0.8, paddingHorizontal: 10, marginLeft: 20 }}>
        <Image
          resizeMode={"contain"}
          style={{
            width: 330,
            height: "100%",
          }}
          source={{ uri: fileUri.uri }}
        ></Image>
      </View>

      <View
        style={{
          flex: 0.2,
          flexDirection: "row",
          paddingHorizontal: 10,
          justifyContent: "space-between",
        }}
      >
        <Button
          onPress={openFilePicker}
          style={{
            buttonContainer: {
              elevation: 5,
              width: 150,
              backgroundColor: "transparent",
            },
            text: {
              color: Screens.colors.primary,
            },
            iconStyle: {
              tintColor: Screens.pureWhite,
            },
          }}
          title={"retakes"}
        ></Button>
        <Button
          onPress={uploadDoc}
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
          title={"uploads"}
        ></Button>
      </View>
      <AnimatedLoader
        isLoaderVisible={getUserLoading}
        loadingText={"uploaddocs"}
      />
      <SuccessPopUp
        isLoaderVisible={successResponse}
        loadingText={"qrupload"}
      />
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

export default UploadDocumentPreviewScreen;
