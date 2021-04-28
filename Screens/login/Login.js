import React, { Component } from "react";
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import FlashMessage, { showMessage } from "react-native-flash-message";
import axios from "axios";
import { AsyncStorage } from "react-native";
import { BASE_URL, BASE_USER, LOGIN, USER_DATA_KEY } from "../../constants";
import DeviceStorage from "../../storage/DeviceStorage";

class Login extends Component {
  state = {
    enteredEmail: "PetraMeier@gmail.com",
    enteredPassword: "testPw",
  };
  storage = new DeviceStorage();

  wrongLoginData = () => {
    showMessage({
      message: "Login Failed",
      type: "danger",
      icon: "danger",
      description: "Wrong E-mail or Password!",
    });
  };

  login = () => {
    const url = BASE_URL + BASE_USER + LOGIN;

    const params = {
      params: {
        email: this.state.enteredEmail,
        password: this.state.enteredPassword,
      },
    };

    axios
      .get(url, params)
      .then((response) => {
        if (!response.data) {
          this.wrongLoginData();
        } else {
          this.storage.storeData(USER_DATA_KEY, response.data);
          this.props.navigation.navigate("tabNavigator");
        }
      })
      .catch((err) => console.log(err));
  };

  render() {
    return (
      <View style={styles.screen}>
        <View style={styles.login}>
          <Text style={styles.title}>Rent Bike App</Text>
          <TextInput
            placeholder="Email"
            placeholderTextColor="white"
            style={styles.textInput}
            textContentType="emailAddress"
            onChangeText={(enteredEmail) =>
              this.setState({
                enteredEmail: enteredEmail,
              })
            }
            value={this.state.enteredEmail}
            onSubmitEditing={() => this.secondInput.focus()}
          />
          <TextInput
            placeholder="Password"
            placeholderTextColor="white"
            style={styles.textInput}
            textContentType="password"
            onChangeText={(enteredPassword) =>
              this.setState({
                enteredPassword: enteredPassword,
              })
            }
            value={this.state.enteredPassword}
            pas
            ref={(input) => (this.secondInput = input)}
            secureTextEntry={true}
          />
          <TouchableOpacity
            style={
              !this.state.enteredEmail || !this.state.enteredPassword
                ? styles.loginButtonDisabled
                : styles.loginButton
            }
            onPress={() => this.login()}
            disabled={!this.state.enteredEmail && !this.state.enteredPassword}
          >
            <Text
              style={{ color: "#101820FF", fontWeight: "bold", fontSize: 18 }}
            >
              LOGIN
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.signupButton}>
          <Text style={{ color: "white", fontSize: 18 }}>New User? </Text>
          <TouchableOpacity>
            <Text
              style={{ color: "#F2AA4CFF", fontWeight: "bold", fontSize: 18 }}
            >
              SIGN UP
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#101820FF",
    alignItems: "center",
  },
  login: { width: "85%", marginTop: "20%" },
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
  loginButtonDisabled: {
    opacity: 0.7,
    backgroundColor: "#EBEBE4",
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
