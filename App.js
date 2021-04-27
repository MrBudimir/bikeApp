import React, {Component} from "react";
import {NavigationContainer} from "@react-navigation/native";
import StackNavigator from "./navigation/StackNavigator";
import FlashMessage from "react-native-flash-message";
import {View} from "react-native";

class App extends Component {
    render() {
        return (
            <NavigationContainer>
                <StackNavigator/>
                <FlashMessage position="top" />
            </NavigationContainer>
        );
    }
}

export default App;
