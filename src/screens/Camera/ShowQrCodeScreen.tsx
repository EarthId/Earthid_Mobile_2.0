import React, { useRef, useState } from "react";
import {
  View,
  StyleSheet,
  Image,
  Text,
  PermissionsAndroid,
  Alert,
  BackHandler,
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import Button from "../../components/Button";
import { LocalImages } from "../../constants/imageUrlConstants";
import { Screens } from "../../themes/index";
import Share from "react-native-share";
import ImgToBase64 from "react-native-image-base64";
import ViewShot from "react-native-view-shot";
import QRCode from "react-native-qrcode-image";
import { SCREENS } from "../../constants/Labels";
import CameraRoll from "@react-native-community/cameraroll";
import CryptoJS from "react-native-crypto-js";
import { useAppSelector } from "../../hooks/hooks";
import { AES_ENCRYPTION_SALT } from "../../utils/earthid_account";
import GenericText from "../../components/Text";

const CameraScreen = (props: any) => {
  const _handleBarCodeRead = (barCodeData: any) => {};
  let [qrBase64, setBase64] = useState("");
  const getGeneratedKeys = useAppSelector((state) => state.user);
  const accountDetails = useAppSelector((state) => state.account);
  const viewShot: any = useRef();
  const username = accountDetails?.responseData?.username;
  const earthId = accountDetails?.responseData?.earthId;
  let qrData = {
    accountId: accountDetails?.responseData.toString().split(".")[2],
    // passPhrase: getGeneratedKeys?.responseData.mnemonics,
  };

  console.log("accID", accountDetails?.responseData?.username);

  var encryptedString: any = CryptoJS.AES.encrypt(
    JSON.stringify(qrData),
    AES_ENCRYPTION_SALT
  );
  encryptedString = encryptedString.toString();
  const capturePicture = () => {
    console.log("Capturing picture..");

    viewShot.current.capture().then(async (imageData: any) => {
      console.log("imageData", imageData);
      try {
        await requestExternalStoragePermission();

        dwFile(imageData);
        ImgToBase64.getBase64String(imageData)
          .then((base64String: any) => dwFile(base64String))
          .catch(() => console.log("error"));
      } catch (error) {
        console.log("error", error);
      }
    });
  };
  const dwFile = async (file_url: any) => {
    await Share.open({ url: file_url });
  };
  const requestExternalStoragePermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
        // {
        //     title: 'Earth Id Storage Permission',
        //     message: 'Earth Id needs access to your storage ' +
        //         'so you can save your photos',
        // },
      );
      return granted == "granted"
        ? true
        : granted == "never_ask_again"
        ? securityModalPopup()
        : securityModalPopup();
    } catch (err) {
      console.error("Failed to request permission ", err);
      return false;
    }
  };
  const securityModalPopup = () => {
    Alert.alert(
      "Device Permission",
      "To grant Device id you need to all the app permission from (Setting > App > EarthID > Permission)",
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel'),
          style: 'cancel',
        },
        // { text: "OK", onPress: () => BackHandler.exitApp() },
      ],
      { cancelable: false }
    );
  };
  return (
    <View style={styles.sectionContainer}>
      <View
        style={{
          position: "absolute",
          top: 20,
          left: 20,
          zIndex: 100,
        }}
      >
        <TouchableOpacity
          onPress={() => props.navigation.navigate("ShowQrScreen")}
        >
          <Image
            resizeMode="contain"
            style={[styles.logoContainer]}
            source={LocalImages.qrscanImage}
          ></Image>
        </TouchableOpacity>
      </View>
      <View
        style={{
          position: "absolute",
          top: 20,
          right: 20,
          zIndex: 100,
        }}
      >
        <TouchableOpacity onPress={() => props.navigation.goBack()}>
          <Image
            resizeMode="contain"
            style={[
              styles.logoContainer,
              { tintColor: Screens.pureWhite, width: 15, height: 15 },
            ]}
            source={LocalImages.closeImage}
          ></Image>
        </TouchableOpacity>
      </View>
      <View style={styles.category}>
        <View style={{ flex: 0.8, justifyContent: "space-between" }}>
          <GenericText
            style={[
              styles.categoryHeaderText,
              {
                fontSize: 15,
                fontWeight: "bold",
                textAlign: "center",
                color: Screens.pureWhite,
              },
            ]}
          >
            {username}
          </GenericText>
          <GenericText
            style={[
              styles.categoryHeaderText,
              {
                fontSize: 14,
                fontWeight: "500",
                textAlign: "center",
                color: Screens.colors.primary,
              },
            ]}
          >
            {"ID: " + earthId}
          </GenericText>

          <View style={{ justifyContent: "center", alignItems: "center" }}>
            <ViewShot
              ref={viewShot}
              captureMode="update"
              onCapture={() => {
                // console.log('on capture image response', res)
              }}
              options={{ format: "jpg", quality: 0.8 }}
            >
              <QRCode
                getBase64={(base64: string) => {
                  qrBase64 = base64;
                  setBase64(base64);
                }}
                value={encryptedString}
                size={250}
              />
            </ViewShot>
          </View>
          <GenericText
            style={[
              styles.categoryHeaderText,
              {
                fontSize: 15,
                fontWeight: "bold",
                textAlign: "center",
                color: Screens.pureWhite,
              },
            ]}
          >
            {"Share this code"}
          </GenericText>
          {/* <Text
            style={[
              styles.categoryHeaderText,
              {
                fontSize: 14,
                fontWeight: "500",
                textAlign: "center",
                color: Screens.colors.primary,
              },
            ]}
          >
            {SCREENS.SHOWQRSCREEN.instruction}
          </Text> */}
        </View>
        <Button
          onPress={capturePicture}
          leftIcon={LocalImages.shareImage}
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
          title={"SHARE QR CODE"}
        ></Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    flex: 1,
    backgroundColor: Screens.black,
  },
  categoryHeaderText: {
    marginHorizontal: 20,
    marginVertical: 10,

    color: Screens.headingtextColor,
  },
  preview: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  category: {
    padding: 10,
    marginTop: 100,
    marginHorizontal: 15,
    elevation: 5,
    borderRadius: 10,
    flex: 1,
    justifyContent: "space-between",
  },
  logoContainer: {
    width: 30,
    height: 30,
  },
});

export default CameraScreen;
