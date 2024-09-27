import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from "react-native";
import ToggleSwitch from "toggle-switch-react-native";
import Header from "../../components/Header";
import GenericText from "../../components/Text";
import { LocalImages } from "../../constants/imageUrlConstants";
import { SCREENS } from "../../constants/Labels";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { savingCustomQrData, toggleAction } from "../../redux/actions/LocalSavingActions";
import { Screens } from "../../themes";
import { saveProfileDetails } from "../../redux/actions/authenticationAction";

interface IDocumentScreenProps {
  navigation?: any;
}

const CustomizeQr = ({ navigation }: IDocumentScreenProps) => {
  const qrListData = useAppSelector((state :any) => state.saveData);
  const profileDetails = useAppSelector((state) => state.SaveProfile?.profileDetails);
  const userDetails = useAppSelector((state) => state.account);
  const isToggle :any = useAppSelector(state => state.isToggleOn);
  const [medialList, setmedialList] = useState(profileDetails);
  console.log("isToggleData",isToggle?.index?.CHECKED);

  const toggleValue :boolean = isToggle?.index?.CHECKED

  useEffect(() => {
    if (userDetails) {
      SCREENS.HOMESCREEN.CategoryCustomiseList = [
        {
          TITLE: "username",
          VALUE: userDetails.firstName + userDetails.lastName,
          URI: LocalImages.SOCIAL_MEDIA_.webImage,
          DOMAIN: "name",
          CHECKED: true,
        },
        {
          TITLE: "mobileno",
          VALUE: "+91 7373834595",
          URI: LocalImages.SOCIAL_MEDIA_.webImage,
          DOMAIN: "mobile",
          CHECKED: true,
        },
        {
          TITLE: "email",
          VALUE: "vicky@yopmail.com",
          URI: LocalImages.SOCIAL_MEDIA_.webImage,
          DOMAIN: "email",
          CHECKED: true,
        },
        {
          TITLE: "Website",
          URI: LocalImages.SOCIAL_MEDIA_.webImage,
          VALUE: "https://yourdomain.com",
          DOMAIN: "https://yourdomain.com",
          CHECKED: true,
        },
        {
          TITLE: "Facebook",
          URI: LocalImages.SOCIAL_MEDIA_.facebookImage,
          VALUE: "https://yourdomain.com",
          DOMAIN: "https://facebook.com/yourdomain",
          CHECKED: true,
        },
        {
          TITLE: "Instagram",
          URI: LocalImages.SOCIAL_MEDIA_.instagramImage,
          VALUE: "https://yourdomain.com",
          DOMAIN: "https://instagram.com/yourdomain",
          CHECKED: true,
        },
        {
          TITLE: "LinkedIn",
          URI: LocalImages.SOCIAL_MEDIA_.linkdInImage,
          VALUE: "https://yourdomain.com",
          DOMAIN: "https://linkedin.com/yourdomain",
          CHECKED: true,
        },
        {
          TITLE: "Telegram",
          URI: LocalImages.SOCIAL_MEDIA_.telegramImage,
          VALUE: "https://yourdomain.com",
          DOMAIN: "https://telegram.com/yourdomain",
          CHECKED: true,
        },
        {
          TITLE: "Twitter",
          URI: LocalImages.SOCIAL_MEDIA_.twitterImage,
          VALUE: "https://yourdomain.com",
          DOMAIN: "https://twitter.com/yourdomain",
          CHECKED: true,
        },
      ];
    }
  }, [userDetails]);

  
  useEffect(()=>{
    console.log('profileDetails',profileDetails)
    if(profileDetails){
      if(Object.keys(profileDetails).length ===0){
        setmedialList(SCREENS.HOMESCREEN.CategoryCustomiseList)
      }
     
    }
    else{
      setmedialList(SCREENS.HOMESCREEN.CategoryCustomiseList)
    }

  },[profileDetails])



  const dispatch = useAppDispatch();


  useEffect(()=>{
    console.log("Details==>", userDetails);
  },[])

  const _toggleDrawer = () => {
    navigation.openDrawer();
    console.log("drawer==>", "ooo");
  };

  let documentsDetailsList = useAppSelector((state) => state.Documents);

  const [
    isBottomSheetForSideOptionVisible,
    setisBottomSheetForSideOptionVisible,
  ] = useState<boolean>(false);
  const [categoriCustomize, setcategoriCustomize] = useState(medialList);
  const [isBottomSheetForFilterVisible, setisBottomSheetForFilterVisible] =
    useState<boolean>(false);
    const[data,setData]= useState([])

  const _rightIconOnPress = () => {
    setisBottomSheetForSideOptionVisible(true);
  };

  const onToggelchange = async (toggle: any, item: any, itemIndex: any) => {
    medialList.map((item: { CHECKED?: any; }, index: any) => {
      if (index === itemIndex) {
        item.CHECKED = !item.CHECKED;
        dispatch(toggleAction(item))
      }
     

      return item;
    });
    setcategoriCustomize([...medialList]); 
    console.log("this is saved qr data:", [...medialList])
    dispatch(savingCustomQrData([...medialList]));
    dispatch(saveProfileDetails([...medialList])).then(() => {
    })
   
  };

  const _renderItem = ({ item, index }: any) => {
    return (
      <View
        style={{
          borderBottomWidth: 1,
          borderColor: Screens.darkGray,
          marginHorizontal: 15,
          marginVertical: 10,
          paddingVertical: 8,
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <View>
          <GenericText style={[{ fontSize: 13 }]}>{item.TITLE}</GenericText>
          <GenericText style={[{ fontSize: 15, fontWeight: "900" }]}>
            {item.DOMAIN == "mobile"
              ? userDetails?.responseData?.phone
              : item.DOMAIN == "name"
              ? userDetails?.responseData?.username
              : item.DOMAIN == "email"
              ? userDetails?.responseData?.email
              : item.DOMAIN}
          </GenericText>
        </View>
        <View>
          <ToggleSwitch
            onToggle={(on) => onToggelchange(on, item, index)}
            isOn={item.CHECKED}
            size={"small"}
            onColor={Screens.colors.primary}
            offColor={Screens.darkGray}
          />
        </View>
      </View>
    );
  };

  const onChangeHandler = () => {};
  const onPressNavigateTo = () => {
    navigation.navigate("uploadDocumentsScreen");
  };

  return (
    <View style={styles.sectionContainer}>
      <Header
        headingText="customizeqrcode"
        letfIconPress={() => navigation.goBack()}
        linearStyle={styles.linearStyle}
        containerStyle={{
          iconContainer: styles.alignCenter,
        }}
      ></Header>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={{
          position: "absolute",
          marginTop: 40,
          marginLeft: 20,
        }}
      >
        <Image
          source={LocalImages.backImage}
          style={{ height: 20, width: 20, resizeMode: "contain" }}
        />
      </TouchableOpacity>
      <GenericText
        style={[styles.label, { fontSize: 14, textAlign: "center" }]}
      >
        {"pleaseenableinfo"}
      </GenericText>
      <FlatList<any>
        showsHorizontalScrollIndicator={false}
        data={medialList}
        renderItem={_renderItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    flex: 1,
    backgroundColor: Screens.colors.background,
  },
  linearStyle: {
    height: 108,
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
  },
  alignCenter: { justifyContent: "center", alignItems: "center" },
  label: {
    padding: 10,
    color: Screens.black,
  },
  textInputContainer: {
    backgroundColor: "#fff",
    elevation: 1,
    borderColor: "transparent",
  },
  categoryHeaderText: {
    marginHorizontal: 30,
    marginVertical: 20,
    color: Screens.headingtextColor,
  },

  cardContainer: {
    flex: 1,
    marginHorizontal: 20,
    marginVertical: 10,
    elevation: 10,

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
  documentContainer: {
    marginHorizontal: 20,
    marginVertical: 5,
    flex: 1,
    backgroundColor: Screens.pureWhite,
  },
  logoContainer: {
    width: 25,
    height: 25,
  },
});

export default CustomizeQr;
