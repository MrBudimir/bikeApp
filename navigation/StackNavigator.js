import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import TabNavigator from "./TabNavigator";
import Login from "../Screens/login/Login";

const Stack = createStackNavigator();

const StackNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="login" component={Login}></Stack.Screen>
      <Stack.Screen name="test" component={TabNavigator}></Stack.Screen>
    </Stack.Navigator>
  );
};

export default StackNavigator;
