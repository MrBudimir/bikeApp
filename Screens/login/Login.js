import React, {Component} from "react";
import {
    Button,
    Text,
    View,
    StyleSheet,
    TextInput,
    Dimensions,
    TouchableOpacity,
} from "react-native";

class Login extends Component {
    render() {
        return (
            <View style={styles.screen}>
                <View style={styles.login}>
                    <Text style={styles.title}>Rent Bike App</Text>
                    <TextInput
                        placeholder="Email"
                        placeholderTextColor="white"
                        style={styles.textInput}
                    />
                    <TextInput
                        placeholder="Password"
                        placeholderTextColor="white"
                        style={styles.textInput}
                    />
                    <TouchableOpacity
                        style={styles.loginButton}
                        onPress={() => this.props.navigation.navigate("tabNavigator")}
                    >
                        <Text
                            style={{color: "#101820FF", fontWeight: "bold", fontSize: 18}}
                        >
                            LOGIN
                        </Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.signupButton}>
                    <Text style={{color: "white", fontSize: 18}}>New User? </Text>
                    <TouchableOpacity>
                        <Text
                            style={{color: "#F2AA4CFF", fontWeight: "bold", fontSize: 18}}
                        >
                            SIGN UP
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: "#101820FF",
        alignItems: "center",
        justifyContent: "center",
    },
    login: {width: "85%"},
    title: {
        fontSize: 42,
        color: "#F2AA4CFF",
        marginBottom: 25,
        alignSelf: "center",
    },
    textInput: {
        backgroundColor: "#25384A",
        height: 60,
        borderRadius: 15,
        marginVertical: 10,
        textAlign: "center",
        color: "white",
        fontSize: 18,
    },
    loginButton: {
        backgroundColor: "#F2AA4CFF",
        borderRadius: 25,
        height: 60,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 25,
    },
    signupButton: {
        position: "absolute",
        bottom: 0,
        flexDirection: "row",
        marginBottom: 35,
    },
    buttonText: {
        fontWeight: "bold",
        fontSize: 18,
    },
});

export default Login;
