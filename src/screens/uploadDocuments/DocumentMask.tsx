import React from "react";
import { Dimensions, StyleSheet, View } from "react-native";

const { height, width } = Dimensions.get("window");
const maskRowHeight = Math.round((height - 300) / 20);
const maskColWidth = (width - 300) / 2;
interface IQrScannerProps {
  color?: string;
}
export const QrScannerMaskedWidget = ({ color }: IQrScannerProps) => {
  return (
    <View style={styles.maskOutter}>
      <View
        style={[{ flex: maskRowHeight }, styles.maskRow, styles.maskFrame]}
      />
      <View style={styles.maskCenter}>
        <View style={[{ width: maskColWidth }, styles.maskFrame]} />
        <View style={[styles.maskInner, { borderColor: color }]}></View>

        <View style={[{ width: maskColWidth }, styles.maskFrame]} />
      </View>
      <View
        style={[{ flex: maskRowHeight }, styles.maskRow, styles.maskFrame]}
      />
    </View>
  );
};

export default QrScannerMaskedWidget;

const styles = StyleSheet.create({
  maskOutter: {
    position: "absolute",
    top: 10,
    left: 0,
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "space-around",
  },
  scanInstructionText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
  },
  instructionText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },

  maskInnerInstructionTextContainer: {
    position: "absolute",
    bottom: -10,
    alignSelf: "center",
    left: 0,
    right: 0,
  },
  maskInner: {
    width: width - 80,

    backgroundColor: "transparent",
    borderColor: "#fff",
    borderStyle: "dotted",
    borderWidth: 2,
    borderRadius: 50,
    position: "relative",
  },
  maskFrame: {
    backgroundColor: "rgba(1,1,1,0.1)",
  },
  maskRow: {
    width: "100%",
  },
  maskCenter: { flexDirection: "row", flex: 200 },
});
