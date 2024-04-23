import React from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import Modal from "react-native-modal";
import LottieView from "lottie-react-native";
import { LocalImages } from "../../constants/imageUrlConstants";
import GenericText from "../Text";
import { Screens } from "../../themes";
import { ILoaderProps } from "./ILoaderProps";

const deviceWidth = Dimensions.get("window").width;

const ErrorPopUp = ({
    isLoaderVisible = false,
    style = {},
    Status,
    loadingText,
    type = "error",
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
      {/* <LottieView
        style={{ width: 90, height: 90 }}
        source={LocalImages.LOTTIEICONS.error}
        autoPlay
        loop={false}
      /> */}
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
        Error
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

const styles = StyleSheet.create({
  categoryHeaderText: {
    marginHorizontal: 20,
    marginVertical: 5,
    color: Screens.headingtextColor,
  },
});

export default ErrorPopUp;
