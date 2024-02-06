import { values } from "lodash";
import React, { useEffect, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Platform,
  PermissionsAndroid,
  Alert,
  AsyncStorage,
} from "react-native";
import DocumentPicker from "react-native-document-picker";
import { ScrollView } from "react-native-gesture-handler";
import Avatar from "../../components/Avatar";
import BottomSheet from "../../components/Bottomsheet";
import Header from "../../components/Header";
import Info from "../../components/Info";
import GenericText from "../../components/Text";

import { LocalImages } from "../../constants/imageUrlConstants";
import { SCREENS } from "../../constants/Labels";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { useDrawerStatus } from "@react-navigation/drawer";
import { Screens } from "../../themes";
import { RNCamera } from "react-native-camera";
import DocumentMask from "../uploadDocuments/DocumentMask";
import { useTheme } from "@react-navigation/native";
import { savingProfilePictures } from "../../redux/actions/LocalSavingActions";
// import { launchImageLibrary } from "react-native-image-picker";
import * as ImagePicker from "react-native-image-picker";
import { alertBox } from "../../utils/earthid_account";
import { postApi } from "../../utils/createUserSignaturekey";

interface IHomeScreenProps {
  navigation?: any;
}

const ProfileScreen = ({ navigation }: IHomeScreenProps) => {
  const userDetails = useAppSelector((state) => state.account);
  const profilePicture = useAppSelector((state) => state.savedPic);
  const [isCamerVisible, setIsCameraVisible] = useState(false);
  const [Response, setResponse] = useState<any>('');
  const [pic, setPic] = useState<any>('');
console.log('userDetails',userDetails)
  const camRef: any = useRef();
  const { colors } = useTheme();
  const disPatch = useAppDispatch();
  const [cameraDataUri, setcameraDataUri] = useState();
  const [local_img, setLocal_img] = useState("");
  const isDrawerOpen = useDrawerStatus() === "open";
  if (isDrawerOpen) {
    navigation.closeDrawer();
  }
  const [isCameraOptionVisible, setisCameraOptionVisible] =
    useState<boolean>(false);
  const _navigateAction = () => {
    navigation.navigate("EditProfileScreen");
  };
  const _letfIconPress = () => {
    navigation.goBack();
  };

  const _navigateEditMobile = () => {
    navigation.navigate("EditMobileNumber");
   
  };

  const _navigateEditEmail = () => {
    navigation.navigate("EditEmailAddress");
  };


  const _renderItem = ({ item }: any) => {
    return (
      <View style={{ paddingHorizontal: 10}}>
        <Image
          resizeMode="contain"
          style={styles.logoContainers}
          source={item.uri}
        ></Image>
      </View>
    );
  };

  const ColoumnOption = ({ icon, title, avatarClick }: any) => (
    <View>
      <Avatar
        avatarClick={avatarClick}
        isUploaded={false}
        iconSource={icon}
        style={{
          container: [styles.avatarContainer],
          imgContainer: styles.avatarImageContainer,
        }}
      />
      <GenericText
        style={[styles.label, { fontSize: 12, textAlign: "center" }]}
      >
        {title}
      </GenericText>
    </View>
  );

  const _keyExtractor = ({ title }: any) => title.toString();

  const _avatarClick = () => {
    setisCameraOptionVisible(true);
  };



  async function auditFlowApi(){

    const min = 1;
    const max = 666666;
    const minid = 1;
    const maxid = 6666667777;
    const randomNumtopic = Math.floor(Math.random() * (max - min + 1)) + min;
    const randomNumtransID = Math.floor(Math.random() * (maxid - minid + 1)) + minid;
    const currentTimestamp = new Date().toISOString();
    const urlRequest:any = "https://w3storage.myearth.id/api/subs/publish"

    const postData = {
      topic: '0.0.'+randomNumtopic,
      message: JSON.stringify({
        transactionID: randomNumtransID,
        flowName: 'ProfileChangeFlow',
        topicId: '0.0.'+randomNumtopic,
        timestamp:currentTimestamp
      })
    };

    const headersToSend = {
      'Content-Type': 'application/json',
    };

   await postApi(urlRequest,postData,headersToSend)
    .then((res:any)=>{
      console.log("resData",res)
    })
    .catch((e:any)=>{
      console.log("error",e);
    })
  }



  const openCamera = async () => {
    const options = { quality: 0.1, base64: true };
    const data = await camRef.current.takePictureAsync(options);
    console.log("data", data);
    if (data) {
      auditFlowApi()
      AsyncStorage.setItem("profilePic",data?.uri)
      disPatch(savingProfilePictures(data?.uri));
      setIsCameraVisible(false);
      setcameraDataUri(data?.uri);
    }
  };
  const requestPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        {
          title: "EarthId Storage Acess",
          message: "EarthId needs access to your storage ",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK",
        }
      );
    } catch (err) {
      console.log(err);
    }
  };
const setResponseData =(data: any)=>{
  setResponse(data)
  auditFlowApi()
  setisCameraOptionVisible(false)
}
  const openFilePicker = async () => {
    if (Platform.OS == "android") {
      await requestPermission();
    }
    try {
      ImagePicker.launchImageLibrary(
        ImagePicker.ImageLibraryOptions,
        setResponseData
      )

      // const resp: any = await DocumentPicker.pick({
      //   type: [DocumentPicker.types.allFiles],
      // });

      //  let fileUri = resp[0].uri;
      //   disPatch(savingProfilePictures(fileUri));
      //   setIsCameraVisible(false);
      //    setcameraDataUri(fileUri);
    } catch (err) {
      console.log("data==>", err);
    }
  };

  useEffect(()=>{
    getImage()
  },[])


  const getImage= async ()=>{
    const profilePic = await AsyncStorage.getItem("profilePic")
    console.log('profilePic',profilePic)
    setcameraDataUri(profilePic);
    disPatch(savingProfilePictures(profilePic));
  }


  useEffect(() => {
 
    if(Response && Response?.assets){
      console.log('Response==>sddwsdxsw',Response)
      saveImage()
    }
  }, [Response]);

    const saveImage = async() =>{
      if(Response?.assets?.length>0){
        console.log('ImageResult==>',Response?.assets[0]?.uri)
        let fileUri = Response?.assets[0]?.uri;
              disPatch(savingProfilePictures(fileUri));
        setIsCameraVisible(false);
        setcameraDataUri(fileUri);
        await AsyncStorage.setItem("profilePic",fileUri)
  
    
      }
    }


  const mobileVerifyAction = () => {
    navigation.navigate("OTPScreen", { type: "phone" });
  };

  const emailVerifyAction = () => {
    navigation.navigate("OTPScreen", { type: "email" });
  };

  const navigateToCustomizedControl = () => {
    navigation.navigate("CustomizeQr");
  };
  useEffect(() => {
    navigation.closeDrawer();
  }, []);
  return (
    <View style={styles.sectionContainer}>
      {isCamerVisible ? (
        <View style={{ flex: 1 }}>
          <View
            style={{ position: "absolute", top: 20, right: 20, zIndex: 100 }}
          >
            <TouchableOpacity onPress={() => setIsCameraVisible(false)}>
              <Image
                resizeMode="contain"
                style={[[styles.logoContainer, { tintColor: "#fff" }]]}
                source={LocalImages.closeImage}
              ></Image>
            </TouchableOpacity>
          </View>
          <RNCamera
            ref={camRef}
            style={styles.preview}
            androidCameraPermissionOptions={null}
            type={RNCamera.Constants.Type.front}
            captureAudio={false}
          >
            <DocumentMask />
          </RNCamera>
          <View style={{ backgroundColor: "#000" }}>
            <View
              style={{
                width: 60,
                height: 60,
                borderRadius: 30,
                backgroundColor: colors.primary,
                alignSelf: "center",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TouchableOpacity onPress={() => openCamera()}>
                <View
                  style={{
                    width: 50,
                    height: 50,
                    borderColor: "#fff",
                    borderWidth: 1,
                    borderRadius: 25,
                    backgroundColor: "transparent",
                  }}
                ></View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.sectionContainer}>
          <Header
          hideUser={true}
            picUri={local_img == "" ? profilePicture?.profileData : local_img}
            actionIcon={LocalImages.editImage}
            avatarClick={_avatarClick}
            absoluteCircleInnerImage={LocalImages.cam}
            isProfileAvatar={true}
            isUploaded={true}
            isBack
            letfIconPress={_letfIconPress}
            // rewardPoints={"50"}
            // // leftIconSource={LocalImages.backImage}
            // rightIconSource={LocalImages.giftBoxImage}
            isAvatar
            onpress={_navigateAction}
            linearStyle={styles.linearStyle}
            containerStyle={{
              iconStyle: {
                width: 15,
                height: 15,
              },
              iconContainer: styles.alignCenter,
            }}
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
          <View style={styles.category}>
            <Info
              title={"firstname"}
              subtitle={userDetails?.responseData?.firstname}
              style={{
                title: styles.title,
                subtitle: styles.subtitle,
                container: styles.textContainer,
              }}
            />
              <Info
              title={"lastname"}
              subtitle={userDetails?.responseData?.lastname}
              style={{
                title: styles.title,
                subtitle: styles.subtitle,
                container: styles.textContainer,
              }}
            />


            <Info
           //   tailIcondisabled={userDetails?.responseData?.mobileApproved ? 0.2 : 0.9}
              tailIconPress={ _navigateEditMobile}
              tailIcon={LocalImages.editIcon}
              subTitlePress={
                userDetails?.responseData?.mobileApproved
                  ? null
                  : mobileVerifyAction
              }
              title={"mobileno"}
              subtitle={
                userDetails?.responseData?.countryCode +
                " " +
                userDetails?.responseData?.phone
              }
              subtitleRowText={
                userDetails?.responseData?.mobileApproved
                  ? "verified"
                  : "verify"
              }
              style={{
                title: styles.title,
                subtitle: styles.subtitle,
                container: styles.textContainer,
                subtitleNearText: [
                  styles.subtitleNearText,
                  {
                    color: userDetails?.responseData?.mobileApproved
                      ? Screens.success
                      : "red",
                  },
                ],
              }}
            />
            <Info
              // tailIcondisabled={userDetails?.responseData?.emailApproved ? 0.2 : 0.9}
              tailIconPress={ ()=> _navigateEditEmail() }
              tailIcon={LocalImages.editIcon}
              subTitlePress={
                userDetails?.responseData?.emailApproved
                  ? null
                  : emailVerifyAction
              }
              title={"email"}
              subtitle={userDetails?.responseData?.email}
              subtitleRowText={
                userDetails?.responseData?.emailApproved ? "verified" : "verify"
              }
              style={{
                title: styles.title,
                subtitle: styles.subtitle,
                container: styles.textContainer,
                subtitleNearText: [
                  styles.subtitleNearText,
                  {
                    color: userDetails?.responseData?.emailApproved
                      ? Screens.success
                      : "red",
                  },
                ],
              }}
            />
          </View>
          {/* <View style={styles.socialMediaContainer}>
            <FlatList<any>
              horizontal
              scrollEnabled={false}
              data={socialMedialList}
              renderItem={_renderItem}
              keyExtractor={_keyExtractor}
            />
          </View> */}
          <BottomSheet
            onClose={() => setisCameraOptionVisible(false)}
            height={150}
            isVisible={isCameraOptionVisible}
          >
            <View
              style={{
                height: 100,
                width: "100%",
                paddingHorizontal: 50,
                flexDirection: "row",
                justifyContent: "space-around",
              }}
            >
              <ColoumnOption
                avatarClick={async() => {
                  setisCameraOptionVisible(false);
                  disPatch(savingProfilePictures(undefined));
                 await AsyncStorage.removeItem("profilePic")
                }}
                title={"removephone"}
                icon={LocalImages.deleteImage}
              />

              <ColoumnOption
                avatarClick={() => {
                  setisCameraOptionVisible(false);
                  setIsCameraVisible(true);
                }}
                title={"camera"}
                icon={LocalImages.cameraImage}
              />

              <ColoumnOption
                avatarClick={() => {
                
                  openFilePicker();
                 // setisCameraOptionVisible(false)
                }}
                title={"gallery"}
                icon={LocalImages.galleryImage}
              />
            </View>
          </BottomSheet>
          <TouchableOpacity onPress={() => navigateToCustomizedControl()}>
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                marginVertical: 20,
                flexDirection: "row",
              }}
            >
              <Image
                resizeMode="contain"
                style={[styles.logoContainer]}
                source={LocalImages.qrcodeImage}
              ></Image>
              <GenericText
                style={[
                  styles.label,
                  {
                    fontSize: 14,
                    paddingHorizontal: 10,
                    color: Screens.colors.primary,
                    textDecorationLine: "underline",
                  },
                ]}
              >
                {"customizeqrcode"}
              </GenericText>
            </View>
          </TouchableOpacity>
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    flexGrow: 1,
    backgroundColor: Screens.colors.background,
  },
  title: {
    color: Screens.grayShadeColor,
  },
  logoContainer: {
    width: 15,
    height: 15,
    tintColor: Screens.colors.primary,
  },
  subtitle: {
    color: Screens.black,
    paddingLeft: 20,
    fontWeight: "bold",
    fontSize: 15,
    opacity: 1,
  },
  socialMediaContainer: {
    padding: 25,
    marginHorizontal: 10,
    elevation: 5,
    backgroundColor: Screens.pureWhite,
    borderRadius: 10,
    justifyContent: "center",
  },
  subtitleNearText: {
    color: Screens.success,
    paddingHorizontal: 10,
    fontWeight: "bold",
    fontSize: 14,
    opacity: 1,
  },
  textContainer: {
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  linearStyle: {
    height: 250,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    elevation: 4,
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
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  logoContainers: {
    width: 30,
    height: 30,
  },
  alignCenter: { justifyContent: "center", alignItems: "center" },
  label: {
    fontWeight: "bold",
    color: Screens.black,
  },
  category: {
    backgroundColor: Screens.pureWhite,
    padding: 10,
    marginVertical: 20,
    marginHorizontal: 10,
    elevation: 5,
    borderRadius: 10,
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginHorizontal: 8,
    flexDirection: "row",
    backgroundColor: Screens.lightGray,
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
  preview: {
    flex: 1,
  },
  documentContainer: {
    borderColor: Screens.colors.primary,
    borderWidth: 0.5,
    marginHorizontal: 20,
    marginVertical: 5,
    borderRadius: 20,
  },
});

export default ProfileScreen;
