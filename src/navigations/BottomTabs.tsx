import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { View, Image, StyleSheet, TouchableOpacity, Alert } from "react-native";
import * as React from "react";
import { useTheme } from "@react-navigation/native";

import { LocalImages } from "../constants/imageUrlConstants";
import LinearGradients from "../components/GradientsPanel/LinearGradient";
import { Screens } from "../themes/index";

import HomeScreen from "../screens/bottomTabs/homeTab/index";
import DocumentScreen from "../screens/bottomTabs/documentTab";
import HistoryScreen from "../screens/bottomTabs/historyTab";
import PaymentScreen from "../screens/bottomTabs/payemnts/index";
import CameraScreen from "../screens/Camera";
import { EventRegister } from "react-native-event-listeners";
import { useTranslation } from "react-i18next";
const Tab = createBottomTabNavigator();

export const BottomMenus = (propss: any) => {
  const { colors } = useTheme();
  const { t } = useTranslation()

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: styles.tabBar,
        headerShown: false,
       
      }}
      initialRouteName="Home"
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel:t("home"),
          tabBarLabelStyle: styles.tabBarLabelStyle,
          tabBarIcon: ({ focused }: any) => (
            <View
              style={[
                styles.iconContainer,
                { backgroundColor: focused ? "#EDF1F4" : "transparent" },
              ]}
            >
              <Image
                style={[
                  styles.ImgStyle,
                  {
                    tintColor: focused
                      ? Screens.colors.primary
                      : colors.background,
                  },
                ]}
                source={LocalImages.homeImage}
              />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Documents"
        component={DocumentScreen}
     
        listeners={({ navigation }) => ({
          blur: () => navigation.setParams({ category:undefined }),
        })}
        initialParams={{category:undefined}}
        options={{
          tabBarLabel:t("document"),
          unmountOnBlur: true,
          tabBarLabelStyle: styles.tabBarLabelStyle,
          tabBarIcon: ({ focused }: any) => (
            <View
              style={[
                styles.iconContainer,
                { backgroundColor: focused ? "#EDF1F4" : "transparent" },
              ]}
            >
              <Image
                style={[
                  styles.ImgStyle,
                  {
                    tintColor: focused
                      ? Screens.colors.primary
                      : colors.background,
                  },
                ]}
                source={LocalImages.documentpic}
              />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Camera"
        component={CameraScreen}
        options={{
          tabBarLabel:t("camera"),
          unmountOnBlur: true,
          tabBarLabelStyle: {
            color: "transparent",
          },

          tabBarIcon: () => (
            <View style={{ overflow: "hidden", paddingTop: 5 }}>
              <View style={styles.circle}>
                <LinearGradients
                  horizontalGradient
                  endColor={"#3393e2"}
                  middleColor={"#7036f8"}
                  startColor={"#801ffe"}
                  style={[styles.Innercircle]}
                >
                  <Image
                    style={styles.ImgStyle}
                    source={LocalImages.scanImage}
                  />
                </LinearGradients>
              </View>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="History"
        component={HistoryScreen}
        options={{
          tabBarLabel:t("history"),
          tabBarLabelStyle: styles.tabBarLabelStyle,
     

          tabBarIcon: ({ focused }: any) => (
            <View
              style={[
                styles.iconContainer,
                {
                  backgroundColor: focused
                    ? Screens.colors.bottomFocusedBackground.color
                    : "transparent",
                },
              ]}
            >
              <Image
                style={[
                  styles.ImgStyle,
                  {
                    tintColor: focused
                      ? Screens.colors.primary
                      : colors.background,
                  },
                ]}
                source={LocalImages.historyImage}
              />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="More"
        component={PaymentScreen}
      
        options={{
          tabBarLabel:'More',
          tabBarLabelStyle: styles.tabBarLabelStyle,
          tabBarButton: (props) => (
            <TouchableOpacity
              {...props}
              onPress={() => {
                EventRegister.emit("OpenDrawer");
              }}
            />
          ),

          tabBarIcon: ({ focused }: any) => (
            <View
              style={[
                styles.iconContainer,
                { backgroundColor: focused ? "#EDF1F4" : "transparent" },
              ]}
            >
              <Image
                style={[
                  styles.ImgStyle,
                  {
                    tintColor: focused
                      ? Screens.colors.primary
                      : colors.background,
                  },
                ]}
                source={LocalImages.moreImage}
              />
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  circle: {
    marginBottom: 20,
    backgroundColor: "#fff",
    width: 70,
    height: 80,
    borderRadius: (70 + 80) / 2,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "gray",
  },
  Innercircle: {
    elevation: 10,
    shadowColor: "gray",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 15,
    width: 68,
    height: 70,
    borderRadius: (68 + 70) / 2,
    justifyContent: "center",
    alignItems: "center",
  },
  tabBar: {
    position: "absolute",
    zIndex: 100,
    height: 75,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
  },
  iconContainer: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 3,
  },
  ImgStyle: {
    width: 25,
    tintColor: "#fff",
    height: 25,
    resizeMode: "contain",
  },
  tabBarLabelStyle: {
    fontWeight: "900",
  },
});
function alert(arg0: number): void {
  throw new Error("Function not implemented.");
}
