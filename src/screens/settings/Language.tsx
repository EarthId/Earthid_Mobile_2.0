import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import Header from "../../components/Header";
import { values } from "lodash";
import { ABOUT_ROUTES } from "../../constants/Routes";
import { Screens } from "../../themes";
import { LocalImages } from "../../constants/imageUrlConstants";
import Card from "../../components/Card";
import { Dropdown } from "react-native-element-dropdown";
import { useTranslation } from "react-i18next";
import GenericText from "../../components/Text";
import { SCREENS } from "../../constants/Labels";
import il8n from ".././../utils/i18n";
import { AppLanguage } from "../../typings/enums/AppLanguage";

const language = (props: any) => {
  const aboutList = values(ABOUT_ROUTES).map(
    ({
      CARD: card,
      TITLE: title,
      SCREEN: route,
      URI: uri,
      RIGHT_ICON: rightUri,
    }: any) => ({
      card,
      title,
      route,
      uri,
      rightUri,
    })
  );

  const _navigateAction = (item: any) => {
   // console.log("item", item);
    props.navigation.navigate(item.route);
  };
  const _renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity onPress={() => _navigateAction(item)}>
      <Card
        title={item.title}
        leftIconSrc={item.uri}
        rightIconSrc={item.rightUri}
        style={styles.cardContainer}
      />
    </TouchableOpacity>
  );
  const _keyExtractor = ({ title }: any) => title.toString();

  const data = [
    { label: "English", value: AppLanguage.ENGLISH },
    { label: "Spanish", value: AppLanguage.SPANISH },
  ];

  const [value, setValue] = useState(null);
  const [isFocus, setIsFocus] = useState(false);

  return (
    <View style={styles.sectionContainer}>
      <View style={styles.sectionHeaderContainer}>
        <Image
          resizeMode="contain"
          style={styles.logoContainer}
          source={LocalImages.logoImage}
        ></Image>
        <TouchableOpacity
          style={styles.closeContainer}
          onPress={() => props.navigation.goBack()}
        >
          <Image
            resizeMode="contain"
            style={styles.close}
            source={LocalImages.closeImage}
          ></Image>
        </TouchableOpacity>
      </View>

      <GenericText style={{ margin: 12, color: Screens.black }}>
        {SCREENS.LANGUAGESCREEN.SELECT_LANGUAGE}
      </GenericText>

      <Dropdown
        style={[
          styles.dropdown,
          isFocus && { borderColor: Screens.colors.background },
        ]}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        data={data}
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder={!isFocus ? "Select Language" : "..."}
        searchPlaceholder="Search..."
        value={value}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onChange={(item) => {
          setValue(item.value);
          setIsFocus(false);
          il8n.changeLanguage(item.value);
          console.log("praveen", item.value);
        }}
      />
    </View>
  );
};

export default language;

const styles = StyleSheet.create({
  sectionContainer: {
    flex: 1,
    backgroundColor: Screens.colors.background,
  },
  cardContainer: {
    flex: 1,
    paddingVertical: 5,
  },
  sectionHeaderContainer: {
    flexDirection: "row",
    height: 120,
    backgroundColor: Screens.colors.customDrawer.headerBackground,
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
  },
  closeContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    backgroundColor: "white",
    padding: 16,
  },
  dropdown: {
    marginLeft: 12,
    height: 50,
    borderColor: "gray",
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginRight: 12,
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: "absolute",
    backgroundColor: "white",
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
    color: Screens.black,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});
