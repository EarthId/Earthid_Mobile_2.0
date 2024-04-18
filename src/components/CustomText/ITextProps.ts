import * as RN from "react-native";

export interface ITextProps extends RN.TextProps {
  bold?: boolean;
  bolder?: boolean;
  size?: number;
  color?: string;
  style?: RN.StyleProp<RN.TextStyle>;
  animated?: boolean;
  lineHeight?: number | string;
  fontFamily?: string;
}
