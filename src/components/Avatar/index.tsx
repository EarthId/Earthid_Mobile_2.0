import React from "react";
import { Pressable, StyleSheet, Image, View } from "react-native";
import { LocalImages } from "../../constants/imageUrlConstants";

import { useAppSelector } from "../../hooks/hooks";
import { Screens } from "../../themes";
import { isEarthId } from "../../utils/PlatFormUtils";
import Icon from "../Icon";
import GenericText from "../Text";
import { IAvatarProps } from "./IAvatarProps";

/**
 * @author  vicky@
 * @description This is a base component for the implementation of Avatar.
 */

const Avatar = ({
  text,
  style = {},
  iconSource,
  isUploaded,
  isProfileAvatar = false,
  absoluteCircleInnerImage,
  avatarClick,
  isCategory = true,
  subCatSideArrowVisible = false,
}: IAvatarProps) => {
  const userDetails = useAppSelector((state) => state.account);
  return (
    <Pressable onPress={avatarClick}>
      <Icon
        onPress={avatarClick}
        absoluteCircleInnerImage={absoluteCircleInnerImage}
        isProfileAvatar={isProfileAvatar}
        isUploaded={isUploaded}
        src={iconSource}
        style={{
          container: [styles.container, style.container],
          image: [styles.avatar, style.imgContainer],
          uploadImageStyle: style.uploadImageStyle,
        }}
      />
      
      {text !== "" && (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View>
            <GenericText style={[styles.text, style.text]}>{text}</GenericText>
            {!isCategory && (
              <View style={styles.row}>
                <View
                  style={{ justifyContent: "center", alignItems: "center" }}
                >
                  <Image
                    source={LocalImages.email}
                    style={{
                      width: 15,
                      height: 15,
                      marginTop: 10,
                      tintColor: isEarthId()
                        ? Screens.pureWhite
                        : Screens.black,
                    }}
                  ></Image>
                </View>

                <GenericText
                  style={[
                    styles.text,
                    style.text,
                    { marginLeft: 10, fontSize:13 },
                  ]}
                >
                  {userDetails?.responseData?.email}
                </GenericText>
                {userDetails?.responseData?.emailApproved ? (
                  <View
                    style={{
                      justifyContent: "center",
                      alignItems: "center",
                      backgroundColor: "#fff",
                      width: 12,
                      height: 12,
                      marginTop: 15,
                      marginLeft: 10,
                    }}
                  >
                    <Image
                      source={LocalImages.successTikImage}
                      style={{ width: 20, height: 20, marginTop: 2 }}
                    ></Image>
                  </View>
                ): <View style={{justifyContent:'center',alignItems:'center'}}><GenericText
                style={[
                  styles.text,
                  style.text,
                  { marginLeft: 5, fontSize:10,textAlign:'center' },
                ]}
              >
                {'(Not Verified)'}
              </GenericText></View>}
              </View>
            )}

            {!isCategory && (
              <View style={styles.row}>
                <View
                  style={{ justifyContent: "center", alignItems: "center" }}
                >
                  <Image
                    source={LocalImages.phone}
                    style={{
                      width: 15,
                      height: 15,
                      marginTop: 10,
                      tintColor: isEarthId()
                        ? Screens.pureWhite
                        : Screens.black,
                    }}
                  ></Image>
                </View>
                <GenericText
                  style={[
                    styles.text,
                    style.text,
                    { marginLeft: 10, fontSize:13 },
                  ]}
                >
                  {userDetails?.responseData?.countryCode +
                    " " +
                    userDetails?.responseData?.phone}
                </GenericText>
                {userDetails?.responseData?.mobileApproved ? (
                  <View
                    style={{
                      justifyContent: "center",
                      alignItems: "center",
                      backgroundColor: "#fff",
                      width: 12,
                      height: 12,
                      marginTop: 15,
                      marginLeft: 10,
                    }}
                  >
                    <Image
                      source={LocalImages.successTikImage}
                      style={{ width: 20, height: 20, marginTop: 2 }}
                    ></Image>
                  </View>
                ):<View style={{justifyContent:'center',alignItems:'center'}}><GenericText
                style={[
                  styles.text,
                  style.text,
                  { marginLeft: 5, fontSize:10,textAlign:'center' },
                ]}
              >
                {'(Not Verified)'}
              </GenericText></View>}
              </View>
            )}
          </View>
          {subCatSideArrowVisible && (
            <View style={{ position: "absolute", right: 25, top: 30 }}>
              <Image
                source={LocalImages.sideArrowImage}
                style={{
                  width: 15,
                  height: 15,
                  marginTop: 40,
                  tintColor: isEarthId() ? Screens.pureWhite : Screens.black,
                  resizeMode: "contain",
                }}
              ></Image>
            </View>
          )}
        </View>
      )}
    </Pressable>
  );
};

export default Avatar;

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignContent: "center",
    
  },
  row: {
    flexDirection: "row",
    justifyContent: "center",
    alignContent: "center",
  },
  text: {
    textAlignVertical: "center",
    textAlign: "center",
    fontWeight: "bold",
    borderRadius: 25,
    fontSize: 18,
    color: "#000",
    marginTop: 10,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginTop: -25,
    zIndex:100,
 
  },
});
