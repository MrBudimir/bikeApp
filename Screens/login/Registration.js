import React, { Component } from "react";
import { View, StyleSheet, TextInput, Text } from "react-native";
import TextButton from "../../components/TextButton";
import ValidationComponent from "react-native-form-validator";
import RoundButton from "../../components/RoundButton";
import Message from "../../components/Message";
import { BASE_URL, BASE_USER, REGISTER } from "../../constants";
import axios from "axios";

class Registration extends ValidationComponent {
  state = {
    enteredFirstName: "",
    enteredLastName: "",
    enteredEmail: "",
    enteredPassword: "",
    isEmailInError: false,
    isPasswordInError: false,
    isFirstNameInError: false,
    isLastNameInError: false,
  };
  fieldLabels = {
    enteredFirstName: "First Name",
    enteredLastName: "Last Name",
    enteredEmail: "E-Mail",
    enteredPassword: "Password",
  };
  message = new Message();

  signup = () => {
    this.labels = this.fieldLabels;
    this.validate({
      enteredFirstName: { required: true },
      enteredLastName: { required: true },
      enteredEmail: { email: true, required: true },
      enteredPassword: { required: true, minlength: 8 },
    });

    this.styleValidation();

    if (this.isFormValid()) {
      const url = BASE_URL + BASE_USER + REGISTER;

      const params = {
        params: {
          firstName: this.state.enteredFirstName,
          lastName: this.state.enteredLastName,
          email: this.state.enteredEmail,
          password: this.state.enteredPassword,
        },
      };

      axios
        .post(url, null, params)
        .then((res) => {
          console.log(res);
          if (res.data) {
            this.message.successMessage(
              "Signed Up",
              "You have successfuly registrate!"
            );
            this.props.navigation.navigate("login");
          } else {
            this.message.failMessage(
              "E-Mail Exists",
              "The entered E-Mail already exists"
            );
          }
        })
        .catch((err) => console.log(err));
    } else {
      this.message.failSignupMessage("Wrong Input!", this.getErrorMessages());
    }
  };

  styleError = (isInError) => {
    if (isInError) {
      return {
        borderLeftColor: "red",
        borderLeftWidth: 20,
      };
    } else {
      return {
        borderLeftColor: "transparent",
        borderLeftWidth: 0,
      };
    }
  };

  styleValidation = () => {
    this.setState({
      isFirstNameInError: this.isFieldInError("enteredFirstName"),
      isLastNameInError: this.isFieldInError("enteredLastName"),
      isEmailInError: this.isFieldInError("enteredEmail"),
      isPasswordInError: this.isFieldInError("enteredPassword"),
    });
  };

  render() {
    return (
      <View style={styles.screen}>
        <View style={styles.backButton}>
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
              ref="firstName"
              style={[
                styles.nameTextInput,
                this.styleError(this.state.isFirstNameInError),
              ]}
              placeholderTextColor="white"
              placeholder="First Name"
              textContentType="givenName"
              onChangeText={(firstName) =>
                this.setState({ enteredFirstName: firstName })
              }
              value={this.state.enteredFirstName}
            />
            <TextInput
              ref="lastName"
              style={[
                styles.nameTextInput,
                this.styleError(this.state.isLastNameInError),
              ]}
              placeholderTextColor="white"
              placeholder="Last Name"
              textContentType="familyName"
              onChangeText={(lastName) =>
                this.setState({ enteredLastName: lastName })
              }
              value={this.state.enteredLastName}
            />
          </View>
          <TextInput
            ref="email"
            style={[
              styles.textInput,
              this.styleError(this.state.isEmailInError),
            ]}
            placeholderTextColor="white"
            placeholder="E-Mail"
            textContentType="emailAddress"
            onChangeText={(email) => this.setState({ enteredEmail: email })}
            value={this.state.enteredEmail}
          />
          <TextInput
            ref="password"
            style={[
              styles.textInput,
              this.styleError(this.state.isPasswordInError),
            ]}
            placeholderTextColor="white"
            placeholder="Password"
            textContentType="newPassword"
            onChangeText={(password) =>
              this.setState({ enteredPassword: password })
            }
            secureTextEntry={true}
            value={this.state.enteredPassword}
          />
          <RoundButton text="SIGN UP" onPress={() => this.signup()} />
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
  },
  backButton: {
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
});

export default Registration;
