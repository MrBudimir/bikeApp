import {
  View,
  Text,
  StyleSheet,
  AppState,
  TextInput,
  ScrollView,
} from "react-native";
import React, { Component } from "react";
import axios from "axios";
import ConfirmSavePopup from "../components/ConfirmSavePopup";
import {
  BASE_URL,
  BASE_USER,
  GET_USER,
  USER_DATA_KEY,
  USER_EDIT,
} from "../constants";
import DeviceStorage from "../storage/DeviceStorage";
import Message from "../components/Message";
import TextButton from "../components/TextButton";
import InfoField from "../components/InfoField";
import InvoiceHistory from "../components/InvoiceHisotry";
import RoundButton from "../components/RoundButton";

class MyProfile extends Component {
  userFromStorage = null;
  state = {
    user: {
      firstName: null,
      lastName: null,
      email: null,
      password: null,
    },
    newFirstName: null,
    newLastName: null,
    newEmail: null,
    newPassword: null,
    appState: AppState.currentState,
    editView: false,
    showPopup: false,
    showInvoiceHistory: false,
  };
  storage = new DeviceStorage();
  message = new Message();

  constructor() {
    super();
  }

  async componentDidMount() {
    this.userFromStorage = await this.storage.fetchData(USER_DATA_KEY);
    await this._handleGettingBackOnline();

    this.props.navigation.addListener("focus", () => {
      this._handleGettingBackOnline();
    });

    AppState.addEventListener("change", this._handleAppStateChange);
  }

  async componentWillUnmount() {
    if (this.props.navigation.event) {
      this.props.navigation.removeEventListener("focus", () => {
        this._handleGettingBackOnline();
      });
    }

    AppState.removeEventListener("change", this._handleAppStateChange);
  }

  _handleAppStateChange = (nextAppState) => {
    if (
      this.state.appState.match(/inactive|background/) &&
      nextAppState === "active"
    ) {
      console.log("PROFILE: coming from background");
      this._handleGettingBackOnline().then((r) => console.log("unbound"));
      this.getCurrentUser(this.email);
    }

    this.setState({ appState: nextAppState });
  };

  async _handleGettingBackOnline() {
    this.getCurrentUser();
    this.userFromStorage = await this.storage.fetchData(USER_DATA_KEY);
    if (this.userFromStorage.requestNeeded) {
      this.handleSave({
        params: {
          firstName: this.userFromStorage.firstName,
          lastName: this.userFromStorage.lastName,
          password: this.userFromStorage.password,
          email: this.userFromStorage.email,
        },
      });
    }
  }

  getCurrentUser() {
    const url = BASE_URL + BASE_USER + GET_USER;

    const params = {
      params: {
        email: this.userFromStorage.email,
      },
    };

    axios
      .get(url, params)
      .then((user) => {
        let currentUser = user.data;
        if (currentUser) {
          this.setState({
            user: currentUser,
          });
        }
      })
      .catch((err) => {
        console.log("Can't get user", err);
        this.setState({
          user: this.userFromStorage,
        });
      });
  }

  handleSave(paramsFromFailedRequest) {
    if (paramsFromFailedRequest) {
      this.save(paramsFromFailedRequest);
    } else {
      const params = {
        params: {
          email: this.state.newEmail
            ? this.state.newEmail
            : this.state.user.email,
          password: this.state.newPassword
            ? this.state.newPassword
            : this.state.user.password,
          lastName: this.state.newLastName
            ? this.state.newLastName
            : this.state.user.lastName,
          firstName: this.state.newFirstName
            ? this.state.newFirstName
            : this.state.user.firstName,
        },
      };
      this.save(params);
    }
  }

  save(params) {
    const url = BASE_URL + BASE_USER + USER_EDIT;

    axios
      .post(url, null, params)
      .then((response) => {
        if (response.data) {
          this.setState({
            editView: false,
            user: {
              password: response.data.password,
              lastName: response.data.lastName,
              firstName: response.data.firstName,
              email: response.data.email,
              requestNeeded: false,
            },
          });
          this.message.successfullySaved();
          this.storage.storeData(USER_DATA_KEY, this.state.user);
        }
      })
      .catch((err) => {
        console.log("Cant save user", err);

        if (!this.userFromStorage.requestNeeded) {
          this.userFromStorage.firstName = params.params.firstName;
          this.userFromStorage.lastName = params.params.lastName;
          this.userFromStorage.password = params.params.password;
          this.userFromStorage.email = params.params.email;
          this.userFromStorage.requestNeeded = true;
          this.setState({
            user: this.userFromStorage,
          });
          this.storage
            .storeData(USER_DATA_KEY, this.userFromStorage)
            .then((r) => console.log("stored to storage"));
        }
        this.setState({
          editView: false,
        });
      });

    this.closePopup();
  }

  closePopup = () => {
    this.setState({ showPopup: false });
  };

  render() {
    if (!this.state.editView) {
      return (
        <View style={styles.screen}>
          <TextButton
            onPress={() => this.setState({ editView: true })}
            text="Edit Profile"
            style={styles.editButton}
          />
          <View>
            <InfoField
              header="First Name"
              text={this.state.user ? this.state.user.firstName : ""}
            />
            <InfoField
              header="Last Name"
              text={this.state.user ? this.state.user.lastName : ""}
            />
            <InfoField
              header="E-Mail"
              text={this.state.user ? this.state.user.email : ""}
            />
            <View style={styles.invoiceView}>
              <Text style={styles.formHeader}>History Invoices</Text>
              <TextButton
                text="Show"
                onPress={() => this.setState({ showInvoiceHistory: true })}
              />
            </View>
          </View>
          <View style={styles.logoutView}>
            <TextButton
              text="Logout"
              onPress={() => this.props.navigation.navigate("login")}
            />
          </View>
          <InvoiceHistory
            data={this.state.user.invoices}
            visible={this.state.showInvoiceHistory}
            onExitPress={() => this.setState({ showInvoiceHistory: false })}
          />
        </View>
      );
    } else {
      return (
        <View style={styles.screen}>
          <View style={styles.backButton}>
            <TextButton
              text="Cancel"
              onPress={() => this.setState({ editView: false })}
              icon="close-outline"
            />
          </View>
          <ConfirmSavePopup
            visible={this.state.showPopup}
            onCancelPopup={this.closePopup}
            password={this.state.user.password}
            onConfirmPopup={() => this.handleSave(null)}
          />
          <ScrollView style={styles.editView}>
            <Text style={styles.formHeader}>First Name</Text>
            <TextInput
              ref="First Name"
              style={styles.textInput}
              placeholderTextColor="white"
              placeholder="First Name"
              textContentType="givenName"
              onChangeText={(newFirstName) =>
                this.setState({ newFirstName: newFirstName })
              }
            >
              {this.state.user ? this.state.user.firstName : ""}
            </TextInput>

            <Text style={styles.formHeader}>Last Name</Text>
            <TextInput
              ref="Last Name"
              style={styles.textInput}
              placeholderTextColor="white"
              placeholder="Last Name"
              textContentType="givenName"
              onChangeText={(newLastName) =>
                this.setState({ newLastName: newLastName })
              }
            >
              {this.state.user ? this.state.user.lastName : ""}
            </TextInput>

            <Text style={styles.formHeader}>E-Mail</Text>
            <TextInput
              ref="E-Mail"
              editable={false}
              style={styles.textInputDisabled}
              placeholderTextColor="white"
              placeholder="E-Mail"
              textContentType="emailAddress"
              onChangeText={(newEmail) => this.setState({ newEmail: newEmail })}
            >
              {this.state.user ? this.state.user.email : ""}
            </TextInput>

            <Text style={styles.formHeader}>Password</Text>
            <TextInput
              ref="password"
              secureTextEntry={true}
              style={styles.textInput}
              placeholderTextColor="white"
              placeholder="Password"
              textContentType="newPassword"
              onChangeText={(newPassword) =>
                this.setState({ newPassword: newPassword })
              }
            >
              {this.state.user ? this.state.user.password : ""}
            </TextInput>
          </ScrollView>
          <View style={{ marginBottom: 15, marginHorizontal: "5%" }}>
            <RoundButton
              text="Save"
              onPress={() => this.setState({ showPopup: true })}
            />
          </View>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    height: "100%",
    backgroundColor: "#101820FF",
  },
  formHeader: {
    color: "#F2AA4CFF",
    fontSize: 18,
  },
  logoutView: {
    flexDirection: "row",
    alignSelf: "center",
    position: "absolute",
    bottom: 0,
    marginBottom: 35,
  },
  editViewButton: {
    width: "50%",
    alignItems: "center",
    alignSelf: "flex-end",
    marginTop: 25,
    marginRight: "5%",
  },
  editButton: {
    marginTop: 15,
    alignSelf: "flex-end",
    marginRight: "5%",
  },
  button50: {
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    width: "50%",
    height: 55,
  },
  editView: {
    overflow: "scroll",
    backgroundColor: "#101820FF",
    marginHorizontal: "5%",
  },
  saveButton: {
    backgroundColor: "#2947cb",
  },
  cancelButton: {
    backgroundColor: "#f10707",
  },
  saveView: {
    height: "10%",
    alignItems: "center",
    justifyContent: "flex-end",
    flexDirection: "row",
  },
  invoiceView: {
    flexDirection: "row",
    marginHorizontal: "5%",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 15,
  },
  textInput: {
    backgroundColor: "#25384A",
    height: 55,
    borderRadius: 15,
    color: "white",
    fontSize: 18,
    textAlign: "left",
    marginVertical: 10,
    paddingLeft: 8,
    paddingRight: 8,
  },
  textInputDisabled: {
    backgroundColor: "#25384A",
    opacity: 0.5,
    height: 60,
    borderRadius: 15,
    color: "white",
    fontSize: 18,
    paddingLeft: 8,
    paddingRight: 8,
    marginVertical: 10,
  },
  backButton: {
    position: "relative",
    marginTop: 15,
    alignSelf: "flex-end",
    marginRight: "5%",
  },
});

export default MyProfile;
