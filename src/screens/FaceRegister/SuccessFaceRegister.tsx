import { StackActions } from "@react-navigation/native";
import React, { useEffect } from "react";
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';

import Button from "../../components/Button";
import GenericText from "../../components/Text";
import { LocalImages } from "../../constants/imageUrlConstants";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { SaveSecurityConfiguration } from "../../redux/actions/LocalSavingActions";
import { Screens } from "../../themes/index";
import { ESecurityTypes } from "../../typings/enums/Security";

const facePlaceHolderWidget = ({ navigation, route }: any) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    console.log("routeface==>", route.params.type);
    console.log("routeface==>", route);
    storeData();
  }, []);
  const securityReducer: any = useAppSelector((state) => state.security);
  const saveSelectionSecurities = () => {
    let payLoad = [];
    if (
      securityReducer &&
      securityReducer?.securityData &&
      securityReducer?.securityData?.length > 0
    )
      payLoad = securityReducer?.securityData;
    if (payLoad[0].types !== ESecurityTypes.FACE) {
      payLoad.push({
        types: ESecurityTypes.FACE,
        enabled: true,
      });
    } else {
      payLoad = payLoad.map(
        (item: { types: ESecurityTypes; enabled: boolean }) => {
          if (item.types === ESecurityTypes.FACE) {
            item.enabled = true;
          }
          return item;
        }
      );
    }
    dispatch(SaveSecurityConfiguration(payLoad)).then(() => {
      actionToNavigate();
    });
  };

  const actionToNavigate = () => {
    if (securityReducer && securityReducer?.securityData) {
      console.log(
        "securityReducer?.securityData",
        securityReducer?.securityData
      );
      if (
        securityReducer?.securityData?.length === 2 &&
        securityReducer?.securityData?.some(
          (item: { types: any }) => item.types === ESecurityTypes.PASSCORD
        ) &&
        securityReducer?.securityData?.every(
          (item: { enabled: boolean }) => item.enabled
        )
      ) {
        navigation.dispatch(
          StackActions.replace("DrawerNavigator", { type: "Faceid" })
        );
      } else {
        navigation.navigate("Security");
      }
    } else {
      navigation.navigate("Security");
    }
  };

  const storeData = () => {
    try {
      let name = route.params.type;
      AsyncStorage.setItem("faceid", name);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={styles.sectionContainer}>
      <View style={{ position: "absolute", top: 20, right: 20, zIndex: 100 }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image
            resizeMode="contain"
            style={[styles.logoContainer]}
            source={LocalImages.closeImage}
          ></Image>
        </TouchableOpacity>
      </View>
      <View></View>
      <View style={{ justifyContent: "center", alignItems: "center" }}>
        <Image
          resizeMode="contain"
          style={{ width: 300, height: 300 }}
          source={LocalImages.facedetection}
        ></Image>
        <GenericText
          style={[
            {
              fontSize: 20,
              alignSelf: "center",
              color: Screens.pureWhite,
              marginHorizontal: 30,
              fontWeight: "500",
            },
          ]}
        >
          {"All set! You can now unlock the application with your face."}
        </GenericText>
      </View>

      <Button
        onPress={() => saveSelectionSecurities()}
        style={{
          buttonContainer: {
            elevation: 5,
            marginHorizontal: 10,
          },
          text: {
            color: Screens.pureWhite,
          },
          iconStyle: {
            tintColor: Screens.pureWhite,
          },
        }}
        title={"Done!"}
      ></Button>
    </View>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    flex: 1,
    backgroundColor: Screens.black,
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

export default facePlaceHolderWidget;
