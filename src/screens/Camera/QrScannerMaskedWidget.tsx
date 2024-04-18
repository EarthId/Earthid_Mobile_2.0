import React from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { Screens } from "../../themes";
import QrCodeMask from "react-native-qrcode-mask";
import GenericText from "../../components/Text";
const { height, width } = Dimensions.get("window");
export const QrScannerMaskedWidget = () => {
  return (
    <View style={styles.maskOutter}>
      <QrCodeMask
        width={width / 1.2}
        lineColor="green"
        lineDirection="vertical"
        height={350}
        lineThick={5}
        edgeColor={Screens.pureWhite}
        edgeWidth={30}
        edgeHeight={30}
        overlayOpacity={1}
        bottomTitle={"Scan this code"}
      />
    </View>
  );
};

export default QrScannerMaskedWidget;

const styles = StyleSheet.create({
  maskOutter: {
    position: "absolute",
    top: -50,
    left: 0,
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "space-around",
  },
});
