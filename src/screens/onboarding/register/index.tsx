import React, { useRef, useState } from "react";
import { View, StyleSheet, ScrollView, Platform, Alert } from "react-native";
import Header from "../../../components/Header";
import { LocalImages } from "../../../constants/imageUrlConstants";
import { SCREENS } from "../../../constants/Labels";
import { Screens } from "../../../themes";
import Button from "../../../components/Button";
import DatePicker from "react-native-date-picker";

import Info from "../../../components/Info";
import TextInput from "../../../components/TextInput";
import PhoneInput from "react-native-phone-number-input";
import useFormInput from "../../../hooks/use-text-input";
import { emailValidator, nameValidator } from "../../../utils/inputValidations";
import Loader from "../../../components/Loader";
import {
  createAccount,
  GeneratedKeysAction,
} from "../../../redux/actions/authenticationAction";
import { useAppDispatch, useAppSelector } from "../../../hooks/hooks";
import { IUserAccountRequest } from "../../../typings/AccountCreation/IUserAccount";
import { getDeviceId, getDeviceName } from "../../../utils/encryption";
import AnimatedLoader from "../../../components/Loader/AnimatedLoader";
import GenericText from "../../../components/Text";
import { SnackBar } from "../../../components/SnackBar";
import { TouchableOpacity } from "react-native-gesture-handler";
import { isArray } from "lodash";
interface IRegister {
  navigation: any;
}

const Register = ({ navigation }: IRegister) => {
  const phoneInput: any = useRef();
  const dispatch = useAppDispatch();
  const [mobileNumber, setmobileNumber] = useState<string>("");
  const userDetails = useAppSelector((state) => state.account);
  const keys = useAppSelector((state) => state.user);
  const [successResponse, setsuccessResponse] = useState(false);
  const [openDatePicker, setopenDatePicker] = useState<boolean>();
  const [callingCode, setcallingCode] = useState<string>("+1");

  const {
    value: firstName,
    isFocused: firstNameFocus,
    validationResult: {
      hasError: isfirstNameError,
      errorMessage: isfirstNameErrorMessage,
    },
    valueChangeHandler: firstNameChangeHandler,
    inputFocusHandler: firstNameFocusHandlur,
    inputBlurHandler: firstNameBlurHandler,
  } = useFormInput("", true, nameValidator);
  const {
    value: lastName,
    isFocused: lastNameFocus,
    validationResult: {
      hasError: isLastNameError,
      errorMessage: isLastNameErrorMessahe,
    },
    valueChangeHandler: lastNameChangeHandler,
    inputFocusHandler: lastNameFocusHandlur,
    inputBlurHandler: lastNameBlurHandler,
  } = useFormInput("", true, nameValidator);

  const {
    valueChangeHandler: dateOfBirthChangeHandler,
    inputBlurHandler: dateOfBirthlurHandler,
  } = useFormInput("", true, nameValidator);
  const {
    value: email,
    isFocused: emailFocus,
    validationResult: {
      hasError: isemailError,
      errorMessage: isemailErrorMessage,
    },
    valueChangeHandler: emailChangeHandler,
    inputFocusHandler: emailFocusHandlur,
    inputBlurHandler: emailBlurHandler,
  } = useFormInput("", false, emailValidator);

  const _navigateAction = () => {
    if (isValid()) {
      dispatch(GeneratedKeysAction());
    } else {
      console.log("its coming");
      firstNameBlurHandler();
      lastNameBlurHandler();
      emailBlurHandler();
      dateOfBirthlurHandler();
    }
  };
  const isValid = () => {
    if (
      !nameValidator(firstName, true).hasError &&
      !emailValidator(email, true).hasError &&
      mobileNumber !== ""
    ) {
      return true;
    }
    return false;
  };

  const _registerAction = async ({ publicKey }: any) => {
    const token = await getDeviceId();
    const deviceName = await getDeviceName();
    const payLoad: IUserAccountRequest = {
      username: firstName,
      deviceID: token + Math.random(),
      deviceIMEI: token,
      deviceName: deviceName,
      email: email,
      orgId: "35942e1e-e65d-443e-af09-f3c0b330be1e",
      phone: mobileNumber,
      countryCode: callingCode,
      publicKey,
      deviceOS: Platform.OS === "android" ? "android" : "ios",
    };
    dispatch(createAccount(payLoad));
  };

  if (keys && keys?.isGeneratedKeySuccess) {
    keys.isGeneratedKeySuccess = false;
    _registerAction(keys?.responseData?.result);
  }

  if (userDetails && userDetails?.isAccountCreatedSuccess) {
    userDetails.isAccountCreatedSuccess = false;
    console.log("userDetails", userDetails);
    if (userDetails?.responseData) {
      setsuccessResponse(true);
      setTimeout(() => {
        setsuccessResponse(false);
        navigation.navigate("BackupIdentity");
      }, 3000);
    }
  }
  if (userDetails && userDetails?.isAccountCreatedFailure) {
    userDetails.isAccountCreatedFailure = false;
    if (userDetails?.errorMesssage && isArray(userDetails?.errorMesssage)) {
      SnackBar({
        indicationMessage: userDetails?.errorMesssage[0],
      });
    } else {
      SnackBar({
        indicationMessage: userDetails?.errorMesssage,
      });
    }
  }

  return (
    <View style={styles.sectionContainer}>
      <ScrollView contentContainerStyle={styles.sectionContainer}>
        <Header
          isLogoAlone={true}
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
            <GenericText
              style={[
                styles.categoryHeaderText,
                {
                  fontSize: 18,
                  fontWeight: "bold",
                  textAlign: "center",
                  color: Screens.black,
                },
              ]}
            >
              {SCREENS.LANDINGSCREEN.setUpId}
            </GenericText>
            <Info
              title={"Username"}
              style={{
                title: styles.title,
                subtitle: styles.subtitle,
                container: styles.textContainer,
              }}
            />
            <TextInput
              style={{
                container: styles.textInputContainer,
              }}
              placeholder={"Enter Username"}
              isError={isfirstNameError}
              errorText={isfirstNameErrorMessage}
              onFocus={firstNameFocusHandlur}
              onBlur={firstNameBlurHandler}
              maxLength={60}
              isFocused={firstNameFocus}
              value={firstName}
              onChangeText={firstNameChangeHandler}
            />

            {/* <Info
              title={"dob"}
              style={{
                title: styles.title,
                subtitle: styles.subtitle,
                container: styles.textContainer,
              }}
            />
            <TextInput
              style={{
                container: styles.textInputContainer,
              }}
              onPressRightIcon={() => onDatePickerOpen()}
              rightIcon={LocalImages.calendarImage}
              isError={dateOfBirthError}
              errorText={dateOfBirthErrorMessage}
              onFocus={dateOfBirthocusHandlur}
              onBlur={dateOfBirthlurHandler}
              maxLength={60}
              isFocused={dateOfBirthFocus}
              value={dateOfBirth}
              onChangeText={dateOfBirthChangeHandler}
            /> */}
            <Info
              title={"mobileno"}
              style={{
                title: styles.title,
                subtitle: styles.subtitle,
                container: styles.textContainer,
              }}
            />
            <PhoneInput
              onChangeCountry={(code) => {
                const { callingCode } = code;
                setcallingCode(callingCode[0]);
                console.log("code==>", callingCode[0]);
              }}
              autoFocus={false}
              ref={phoneInput}
              defaultCode="US"
              layout="first"
              onChangeText={(text: any) => {
                setmobileNumber(text);
              }}
              containerStyle={{
                borderColor: Screens.darkGray,
                borderWidth: 2.2,
                borderRadius: 5,
                height: 60,
                marginHorizontal: 10,
              }}
              flagButtonStyle={{ backgroundColor: Screens.thickGray }}
              textInputStyle={{ fontSize: 16, padding: 0, margin: 0 }}
              codeTextStyle={{ fontSize: 16, padding: 0, margin: 0 }}
              textContainerStyle={{
                height: 55,
                padding: 0,
                margin: 0,
              }}
              withShadow
            />
            <Info
              title={"email"}
              style={{
                title: styles.title,
                subtitle: styles.subtitle,
                container: styles.textContainer,
              }}
            />
            <TextInput
              style={{
                container: styles.textInputContainer,
              }}
              placeholder={"Enter your mail"}
              isError={isemailError}
              errorText={isemailErrorMessage}
              onFocus={emailFocusHandlur}
              onBlur={emailBlurHandler}
              maxLength={60}
              isFocused={emailFocus}
              value={email}
              onChangeText={emailChangeHandler}
            />
          </View>

          <View style={{ marginHorizontal: 20 }}>
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
              title={"generateeathid"}
            ></Button>
            <TouchableOpacity onPress={() => navigation.goBack(null)}>
              <View style={{ flexDirection: "row", alignSelf: "center" }}>
                <GenericText
                  style={[
                    styles.categoryHeaderText,
                    {
                      fontSize: 13,
                      fontWeight: "500",
                      textAlign: "center",
                      color: Screens.black,
                    },
                  ]}
                >
                  {"alreadyhavemy"}
                </GenericText>
                <GenericText
                  style={{
                    color: Screens.colors.primary,
                    alignSelf: "center",
                    textDecorationLine: "underline",
                  }}
                >
                  {"GlobalId"}
                </GenericText>
              </View>
            </TouchableOpacity>
          </View>

          <Loader
            loadingText="earthidgeneratesuccess"
            Status="status"
            isLoaderVisible={successResponse}
          ></Loader>
          <AnimatedLoader
            isLoaderVisible={userDetails?.isLoading}
            loadingText="loading"
          />
        </View>
        <DatePicker
          modal
          open={openDatePicker}
          date={new Date()}
          onConfirm={(date) => {
            console.log("date");
            setopenDatePicker(false);
            dateOfBirthChangeHandler(date.toDateString());
          }}
          onCancel={() => {
            setopenDatePicker(false);
          }}
        />
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
    color: Screens.black,
    fontWeight: "400",
    fontSize: 13,
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
    height: 400,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    elevation: 4,
  },
  categoryHeaderText: {
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
    marginTop: -250,
    marginHorizontal: 15,
    elevation: 5,
    borderRadius: 30,
    flex: 0.3,
    justifyContent: "space-between",
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
