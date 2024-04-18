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
        <View style={[styles.maskInners, { borderColor: 'green' }]}></View>

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
    top:55,
    left: 0,
    width: "100%",
    height: "50%",
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
    borderColor: "green",
    borderStyle: "dotted",
    borderWidth: 5,
    borderRadius: 30,
    position: "relative",
  },
  maskInners: {
    width: width - 10,
    height:300,
    backgroundColor: "transparent",
    borderColor: "green",
    borderStyle: "dotted",
    borderWidth: 5,
    borderRadius: 30,
    position: "relative",
  },
  maskFrame: {
  
  },
  maskRow: {
    width: "100%",
  },
  maskCenter: { flexDirection: "row", flex: 200 },
});

