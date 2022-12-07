import { values } from "lodash";
import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  ScrollView,
  AsyncStorage,
} from "react-native";
import Share from "react-native-share";
import Avatar from "../../../components/Avatar";
import BottomSheet from "../../../components/Bottomsheet";
import Card from "../../../components/Card";
import Header from "../../../components/Header";
import GenericText from "../../../components/Text";
import TextInput from "../../../components/TextInput";
import { LocalImages } from "../../../constants/imageUrlConstants";
import { SCREENS } from "../../../constants/Labels";
import { useAppDispatch, useAppSelector } from "../../../hooks/hooks";
import { saveDocuments } from "../../../redux/actions/authenticationAction";
import { Screens } from "../../../themes";

interface IDocumentScreenProps {
  navigation?: any;
}

const DocumentScreen = ({ navigation }: IDocumentScreenProps) => {
  const _toggleDrawer = () => {
    navigation.openDrawer();
  };
  let documentsDetailsList = useAppSelector((state) => state.Documents);
  console.log('documentsDetailsList===>',documentsDetailsList)
  const dispatch = useAppDispatch();
  const [selectedItem, setselectedItem] = useState();

  const [
    isBottomSheetForSideOptionVisible,
    setisBottomSheetForSideOptionVisible,
  ] = useState<boolean>(false);

  const [searchedData, setSearchedData] = useState([]);

  const [searchText, setsearchText] = useState("");

  const [isBottomSheetForFilterVisible, setisBottomSheetForFilterVisible] =
    useState<boolean>(false);

  const _rightIconOnPress = (selecteArrayItem: any) => {
 console.log(',,,,selecteArrayItem',selecteArrayItem)
    setselectedItem(selecteArrayItem);
    setisBottomSheetForSideOptionVisible(true);
  };

  const _renderItem = ({ item }: any) => {
    AsyncStorage.setItem("day", item.date);

    return (
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("ViewCredential", { documentDetails: item })
        }
      >
          <View style={{ flexDirection: "row"}}>
            <GenericText style={[styles.categoryHeaderText, { fontSize: 13 }]}>
             {SCREENS.HOMESCREEN.upload}
            </GenericText>
          </View>

        <Card
          titleIcon={item?.isVc ? LocalImages.vcImage : null}
          leftAvatar={LocalImages.documentsImage}
          absoluteCircleInnerImage={LocalImages.upImage}
          rightIconSrc={LocalImages.menuImage}
          rightIconOnPress={() => _rightIconOnPress(item)}
          title={item.name}
          subtitle={`      Uploaded  : ${item.date}`}
          style={{
            ...styles.cardContainer,
            ...{
              avatarContainer: {
                backgroundColor: "rgba(245, 188, 232, 1)",
                width: 60,
                height: 60,
                borderRadius: 20,
                marginTop: 25,
                marginLeft: 10,
                marginRight: 5,
              },
              uploadImageStyle: {
                backgroundColor: "rgba(245, 188, 232, 1)",
                borderRadius:25,
                borderWidth:3,
                bordercolor:'#fff',
                borderWidthRadius:25
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
            },
          }}
        />
      </TouchableOpacity>
    );
  };
  const RowOption = ({ icon, title, rowAction }: any) => (
    <TouchableOpacity onPress={rowAction}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        {icon && (
          <Image
            resizeMode="contain"
            style={styles.logoContainer}
            source={icon}
          ></Image>
        )}

        <View style={{ justifyContent: "center", alignItems: "center" }}>
          <GenericText
            style={[
              styles.categoryHeaderText,
              { fontSize: 13, marginHorizontal: 10, marginVertical: 15 },
            ]}
          >
            {title}
          </GenericText>
        </View>
      </View>
    </TouchableOpacity>
  );

  const onChangeHandler = (text: any) => {
    const newData = documentsDetailsList?.responseData.filter(function (item: {
      name: string;
     }) {
      const itemData = item.name ? item.name.toUpperCase() : "".toUpperCase();

      const textData = text.toUpperCase();

      return itemData.indexOf(textData) > -1;
    });
    setsearchText(text);
    console.log("newData===>", newData);
    setSearchedData(newData);
  };

  const shareItem = async () => {
    if (selectedItem?.base64) {
      await Share.open({
        url: `${selectedItem?.base64}`,
      });
    } 
  };

  const deleteItem = () => {
    setisBottomSheetForSideOptionVisible(false);

    const newData = documentsDetailsList?.responseData.filter(function (item: {
      name: any;
    }) {
      return item.name !== selectedItem?.name;
    });

    dispatch(saveDocuments(newData));
  };
  const onPressNavigateTo = () => {
    navigation.navigate("uploadDocumentsScreen");
  };
  const _keyExtractor = ({ path }: any) => path.toString();

  const getFilteredData = () => {
    let data = documentsDetailsList?.responseData;
 
    if (searchedData.length > 0) {
      data = searchedData;
      return data;
    }
    if (searchedData.length === 0 && searchText != "") {
      return [];
    }
    console.log("searchedData====>{{}}}}}", data);
    return data;
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
            rightIconPress={onPressNavigateTo}
            leftIconSource={LocalImages.logoImage}
            rightIconSource={LocalImages.addImage}
            onpress={() => {
              _toggleDrawer();
            }}
            linearStyle={styles.linearStyle}
          ></Header>
          <TextInput
            leftIcon={LocalImages.searchImage}
            style={{
              container: styles.textInputContainer,
            }}
            isError={false}
            isNumeric={false}
            placeholder={"Search documents"}
            value={searchText}
            onChangeText={onChangeHandler}
          />
         
          <FlatList<any>
            data={getFilteredData()}
            renderItem={_renderItem}
            keyExtractor={_keyExtractor}
          />
          <BottomSheet
            onClose={() => setisBottomSheetForSideOptionVisible(false)}
            height={150}
            isVisible={isBottomSheetForSideOptionVisible}
          >
            <View style={{ height: 100, width: "100%", paddingHorizontal: 30 }}>
              <RowOption
                rowAction={() => shareItem()}
                title={"Share"}
                icon={LocalImages.shareImage}
              />
              <RowOption
                rowAction={() => deleteItem()}
                title={"Delete"}
                icon={LocalImages.deleteImage}
              />
            </View>
          </BottomSheet>
          <BottomSheet
            onClose={() => setisBottomSheetForFilterVisible(false)}
            height={150}
            isVisible={isBottomSheetForFilterVisible}
          >
            <View style={{ height: 150, width: "100%", paddingHorizontal: 30, }}>
              <RowOption title={"By Category"} />
              <RowOption title={"By Date"} />
              <RowOption title={"By Frequency"} />
            </View>
          </BottomSheet>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    flex: 1,
    backgroundColor: Screens.colors.background,
  },
  linearStyle: {
    height: 120,
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
    fontWeight: "bold",
    color: Screens.black,
  },
  textInputContainer: {
    backgroundColor: "#fff",
    elevation: 1,
    borderColor: "transparent",
    borderRadius: 13,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
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

export default DocumentScreen;
