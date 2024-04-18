import React from "react";
import { Image, StyleSheet, View, TouchableOpacity } from "react-native";

import { LocalImages } from "../../constants/imageUrlConstants";
import { Screens } from "../../themes";
import { IIconProps } from "./IIconProps";

/**
 * @author  vicky@
 * @description This is a base component for the implementation of Icon.
 */

const Icon = ({
  src,
  style = {},
  isUploaded,
  onPress,
  isProfileAvatar = false,
  absoluteCircleInnerImage,
}: IIconProps) => (
  <View style={[styles.container, style.container]}>
    {isUploaded && (
      <View
        style={[
          isProfileAvatar
            ? [styles.uploadContainer, { ...styles.profileAvatar }]
            : styles.uploadContainer,
          style.uploadImageStyle,
        ]}
      >
        <Image
          source={absoluteCircleInnerImage}
          style={[isProfileAvatar ? styles.profileUpload : styles.uploadImage]}
          resizeMode="contain"
        />
      </View>
    )}
    <TouchableOpacity onPress={onPress}>
    
     <Image
        source={src}
        style={[styles.image, style.image]}
        resizeMode='contain'
      />
    
     
    </TouchableOpacity>
  </View>
);

export default Icon;

const styles = StyleSheet.create({
  image: {
    height: 70,
    width: 70,
    borderRadius:10
  
  },
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  uploadContainer: {
    width: 20,
    height: 20,
    borderRadius: 15 / 2,
    backgroundColor: "#25cc25",
    position: "absolute",
    right: 0,
    bottom: 0,
    marginLeft:10,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  profileAvatar: {
    left: 213,
    backgroundColor: "#fff",
    zIndex: 100,
    borderRadius:25,
    justifyContent:'center',
    alignItems:'center'
  },
  profileUpload: {
    width: 12,
    height: 12,
    tintColor: Screens.black,
  },
  uploadImage: {
    width: 10,
    height: 10,
    tintColor: Screens.pureWhite,
  },
});
