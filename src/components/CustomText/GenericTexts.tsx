import * as React from "react";
import { useTranslation } from "react-i18next";
import { Animated, Text } from "react-native";
import { ITextProps } from "./ITextProps";

/**
 * @param bold
 * @param bolder
 * @param size
 * @param color
 * @param style
 * @param children
 * @param animated
 * @param lineHeight
 * @param props
 * @author: vicky (vicky@)
 * @description A generic text component to abstract commonly used props.
 */
const GenericTexts: React.SFC<ITextProps> = ({
  bold,
  bolder,
  size,
  color,
  style,
  children,
  animated,
  lineHeight,
  fontFamily,
  ...props
}) => {
  const Text_ = animated ? Animated.Text : Text; //Support for animated text
  const { t } = useTranslation(); // Support for localization
  const textInput = children! as string; // typescript
  return (
    <Text_
    style={[
      style
    ]}
    {...props}
  >
    {t(textInput)}
  </Text_>
  );
};

export default GenericTexts;
