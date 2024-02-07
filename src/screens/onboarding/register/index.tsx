import React, { useEffect, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  Platform,
  TouchableOpacity,
  KeyboardAvoidingView,
  Alert,
  Text,
  AsyncStorage,
} from "react-native";
import Header from "../../../components/Header";
import { SCREENS } from "../../../constants/Labels";
import { Screens } from "../../../themes";
const PNF = require("google-libphonenumber").PhoneNumberFormat;
import Button from "../../../components/Button";
import DatePicker from "react-native-date-picker";
import { KeyboardAvoidingScrollView } from "react-native-keyboard-avoiding-scroll-view";
import Info from "../../../components/Info";
import TextInput from "../../../components/TextInput";
import PhoneInput from "react-native-phone-number-input";
import useFormInput from "../../../hooks/use-text-input";
import { emailValidator, nameValidator ,nameValidators} from "../../../utils/inputValidations";
import Loader from "../../../components/Loader";
import {
  createAccount,
  GeneratedKeysAction,
  saveDocuments,
} from "../../../redux/actions/authenticationAction";
import { useAppDispatch, useAppSelector } from "../../../hooks/hooks";
import { IUserAccountRequest } from "../../../typings/AccountCreation/IUserAccount";
import {
  dateTime,
  getDeviceId,
  getDeviceName,
} from "../../../utils/encryption";
import GenericText from "../../../components/Text";
import { SnackBar } from "../../../components/SnackBar";
import { isArray } from "lodash";
import { useFetch } from "../../../hooks/use-fetch";
import { newssiApiKey, superAdminApi } from "../../../utils/earthid_account";
import { isEarthId } from "../../../utils/PlatFormUtils";
import Spinner from "react-native-loading-spinner-overlay/lib";
import {
  createUserSignaturekey,
  postApi,
} from "../../../utils/createUserSignaturekey";
import { createVerifiableCred } from "../../../utils/createVerifiableCred";
import { SavedCredVerify } from "../../../redux/reducer/saveDataReducer";
import { SaveVerifyCred } from "../../../redux/actions/LocalSavingActions";
interface IRegister {
  navigation: any;
}

const Register = ({ navigation }: IRegister) => {
  const phoneInput: any = useRef();
  const dispatch = useAppDispatch();
  const {
    loading: superAdminLoading,
    data: superAdminResponse,
    fetch: getSuperAdminApiCall,
  } = useFetch();
  const [mobileNumber, setmobileNumber] = useState<string>("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [buttonPressed, setButtonPressed] = useState(false);
  const userDetails = useAppSelector((state) => state.account);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const keys = useAppSelector((state) => state.user);
  const [successResponse, setsuccessResponse] = useState(false);
  const [openDatePicker, setopenDatePicker] = useState<boolean>();
  const [callingCode, setcallingCode] = useState<string>("1");
  const [isValidMobileNumber, setValidMobileNumber] = useState<boolean>(false);
  const [isMobileEmpty, setMobileEmpty] = useState<boolean>(false);

  const saveFeaturesForVc = useAppSelector((state) => state.saveFeatures);
  // createVerifiableCrendital

  const documentsDetailsList = useAppSelector((state) => state.Documents);
  const [signature, setSignature] = useState();
  const [loading, setLoading] = useState(false);
  const [countryCode, setcountryCode] = useState("US");
  const [createVerify, setCreateVerify] = useState({});
  const issurDid = keys?.responseData?.issuerDid;
  const UserDid = keys?.responseData?.newUserDid;
  const privateKey = keys?.responseData?.generateKeyPair?.privateKey;
  let url: any = `https://ssi-test.myearth.id/api/user/sign?issuerDID=${issurDid}`;
  let requesturl: any = `https://ssi-test.myearth.id/api/issuer/verifiableCredential?isCryptograph=${false}&downloadCryptograph=${false}`;

  console.log(signature, "sign");
  console.log(createVerify, "createVerify");
  console.log(UserDid, "UserDid");

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
      hasError: islastNameError,
      errorMessage: islastNameErrorMessage,
    },
    valueChangeHandler: lastNameChangeHandler,
    inputFocusHandler: lastNameFocusHandlur,
    inputBlurHandler: lastNameBlurHandler,
  } = useFormInput("", true, nameValidators);


  const {
    valueChangeHandler: dateOfBirthChangeHandler,
    inputBlurHandler: dateOfBirthlurHandler,
  } = useFormInput("", true, nameValidators);
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

  useEffect(() => {
    console.log('superAdminApi',superAdminApi)
    getSuperAdminApiCall(superAdminApi, {}, "GET");
  }, []);

  useEffect(() => {
    getItem();
  }, []);

  const getItem = async () => {
    const item = await AsyncStorage.getItem("flow");
    if (item == "documentflow") {
      const name = await AsyncStorage.getItem("userDetails");
      firstNameChangeHandler(name);
    }
  };

  const _navigateAction = () => {
    setKeyboardVisible(false);
    setButtonPressed(true);
    mobileNumber === "" ? setMobileEmpty(true) : null;
    console.log("isValid()", isValid());
    if (isValid()) {
      auditFlowApi();
      setLoginLoading(true);
      dispatch(GeneratedKeysAction());
    } else {
      console.log("its coming");
      firstNameBlurHandler();
      emailBlurHandler();
      dateOfBirthlurHandler();
    }
  };

  async function auditFlowApi() {
    const min = 1;
    const max = 666666;
    const minid = 1;
    const maxid = 6666667777;
    const randomNumtopic = Math.floor(Math.random() * (max - min + 1)) + min;
    const randomNumtransID =
      Math.floor(Math.random() * (maxid - minid + 1)) + minid;
    const currentTimestamp = new Date().toISOString();
    const urlRequest: any = "https://w3storage.myearth.id/api/subs/publish";

    const postData = {
      topic: "0.0." + randomNumtopic,
      message: JSON.stringify({
        transactionID: randomNumtransID,
        flowName: "loginFlow",
        topicId: "0.0." + randomNumtopic,
        timestamp: currentTimestamp,
      }),
    };

    const headersToSend = {
      "Content-Type": "application/json",
    };

    await postApi(urlRequest, postData, headersToSend)
      .then((res: any) => {
        console.log("resData", res);
      })
      .catch((e: any) => {
        console.log("error", e);
      });
  }

  const isValid = () => {
    if (
      !nameValidator(firstName, true).hasError &&
      !emailValidator(email, true).hasError &&
      mobileNumber !== "" &&
      isValidMobileNumber
    ) {
      return true;
    }
    return false;
  };

  const _registerAction = async ({ publicKey }: any) => {
    const token = await getDeviceId();
    const deviceName = await getDeviceName();
    console.log('superAdminResponse',superAdminResponse)
    if (superAdminResponse && superAdminResponse[0]?.Id) {
      const payLoad: IUserAccountRequest = {
        firstname: firstName,
        username:firstName+" "+lastName,
        lastname: lastName,
        deviceID: token + Math.random(),
        deviceIMEI: token,
        deviceName: deviceName,
        email: email,
        orgId: superAdminResponse[0]?.Id,
        phone: mobileNumber,
        countryCode: "+" + callingCode,
        publicKey,
        deviceOS: Platform.OS === "android" ? "android" : "ios",
      };
      console.log('payLoad',JSON.stringify(payLoad))
      dispatch(createAccount(payLoad)).then(async () => {
        await AsyncStorage.setItem("flow", "loginflow");
      });
    } else {
      SnackBar({
        indicationMessage: "Registered Id is not generated ,please try again",
        doRetry: getSuperAdminApiCall(superAdminApi, {}, "GET"),
      });
    }
  };
  console.log("keys", keys);
  if (keys && keys?.isGeneratedKeySuccess) {
    keys.isGeneratedKeySuccess = false;

    _registerAction(keys?.responseData?.result);
  }

  if (userDetails && userDetails?.isAccountCreatedSuccess) {
    setsuccessResponse(true);
    userDetails.isAccountCreatedSuccess = false;
    console.log(
      "saveFeaturesForVc?.isVCFeatureEnabled===>",
      saveFeaturesForVc?.isVCFeatureEnabled
    );
    if (saveFeaturesForVc?.isVCFeatureEnabled) {
      createVerifiableCredentials().then(() => {
        setLoading(false);
        setTimeout(() => {
          setsuccessResponse(false);
          navigation.navigate("BackupIdentity");
        }, 7000);
      });
    } else {
      setLoading(false);
      setTimeout(() => {
        setsuccessResponse(false);
        navigation.navigate("BackupIdentity");
      }, 7000);
    }
  }
  if (userDetails && userDetails?.isAccountCreatedFailure) {
    userDetails.isAccountCreatedFailure = false;
    if (userDetails?.errorMesssage && isArray(userDetails?.errorMesssage)) {
      SnackBar({
        indicationMessage: userDetails?.errorMesssage[0],
      });
    } else {
      console.log("userDetails?.errorMesssage", userDetails?.errorMesssage);
      Alert.alert(
        "Warning",
        "Your EarthID already exists. Please recover it using your QR code generated during the registration process. If you have lost your QR code, please create a new EarthID using different username, email and phone number."
      );
    }
  }
  const Footer = () => (
    <View style={{ marginHorizontal: 20, backgroundColor: "#fff" }}>
      <Button
        disabled={!isValidMobileNumber || islastNameError || isfirstNameError || isemailError || firstName==='' || email==='' || lastName === '' }
        onPress={_navigateAction}
        style={{
          buttonContainer: {
            elevation: 5,
            opacity:isValidMobileNumber && !islastNameError && !isfirstNameError && !isemailError &&  lastName!==''&& firstName!=='' && email !=='' ?1:0.5
          },
          text: {
            color: Screens.pureWhite,
          },
          iconStyle: {
            tintColor: Screens.pureWhite,
          },
        }}
        title={isEarthId() ? "generateeathid" : "generateglobalid"}
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
            {isEarthId() ? "EarthID" : "GlobaliD"}
          </GenericText>
        </View>
      </TouchableOpacity>
    </View>
  );

  const onchangeFirstNameHandler = () => {
    setKeyboardVisible(true);
    firstNameFocusHandlur();
  };
  const onBlurFirstName = () => {
    setKeyboardVisible(false);
    firstNameBlurHandler();
  };
  const onchangelastNameHandler = () => {
    setKeyboardVisible(true);
    lastNameFocusHandlur();
  };
  const onBlurlastName = () => {
    setKeyboardVisible(false);
    lastNameBlurHandler();
  };
  const onchangeEmailHandler = () => {
    setKeyboardVisible(true);
    emailFocusHandlur();
  };
  const onBlurEmailName = () => {
    setKeyboardVisible(false);
    emailBlurHandler();
  };
  const onMobileNumberFocus = () => {
    setKeyboardVisible(true);
  };
  const onMobileNumberBlur = () => {
    setKeyboardVisible(false);
    setButtonPressed(true);
  };
  function containsSpecialChars(str: string) {
    const specialChars = /^[0-9]+$/;
    return specialChars.test(str);
  }

  const isMobileNumberValid = () => {
    if (isValidMobileNumber || isMobileEmpty) {
      return false;
    } else if (phoneInput.current.isFocused) {
      if (mobileNumber.length < 10) {
        console.log("its coming here");
        return false;
      }
    } else {
      return true;
    }
  };

  console.log("mobileNumber====?", mobileNumber.length);
  console.log("isValidMobileNumber", isValidMobileNumber);

  const getSignature = async () => {
    const params = {
      payload: {
        credentialSubject: {
          id: UserDid,
        },
      },
    };
    const headersToSend = {
      "Content-Type": "application/json",
      privateKey: privateKey,
      "x-api-key": newssiApiKey,
    };

    await createUserSignaturekey(url, params, headersToSend)
      .then((res: any) => setSignature(res.Signature))
      .catch((e) => console.log(e));
  };

  async function createVerifiableCredentials() {
    const hasApiBeenCalled = await AsyncStorage.getItem("apiCalled");
    console.log("hasApiBeenCalled", hasApiBeenCalled);

    setLoading(true);

    if (!hasApiBeenCalled) {
      console.log("hasApiBeenCalled++++++vicky1", hasApiBeenCalled);
      setTimeout(() => {
        setLoading(true);
      }, 100);
      getSignature().then(() => {
        const params = {
          schemaName: "EarthIdVCSchema:1",
          isEncrypted: false,
          dependantVerifiableCredential: [],
          credentialSubject: {
            earthId: userDetails?.responseData?.earthId,
            userName: userDetails?.responseData?.username,
            userEmail: userDetails?.responseData?.email,
            userMobileNo: userDetails?.responseData?.phone,
          },
        };

        const headersToSend = {
          "Content-Type": "application/json",
          did: UserDid,
          "x-api-key": newssiApiKey,
          publicKey: userDetails?.responseData?.publicKey,
          signature: signature,
        };

        createVerifiableCred(requesturl, params, headersToSend)
          .then(async (res: any) => {
            console.log("res.data======>", res.data);
            if (res.data) {
              setLoading(false);
              setCreateVerify(res?.data);
              dispatch(SaveVerifyCred(res.data));
              AsyncStorage.setItem(
                "vcCred",
                JSON.stringify(res?.data?.verifiableCredential)
              );
              await AsyncStorage.setItem("apiCalled", "true");
              var date = dateTime();
              var documentDetails: IDocumentProps = {
                id: res?.data?.verifiableCredential?.id,
                name: isEarthId()
                  ? `VC - EarthId Token`
                  : "VC - GlobalId Token",
                path: "filePath",
                date: date?.date,
                time: date?.time,
                txId: "data?.result",
                docType: res?.data?.verifiableCredential?.type[1],
                docExt: ".jpg",
                processedDoc: "",
                isVc: true,
                vc: JSON.stringify({
                  name: isEarthId()
                    ? `VC - EarthId Token`
                    : "VC - GlobalId Token",
                  documentName: isEarthId()
                    ? `VC - EarthId Token`
                    : "VC - GlobalId Token",
                  path: "filePath",
                  date: date?.date,
                  time: date?.time,
                  txId: "data?.result",
                  docType: "pdf",
                  docExt: ".jpg",
                  processedDoc: "",
                  isVc: true,
                }),
                verifiableCredential: res?.data?.verifiableCredential,
                documentName: isEarthId()
                  ? `VC - EarthId Token`
                  : "VC - GlobalId Token",
                docName: isEarthId()
                  ? `VC - EarthId Token`
                  : "VC - GlobalId Token",
                base64: undefined,
              };

              var DocumentList = documentsDetailsList?.responseData
                ? documentsDetailsList?.responseData
                : [];
              DocumentList.push(documentDetails);
              console.log("DocumentList===>", DocumentList);
              dispatch(saveDocuments(DocumentList));
            }
          })
          .catch((e) => console.log("error=====>vicky", e));
      });
    } else {
      setLoading(false);
      console.log("API hit already", "praveen");
    }
  }

  useEffect(()=>{
    setValidMobileNumber(phoneInput.current?.isValidNumber(mobileNumber));
  },[countryCode])

  return (
    <KeyboardAvoidingScrollView
      style={{ flex: 1, backgroundColor: Screens.colors.background }}
    >
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
      <View
        style={{ backgroundColor: Screens.colors.background, marginBottom: 50 }}
      >
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

            <View style={{ flexDirection: "row" }}>
              <Info
                title={"First Name"}
                style={{
                  title: styles.title,
                  subtitle: styles.subtitle,
                  container: styles.textContainer,
                }}
              />

              <GenericText
                style={{
                  color: "red",
                  position: "absolute",
                  alignSelf: "center",
                  left: 75,
                }}
              >
                {"*"}
              </GenericText>
            </View>
            <TextInput
              style={{
                container: styles.textInputContainer,
              }}
              placeholder={"Enter First Name"}
              isError={isfirstNameError}
              errorText={isfirstNameErrorMessage}
              onFocus={onchangeFirstNameHandler}
              onBlur={onBlurFirstName}
              maxLength={60}
              isFocused={firstNameFocus}
              value={firstName}
              onChangeText={firstNameChangeHandler}
            />

<View style={{ flexDirection: "row" }}>
              <Info
                title={"Last Name"}
                style={{
                  title: styles.title,
                  subtitle: styles.subtitle,
                  container: styles.textContainer,
                }}
              />

              <GenericText
                style={{
                  color: "red",
                  position: "absolute",
                  alignSelf: "center",
                  left: 75,
                }}
              >
                {"*"}
              </GenericText>
            </View>
            <TextInput
              style={{
                container: styles.textInputContainer,
              }}
              placeholder={"Enter Last Name"}
              isError={islastNameError}
              errorText={islastNameErrorMessage}
              onFocus={onchangelastNameHandler}
              onBlur={onBlurlastName}
              maxLength={60}
              isFocused={lastNameFocus}
              value={lastName}
              onChangeText={lastNameChangeHandler}
            />
            <View style={{ flexDirection: "row" }}>
              <Info
                title={"mobileno"}
                style={{
                  title: styles.title,
                  subtitle: styles.subtitle,
                  container: styles.textContainer,
                }}
              />

              <GenericText
                style={{
                  color: "red",
                  position: "absolute",
                  alignSelf: "center",
                  left: 105,
                }}
              >
                {"*"}
              </GenericText>
            </View>

            <PhoneInput
              textInputProps={{
                onFocus: onMobileNumberFocus,
                onBlur: onMobileNumberBlur,
                allowFontScaling: false,
              }}
              onChangeCountry={(code) => {
                console.log("code======>", code);
                const { callingCode, cca2 } = code;
               
                setcountryCode(cca2);
                setcallingCode(callingCode[0]);
                console.log("code==>", callingCode[0]);
              }}
              autoFocus={false}
              placeholder="Mobile number"
              ref={phoneInput}
              defaultCode="US"
              layout="first"
             
              onChangeText={(text: any) => {
                setValidMobileNumber(phoneInput.current?.isValidNumber(text));
                setmobileNumber(text);
                setMobileEmpty(false);
                setButtonPressed(false);
              }}
              containerStyle={{
                borderColor: isValidMobileNumber
                  ?mobileNumber.length != 0?Screens.colors.primary: Screens.darkGray
                  : 
                  mobileNumber.length != 0?  Screens.red:Screens.darkGray
               ,
                borderWidth: isValidMobileNumber
                  ? mobileNumber.length != 0?2.2: 1
                  : mobileNumber.length != 0
                  ? 2.2
                  : 2,
                borderRadius: 10,
                height: 60,
                marginHorizontal: 10,
              }}
              flagButtonStyle={{
                backgroundColor: Screens.thickGray,
                borderBottomLeftRadius: 9,
                borderTopLeftRadius: 9,
              }}
              textInputStyle={{ fontSize: 16, padding: 0, margin: 0 }}
              codeTextStyle={{ fontSize: 16, padding: 0, margin: 0 }}
              textContainerStyle={{
                height: 55,
                padding: 0,
                margin: 0,
                borderBottomEndRadius: 9,
                borderTopRightRadius: 9,
                backgroundColor: "#fff",
              }}
              filterProps={{ placeholder: "Search country" }}
            />
            {!isValidMobileNumber && mobileNumber.length != 0 && (
                  <Text allowFontScaling={false} style={styles.errorText}>
                    {"Please enter Valid mobile number"}
                  </Text>
                )}
            <View style={{ flexDirection: "row" }}>
              <Info
                title={"email"}
                style={{
                  title: styles.title,
                  subtitle: styles.subtitle,
                  container: styles.textContainer,
                }}
              />

              <GenericText
                style={{
                  color: "red",
                  position: "absolute",
                  alignSelf: "center",
                  left: 48,
                }}
              >
                {"*"}
              </GenericText>
            </View>
            <TextInput
              style={{
                container: styles.textInputContainer,
              }}
              placeholder={"Enter your Email"}
              isError={isemailError}
              errorText={isemailErrorMessage}
              onFocus={onchangeEmailHandler}
              onBlur={onBlurEmailName}
              maxLength={60}
              isFocused={emailFocus}
              value={email}
              onChangeText={emailChangeHandler}
            />
          </View>
          <Footer />

          <Loader
            loadingText={
              isEarthId() ? "earthidgeneratesuccess" : "globalgeneratesuccess"
            }
            Status="status"
            isLoaderVisible={successResponse}
          ></Loader>

          <Spinner
            visible={userDetails?.isLoading || keys?.isLoading || loading}
            textContent={"Loading..."}
            textStyle={styles.spinnerTextStyle}
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
      </View>
    </KeyboardAvoidingScrollView>
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
  spinnerTextStyle: {
    color: "#fff",
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
    padding: 5,
    marginTop: -260,
    marginHorizontal: 15,
    elevation: 5,
    borderRadius: 25,
    justifyContent: "space-between",
    shadowColor: "#171717",
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
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
    height: 60,
  },
  errorText: {
    color: Screens.red,
    marginBottom: 10,
    marginHorizontal: 20,
  },
});

export default Register;
