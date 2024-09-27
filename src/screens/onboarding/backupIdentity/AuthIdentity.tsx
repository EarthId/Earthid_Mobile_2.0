import React, { useEffect, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  PermissionsAndroid,
  Alert,
  BackHandler,
  TouchableOpacity,
  Image,
} from "react-native";
import Header from "../../../components/Header";
import { SCREENS } from "../../../constants/Labels";
import { Screens } from "../../../themes";
import Loader from "../../../components/Loader";
import CameraRoll from "@react-native-community/cameraroll";
import QRCode from "react-native-qrcode-image";
import CryptoJS from "react-native-crypto-js";
import ImgToBase64 from "react-native-image-base64";
import ViewShot from "react-native-view-shot";
import Button from "../../../components/Button";
import Share from "react-native-share";
import { AES_ENCRYPTION_SALT } from "../../../utils/earthid_account";
import GenericText from "../../../components/Text";
import { useAppSelector } from "../../../hooks/hooks";
import { LocalImages } from "../../../constants/imageUrlConstants";
import { isEarthId } from "../../../utils/PlatFormUtils";
import CustomPopup from "../../../components/Loader/customPopup";

interface IHomeScreenProps {
  navigation?: any;
  route?: any;
}

const AuthBackupIdentity = ({ navigation, route }: IHomeScreenProps) => {

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

  const [mobileNumber, setmobileNumber] = useState();
  const [isLoading, setIsLoading] = useState(false);
  let [qrBase64, setBase64] = useState("");
  const userDetails = useAppSelector((state) => state.account);
  const viewShot: any = useRef();

  const keys = useAppSelector((state) => state.user);
  const UserDid  = keys?.responseData?.newUserDid  
  const privateKey = keys?.responseData?.generateKeyPair?.privateKey
  const publicKey= userDetails?.responseData?.publicKey

  let qrData = {
    earthId: userDetails?.responseData?.earthId,
    publicKey:publicKey,
    privateKey:privateKey,
    UserDid:UserDid
  };
  
  const serializedData = JSON.stringify(qrData);
  const secretKey = 'idv-sessions';
  const encryptedData = CryptoJS.AES.encrypt(serializedData, secretKey).toString();

  const dwFile = async (file_url: any) => {
    await Share.open({ url: `data:image/png;base64,${file_url}` });
  };

  const capturePicture = () => {
    console.log("Capturing picture..");

    viewShot.current.capture().then(async (imageData: any) => {
      console.log("imageData", imageData);
      try {
        // await requestExternalStoragePermission();
        // await CameraRoll.save(imageData);
        dwFile(imageData);
        ImgToBase64.getBase64String(imageData)
          .then((base64String: any) => dwFile(base64String))
          .catch(() => console.log("error"));
        navigation.goBack(null);
      } catch (error) {
        console.log("error", error);
        navigation.goBack(null);
      }
    });
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
    showPopup(
      "Device Permission",
      "To grant Device ID, you need to allow the app permissions from (Settings > App > EarthID > Permission).",
      [
        {
          text: "OK",
          onPress: () => {
            setPopupVisible(false);
            BackHandler.exitApp();
          },
        },
      ]
    );
  };

  useEffect(() => {
    console.log("route==>", route);
  }, []);

  return (
    <View style={styles.sectionContainer}>
      <ScrollView contentContainerStyle={styles.sectionContainer}>
        <Header
          isLogoAlone={true}
          headingText={
            route.name == "AuthBackupIdentity" ? "backupidentity" : "important"
          }
          linearStyle={styles.linearStyle}
          containerStyle={{
            iconStyle: {
              width: 205,
              height: 72,
              marginTop: 30,
            },
            iconContainer: styles.alignCenter,
          }}
        ></Header>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{
            position: "absolute",
            marginTop: 38,
            marginLeft: 20,
          }}
        >
          <Image
            source={LocalImages.backImage}
            style={{
              height: 20,
              width: 20,
              resizeMode: "contain",
              tintColor: isEarthId() ? Screens.pureWhite : Screens.black,
            }}
          />
        </TouchableOpacity>
        <View style={styles.category}>
          <View>
            <GenericText
              style={[
                styles.categoryHeaderText,
                {
                  fontSize: 14,
                  fontWeight: "500",
                  textAlign: "center",
                  color: Screens.black,
                },
              ]}
            >
              {isEarthId()
                ? SCREENS.BACKUPIDENTYSCREEN.instructionEarthID
                : SCREENS.BACKUPIDENTYSCREEN.instruction}
            </GenericText>
          </View>
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
                value={encryptedData}
                size={250}
              />
            </ViewShot>
          </View>
          <Button
            onPress={capturePicture}
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
            title={"downlaodqr"}
          ></Button>
          <Loader
            loadingText="downlaodqrsuccess"
            Status="status"
            isLoaderVisible={isLoading}
          ></Loader>
        </View>
      </ScrollView>
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
    flexGrow: 1,
    backgroundColor: Screens.colors.background,
  },
  title: {
    color: Screens.grayShadeColor,
  },
  subtitle: {
    color: Screens.black,
    paddingLeft: 20,
    fontWeight: "bold",
    fontSize: 15,
    opacity: 1,
  },
  containerForSocialMedia: {
    marginTop: 10,
    marginHorizontal: 10,
    borderColor: Screens.grayShadeColor,
    borderWidth: 0.5,
    borderRadius: 10,
    justifyContent: "center",
  },

  textContainer: {
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  linearStyle: {
    height: 250,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    elevation: 4,
  },
  categoryHeaderText: {
    marginHorizontal: 20,
    marginVertical: 10,

    color: Screens.headingtextColor,
  },

  flatPanel: {
    marginHorizontal: 25,
    height: 80,
    borderRadius: 15,
    backgroundColor: Screens.colors.background,
    elevation: 15,
    marginTop: -40,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  logoContainers: {
    width: 30,
    height: 30,
    tintColor: Screens.grayShadeColor,
  },
  alignCenter: { justifyContent: "center", alignItems: "center" },
  label: {
    fontWeight: "bold",
    color: Screens.black,
  },
  category: {
    backgroundColor: Screens.pureWhite,
    padding: 10,
    marginTop: -160,
    marginHorizontal: 15,
    elevation: 5,
    borderRadius: 10,
    flex: 0.7,
    justifyContent: "space-between",
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginHorizontal: 8,
    flexDirection: "row",
    backgroundColor: Screens.lightGray,
  },
  avatarImageContainer: {
    width: 25,
    height: 30,
    marginTop: 5,
  },
  avatarTextContainer: {
    fontSize: 13,
    fontWeight: "500",
  },
  cardContainer: {
    flex: 1,
    paddingVertical: 9,
    title: {
      color: Screens.grayShadeColor,
    },
  },
  textInputContainer: {
    borderRadius: 10,
    borderColor: Screens.colors.primary,
    borderWidth: 2,
    marginLeft: 10,
    marginTop: -2,
  },
});

export default AuthBackupIdentity;
