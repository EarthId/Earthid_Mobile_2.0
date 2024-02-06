import React from "react";
import {
  Alert,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { LocalImages } from "../../constants/imageUrlConstants";
import { useAppSelector } from "../../hooks/hooks";
import { Screens } from "../../themes";
import { isEarthId } from "../../utils/PlatFormUtils";
import Avatar from "../Avatar";
import LinearGradients from "../GradientsPanel/LinearGradient";
import GenericText from "../Text";
import { IHeaderProps } from "./IHeaderProps";

/**
 * @author  vicky@
 * @description This is a base component for the implementation of Icon.
 */

const Header = ({
  containerStyle = {},
  linearStyle = {},
  onpress,
  hideUser = false,
  isUploaded = false,
  isAvatar,
  isProfileAvatar = false,
  absoluteCircleInnerImage,
  letfIconPress,
  rightIconSource,
  actionIcon = LocalImages.humbergerImage,
  rewardPoints,
  picUri,
  avatarClick,
  isLogoAlone,
  headingText,
  isBack = false,
  navigation,
  rightIconPress,
  subCatSideArrowVisible = false,
}: IHeaderProps) => {
  const userDetails = useAppSelector((state) => state.account);
  return (
    <View style={containerStyle}>
      <LinearGradients
        endColor={Screens.colors.header.endColor}
        middleColor={Screens.colors.header.middleColor}
        startColor={Screens.colors.header.startColor}
        style={linearStyle}
        horizontalGradient={false}
      >
        {headingText ? (
          <View>
            {isBack && (
              <View
                style={{ position: "absolute", top: 30, left: 30, zIndex: 100 }}
              >
                <Pressable onPress={letfIconPress}>
                  <Image
                    resizeMode="contain"
                    style={{
                      width: 25,
                      height: 25,
                      resizeMode: "contain",
                      tintColor: isEarthId()
                        ? Screens.pureWhite
                        : Screens.black,
                    }}
                    source={LocalImages.backImage}
                  ></Image>
                </Pressable>
              </View>
            )}
            <GenericText
              style={{
                fontWeight: "bold",
                textAlign: "center",
                fontSize: 20,
                color: isEarthId() ? Screens.pureWhite : Screens.black,
                marginTop: 30,
              }}
            >
              {headingText}
            </GenericText>
          </View>
        ) : isLogoAlone ? (
          <View>
            {isBack && (
              <View
                style={{ position: "absolute", top: 40, left: 30, zIndex: 100 }}
              >
                <Pressable
                  style={{ width: 50, height: 50 }}
                  onPress={letfIconPress}
                >
                  <Image
                    resizeMode="contain"
                    style={{
                      width: 25,
                      height: 25,
                      resizeMode: "contain",
                      tintColor: isEarthId()
                        ? Screens.pureWhite
                        : Screens.black,
                    }}
                    source={LocalImages.backImage}
                  ></Image>
                </Pressable>
              </View>
            )}
            <View style={{ justifyContent: "center", alignItems: "center" }}>
              <Image
                resizeMode="contain"
                style={[styles.logoContainer, containerStyle.iconStyle]}
                source={LocalImages.logoImage}
              ></Image>
            </View>
          </View>
        ) : (
          <View>
            <View style={styles.sectionHeaderContainer}>
              <TouchableOpacity
                style={containerStyle.iconContainer}
                disabled={letfIconPress ? false : true}
                onPress={letfIconPress}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <View
                    style={{ justifyContent: "center", alignItems: "center" }}
                  >
                    {isBack && (
                      <Image
                        resizeMode="contain"
                        style={{
                          width: 20,
                          height: 20,
                          resizeMode: "contain",
                          marginRight: 10,
                          tintColor: isEarthId()
                            ? Screens.pureWhite
                            : Screens.black,
                        }}
                        source={LocalImages.backImage}
                      ></Image>
                    )}
                  </View>

                  <Image
                    resizeMode="contain"
                    style={[styles.logoContainer]}
                    source={LocalImages.logoImage}
                  ></Image>
                </View>
              </TouchableOpacity>

              <View
                style={{
                  flexDirection: "row",
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                  }}
                >
                  <TouchableOpacity
                    style={styles.closeContainer}
                    onPress={rightIconPress}
                  >
                    <Image
                      resizeMode="contain"
                      style={styles.close}
                      source={rightIconSource}
                    ></Image>
                  </TouchableOpacity>
                  {rewardPoints !== "" && (
                    <View
                      style={{
                        justifyContent: "center",
                        alignItems: "center",
                        marginLeft: 10,
                      }}
                    >
                      <GenericText
                        style={{
                          fontWeight: "bold",
                          marginLeft: -5,
                          color: isEarthId()
                            ? Screens.pureWhite
                            : Screens.black,
                        }}
                      >
                        {rewardPoints}
                      </GenericText>
                    </View>
                  )}
                </View>

                <TouchableOpacity
                  style={[styles.closeContainer, { marginLeft: 10 }]}
                  onPress={onpress}
                >
                  <Image
                    resizeMode="contain"
                    style={styles.close}
                    source={actionIcon}
                  ></Image>
                </TouchableOpacity>
              </View>
            </View>
            {isAvatar && (
              <Avatar
                subCatSideArrowVisible={subCatSideArrowVisible}
                isCategory={false}
                avatarClick={avatarClick}
                style={{
                  text: {
                    color: isEarthId() ? Screens.pureWhite : Screens.black,
                  },
                }}
                absoluteCircleInnerImage={absoluteCircleInnerImage}
                isProfileAvatar={isProfileAvatar}
                isUploaded={isUploaded}
                text={hideUser ? "" : userDetails?.responseData?.firstname+" "+ userDetails?.responseData?.lastname}
                iconSource={picUri ? { uri: picUri } : LocalImages.avatarImage}
              ></Avatar>
            )}
          </View>
        )}
      </LinearGradients>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  image: {
    height: 20,
    width: 20,
  },
  closeContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  sectionHeaderContainer: {
    flexDirection: "row",
    height: 120,
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
    width: 30,
    height: 30,
    tintColor: isEarthId() ? Screens.pureWhite : Screens.black,
  },
});
