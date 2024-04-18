import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';

import Header from "../../../../../components/Header";
import { SCREENS } from "../../../../../constants/Labels";
import { Screens } from "../../../../../themes";
import Button from "../../../../../components/Button";
import SmoothPinCodeInput from "react-native-smooth-pincode-input";
import { LocalImages } from "../../../../../constants/imageUrlConstants";
import Loader from "../../../../../components/Loader";
import GenericText from "../../../../../components/Text";
import { isEarthId } from "../../../../../utils/PlatFormUtils";

interface IHomeScreenProps {
  navigation?: any;
  route?: any;
}

const Register = ({ navigation, route }: IHomeScreenProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [code, setCode] = useState();
  const [isError, setisError] = useState(false);
  const savedCode = route.params?.setCode;
  const { type } = route.params;

  const onPinCodeChange = (code: any) => {
    setisError(false);
    var format = code.replace(/[^0-9]/g, "");
    setCode(format);
  };
  const _navigateAction = async () => {
    console.log("savedCode", savedCode);
    if (code?.length > 5) {
      if (savedCode === code?.toString()) {
        await AsyncStorage.setItem("passcode", code?.toString());
        setIsLoading(true);
        setTimeout(() => {
          setIsLoading(false);
          navigation.navigate("UpdateAuthentication");
        }, 3000);
      } else {
        setisError(true);
      }
    } else {
      Alert.alert("Oops!", "Please enter valid passcode", [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        { text: "OK", onPress: () => console.log("OK Pressed") },
      ]);
    }
  };

  useEffect(() => {
    console.log("savedtype==>", route);
  }, []);

  return (
    <View style={styles.sectionContainer}>
      <ScrollView contentContainerStyle={styles.sectionContainer}>
        <Header
          isLogoAlone={true}
          headingText={"confirmpasscord"}
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
            marginTop: 40,
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
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                margin: 30,
              }}
            >
              <Image
                resizeMode="contain"
                style={[styles.logoContainer]}
                source={LocalImages.passcordImage}
              ></Image>
            </View>

            <GenericText
              style={[
                styles.categoryHeaderText,
                {
                  fontSize: 13,
                  fontWeight: "500",
                  textAlign: "center",
                  color: Screens.grayShadeColor,
                },
              ]}
            >
              {route.name == "UpdateConfirmPincode"
                ? "confirmnewpass"
                : SCREENS.SECURITYSCREEN.confirmInstruction}
            </GenericText>
          </View>

          <View style={{ alignSelf: "center" }}>
            <SmoothPinCodeInput
              cellStyle={{
                borderWidth: isError ? 1.5 : 0.5,
                borderColor: isError ? "red" : Screens.grayShadeColor,
                borderRadius: 5,
              }}
              cellStyleFocused={{
                borderWidth: 2,
                borderColor: Screens.colors.primary,
              }}
              password
              cellSize={50}
              codeLength={6}
              value={code}
              onTextChange={onPinCodeChange}
            />
          </View>
          {isError && (
            <GenericText
              style={[
                styles.categoryHeaderText,
                {
                  fontSize: 13,
                  fontWeight: "500",
                  textAlign: "center",
                  color: "red",
                },
              ]}
            >
              {"plsentervalid"}
            </GenericText>
          )}

          <Button
            onPress={_navigateAction}
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
            title={"confirm"}
          ></Button>
          <Loader
            loadingText={"passupdatessuccess"}
            Status={"status"}
            isLoaderVisible={isLoading}
          ></Loader>
        </View>
      </ScrollView>
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
  logoContainer: {
    width: 100,
    height: 100,
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
    flex: 0.1,
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

export default Register;
