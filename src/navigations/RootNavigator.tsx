
import * as React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import { Apptheme } from "../themes";
import { enableScreens } from "react-native-screens";
import DrawerNavigator from "../navigations/DrawerNavigator";
import { SlidAnimation } from "./SlidAnimation";
import LandingScreen from "../screens/onboarding/landingPage";
import RegisterScreen from "../screens/onboarding/register";
import BackupIdentity from "../screens/onboarding/backupIdentity";
import Security from "../screens/onboarding/security";
import SetPin from "../screens/onboarding/security/passcode/SetPincode";
import ConfirmPincode from "../screens/onboarding/security/passcode/ConfirmPincode";
import uploadDocumentsScreen from "../screens/uploadDocuments";
import LoadingScreen from "../screens/onboarding/LoadingScreen";
import PasswordCheck from "../screens/onboarding/security/passcode/PasswordCheck";
import facePlaceHolderWidget from "../screens/FaceRegister/facePlaceHolderWidget";
import RegisterFace from "../screens/FaceRegister/RegisterFace";
import SuccessFaceRegister from "../screens/FaceRegister/SuccessFaceRegister";
import FingerPrintInstructionScreen from "../screens/FingerPrintRegister/FingerPrintInstructionScreen";
import UploadDocument from "../screens/uploadDocuments/UploadDocument";
import DocumentPreviewScreen from "../screens/uploadDocuments/DocumentPreviewScreen";
import categoryScreen from "../screens/uploadDocuments/categoryScreen";
import UploadQr from "../screens/UploadQr";
import UploadDocumentPreviewScreen from "../screens/UploadQr/UploadDocumentPreviewScreen";
import FaceCheck from "../screens/FaceRegister/FaceCheck";
import LivenessCameraScreen from "../screens/uploadDocuments/LivenessCameraScreen";
import VerifiDocumentScreen from "../screens/uploadDocuments/VerifiDocumentScreen";
import PasswordCheck1 from "../screens/onboarding/security/passcode/PasswordCheck1";

// Before rendering any navigation stack
const animations: any = SlidAnimation;
export default function RootNavigator() {
  enableScreens();
  const Stack = createStackNavigator();

  const beforeLoggedIn = {
    LandingScreen: LandingScreen,
    Security: Security,
    facePlaceHolderWidget: facePlaceHolderWidget,
    RegisterFace: RegisterFace,
    FingerPrintInstructionScreen: FingerPrintInstructionScreen,
    RegisterScreen: RegisterScreen,
    BackupIdentity: BackupIdentity,
    FaceCheck: FaceCheck,
    SetPin: SetPin,
    ConfirmPincode: ConfirmPincode,
    uploadDocumentsScreen: uploadDocumentsScreen,
    SuccessFaceRegister: SuccessFaceRegister,
    UploadDocument: UploadDocument,
    DocumentPreviewScreen: DocumentPreviewScreen,
    categoryScreen: categoryScreen,
    UploadQr: UploadQr,
    UploadDocumentPreviewScreen: UploadDocumentPreviewScreen,
    LivenessCameraScreen: LivenessCameraScreen,
    VerifiDocumentScreen: VerifiDocumentScreen,
  
  };

  function AuthStack() {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {Object.entries({
          ...beforeLoggedIn,
        }).map(([name, component]) => (
          <Stack.Screen
            key={name}
            options={{
              ...animations,
            }}
            name={name}
            component={component}
          />
        ))}
      </Stack.Navigator>
    );
  }

  return (

    <NavigationContainer theme={Apptheme}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen
          options={{
            ...animations,
          }}
          name={"LoadingScreen"}
          component={LoadingScreen}
        />
        <Stack.Screen
          options={{
            ...animations,
          }}
          name={"AuthStack"}
          component={AuthStack}
        />
        
        <Stack.Screen
          options={{
            ...animations,
          }}
          name={"PasswordCheck1"}
          component={PasswordCheck1}
        />

        <Stack.Screen
          options={{
            ...animations,
          }}
          name={"PasswordCheck"}
          component={PasswordCheck}
        />
        <Stack.Screen
          options={{
            ...animations,
          }}
          name={"FaceCheck"}
          component={FaceCheck}
        />
        <Stack.Screen
          options={{
            ...animations,
          }}
          name={"DrawerNavigator"}
          component={DrawerNavigator}
        />
        <Stack.Screen
          options={{
            ...animations,
          }}
          name={"Security"}
          component={Security}
        />

        <Stack.Screen
          options={{
            ...animations,
          }}
          name={"RegisterFace"}
          component={RegisterFace}
        />

        <Stack.Screen
          options={{
            ...animations,
          }}
          name={"SetPin"}
          component={SetPin}
        />

        <Stack.Screen
          options={{
            ...animations,
          }}
          name={"FingerPrintInstructionScreen"}
          component={FingerPrintInstructionScreen}
        />
        <Stack.Screen
          options={{
            ...animations,
          }}
          name={"ConfirmPincode"}
          component={ConfirmPincode}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
