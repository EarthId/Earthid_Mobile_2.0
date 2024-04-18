import React from "react";
import { StyleSheet, View, TouchableOpacity, Image, Alert, Pressable } from "react-native";
import Avatar from "../Avatar";
import Icon from "../Icon";
import Info from "../Info";
import CheckBox from "@react-native-community/checkbox";
import { Value } from "react-native-reanimated";
import { alertBox } from "../../utils/earthid_account";

/**
 * @author  vicky@
 * @description This is a component for the implementation of card.
 */

interface ICardProps {
  title?: string | null;
  subtitle?: string | null;
  leftIconSrc?: any;
  rightIconSrc?: any;
  isSelected?: boolean;
  onPress?: (e: any) => void;
  style?: any; // Overriding options for styling.
  leftAvatar?: any;
  titleIcon?: any;
  rightIconOnPress?: any;
  absoluteCircleInnerImage?: any;
  isUploaded?: boolean;
  isCheckBoxEnable?: boolean;
  onCheckBoxValueChange?: any;
  checkBoxValue?: boolean;
  timeTitle?: any;
}

const Card = ({
  leftIconSrc,
  rightIconSrc,
  title,
  subtitle,
  leftAvatar,
  absoluteCircleInnerImage,
  onPress,
  titleIcon,
  rightIconOnPress,
  isUploaded = true,
  style = {},
  isCheckBoxEnable,
  onCheckBoxValueChange,
  checkBoxValue,
  timeTitle
}: ICardProps) => {
  return (
    <View style={[styles.container, style]}>
      {isCheckBoxEnable && (
        <CheckBox
          onValueChange={(value) => {
           onCheckBoxValueChange(value);
          }}
          disabled={false}
          value={checkBoxValue}
        />
      )}
      {leftAvatar && (
        <Avatar
          isUploaded={isUploaded}
          absoluteCircleInnerImage={absoluteCircleInnerImage}
          iconSource={leftAvatar}
          style={{
            container: [style.avatarContainer],
            imgContainer: style.avatarImageContainer,
            uploadImageStyle: style.uploadImageStyle,
          }}
        />
      )}
      {leftIconSrc && (
       
           <Icon
           onPress={onPress}
          src={leftIconSrc}
          style={{
            container: styles.leftIconContainer,
            image:{width:30,height:30},
          }}
        />
      
       
      )}
      <Info
        titleIcon={titleIcon}
        title={title}
        subtitle={subtitle}
        timeTitle={timeTitle}
        style={{
          title: style.title,
          subtitle: style.subtitle,
          container: style.textContainer,
        }}
      />
      {rightIconSrc && !isCheckBoxEnable && (
        <Icon
          onPress={rightIconOnPress}
          src={rightIconSrc}
          style={{
            container: [styles.rightIconContainer, style.rightIconStyle],
            image: { width:18, height: 18,tintColor:'#000' },
          }}
        />
      )}
    </View>
  );
};

export default Card;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    paddingHorizontal: 10,
    position: "relative",
  },

  leftIconContainer: {
    paddingVertical: 5,
  },
  rightIconContainer: {
    position: "absolute",
    right: 20,
    top: 0,
    left: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "flex-end",
  },
  rightIconImage: {
    height: 20,
    width: 15,
  },
});
