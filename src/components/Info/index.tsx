import React from "react";
import { StyleSheet, View, Image, TouchableOpacity } from "react-native";
import { LocalImages } from "../../constants/imageUrlConstants";
import { Screens } from "../../themes";
import GenericText from "../Text";

import { IInfoProps } from "./IInfoProps";

/**
 * @author  vicky@
 * @description This is a base component for the implementation of Info.
 */

const Info = ({
  title,
  subtitle,
  style = {},
  titleIcon,
  subtitleRowText,
  subTitlePress,
  tailIcon,
  tailIconPress,
  tailIcondisabled,
  timeTitle,
}: IInfoProps) => (
  <View style={[styles.container, style.container]}>
    {title && (
      <View style={styles.titleTextContainer}>
        <View>
          <GenericText
            style={[styles.title, style.title, { flexShrink: 1, width: 200 }]}
          >
            {title}
          </GenericText>
          {subtitle && (
            <View
              style={{ justifyContent: "space-between", flexDirection: "row" }}
            >
              <View style={styles.titleTextContainer}>
                <View style={{ flexDirection: "column", width: "65%" }}>
                  <GenericText style={[styles.subtitle, style.subtitle]}>
                    {subtitle}
                  </GenericText>
                  <GenericText
                    style={[
                      styles.subtitle,
                      style.subtitle,
                      { position: "absolute", left: 170 },
                    ]}
                  >
                    {timeTitle}
                  </GenericText>
                </View>
                {subtitleRowText && (
                  <TouchableOpacity onPress={subTitlePress}>
                    {/* //verify */}
                    <View style={styles.titleTextContainer}>
                      <View
                        style={{
                          paddingHorizontal: 10,
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        {subtitleRowText === "verified" && (
                          <Image
                            resizeMode="contain"
                            style={styles.sublogoContainers}
                            source={LocalImages.successTikImage}
                          ></Image>
                        )}
                      </View>
                      <GenericText
                        style={[styles.subtitle, style.subtitleNearText]}
                      >
                        {subtitleRowText}
                      </GenericText>
                    </View>
                  </TouchableOpacity>
                )}
              </View>

              {tailIcon && (
                <TouchableOpacity
                  activeOpacity={tailIcondisabled}
                  onPress={tailIconPress}
                  style={{ position: "absolute", right: 0 }}
                >
                  <Image
                    style={{
                      position: "absolute",
                      right: 0,
                      height: 20,
                      width: 20,
                    }}
                    resizeMode="contain"
                    source={tailIcon}
                  ></Image>
                </TouchableOpacity>
              )}
            </View>
          )}
          {titleIcon && (
            <View
              style={{
                position: "absolute",
                justifyContent: "center",
                alignItems: "center",
                top: -30,
                bottom: 0,
                left: 40,
                right: 0,
              }}
            >
              <Image
                resizeMode="contain"
                style={styles.logoContainers}
                source={titleIcon}
              ></Image>
            </View>
          )}
        </View>
      </View>
    )}
  </View>
);

export default Info;

const styles = StyleSheet.create({
  logoContainers: {
    width: 50,
    height: 50,
  },
  sublogoContainers: {
    width: 15,
    height: 15,
    marginRight: 8,
  },
  titleTextContainer: {
    flexDirection: "row",
    width: "100%",
  },
  imageContainer: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    top: 10,
    bottom: 0,
    left: 40,
    right: 0,
  },
  container: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    color: Screens.black,
    fontSize: 16,
    fontWeight: "500",
    paddingVertical: 1.5,
  },
  subtitle: {
    color: Screens.black,
    opacity: 0.4,
    fontSize: 12,
    paddingVertical: 1.5,
  },
});
