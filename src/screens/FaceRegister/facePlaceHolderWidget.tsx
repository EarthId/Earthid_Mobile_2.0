import React from "react";
import { View, StyleSheet, Image, TouchableOpacity } from "react-native";

import Button from "../../components/Button";
import GenericText from "../../components/Text";
import { LocalImages } from "../../constants/imageUrlConstants";
import { Screens } from "../../themes/index";

const facePlaceHolderWidget = (props: any, route: any) => {
  return (
    <View style={styles.sectionContainer}>
      <View style={{ position: "absolute", top: 20, right: 20, zIndex: 100 }}>
        <TouchableOpacity onPress={() => props.navigation.goBack()}>
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

              color: Screens.pureWhite,
              fontWeight: "500",
            },
          ]}
        >
          {"enrollface"}
        </GenericText>

        <GenericText
          style={[
            {
              fontSize: 14,
              textAlign: "center",
              marginHorizontal: 30,
              marginVertical: 20,
              color: Screens.pureWhite,
              fontWeight: "100",
            },
          ]}
        >
          {"forbestresults"}
        </GenericText>
      </View>

      <Button
        onPress={() => props.navigation.navigate("RegisterFace")}
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
        title={"continue"}
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
