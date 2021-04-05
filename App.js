import React from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "./Screens/Home";
import MyBikeScreen from "./Screens/MyBike";
import MyProfileScreen from "./Screens/MyProfile";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native-gesture-handler";

const Tab = createBottomTabNavigator();
const orangeColor = "#F2AA4CFF";
const darkOrangeColor = "#CC5500";
const blackColor = "#101820FF";

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRoutName="Home"
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            let inactivColor = orangeColor;
            let acitveColor = darkOrangeColor;

            if (route.name === "Home") {
              iconName = "home-outline";
              color = focused ? acitveColor : inactivColor;
            } else if (route.name === "MyBike") {
              iconName = "bicycle-outline";
              color = focused ? acitveColor : inactivColor;
            } else if (route.name === "MyProfile") {
              iconName = "person-outline";
              color = focused ? acitveColor : inactivColor;
            }
            return (
              <TouchableOpacity activeOpacity={0.3}>
                <Ionicons
                  name={iconName}
                  size={size}
                  color={color}
                  style={{
                    borderBottomWidth: 1,
                    borderBottomColor: focused ? acitveColor : blackColor,
                  }}
                />
              </TouchableOpacity>
            );
          },
          tabBarShowLabel: false,
          headerTintColor: orangeColor,
          headerTitleAlign: "center",
          headerStyle: {
            backgroundColor: blackColor,
          },
          tabBarStyle: {
            backgroundColor: blackColor,
            borderTopColor: "transparent",
          },
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="MyBike" component={MyBikeScreen} />
        <Tab.Screen name="MyProfile" component={MyProfileScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
