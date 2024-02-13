import {
  Alert,
  AsyncStorage,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { Screens } from "../../themes";
import { LocalImages } from "../../constants/imageUrlConstants";
import PhoneInput from "react-native-phone-number-input";
import Button from "../../components/Button";
import AnimatedLoader from "../../components/Loader/AnimatedLoader";
import GenericText from "../../components/Text";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { useFetch } from "../../hooks/use-fetch";
import { updatephoneOtp,unVerifiedPhone } from "../../utils/earthid_account";
import { KeyboardAvoidingScrollView } from "react-native-keyboard-avoiding-scroll-view";
import Header from "../../components/Header";
import Loader from "../../components/Loader";
import { byPassUserDetailsRedux, saveProfileDetails } from "../../redux/actions/authenticationAction";

const EditMobileNumber = (props: any) => {
  const [callingCode, setcallingCode] = useState<string>("1");
  const phoneInput: any = useRef();
  const disPatch = useAppDispatch();
  const userDetails = useAppSelector((state) => state.account);
  const [code, setCode] = useState();
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [successResponse, setsuccessResponse] = useState(false);
  const [isMobileEmpty, setMobileEmpty] = useState<boolean>(false);
  const [countryCode, setcountryCode] = useState("US");
  const { loading, data, error, fetch } = useFetch();
  const [mobileNumber, setmobileNumber] = useState<string>("");
  const [isValidMobileNumber, setValidMobileNumber] = useState<boolean>(false);
  var codename:any=""
  const sentOtp = () => {
    var postData = {
      oldPhone: userDetails?.responseData?.phone,
      newPhone: mobileNumber,
      newCountryCode: "+" + callingCode,
      earthId: userDetails?.responseData?.earthId,
      publicKey: userDetails?.responseData?.publicKey,
      oldCountryCode: userDetails?.responseData?.countryCode,
    };
    console.log("postData", postData);
    fetch(updatephoneOtp, postData, "POST");
  };

  const unverifiedMobileUpdate =()=>{
    var postData = {
      username: userDetails?.responseData?.username,
      firstname: userDetails?.responseData?.firstname,
      lastname: userDetails?.responseData?.lastname,
      phone: mobileNumber,
      countryCode: "+" + callingCode,
      earthId: userDetails?.responseData?.earthId,
      publicKey: userDetails?.responseData?.publicKey,
     // email: userDetails?.responseData?.email,
    };
    console.log("postData", postData);
    fetch(unVerifiedPhone, postData, "POST");
  }

  const onMobileNumberFocus = () => {
    setKeyboardVisible(true);
  };
  const onMobileNumberBlur = () => {
    setKeyboardVisible(false);

  };

  const navigateAction = () => {
    if( userDetails?.responseData?.mobileApproved){
      sentOtp();
    }
    else{
      unverifiedMobileUpdate()
    }
 
  };

  useEffect(() => {
    console.log("data", data);
    console.log("userdetails", userDetails.responseData);
    console.log("userdetails", userDetails.responseData.countryCode);

    if (data) {
      if(userDetails?.responseData?.mobileApproved){
        props.navigation.navigate("EditMobileNumOtp", {
          newPhone: mobileNumber,
          callingCode,
        });
       
      }
      else{
        setsuccessResponse(true);
        let overallResponseData = {
          ...userDetails.responseData,
          ...{phone:mobileNumber },
        };
          disPatch(byPassUserDetailsRedux(overallResponseData)).then(() => {
            setTimeout(() => {
              setsuccessResponse(false);
              props.navigation.goBack(null)
            }, 7000);
          });
        } 
    }
  }, [data]);

  useEffect(()=>{
    name()
  })

  async function name() {
   
      codename = await AsyncStorage.getItem("callingcode")
      console.log("codeCountry",codename)
      console.log("codename",code)
      var data :any ="\"" + codename + "\"";
      console.log("codeValue",data)
      setCode(data)

  }


  return (
    <KeyboardAvoidingScrollView
      stickyFooter={
        <View
          style={{
            paddingHorizontal: 15,
            backgroundColor: Screens.colors.background,
          }}
        >
          <Button
            onPress={navigateAction}
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
            title={"submt"}
          ></Button>
        </View>
      }
      style={styles.sectionContainer}
    >
      <View style={styles.sectionContainer}>
      <Header
            isBack
            letfIconPress={() => props.navigation.goBack()}
            headingText= {"updatemobileno"}
            linearStyle={styles.linearStyle}
        ></Header>
        <GenericText
          style={[
            {
              fontSize: 16,
              color: Screens.black,
              fontWeight: "500",
              alignSelf: "center",
              marginTop: 15,
            },
          ]}
        >
          {"plsenternewmobile"}
        </GenericText>

        <GenericText
          style={[
            {
              fontSize: 13,
              marginTop: 20,
              paddingHorizontal: 15,
              marginBottom:20
            },
          ]}
        >
          {"mobileno"}
        </GenericText>
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
                width:'90%',
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
        <AnimatedLoader isLoaderVisible={loading} loadingText="Loading..." />
        <Loader
            loadingText={
             'Phone Number Updated SuccessFully'
            }
            Status="status"
            isLoaderVisible={successResponse}
          ></Loader>
      </View>
    </KeyboardAvoidingScrollView>
  );
};

export default EditMobileNumber;

const styles = StyleSheet.create({
  sectionContainer: {
    flex: 1,
    backgroundColor: Screens.colors.background,
  },
  linearStyle: {
    height: 120,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    elevation: 4,
  },
  logoContainer: {
    width: 25,
    height: 25,
    tintColor: "#fff",
  },
  sectionHeaderContainer: {
    flexDirection: "row",
    height: 120,
    backgroundColor: "#8b88db",
    borderBottomRightRadius: 25,
    borderBottomLeftRadius: 25,
    justifyContent: "space-between",
    paddingHorizontal: 10,
    alignItems: "center",
  },
  errorText: {
    color: Screens.red,
    marginBottom: 10,
    marginHorizontal: 20,
  },
});
