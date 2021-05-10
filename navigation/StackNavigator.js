import React, { Component } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import TabNavigator from "./TabNavigator";
import Login from "../Screens/login/Login";
import Registration from "../Screens/login/Registration";
import TextButton from "../components/TextButton";

const Stack = createStackNavigator();

class StackNavigator extends Component {
  render() {
    return (
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="login" component={Login} />
        <Stack.Screen name="signup" component={Registration} />
        <Stack.Screen name="tabNavigator" component={TabNavigator} />
      </Stack.Navigator>
    );
  }
}

export default StackNavigator;
