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
import ViewShot from "react-native-view-shot";
import QRCode from "react-native-qrcode-image";
import CryptoJS from "react-native-crypto-js";
import { useAppSelector } from "../../hooks/hooks";
import { AES_ENCRYPTION_SALT } from "../../utils/earthid_account";
import GenericText from "../../components/Text";
import { useSelector } from "react-redux";

const CameraScreen = (props: any) => {
  const viewShot = useRef(null);
  const getGeneratedKeys = useAppSelector((state) => state.user);
  const accountDetails = useAppSelector((state) => state.account);
  //const qrListData = useSelector((state) => state.qrListData);
  const username = accountDetails?.responseData?.username;
  const earthId = accountDetails?.responseData?.earthId;
  let qrData = {
    accountId: accountDetails?.responseData.toString().split(".")[2],
  };
  console.log("Capturing picture..", qrData);
  console.log("accID", accountDetails?.responseData);

  var encryptedString: any = CryptoJS.AES.encrypt(
    JSON.stringify(qrData),
    AES_ENCRYPTION_SALT
  );
  encryptedString = encryptedString.toString();

  const capturePicture = () => {
    console.log("Capturing picture..");

    viewShot.current.capture().then(async (imageData) => {
      console.log("imageData", imageData);
      try {
        await Share.open({
          url: "file://" + imageData,
          type: "image/jpeg",
          message: "Here's my QR code!",
        });
      } catch (error) {
        console.log("error", error);
      }
    });
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
        <TouchableOpacity onPress={() => props.navigation.goBack()}>
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
              options={{ format: "jpg", quality: 0.8 }}
            >
              <QRCode
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
