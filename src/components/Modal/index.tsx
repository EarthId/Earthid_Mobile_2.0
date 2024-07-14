import React from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import { Screens } from "../../themes";
import Modal from "react-native-modal";
import { IModalProps } from "./IModalProps";
const deviceWidth = Dimensions.get("window").width;

/**
 * @author  vicky@
 * @description This is a base component for the implementation of Button.
 */

const ModalView = ({
  isModalVisible = false,
  height = 200,
  width = deviceWidth / 1.5,
  left = deviceWidth / 5,
  children,
}: IModalProps) => (
  <Modal style={{ marginLeft: left }} isVisible={isModalVisible}>
    <View
      style={{
        backgroundColor: "#fff",
        width: width,
        height: height,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 18,
      }}
    >
      {children}
    </View>
  </Modal>
);
export default ModalView;

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
    marginLeft: deviceWidth / 2,
    backgroundColor: Screens.colors.primary,
    padding: 15,
    flexDirection: "row",
    borderRadius: 50,
    borderColor: Screens.colors.primary,
    borderWidth: 2,
  },
});
