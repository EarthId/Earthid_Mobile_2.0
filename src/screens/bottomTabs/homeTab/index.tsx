import { set, values } from "lodash";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
  Platform,
  AppState,
  Text,
  InteractionManager,
  SectionList,
} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';

import { EventRegister } from "react-native-event-listeners";
import il8n, { getUserLanguagePreference } from "../.././../utils/i18n";
import RNFS from "react-native-fs";
import Avatar from "../../../components/Avatar";
import Card from "../../../components/Card";
import Header from "../../../components/Header";
import ShareMenu, { ShareMenuReactView } from "react-native-share-menu";
import GenericText from "../../../components/Text";
import { Linking } from "react-native";
import { LocalImages } from "../../../constants/imageUrlConstants";
import { SCREENS } from "../../../constants/Labels";
import { useAppDispatch, useAppSelector } from "../../../hooks/hooks";
import {
  getHistory,
  saveDocuments,
} from "../../../redux/actions/authenticationAction";
import { savingProfilePictures } from "../../../redux/actions/LocalSavingActions";
import { Screens } from "../../../themes";
import { getColor } from "../../../utils/CommonFuntion";

import { dateTime } from "../../../utils/encryption";
import RNFetchBlob from "rn-fetch-blob";
import { IDocumentProps } from "../../uploadDocuments/VerifiDocumentScreen";
import NetInfo from "@react-native-community/netinfo";
import { createUserSignaturekey } from "../../../utils/createUserSignaturekey";
import { newssiApiKey } from "../../../utils/earthid_account";
import { createVerifiableCred } from "../../../utils/createVerifiableCred";
import Spinner from "react-native-loading-spinner-overlay/lib";
import { StackActions } from "@react-navigation/native";
import TouchID from "react-native-touch-id";
import GLOBAL from "../../../utils/globals";
import GLOBALS from "../../../utils/globals";
import { AWS_API_BASE } from "../../../constants/URLContstants";
import ReactNativeBiometrics from "react-native-biometrics";
import CustomPopup from "../../../components/Loader/customPopup";

//import { useIsFocused } from "@react-navigation/native"; // Import this hook


interface IHomeScreenProps {
  navigation?: any;
  route?: any;
}
type SharedItem = {
  mimeType: string;
  data: string;
  extraData: any;
};
const optionalConfigObject = {
  title: "Authentication Required", // Android
  imageColor: "#2AA2DE", // Android
  imageErrorColor: "#ff0000", // Android
  sensorDescription: "Touch sensor", // Android
  sensorErrorDescription: "Failed", // Android
  cancelText: "Cancel", // Android
  fallbackLabel: "Show Passcode", // iOS (if empty, then label is hidden)
  unifiedErrors: false, // use unified error messages (default false)
  passcodeFallback: false, // iOS - allows the device to fall back to using the passcode, if faceid/touch is not available. this does not mean that if touchid/faceid fails the first few times it will revert to passcode, rather that if the former are not enrolled, then it will use the passcode.
};

const rnBiometrics = new ReactNativeBiometrics();

const HomeScreen = ({ navigation, route }: IHomeScreenProps) => {
  // GLOBAL.credentials = {test: "does this work?"};
  // //wait two seconds then print global.credentials
  // setTimeout(() => {
  //   console.log(AWS_ACCESS_KEY, AWS_SECRET_KEY);
  // }, 2000);
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [popupContent, setPopupContent] = useState({
    title: '',
    message: '',
    buttons: []
  });

  const showPopup = (title, message, buttons) => {
    setPopupContent({ title, message, buttons });
    setPopupVisible(true);
  };
  const userDetails = useAppSelector((state) => state.account);
  let documentsDetailsListData = useAppSelector((state) => state.Documents);
  const [documentsDetailsList, setdocumentsDetailsList] = useState(
    documentsDetailsListData
  );
  const getHistoryReducer = useAppSelector((state) => state.getHistoryReducer);
  const profilePicture = useAppSelector((state) => state.savedPic);
  const securityReducer: any = useAppSelector((state) => state.security);
  const [createVerifyCondition, setcreateVerifyCondition] = useState(true);
  const [createVerifyCondition1, setcreateVerifyCondition1] = useState(true);
  const [signature, setSignature] = useState();
  const [loading, setLoading] = useState(false);
  let categoryTypes = "";

  if (route?.params && route?.params?.category) {
    categoryTypes = route?.params?.category;
  }

 

  const [createVerify, setCreateVerify] = useState({});
  const [randomString,setRandomString] =useState('')
  const keys = useAppSelector((state) => state.user);
  const issurDid = keys?.responseData?.issuerDid;
  const UserDid = keys?.responseData?.newUserDid;
  const privateKey = keys?.responseData?.generateKeyPair?.privateKey;
  let url: any = `https://ssi-test.myearth.id/api/user/sign?issuerDID=${issurDid}`;
  let requesturl: any = `https://ssi-test.myearth.id/api/issuer/verifiableCredential?isCryptograph=${false}&downloadCryptograph=${false}`;

  const disPatch = useAppDispatch();

  let flatListRef: any = useRef();
  let idleTimer = useRef(null);
  let lastActiveTime = useRef(Date.now());
  const IDLE_TIMEOUT = 60000 * 10; // 10 minute
  console.log(signature, "sign");
  console.log(createVerify, "createVerify");
  console.log(UserDid, "UserDid");
  console.log(userDetails, "UserDetails");
  console.log(userDetails?.responseData?.publicKey, "publickey");
  //let idleTimer: string | number | NodeJS.Timeout | undefined;
  //recent activity
 
  const [s3documentsDetailsList, sets3documentsDetailsList] = useState<any[]>([]);
  const [s3DocFullPath, sets3DocFullPath] = useState([]);
  const recentData = documentsDetailsList?.responseData;
  const data = documentsDetailsList?.responseData;

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [lastBackgroundTime, setLastBackgroundTime] = useState<Date | null>(null);
  const [aState, setAppState] = useState(AppState.currentState);

  //const isFocused = useIsFocused();

  // useFocusEffect(
  //   useCallback(() => {
  //     // This will run every time the screen is focused
  //     console.log("HomeScreen focused");

  //     // Call your data fetching or any side effect you want to run
  //     async function fetchData() {
  //       await getCredentials();
  //       await getAllDocs();
  //       await getImage();
  //     }

  //     fetchData();
      
  //     return () => {
  //       console.log("HomeScreen unfocused");
  //       // Optionally clean up any resources or listeners here
  //     };
  //   }, [])
  // );

  useEffect(() => {
    setdocumentsDetailsList(documentsDetailsListData);
  }, [documentsDetailsListData?.responseData]);
  
   useEffect(() => {
    const handleAppStateChange = async (nextAppState) => {
      const sdkStatus = await AsyncStorage.getItem("sdkStatus");
      console.log("SDKStatus in HomeScreen is: ", sdkStatus);
      console.log("Next AppState is: ", nextAppState);

      if (aState.match(/inactive|background/) && nextAppState === "active") {
        const currentTime = new Date();
        const timeDiff = lastBackgroundTime ? currentTime.getTime() - lastBackgroundTime.getTime() : 0;

        if (sdkStatus === "true") {
          console.log("SDK is launched");
          await AsyncStorage.setItem("sdkStatus", "false");
        } else if (timeDiff > 50000) {
          await checkAuth();
        }
      } else if (nextAppState.match(/inactive|background/)) {
        setLastBackgroundTime(new Date());
      }

      setAppState(nextAppState);
      setLanguage();
      ShareMenu.getInitialShare(handleShare);
    };

    const appStateListener = AppState.addEventListener("change", handleAppStateChange);

    return () => {
      appStateListener.remove();
    };
  }, [aState, lastBackgroundTime]);

  useEffect(() => {
    async function getCredentials() {
      const response = await fetch("https://" + AWS_API_BASE + "auth/gettoken", {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userID: userDetails.responseData.Id,
        }),
      });
      console.log('this is userID s3 getcred', userDetails.responseData.Id)
      let myJson = await response.json();
      console.log('this is myJson response s3 getcred', myJson)
      GLOBAL.credentials = {
        accessKeyId: myJson.Credentials.AccessKeyId,
        expiration: myJson.Credentials.Expiration,
        secretAccessKey: myJson.Credentials.SecretAccessKey,
        sessionToken: myJson.Credentials.SessionToken,
      },
      GLOBAL.awsID = myJson.SubjectFromWebIdentityToken;
      console.log("These are the aws s3 cred:",GLOBAL.credentials)
    }
    getCredentials();
  }, []);



  useEffect(() => {
    console.log(GLOBALS.credentials);
    async function getAllDocs() {
      const response = await fetch("https://" + AWS_API_BASE + "documents/getall", {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          credentials: GLOBALS.credentials,
          awsID: GLOBALS.awsID,
        }),
      })
      const myJson = await response.json();
      console.log('this is my json1----------', myJson)
      let result = [];
      let content = myJson.Contents;
      for (let i = 0; i < content.length; i++) {
        let myObject = content[i];

        if (myObject.Key.substr(-1) == "/") {
          continue;
        }

        let myKey = myObject.Key.split("/");
        let date = new Date(Date.parse(myObject.LastModified));
        let myDate = date.getDate();
        myDate = myDate < 10 ? "0" + myDate : myDate;
        let myMonth = date.getMonth() + 1;
        myMonth = myMonth < 10 ? "0" + myMonth : myMonth;
        let myHours = date.getHours();
        myHours = myHours < 10 ? "0" + myHours : myHours;
        let myMinutes = date.getMinutes();
        myMinutes = myMinutes < 10 ? "0" + myMinutes : myMinutes;

        result.push({
          title: myKey[myKey.length - 1],
          name: myKey[myKey.length - 1],
          displayName: myKey[myKey.length - 1].split(".")[0],
          fullPath: myObject.Key,
          upload:
            myDate +
            "/" +
            myMonth +
            "/" +
            date.getFullYear() +
            " " +
            myHours +
            ":" +
            myMinutes,
          uploadTime: date,
          category: myKey[myKey.length - 2],
        });
      }
      documentsDetailsListData = result;
      console.log('this is s3 retrieved documents details::::::::::::::::::' ,result);
      sets3documentsDetailsList(result);
     // setData(result);
      // console.log(getFilteredData());
    }
    getAllDocs();
  }, []);

  const getFullPath = async (displayName: string) =>{
    console.log('this is my s3 doc list',s3documentsDetailsList)
    for (let i = 0; i < s3documentsDetailsList.length; i++) {
      if (s3documentsDetailsList[i].displayName === displayName) {
        console.log('This is the s3 path:', s3documentsDetailsList[i].fullPath)
        const s3docPath = s3documentsDetailsList[i].fullPath
        console.log('path', s3docPath)
        sets3DocFullPath(s3docPath)
        return s3docPath
      }
    }
    return null;
  }


  const getItemsForSection =(data: any[])=>{
    const idDocuments = data?.filter((item: { categoryType: string; })=>item?.categoryType === "ID" ||item?.categoryType === "id")
    const idHealthCare = data?.filter((item: { categoryType: string; })=>item?.categoryType === "HEALTHCARE" ||item?.categoryType === "Healthcare")
    const idTravels = data?.filter((item: { categoryType: string; })=>item?.categoryType === "TRAVEL" ||item?.categoryType === "Travel")
    const idInsurance = data?.filter((item: { categoryType: string; })=>item?.categoryType === "INSURANCE" ||item?.categoryType === "Insurance")
    const idEducation = data?.filter((item: { categoryType: string; })=>item?.categoryType === "EDUCATION" ||item?.categoryType === "Education")
    const idEmployement = data?.filter((item: { categoryType: string; })=>item?.categoryType === "EMPLOYMENT" ||item?.categoryType === "Employment")
    const idFinanace = data?.filter((item: { categoryType: string; })=>item?.categoryType === "FINANCE" ||item?.categoryType === "Finance")
    const localArray=[{
      title:idDocuments?.length>0 ? "ID":'',
      data:idDocuments
    },
    {
      title:idHealthCare?.length>0 ? "HEALTHCARE":'',
      data:idHealthCare
    },
    {
      title:idTravels?.length>0 ? "TRAVEL":'',
      data:idTravels
    },
    {
      title:idInsurance?.length>0 ? "INSURANCE":'',
      data:idInsurance
    },
    {
      title:idEducation?.length>0 ? "EDUCATION":'',
      data:idEducation
    },
    {
      title:idEmployement?.length>0 ? "EMPLOYMENT":'',
      data:idEmployement
    },
    {
      title:idFinanace?.length>0 ? "FINANCE":'',
      data:idFinanace
    },
   
  ]
  
  const filteredLocalArray = localArray?.filter(item => item?.data?.length > 0);
  console.log('filteredLocalArray==>',filteredLocalArray)
    return filteredLocalArray ;
  }
  const aunthenticateBioMetricInfo = () => {
    TouchID.isSupported(optionalConfigObject)
      .then(async (biometryType) => {
        // Success code
        if (biometryType === "FaceID") {
        } else {
          TouchID.authenticate("", optionalConfigObject)
            .then(async (success: any) => {
              console.log("success", success);
              const getItem = await AsyncStorage.getItem("passcode");
              if (getItem) {
                navigation.dispatch(StackActions.replace("PasswordCheck"));
              } else {
                navigation.dispatch(StackActions.replace("DrawerNavigator"));
              }
            })
            .catch((e: any) => {
              aunthenticateBioMetricInfo();
            });
          console.log("TouchID is supported.");
        }
      })
      .catch((error) => {
        // Failure code
        console.log(error);
      });
  };
  const checkAuth = async () => {
    const fingerPrint = await AsyncStorage.getItem("fingerprint");
    const passcode = await AsyncStorage.getItem("passcode");
    const FaceID = await AsyncStorage.getItem("FaceID");
    const Biometrics = await AsyncStorage.getItem("biometrics")
    console.log("FaceID===>", FaceID);
    if (fingerPrint && passcode) {
     // aunthenticateBioMetricInfo();
     handleBiometrics()
      navigation.dispatch(StackActions.replace("PasswordCheck"));
    } else if (FaceID && passcode) {
      navigation.dispatch(StackActions.replace("FaceCheck"));
    } else if (Biometrics) {
      handleBiometrics()
      navigation.dispatch(StackActions.replace("PasswordCheck"));
    } else if (passcode) {
      navigation.dispatch(StackActions.replace("PasswordCheck"));
    } else {
      navigation.dispatch(StackActions.replace("AuthStack"));
    }
  };
  // Function to handle idle timeout

  const handleBiometrics = async () => {
    rnBiometrics.simplePrompt({ promptMessage: 'Authenticate with Biometrics' })
      .then((resultObject) => {
        const { success } = resultObject;
        if (success) {
          console.log('Authentication successful');
        } else {
          showPopup(
            'Authentication Failed',
            'Authentication failed.',
            [{ text: "OK", onPress: () => setPopupVisible(false) }] // Provide default button
          );
        }
      })
      .catch((error) => {
        showPopup(
          'Authentication Error',
          error.message,
          [{ text: "OK", onPress: () => setPopupVisible(false) }] // Provide default button
        );
      });
  };
  

  //Handletimer
  // const handleIdle = () => {
  //   const currentTime = Date.now();
  //   const idleDuration = currentTime - lastActiveTime.current;
  //   if (idleDuration >= IDLE_TIMEOUT) {
  //     checkAuth();
  //   }
  // };

  // const resetIdleTimer = useCallback(() => {
  //   lastActiveTime.current = Date.now();
  //   if (idleTimer.current) {
  //     clearTimeout(idleTimer.current);
  //   }
  //   idleTimer.current = setTimeout(() => {
  //     handleIdle();
  //   }, IDLE_TIMEOUT);
  // }, [handleIdle]);

  // useEffect(() => {
  //   resetIdleTimer();
  // }, [resetIdleTimer]);

  // useEffect(() => {
  //   const handleAppStateChange = async (nextAppState) => {
  //     console.log("Next AppState is: ", nextAppState);
  //     if (nextAppState === "active") {
  //       resetIdleTimer();
  //     }
  //   };

  //   const appStateListener = AppState.addEventListener("change", handleAppStateChange);

  //   return () => {
  //     appStateListener.remove();
  //     if (idleTimer.current) {
  //       clearTimeout(idleTimer.current);
  //     }
  //   };
  // }, [resetIdleTimer]);

  // useEffect(() => {
  //   resetIdleTimer();
  // }, [resetIdleTimer]);


  //Handle timer ends

  const setLanguage = async () => {
    const language = await AsyncStorage.getItem("setLanguage");
    if (language) {
      il8n.changeLanguage(language);
    }
  };

  const [recentDataOfDocument, setrecentData] = useState([]);
  const dispatch = useAppDispatch();
  const _toggleDrawer = () => {
    navigation.openDrawer();
  };

  async function convertToBase64(path: string) {
    const result = await RNFS.readFile(path, "base64");
    return `data:image/png;base64,${result}`;
  }

  const handleShare = useCallback(async (item: SharedItem | null) => {

 const  getData  = await AsyncStorage.getItem('shareButton')
 if(getData ===item?.extraData &&  item?.extraData?.shareButton && item?.extraData?.shareButton){
  return
 }
 else{
  await AsyncStorage.setItem('shareButton',item?.extraData?.shareButton??"")
 }
   

    
    if (!item) {
      return;
    }
    
    if (Platform.OS === "android") {
      const { mimeType, data, extraData } = item;
      console.log("datamimeType::homepage", data);
      console.log("datamimeType", mimeType);
      const imageName1 = extraData?.data?.split("/").pop();
      const imageName =imageName1?.replaceAll("%20", " ")

      // const fileStat = await RNFS.stat(data);
      // console.log("imageName",fileStat)
      // const uriimage = fileStat.originalFilepath
      // const uriimage1 :any = uriimage.split("/").pop()
      // const uriimage2 = uriimage1.split(".")[0]
      // console.log("imageName",uriimage2)

      if (
        mimeType === "image/*" ||
        mimeType === "image/jpeg" ||
        mimeType === "image/png"
      ) {
        const imagePath = data;
        console.log("imagePath====>", imagePath);
        const base64 = await RNFS.readFile(imagePath, "base64");
        console.log("data====>", base64);
        const fileUri = {
          base64: base64,
          type: mimeType,
          uri: imagePath,
          flow: "deeplink",
          docName: imageName,
          file: {
            uri: imagePath,
          },
        };
        navigation.navigate("DocumentPreviewScreen", { fileUri: fileUri });
      } else {
        const imagePath = data;
        console.log("imagePath====>", imagePath);
        const base64 = await RNFS.readFile(imagePath, "base64");
       // console.log("data====>", base64);
        const fileUri = {
          base64: base64,
          type: mimeType,
          uri: base64,
          flow: "deeplink",
          docName: imageName,
          file: {
            uri: base64,
          },
        };
        navigation.navigate("DocumentPreviewScreen", { fileUri: fileUri });
      }
    } else {
      const { mimeType, data, extraData } = item;
      console.log("datamimeType", extraData);
      console.log("extraData?.mimeType", extraData?.mimeType);
      setRandomString(extraData?.shareButton??"")
    
      const imageName1 = extraData?.data?.split("/").pop();
      const imageName =imageName1?.replaceAll("%20", " ")
  

      if (
        extraData?.mimeType === "image/*" ||
        extraData?.mimeType === "image/jpeg" ||
        extraData?.mimeType === "image/png" ||
        extraData?.mimeType === "text/plain"
      ) {
        const imagePath = extraData?.data?.replaceAll("%20", " ");
    
        const base64 = await RNFS.readFile(imagePath, "base64");
        console.log("imagePath123", base64);
        const fileUri = {
          base64: base64,
          type: extraData?.mimeType,
          uri: imagePath,
          flow: "deeplink",
          docName: imageName,
          imagePath: imagePath,
          file: {
            uri: base64,
          },
        };
        navigation.navigate("DocumentPreviewScreen", { fileUri: fileUri });
      } else {
        const imagePath = extraData?.data?.replaceAll("%20", " ");
        const base64 = await RNFS.readFile(imagePath, "base64");
       // console.log("data====>", base64);
        const fileUri = {
          base64: base64,
          type: extraData?.mimeType,
          uri: base64,
          docName: imageName,
          flow: "deeplink",
          file: {
            uri: base64,
          },
        };
        navigation.navigate("DocumentPreviewScreen", { fileUri: fileUri });
      }
    }
  }, []);
  const uploadPdf = (base64: string) => {};
  const validateImages = (base64: string) => {
    // AddDocumehtfetch(CreateHistory, payLoad, "POST");
    setTimeout(() => {
      var date = dateTime();
      const filePath = RNFetchBlob.fs.dirs.DocumentDir + "/" + "Adhaar";
      var documentDetails: IDocumentProps = {
        id: `ID_VERIFICATION`,
        name: "Id",
        path: filePath,
        date: date?.date,
        time: date?.time,
        txId: "",
        docType: "jpg",
        docExt: ".jpg",
        processedDoc: "",
        base64: base64,
        categoryType: "insurance",
        vc: undefined,
        isVc: false,
        color: "rgba(191, 245, 206, 1)",
      };
      console.log(
        "documentsDetailsList?.responseData",
        documentsDetailsList?.responseData
      );
      var DocumentList = documentsDetailsList?.responseData
        ? documentsDetailsList?.responseData
        : [];
      DocumentList.push(documentDetails);
      dispatch(saveDocuments(DocumentList));
      getHistoryReducer.isSuccess = false;
      setTimeout(() => {}, 2000);
    }, 200);
  };
  useEffect(() => {
    console.log("recentData====>", recentData);
    if (documentsDetailsList) {
      let recentDataFillerWithColor: any =
        recentData &&
        recentData?.map((item: any, index: any) => {
          let colors = item?.documentName;
          let iteName = colors?.trim()?.split("(")[0].trim();
          console.log("recentDataFillerWithColor====>", iteName);
          item.color = getColor(iteName);
          return item;
        });
      if (recentDataFillerWithColor?.length > 0) {
        setrecentData(recentDataFillerWithColor);
      } else {
        setrecentData([]);
      }
    }
  }, [documentsDetailsList]);

  const categoryList = values(SCREENS.HOMESCREEN.categoryList).map(
    ({ TITLE: title, URI: uri, COLOR: color }: any) => ({
      title,
      uri,
      color,
    })
  );
  const documentList = values(SCREENS.HOMESCREEN.DocumentList).map(
    ({ TITLE: title, URI: uri, COLOR: color }: any) => ({
      title,
      uri,
      color,
    })
  );

  const isNetworkConnect = () => {
    NetInfo.fetch().then((state) => {
      console.log("isconnect", state.isConnected);
      if (!state.isConnected) {
        showPopup(
          "Network not connected",
          "Please check your internet connection and try again.",
          [{ text: "OK" }]
        );
      }
    });
  };

  useEffect(() => {
    isNetworkConnect();
  }, []);

  const _renderItem = ({ item }: any) => {
    return (
      <Avatar
        avatarClick={() =>
          navigation.navigate("Documents", { category: item.title })
        }
        isCategory={true}
        isUploaded={false}
        text={item.title}
        iconSource={item.uri}
        style={{
          container: [styles.avatarContainer, { backgroundColor: item.color }],
          imgContainer: styles.avatarImageContainer,
          text: styles.avatarTextContainer,
        }}
      />
    );
  };

  const _renderItemDocuments = ({ item }: any) => {
    return (
      <View style={styles.documentContainer}>
        <Card
          title={item.title}
          leftIconSrc={item.uri}
          style={styles.cardContainer}
        />
      </View>
    );
  };

  const _avatarClick = () => {
    navigation.navigate("ProfileScreen");
  };
  if (getHistoryReducer?.isSuccess) {
    getHistoryReducer.isSuccess = false;
  }
  useEffect(() => {
    const listener: any = EventRegister.addEventListener("OpenDrawer", () => {
      navigation.openDrawer();
      return;
    });
    return () => {
      EventRegister.removeEventListener(listener);
      listener;
    };
  });

  useEffect(() => {
    const listener: any = EventRegister.addEventListener("t", () => {
      handleIdle();
      return;
    });
    return () => {
      EventRegister.removeEventListener(listener);
      listener;
    };
  });
  useEffect(() => {
    setMetrics();
  }, []);

  const setMetrics = async () => {
    await AsyncStorage.setItem("pageName", "Home");
  };
  // useEffect(() => {
  //   const PayLoad = {
  //     userId: userDetails?.responseData?.Id,
  //     publicKey: userDetails?.responseData?.publicKey,
  //   };
  //   dispatch(getHistory(PayLoad));
  //   setValueSecurity();
  //   console.log("items==>", userDetails);
  // }, []);

  useEffect(() => {
    getImage();
  }, []);

  const getImage = async () => {
    const profilePic = await AsyncStorage.getItem("profilePic");
    disPatch(savingProfilePictures(profilePic));
  };
  function convertTimeToAmPmFormat(timeString: {
    split: (arg0: string) => [any, any];
  }) {
    const [hours, minutes] = timeString.split(":");
    let formattedTime = "";

    // Convert the 24-hour format to 12-hour format
    let hoursIn12HourFormat = parseInt(hours, 10) % 12;
    if (hoursIn12HourFormat === 0) {
      hoursIn12HourFormat = 12; // Set 12 for 0 (midnight) in 12-hour format
    }

    // Determine AM or PM
    const amOrPm = parseInt(hours, 10) < 12 ? "am" : "pm";

    // Add leading zero for single-digit minutes
    const paddedMinutes = minutes.padStart(2, "0");

    // Construct the formatted time string
    formattedTime = `${hoursIn12HourFormat}:${paddedMinutes} ${amOrPm}`;

    return formattedTime;
  }
  const getTime = (item: { time: any }) => {
    return convertTimeToAmPmFormat(item?.time);
  };

  function compareTime(a, b) {
    const timeA = new Date(`1970-01-01T${a.time}`);
    const timeB = new Date(`1970-01-01T${b.time}`);
    return timeA - timeB;
  }
  const getCategoryImages = (item: { categoryType: any; name: any }) => {
    const getItems = SCREENS.HOMESCREEN.categoryList.filter(
      (itemFiltered, index) => {
        return (
          itemFiltered?.TITLE?.toLowerCase() ===
          item?.categoryType?.toLowerCase()
        );
      }
    );

    if (!getItems[0]) {
      return "#D7EFFB";
    }
    return getItems[0];
  };

  const getFilteredData = () => {
    console.log("getFilteredData");
    let data = documentsDetailsList?.responseData;
  
    // Sort the array based on the combined date and time in descending order
    if (data) {
      data = [...data].sort((a, b) => {
        const dateTimeA = new Date(`${a.date.split('/').reverse().join('-')}T${a.time}`);
        const dateTimeB = new Date(`${b.date.split('/').reverse().join('-')}T${b.time}`);
        return dateTimeB - dateTimeA; // Descending order
      });
    }
  
    // // Log just the docName for each item
    // data.forEach((item) => {
    //   console.log(item.docName);
    // });
  
    if (categoryTypes !== "") {
      var alter = function (item) {
        let splittedValue = item?.categoryType
          ?.trim()
          .split("(")[0]
          ?.toLowerCase();
  
        return splittedValue?.trim() === categoryTypes?.trim()?.toLowerCase(); 
      };
      var filter = data?.filter(alter);
      return getItemsForSection(filter);
    }
  
    // if (searchedData.length > 0) {
    //   data = searchedData;
    //   return getItemsForSection(data);
    // }
  
    // if (searchedData.length === 0 && searchText != "") {
    //   return []; 
    // }
  
    return getItemsForSection(data);
  };


  const handleDocPress = async (item:any) => {
    console.log('Item docname is:', item.docName)
          const s3DocFullPath =  await getFullPath(item.docName)
           console.log('This is the s3 path for view cred page:', s3DocFullPath)
           navigation.navigate("ViewCredential", { documentDetails: item, s3DocFullPath })
                //navigation.navigate("ViewCredential", { documentDetails: item })
  }

  const _renderItemNew = ({ item, index }: any) => {
    //console.log('This is item:', item)
   
    return (
      <TouchableOpacity
     
        style={{
          marginBottom: 20,
        }}
        onPress={()=>
          handleDocPress(item)
        }
      >
      

        <View style={{ marginTop: -20 }}>
          <Card
            titleIcon={item?.isVc ? LocalImages.vcImage : null}
            leftAvatar={LocalImages.documentsImage}
            absoluteCircleInnerImage={LocalImages.upImage}
            title={
              item?.isVc
                ? item.name
                : item?.docName?.split("(")[1]?.split(")")[0] == "undefined"
                ? item?.docName?.replaceAll("%20", "")
                : item?.docName?.replaceAll("%20", "")
            }
            subtitle={
              item.isVc
                ? `      Received  : ${item.date}`
                : `      Uploaded  : ${item.date}`
            }
            timeTitle={"   " + `${getTime(item)}`}
            onCheckBoxValueChange={(value: any) => {
              // item.isSelected = value;
              //setdocumentsDetailsList({ ...documentsDetailsList });
            }}
            checkBoxValue={item.isSelected}
            style={{
              ...styles.cardContainers,
              ...{
                avatarContainer: {
                  backgroundColor: getCategoryImages(item)?.COLOR,
                  width: 60,
                  height: 60,
                  borderRadius: 20,
                  marginTop: 25,
                  marginLeft: 10,
                  marginRight: 5,
                },
                uploadImageStyle: {
                  backgroundColor: getCategoryImages(item)?.COLOR,
                  borderRadius: 25,
                  borderWidth: 3,
                  bordercolor: "#fff",
                  borderWidthRadius: 25,
                },
              },
              title: {
                fontSize: 18,
                marginTop: -10,
                fontWeight: "bold",
              },
              subtitle: {
                fontSize: 14,
                marginTop: 5,
                marginLeft: -23
              },
            }}
          />
        </View>
      </TouchableOpacity>
    );
  };




  return (
    <View style={styles.sectionContainer}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          flexGrow: 1,
          paddingBottom: 200,
          backgroundColor: "#fff",
        }}
      >
        <View>
          <Header
            picUri={profilePicture?.profileData}
            subCatSideArrowVisible
            leftIconSource={LocalImages.logoImage}
            // rewardPoints={"50"}
            // rightIconSource={LocalImages.giftBoxImage}
            isAvatar
            avatarClick={_avatarClick}
            onpress={() => {
              _toggleDrawer();
            }}
            linearStyle={styles.linearStyle}
          ></Header>
          <View style={styles.flatPanel}>
            <View style={styles.alignCenter}>
              <GenericText style={[styles.label, { fontSize: 12 }]}>
                {SCREENS.HOMESCREEN.appName}
              </GenericText>
              <GenericText style={[styles.label, { fontSize: 16 }]}>
                {userDetails?.responseData?.earthId}
              </GenericText>
            </View>
            {/* <CircularProgress
              value={60}
              radius={30}
              activeStrokeWidth={5}
              activeStrokeColor={Screens.colors.primary}
            /> */}
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <View>
              <GenericText
                style={[styles.categoryHeaderText, { fontSize: 13 }]}
              >
                {SCREENS.HOMESCREENTITLES.CATEGORIES}
              </GenericText>
            </View>

            <View style={{ flexDirection: "row" }}>
              <TouchableOpacity
                style={{
                  width: 20,
                  height: 20,
                  alignSelf: "center",
                  marginRight: 40,
                }}
                onPress={() => flatListRef.scrollToIndex({ index: 0 })}
              >
                <Image
                  source={LocalImages.backicon}
                  style={{
                    width: 20,
                    height: 20,
                    tintColor: "gray",
                    alignSelf: "center",
                  }}
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  width: 20,
                  height: 20,
                  alignSelf: "center",
                }}
                onPress={() => flatListRef.scrollToEnd()}
              >
                <Image
                  source={LocalImages.nexticon}
                  style={{
                    width: 20,
                    height: 20,
                    tintColor: "gray",
                    alignSelf: "center",
                    marginRight: 50,
                  }}
                />
              </TouchableOpacity>
            </View>
          </View>
          <View style={[styles.flatPanel, { height: 130, marginTop: -10 }]}>
            <FlatList<any>
              horizontal
              ref={(ref) => {
                flatListRef = ref;
              }}
              showsHorizontalScrollIndicator={false}
              data={categoryList}
              renderItem={_renderItem}
            />
          </View>
          <GenericText style={[styles.categoryHeaderText, { fontSize: 13 }]}>
            {SCREENS.HOMESCREEN.documentLabel}
          </GenericText>
          {/* <FlatList<any>
            showsHorizontalScrollIndicator={false}
            // data={
            //   getHistoryReducer && getHistoryReducer?.responseData
            //     ? getHistoryReducer.responseData
            //     : []
            // }
            data={getData(recentData)}
            
            renderItem={_renderItemHistory}
          /> */}
  <SectionList<any>
              sections={getFilteredData()}
              renderItem={_renderItemNew}
           
            
              
            />
       

          {/* <AnimatedLoader
            isLoaderVisible={getHistoryReducer?.isLoading}
            loadingText="loading"
          /> */}
          {recentDataOfDocument && recentDataOfDocument?.length === 0 && (
            <View style={{ justifyContent: "center", alignItems: "center" }}>
              <Image
                resizeMode="contain"
                style={[styles.logoContainer]}
                source={LocalImages.recent}
              ></Image>
            </View>
          )}
        </View>

        <Spinner
          visible={loading}
          textContent={"Loading..."}
          textStyle={styles.spinnerTextStyle}
        />
      </ScrollView>
      <CustomPopup
      isVisible={isPopupVisible}
      title={popupContent.title}
      message={popupContent.message}
      buttons={popupContent.buttons}
      onClose={() => setPopupVisible(false)}
    />
    </View>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    flex: 1,
    backgroundColor: Screens.colors.background,
  },
  spinnerTextStyle: {
    color: "#fff",
  },
  cardContainernew: {
    flex: 1,
    marginHorizontal: 20,
    marginVertical: 10,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    alignItems: "center",
    borderRadius: 20,
    backgroundColor: Screens.pureWhite,
    title: {
      color: Screens.black,
    },
    textContainer: {
      justifyContent: "center",
      alignItems: "center",
    },

    avatarImageContainer: {
      width: 25,
      height: 30,
      marginTop: 5,
    },
    avatarTextContainer: {
      fontSize: 13,
      fontWeight: "500",
    },
  },
  linearStyle: {
    height: 330,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    elevation: 4,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    shadowColor: "#000",
  },
  logoContainer: {
    width: 200,
    height: 150,
    resizeMode: "contain",
  },
  flatPanel: {
    marginHorizontal: 25,
    height: 80,
    borderRadius: 15,
    backgroundColor: Screens.colors.background,
    elevation: 15,
    marginTop: -40,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    shadowColor: "#000",
  },
  alignCenter: { justifyContent: "center", alignItems: "center" },
  label: {
    fontWeight: "bold",
    color: Screens.black,
  },
  categoryHeaderText: {
    marginHorizontal: 30,
    marginVertical: 20,
    color: Screens.headingtextColor,
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 20,
    marginHorizontal: 8,
  },
  avatarImageContainer: {
    width: 25,
    height: 30,
    marginTop: 5,
  },
  avatarTextContainer: {
    fontSize: 13,
    fontWeight: "500",
  },
  cardContainer: {
    flex: 1,
    paddingVertical: 9,
    title: {
      color: Screens.grayShadeColor,
    },
  },
  documentContainer: {
    borderColor: Screens.colors.primary,
    borderWidth: 0.5,
    marginHorizontal: 20,
    marginVertical: 5,
    borderRadius: 20,
  },
  cardContainers: {
    flex: 1,
    marginHorizontal: 20,
    marginVertical: 10,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    alignItems: "center",
    borderRadius: 20,
    backgroundColor: Screens.pureWhite,
    // backgroundColor:'red',
    title: {
      color: Screens.black,
    },
    textContainer: {
      justifyContent: "center",
      alignItems: "center",
    },

    avatarImageContainer: {
      width: 25,
      height: 30,
      marginTop: 5,
    },
    avatarTextContainer: {
      fontSize: 13,
      fontWeight: "500",
    },
  },
});

export default HomeScreen;
