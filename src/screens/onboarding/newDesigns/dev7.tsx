import React, { useMemo, useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  AsyncStorage,
  Alert,
} from "react-native";
import Header from "../../../components/Header";
import { SCREENS } from "../../../constants/Labels";
import { Screens } from "../../../themes";
import Button from "../../../components/Button";
import { LocalImages } from "../../../constants/imageUrlConstants";
import GenericText from "../../../components/Text";
import RadioGroup from 'react-native-radio-buttons-group';

interface IHomeScreenProps {
  navigation?: any;
}

const Register = ({ navigation }: IHomeScreenProps) => {

  const radioButtons = useMemo(() => ([
    {
        id: '1', // acts as primary key, should be unique and non-empty string
        label: 'Yes',
        value: 'yes',
        color: "#00f",
        labelStyle: { color: '#000' },
    },
    {
        id: '2',
        label: 'No',
        value: 'no',
        color: "#00f",
        labelStyle: { color: '#000' },
    }
]), []);

const [selectedId, setSelectedId] = useState();
  
  return (
    <View style={styles.sectionContainer}>
      <ScrollView contentContainerStyle={styles.sectionContainer}>
        <Header
          isBack
          letfIconPress={() => navigation.goBack()}
          isLogoAlone={true}
          headingText="Trustee Info"
          linearStyle={styles.linearStyle}
          containerStyle={{
            iconStyle: {
              width: 205,
              height: 72,
              marginTop: 30,
            },
            iconContainer: styles.alignCenter,
          }}
        ></Header>

        <View style={styles.category}>
          <View>
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                margin: 30,
              }}
            >
              <Image
                resizeMode="contain"
                style={[styles.logoContainer]}
                source={LocalImages.key}
              ></Image>
            </View>
            <GenericText
              style={[
                styles.categoryHeaderText,
                {
                  fontSize: 14,
                  fontWeight: "bold",
                  textAlign: "center",
                  color: Screens.black,
                },
              ]}
            >
              Trustee Info
            </GenericText>
            <GenericText
              style={[
                styles.categoryHeaderText,
                {
                  fontSize: 13,
                  fontWeight: "500",
                  textAlign: "center",
                  color: Screens.grayShadeColor,
                },
              ]}
            >
              Please add trustee contact info.
            </GenericText>
            <View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}>
                <GenericText
                  style={[
                    styles.categoryHeaderText,
                    {
                      fontSize: 13,
                      fontWeight: "500",
                      textAlign: "center",
                      color: Screens.black,
                    },
                  ]}
                >
                  1st Person
                </GenericText>
                <GenericText
                  style={[
                    styles.categoryHeaderText,
                    {
                      fontSize: 10,
                      fontWeight: "500",
                      textAlign: "center",
                      color: Screens.grayShadeColor,
                    },
                  ]}
                >
                  VERIFIED
                </GenericText>
              </View>
              <View
                style={{
                  borderBottomColor: 'black',
                  borderBottomWidth: StyleSheet.hairlineWidth,
                  marginHorizontal: 15,
                }}
              />
              <View
                style={{
                  justifyContent: "flex-start",
                  alignItems: "flex-start",
                }}>
              <GenericText
                style={[
                  styles.categoryHeaderText,
                  {
                    fontSize: 13,
                    fontWeight: "500",
                    textAlign: "center",
                    color: Screens.grayShadeColor,
                    marginBottom: -5,
                  },
                ]}
              >
                Full Name
              </GenericText>
              <GenericText
                style={[
                  styles.categoryHeaderText,
                  {
                    fontSize: 13,
                    fontWeight: "bold",
                    textAlign: "center",
                    color: Screens.black,
                  },
                ]}
              >
                Robert Downey
              </GenericText>
              </View>
              <View
                style={{
                  justifyContent: "flex-start",
                  alignItems: "flex-start",
                }}>
              <GenericText
                style={[
                  styles.categoryHeaderText,
                  {
                    fontSize: 13,
                    fontWeight: "500",
                    textAlign: "center",
                    color: Screens.grayShadeColor,
                    marginBottom: -5,
                  },
                ]}
              >
                Mobile Number
              </GenericText>
              <GenericText
                style={[
                  styles.categoryHeaderText,
                  {
                    fontSize: 13,
                    fontWeight: "bold",
                    textAlign: "center",
                    color: Screens.black,
                  },
                ]}
              >
                +91 82348 12345
              </GenericText>
              </View>
              <View
                style={{
                  justifyContent: "flex-start",
                  alignItems: "flex-start",
                }}>
              <GenericText
                style={[
                  styles.categoryHeaderText,
                  {
                    fontSize: 13,
                    fontWeight: "500",
                    textAlign: "center",
                    color: Screens.grayShadeColor,
                    marginBottom: -5,
                  },
                ]}
              >
                Email
              </GenericText>
              <GenericText
                style={[
                  styles.categoryHeaderText,
                  {
                    fontSize: 13,
                    fontWeight: "bold",
                    textAlign: "center",
                    color: Screens.black,
                  },
                ]}
              >
                anymail@earthid.com
              </GenericText>
              </View>
              <View
                style={{
                  justifyContent: "flex-start",
                  alignItems: "flex-start",
                }}>
              <GenericText
                style={[
                  styles.categoryHeaderText,
                  {
                    fontSize: 13,
                    fontWeight: "500",
                    textAlign: "center",
                    color: Screens.grayShadeColor,
                    marginBottom: 5,
                  },
                ]}
              >
                Has EarthID?
              </GenericText>
              <RadioGroup 
                  radioButtons={radioButtons} 
                  onPress={setSelectedId}
                  selectedId={selectedId}
                  layout="row"
                  containerStyle={{marginHorizontal: 10}}
              />
              </View>
            </View>
            <Button
              selected={false}
              disabled={false}
              onPress={() => {
                navigation.navigate("Home");
              }}
              style={{
                buttonContainer: {
                  opacity: 1,
                  backgroundColor: "#fff",
                  elevation: 2,
                  borderColor: Screens.colors.primary,
                },
              }}
              title="INVITE"
            ></Button>
          </View>
        </View>
      </ScrollView>
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
  subtitle: {
    color: Screens.black,
    paddingLeft: 20,
    fontWeight: "bold",
    fontSize: 15,
    opacity: 1,
  },
  containerForSocialMedia: {
    marginTop: 10,
    marginHorizontal: 10,
    borderColor: Screens.grayShadeColor,
    borderWidth: 0.5,
    borderRadius: 10,
    justifyContent: "center",
  },
  logoContainer: {
    width: 100,
    height: 100,
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
  categoryHeaderText: {
    marginHorizontal: 20,
    marginVertical: 10,

    color: Screens.headingtextColor,
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
  logoContainers: {
    width: 30,
    height: 30,
    tintColor: Screens.grayShadeColor,
  },
  alignCenter: { justifyContent: "center", alignItems: "center" },
  label: {
    fontWeight: "bold",
    color: Screens.black,
  },
  category: {
    backgroundColor: Screens.pureWhite,
    padding: 10,
    marginTop: -160,
    marginHorizontal: 15,
    elevation: 5,
    borderRadius: 10,
    flex: 0.1,
    justifyContent: "space-between",
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
  textInputContainer: {
    borderRadius: 10,
    borderColor: Screens.colors.primary,
    borderWidth: 2,
    marginLeft: 10,
    marginTop: -2,
  },
});

export default Register;
