import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import GenericText from "../../components/Text";
import { Screens } from "../../themes";
import { LocalImages } from "../../constants/imageUrlConstants";
import PhoneInput from "react-native-phone-number-input";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import SmoothPinCodeInput from "react-native-smooth-pincode-input";
import Button from "../../components/Button";
import AnimatedLoader from "../../components/Loader/AnimatedLoader";
import { useFetch } from "../../hooks/use-fetch";
import { updatePhone, updatephoneOtp } from "../../utils/earthid_account";
import { byPassUserDetailsRedux } from "../../redux/actions/authenticationAction";
import { KeyboardAvoidingScrollView } from "react-native-keyboard-avoiding-scroll-view";
import { SnackBar } from "../../components/SnackBar";

const EditMobileNumOtp = (props: any) => {
  const userDetails = useAppSelector((state) => state.account);
  const { loading, data, error, fetch } = useFetch();
  const {
    loading: loadingResend,
    data: reSendData,
    error: resendError,
    fetch: reSendfetch,
  } = useFetch();
  const dispatch = useAppDispatch();
  const { newPhone, callingCode } = props.route.params;
  const [oldCode, setOldCode] = useState<any>();
  const [newCode, setNewCode] = useState<any>();
  
  const onPinCodeChangeForOld = (code: any) => {
    var format = code.replace(/[^0-9]/g, "");
    setOldCode(format);
  };
  const onPinCodeChangeForNew = (code: any) => {
    var format = code.replace(/[^0-9]/g, "");
    setNewCode(format);
  };
  console.log("userDetails", userDetails);
  const verfified = () => {
     if(oldCode== null || oldCode?.length < 6){
      SnackBar({
        indicationMessage: "Please enter the old mobile OTP code",
      });
     }
     else if(newCode==null || newCode.length < 6){
      SnackBar({
        indicationMessage: "Please enter the new mobile OTP code",
      });     }else{
      var postData = {
        oldEmailOTP: oldCode,
        newEmailOTP: newCode,
        earthId: userDetails?.responseData?.earthId,
        publicKey: userDetails?.responseData?.publicKey,
      };
      fetch(updatePhone, postData, "POST");
     }
     


  };
  useEffect(() => {
   console.log("data", data);
    if (data) {
      let overallResponseData = {
        ...userDetails.responseData,
        ...{ phone: newPhone },
      };
      dispatch(byPassUserDetailsRedux(overallResponseData)).then(() => {
        props.navigation.navigate("ProfileScreen");
      });
    }
  
  }, [data]);

  const _reSend = () => {
    var postData = {
      oldPhone: userDetails?.responseData?.phone,
      newPhone: newPhone,
      newCountryCode: "+" + callingCode,
      earthId: userDetails?.responseData?.earthId,
      publicKey: userDetails?.responseData?.publicKey,
      oldCountryCode: userDetails?.responseData?.countryCode,
    };
    reSendfetch(updatephoneOtp, postData, "POST");
  };

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
            onPress={verfified}
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
        <ScrollView contentContainerStyle={styles.sectionContainer}>
          <View style={styles.sectionHeaderContainer}>
            <TouchableOpacity onPress={() => props.navigation.goBack()}>
              <Image
                resizeMode="contain"
                style={styles.logoContainer}
                source={LocalImages.backImage}
              ></Image>
            </TouchableOpacity>
            <GenericText
              style={[
                {
                  fontSize: 20,
                  color: Screens.pureWhite,
                  fontWeight: "500",
                  marginLeft: -10,
                },
              ]}
            >
              {"updatemobileno"}
            </GenericText>

            <View />
          </View>

          <GenericText
            style={[
              {
                fontSize: 16,
                color: Screens.grayShadeColor,
                fontWeight: "500",
                alignSelf: "center",
                marginTop: 15,
              },
            ]}
          >
            {"enterotprevoldmobile"}
          </GenericText>
          <GenericText
            style={[
              {
                fontSize: 16,
                color: Screens.grayShadeColor,
                fontWeight: "500",
                alignSelf: "center",
              },
            ]}
          >
            {userDetails?.responseData?.countryCode +
              " " +
              userDetails.responseData.phone}
          </GenericText>

          <View style={{ alignSelf: "center", marginTop: 25 }}>
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
              value={oldCode}
              onTextChange={onPinCodeChangeForOld}
            />
          </View>

          <TouchableOpacity onPress={() => _reSend()}>
            <GenericText
              style={[
                {
                  fontSize: 13,
                  color: "#293FEE",
                  fontWeight: "500",
                  alignSelf: "flex-end",
                  marginRight: 35,
                  marginTop: 8,
                  textDecorationLine: "underline",
                },
              ]}
            >
              {"resendcode"}
            </GenericText>
          </TouchableOpacity>

          <GenericText
            style={[
              {
                fontSize: 16,
                color: Screens.grayShadeColor,
                fontWeight: "500",
                alignSelf: "center",
                marginTop: 40,
              },
            ]}
          >
            {"enterotprevnewmobile"}
          </GenericText>
          <GenericText
            style={[
              {
                fontSize: 16,
                color: Screens.grayShadeColor,
                fontWeight: "500",
                alignSelf: "center",
              },
            ]}
          >
            {"+" + callingCode + " " + newPhone}
          </GenericText>

          <View style={{ alignSelf: "center", marginTop: 25 }}>
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
              value={newCode}
              onTextChange={onPinCodeChangeForNew}
            />
          </View>

          <TouchableOpacity onPress={() => _reSend()}>
            <GenericText
              style={[
                {
                  fontSize: 13,
                  color: "#293FEE",
                  fontWeight: "500",
                  alignSelf: "flex-end",
                  marginRight: 35,
                  marginTop: 8,
                  textDecorationLine: "underline",
                },
              ]}
            >
              {"resendcode"}
            </GenericText>
          </TouchableOpacity>

          <AnimatedLoader loadingText={"loading"} />
        </ScrollView>
      </View>
    </KeyboardAvoidingScrollView>
  );
};

export default EditMobileNumOtp;

const styles = StyleSheet.create({
  sectionContainer: {
    flex: 1,
    backgroundColor: Screens.colors.background,
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
});
