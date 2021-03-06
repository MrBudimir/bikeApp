import React, { Component } from "react";
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import Message from "../../components/Message";
import axios from "axios";
import { BASE_URL, BASE_USER, LOGIN, USER_DATA_KEY } from "../../constants";
import DeviceStorage from "../../storage/DeviceStorage";
import RoundButton from "../../components/RoundButton";

class Login extends Component {
  state = {
    enteredEmail: "",
    enteredPassword: "",
  };
  storage = new DeviceStorage();
  message = new Message();

  async componentDidMount() {
    let user = await this.storage.fetchData(USER_DATA_KEY);
    if (user) {
      this.setState({
        enteredEmail: user.email,
        enteredPassword: user.password,
      });
      this.login();
    }
  }

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
          this.message.wrongLoginData();
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
          <RoundButton
            text="LOGIN"
            onPress={() => this.login()}
            disabled={!this.state.enteredEmail || !this.state.enteredPassword}
          />
        </View>
        <View style={styles.signupButton}>
          <Text style={{ color: "white", fontSize: 18 }}>New User? </Text>
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate("signup")}
          >
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
  signupButton: {
    flex: 1,
    justifyContent: "center",
    flexDirection: "row",
    marginTop: 15,
  },
  buttonText: {
    fontWeight: "bold",
    fontSize: 18,
  },
});

export default Login;
