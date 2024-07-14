import React, { useRef, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  Image,
} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';

import Header from "../../../../components/Header";
import { SCREENS } from "../../../../constants/Labels";
import { Screens } from "../../../../themes";
import Button from "../../../../components/Button";
import SmoothPinCodeInput from "react-native-smooth-pincode-input";
import { LocalImages } from "../../../../constants/imageUrlConstants";
import GenericText from "../../../../components/Text";
import { StackActions } from "@react-navigation/native";
import { isEarthId } from "../../../../utils/PlatFormUtils";

interface IHomeScreenProps {
  navigation?: any;
}

const Register = ({ navigation,route }: IHomeScreenProps) => {
  const [code, setCode] = useState();
  const { isHide } = route.params || {};
  const onPinCodeChange = (code: any) => {
    var format = code.replace(/[^0-9]/g, "");
    setCode(format);
  };
  const _navigateAction = async () => {
    if (code.length === 6) {
      navigation.navigate("ConfirmPincode", { setCode: code });
    }
  };
  const actionToNavigate = () => {
    navigation.dispatch(StackActions.replace("DrawerNavigator"));
  };
  return (
    <View style={styles.sectionContainer}>
      <ScrollView contentContainerStyle={styles.sectionContainer}>
        <Header
          isBack
          letfIconPress={() => navigation.goBack()}
          headingText={"setpass"}
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

            {/* <GenericText
              style={[
                styles.categoryHeaderText,
                {
                  fontSize: 14,
                  fontWeight: "500",
                  textAlign: "center",
                  color: Screens.grayShadeColor,
                },
              ]}
            >
              {SCREENS.SECURITYSCREEN.PasscodeInstruction}
            </GenericText> */}
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
              {SCREENS.SECURITYSCREEN.PasscodeInstructions}
            </GenericText>
          </View>

          <View style={{ alignSelf: "center" }}>
            <SmoothPinCodeInput
              cellStyle={{
                borderWidth: 0.5,
                borderColor: Screens.grayShadeColor,
                borderRadius: 5,
              }}
              cellStyleFocused={{
                borderColor: Screens.colors.primary,
                borderWidth: 2,
              }}
              password
              cellSize={50}
              codeLength={6}
              value={code}
              onTextChange={onPinCodeChange}
            />
          </View>
        <View style={{marginTop:30}}>
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
            title={"createpasscord"}
          ></Button>

{isHide && <Button
            onPress={actionToNavigate}
            style={{
              buttonContainer: {
                elevation: 5,
                backgroundColor:'#ffff'
              },
              text: {
                color :isEarthId() ? "#293fee" : "#2AA2DE",
              },
              iconStyle: {
                tintColor: Screens.pureWhite,
              },
            }}
            title={"SKIP PASSCODE"}
          ></Button>
}
        </View>
     
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
