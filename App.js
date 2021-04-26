import React, {Component} from "react";
import {NavigationContainer} from "@react-navigation/native";
import StackNavigator from "./navigation/StackNavigator";

class App extends Component {
    render() {
        return (
            <NavigationContainer>
                <StackNavigator/>
            </NavigationContainer>
        );
    }
}

export default App;
