import React, {Component} from "react";
import { createStackNavigator } from "@react-navigation/stack";
import TabNavigator from "./TabNavigator";
import Login from "../Screens/login/Login";

const Stack = createStackNavigator();

class StackNavigator extends Component{
    render() {
        return(
            <Stack.Navigator
                screenOptions={{
                    headerShown: false,
                }}
            >
                <Stack.Screen name="login" component={Login}/>
                <Stack.Screen name="tabNavigator" component={TabNavigator}/>
            </Stack.Navigator>
        );
    }
}

export default StackNavigator;
