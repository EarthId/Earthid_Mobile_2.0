import React from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import { Screens } from "../../themes";
import Modal from "react-native-modal";
import { ILoaderProps } from "./ILoaderProps";
import LottieView from "lottie-react-native";
import { LocalImages } from "../../constants/imageUrlConstants";
import GenericText from "../Text";
const deviceWidth = Dimensions.get("window").width;
const deviceHeight = Dimensions.get("window").height;

/**
 * @author  vicky@
 * @description This is a base component for the implementation of Button.
 */

const SuccessPopUp = ({
  isLoaderVisible = false,
  style = {},
  Status,
  loadingText,
  type = "success",
}: ILoaderProps) => (
  <Modal style={{ marginLeft: deviceWidth / 6 }} isVisible={isLoaderVisible}>
    <View
      style={{
        backgroundColor: "#fff",
        width: deviceWidth / 1.5,
        height: 200,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 20,
      }}
    >
      {/* <ActivityIndicator size="small" color={Screens.colors.primary} /> */}
      <LottieView
        style={{ width: 90, height: 90 }}
        source={
          type === "success"
            ? LocalImages.LOTTIEICONS.success
            : LocalImages.LOTTIEICONS.loader
        }
        autoPlay
        loop
      />
      <GenericText
        style={[
          styles.categoryHeaderText,
          {
            fontSize: 16,
            fontWeight: "bold",
            textAlign: "center",
            color: Screens.black,
          },
        ]}
      >
        {Status}
      </GenericText>
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
        {loadingText}
      </GenericText>
    </View>
  </Modal>
);
export default SuccessPopUp;

const styles = StyleSheet.create({
  logoContainer: {
    width: 30,
    height: 30,
  },
  common: {
    textAlign: "center",
    marginLeft: 10,
    color: Screens.colors.primary,
    fontWeight: "500",
    fontSize: 15,
  },
  categoryHeaderText: {
    marginHorizontal: 20,
    marginVertical: 5,

    color: Screens.headingtextColor,
  },
  primary: {
    marginVertical: 20,
    justifyContent: "center",
    alignItems: "center",
    marginLef: deviceWidth / 2,
    backgroundColor: Screens.colors.primary,
    padding: 15,
    flexDirection: "row",
    borderRadius: 50,
    borderColor: Screens.colors.primary,
    borderWidth: 2,
  },
});
