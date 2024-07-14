import { DefaultTheme } from "@react-navigation/native";
import { isEarthId } from "../utils/PlatFormUtils";
export const Apptheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: isEarthId() ? "#293fee" : "#2AA2DE",
    background: "#000",
  },
};
export const Screens = {
  black: "#000",
  headingtextColor: "#4A4A4A",
  pureWhite: "#ffffff",
  red: "red",
  grayShadeColor: "#7F7F7F",
  success: "#25cc25",
  darkGray: "#EAEAEA",
  lightGray: "#F8F8F8",
  thickGray: "#EDF1F4",
  colors: {
    background: "#F5F5F5",
    primary: isEarthId() ? "#4816B8" : "#50A0D9",
    primary2: isEarthId() ? "#293fee" : "#50A0D9",
    ScanButton: {
      startColor: isEarthId() ? "#8059D0" : "#f0f4f7",
      middleColor: isEarthId() ? "#8059D0" : "#dbe4ee",
      endColor: isEarthId() ? "#9EDCF0" : "#c0cfdd",
    },
    header: {
      startColor: isEarthId() ? "#8059D0" : "#f0f4f7",
      middleColor: isEarthId() ? "#8059D0" : "#dbe4ee",
      endColor: isEarthId() ? "#9EDCF0" : "#c0cfdd",
    },
    bottomFocusedBackground: {
      color: "#EDF1F4",
    },
    customDrawer: {
      headerBackground: "#D9E3EC",
    },
  },
};
