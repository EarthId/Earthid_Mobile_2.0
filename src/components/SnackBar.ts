import Snackbar from "react-native-snackbar";
import { Screens } from "../themes";
export interface ISnackbarProps {
  actionMessage?: string;
  duration?: number;
  indicationMessage?: string;
  doRetry?: any;
}
export const SnackBar = ({
  actionMessage = "Try ",
  indicationMessage = "",
  duration = 3000,
  doRetry,
}: ISnackbarProps) => {
  Snackbar.show({
    text: indicationMessage,
    duration: duration,
  });
};
