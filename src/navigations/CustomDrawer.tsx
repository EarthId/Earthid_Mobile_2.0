import React, { useEffect } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  Alert,
  Linking,
  AsyncStorage,
} from "react-native";
import { Screens } from "../themes/index";
import { values } from "lodash";
import { LocalImages } from "../constants/imageUrlConstants";
import { ABOUT_ROUTES } from "../constants/Routes";
import { StackActions } from "@react-navigation/native";
import GenericText from "../components/Text";
import { useAppDispatch, useAppSelector } from "../hooks/hooks";
import { FlushData } from "../redux/actions/authenticationAction";
import { useFetch } from "../hooks/use-fetch";
import { EARTHID_DEV_BASE } from "../constants/URLContstants";
import { isEarthId } from "../utils/PlatFormUtils";
import Header from "../components/Header";
import { deleteSingleBucket } from "../utils/awsSetup";

const CustomDrawer = (props: any) => {
  const dispatch = useAppDispatch();
  const userDetails = useAppSelector((state) => state.account);
  const {
    loading,
    data: deletedRespopnse,
    error,
    fetch: deleteFetch,
  } = useFetch();

  const aboutList = values(ABOUT_ROUTES).map(
    ({
      CARD: card,
      TITLE: title,
      SCREEN: route,
      COLOR: color,
      URI: uri,
      RIGHT_ICON: rightUri,
    }: any) => ({
      card,
      title,
      route,
      uri,
      rightUri,
      color,
    })
  );

  const _navigateAction = async (item: any) => {
    if (item.route === "Logout") {
      const bucketName = `idv-sessions-${userDetails?.username.toLowerCase()}`;
      deleteSingleBucket(bucketName)
      dispatch(FlushData()).then(async () => {
        await AsyncStorage.removeItem("passcode");
        await AsyncStorage.removeItem("fingerprint");
        await AsyncStorage.removeItem("FaceID");
        await AsyncStorage.removeItem("pageName");
        await AsyncStorage.removeItem("profilePic");
        await AsyncStorage.removeItem("vcCred");
        props.navigation.dispatch(StackActions.replace("AuthStack"));
      });
    } else if (item.route === "delete") {
      await AsyncStorage.removeItem("passcode");
      await AsyncStorage.removeItem("fingerprint");
      await AsyncStorage.removeItem("FaceID");
      await AsyncStorage.removeItem("pageName");
      await AsyncStorage.removeItem("profilePic");
      await AsyncStorage.removeItem("vcCred");
      // const bucketName = `idv-sessions-${userDetails?.username.toLowerCase()}`;
      // deleteSingleBucket(bucketName)
      await AsyncStorage.removeItem('apiCalled');
      deleteUser();
    } else if (item.route === "about") {
      Linking.openURL(
        isEarthId()
          ? "https://www.myearth.id/about/company"
          : "https://globalidiq.com/about/"
      );
    } else if (item.route === "terms") {
      // Linking.openURL(
      //   isEarthId() ?
      //    "https://www.myearth.id/privacy":"https://globalidiq.com/terms-of-use-3/"
      // );
      Linking.openURL(
        isEarthId()
          ? "https://www.myearth.id/privacy"
          : "https://globalidiq.com/terms-of-use-3/"
      );
    } else {
      props.navigation.navigate(item.route, { type: item.route });
    }
  };

  const deleteuserData = () => {
    const paramsUrl = `${EARTHID_DEV_BASE}/user/deleteUser?earthId=${userDetails?.responseData?.earthId}&publicKey=${userDetails?.responseData?.publicKey}`;

    
    const requestBoady = {
      publicKey: userDetails?.responseData?.publicKey,
    };
    deleteFetch(paramsUrl, requestBoady, "DELETE");
  };

  useEffect(() => {
    if (deletedRespopnse) {
      dispatch(FlushData()).then(async () => {
        await AsyncStorage.removeItem("passcode");
        await AsyncStorage.removeItem("fingerprint");
        await AsyncStorage.removeItem("FaceID");
        await AsyncStorage.removeItem("pageName");
        await AsyncStorage.removeItem("profilePic");
        await AsyncStorage.removeItem("signatureKey");
        await AsyncStorage.removeItem("apiCalled");
        const bucketName = `idv-sessions-${userDetails?.username?.toLowerCase()}`;
       await deleteSingleBucket(bucketName)
        props.navigation.dispatch(StackActions.replace("AuthStack"));
      });
    }
  }, [deletedRespopnse]);

  const _toggleDrawer = () => {
    props.navigation.closeDrawer();
  };
  const deleteUser = () => {
    const deletId = isEarthId()
      ? "Are you sure you want to delete your EarthID? Once deleted you won't be able to recover it later."
      : "Are you sure you want to delete your GlobaliD? Once deleted you won't be able to recover it later.";
    Alert.alert(
      "Delete Identity?",
      deletId,
      [
        {
          text: "Yes",
          onPress: async () => {
            await AsyncStorage.removeItem("signatureKey");
            deleteuserData();
          },
          style: "cancel",
        },
        {
          text: "No",
          onPress: async () => {},
        },
      ],
      { cancelable: false }
    );
  };

  const _signOutAsync = () => {
    Alert.alert(
      "Delete Identity?",
      "Are you sure you want to delete your EarthId? Once deleted you won't be able to recover it later.",
      [
        {
          text: "Yes",
          onPress: async () => {
            // dispatch(FlushData()).then(() => {
            //   props.navigation.dispatch(StackActions.replace("AuthStack"));
            // });
            deleteuserData();
          },
          style: "cancel",
        },
        {
          text: "No",
          onPress: async () => {},
        },
      ],
      { cancelable: false }
    );
  };
  const _renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity onPress={() => _navigateAction(item)}>
      <View
        style={{
          flexDirection: "row",
          flex: 1,
          margin: 10,
          justifyContent: "space-between",
        }}
      >
        <View style={{ flexDirection: "row" }}>
          <View
            style={[styles.avatarContainer, { backgroundColor: item.color }]}
          >
            <Image
              resizeMode="contain"
              style={styles.avatarImageContainer}
              source={item.uri}
            ></Image>
          </View>
          <View style={{ justifyContent: "center", alignItems: "center" }}>
            <GenericText
              style={[
                {
                  fontSize: 14,
                  marginHorizontal: 10,

                  color: Screens.black,
                  fontWeight: "500",
                },
              ]}
            >
              {item.title}
            </GenericText>
          </View>
        </View>
        <View style={{ justifyContent: "center", alignItems: "center" }}>
          <Image
            resizeMode="contain"
            style={styles.avatarImageContainer}
            source={item.rightUri}
          ></Image>
        </View>
      </View>
    </TouchableOpacity>
  );
  const _keyExtractor = ({ title }: any) => title.toString();

  useEffect(() => {

  });

  return (
    <View style={styles.sectionContainer}>
      <Header
        leftIconSource={LocalImages.logoImage}
        actionIcon={props.route == "undefined" ? LocalImages.closeImage : ""}
        onpress={() => {
          _toggleDrawer();
        }}
        linearStyle={styles.linearStyle}
      ></Header>
      <TouchableOpacity
        onPress={() => _toggleDrawer()}
        style={{ position: "absolute", right: 0, top: 50, marginRight: 20 }}
      >
        <Image
          source={LocalImages.closeImage}
          style={{ width: 15, height: 15, tintColor: Screens.pureWhite }}
        />
      </TouchableOpacity>
      <FlatList<any>
        data={aboutList}
        renderItem={_renderItem}
        keyExtractor={_keyExtractor}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    flex: 1,
    backgroundColor: Screens.colors.background,
  },
  cardContainer: {
    flex: 1,
    margin: 10,
  },
  avatarImageContainer: {
    width: 20,
    height: 20,
  },
  avatarContainer: {
    backgroundColor: "red",
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  linearStyle: {
    height: 120,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    elevation: 4,
  },
  sectionHeaderContainer: {
    flexDirection: "row",
    height: 120,
    backgroundColor: "#D9E3EC",
    borderBottomRightRadius: 25,
    borderBottomLeftRadius: 25,
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  logoContainer: {
    width: 130,
    height: 120,
  },
  close: {
    width: 15,
    height: 15,
    tintColor: "#fff",
  },
  closeContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
});

export default CustomDrawer;
