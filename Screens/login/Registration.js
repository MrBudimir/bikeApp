import React, { Component } from "react";
import { View, StyleSheet, TextInput, Text } from "react-native";
import TextButton from "../../components/TextButton";

class Registration extends Component {
  state = {
    enteredEmail: "PetraMeier@gmail.com",
    enteredPassword: "1234",
  };
  render() {
    return (
      <View style={styles.screen}>
        <View style={styles.button}>
          <TextButton
            text="Back"
            onPress={() => this.props.navigation.navigate("login")}
            icon="arrow-back-outline"
          />
        </View>
        <View style={styles.signupView}>
          <Text style={styles.title}>Sign Up</Text>
          <View style={styles.name}>
            <TextInput
              style={styles.nameTextInput}
              placeholderTextColor="white"
              placeholder="First Name"
              textContentType="givenName"
            />
            <TextInput
              style={styles.nameTextInput}
              placeholderTextColor="white"
              placeholder="Family Name"
              textContentType="familyName"
            />
          </View>
          <TextInput
            style={styles.textInput}
            placeholderTextColor="white"
            placeholder="E-Mail"
            textContentType="emailAddress"
          />
          <TextInput
            style={styles.textInput}
            placeholderTextColor="white"
            placeholder="Password"
            textContentType="newPassword"
            passwordRules
          />
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
  title: {
    fontSize: 40,
    color: "#F2AA4CFF",
    alignSelf: "center",
    marginBottom: 25,
  },
  signupView: { width: "85%", marginTop: "15%" },
  textInput: {
    backgroundColor: "#25384A",
    height: 60,
    borderRadius: 15,
    textAlign: "center",
    color: "white",
    fontSize: 18,
    marginVertical: 10,
    borderLeftWidth: 20,
    borderLeftColor: "red",
  },
  button: {
    marginTop: 30,
    position: "absolute",
    marginLeft: 25,
    left: 0,
  },
  name: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  nameTextInput: {
    backgroundColor: "#25384A",
    height: 60,
    borderRadius: 15,
    textAlign: "center",
    color: "white",
    fontSize: 18,
    marginVertical: 10,
    minWidth: 152,
  },
  loginButton: {
    backgroundColor: "#F2AA4CFF",
    borderRadius: 25,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 25,
  },
});

export default Registration;
