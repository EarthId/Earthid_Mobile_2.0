import React from "react";
import { StyleSheet } from "react-native";
import { ILinearGradientProps } from "./ILinearGradientProps";
import LinearGradient from "react-native-linear-gradient";

const LinearGradients = ({
  startColor,
  middleColor,
  endColor,
  style,
  children,
  horizontalGradient,
}: ILinearGradientProps) => {
  const letfToRightX = { x: 0, y: 0 };
  const letfToRightY = { x: 1, y: 0 };
  const topToBottomX = { x: 0, y: 0 };
  const topToBottomY = { x: 0, y: 1 };
  return (
    <LinearGradient
      start={horizontalGradient ? letfToRightX : topToBottomX}
      end={horizontalGradient ? letfToRightY : topToBottomY}
      colors={[startColor, endColor]}
      style={style}
    >
      {children}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    flex: 1,
  },
});

export default LinearGradients;
