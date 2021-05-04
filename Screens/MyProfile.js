import {
  View,
  Text,
  StyleSheet,
  AppState,
  TouchableOpacity,
  TextInput,
  ScrollView,
  FlatList,
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

  formatDate(dateString) {
    if (dateString) {
      let dateObject = Date.parse(dateString);
      this.options = {
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        day: "numeric",
        month: "numeric",
        year: "numeric",
        timeZone: "UTC",
        timeZoneName: "short",
      };
      return new Intl.DateTimeFormat("de-DE", this.options).format(dateObject);
    } else {
      return "rent is ended";
    }
  }

  render() {
    if (!this.state.editView) {
      return (
        <ScrollView style={styles.screen}>
          <View>
            <View style={styles.infoView}>
              <Text style={styles.formHeader}>First Name</Text>
              <Text style={styles.formContent}>
                {this.state.user ? this.state.user.firstName : ""}
              </Text>
            </View>
            <View style={styles.infoView}>
              <Text style={styles.formHeader}>Last Name</Text>
              <Text style={styles.formContent}>
                {this.state.user ? this.state.user.lastName : ""}
              </Text>
            </View>
            <View style={styles.infoView}>
              <Text style={styles.formHeader}>Email</Text>
              <Text style={styles.formContent}>
                {this.state.user ? this.state.user.email : ""}
              </Text>
            </View>
          </View>
          <View style={styles.editViewButton}>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() =>
                this.setState({
                  editView: true,
                })
              }
            >
              <Text style={styles.buttonText}>Edit Profile</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.invoiceHistory}>
            <Text style={styles.formHeader}>Invoice History</Text>
            <View style={styles.listItemContainer}>
              <FlatList
                data={this.state.user.invoices}
                renderItem={({ item }) => (
                  <Text style={styles.listItem}>
                    {this.formatDate(item.startDate)}until{" "}
                    {this.formatDate(item.endDate)}- {item.ebike.model}
                  </Text>
                )}
              />
            </View>
          </View>
          <View style={styles.logoutView}>
            <TouchableOpacity
              style={styles.logoutButton}
              onPress={() => this.props.navigation.navigate("login")}
            >
              <Text style={styles.buttonText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      );
    } else {
      return (
        <View styles={styles.screen}>
          <ConfirmSavePopup
            visible={this.state.showPopup}
            onCancelPopup={this.closePopup}
            password={this.state.user.password}
            onConfirmPopup={() => this.handleSave(null)}
          />
          <ScrollView style={styles.editView}>
            <Text style={styles.formHeader}>First Name</Text>
            <TextInput
              style={styles.input}
              onChangeText={(newFirstName) =>
                this.setState({
                  newFirstName: newFirstName,
                })
              }
            >
              {this.state.user ? this.state.user.firstName : ""}
            </TextInput>
            <Text style={styles.formHeader}>Last Name</Text>
            <TextInput
              style={styles.input}
              onChangeText={(newLastName) =>
                this.setState({
                  newLastName: newLastName,
                })
              }
            >
              {this.state.user ? this.state.user.lastName : ""}
            </TextInput>
            <Text style={styles.formHeader}>Email</Text>
            <TextInput
              style={styles.input}
              editable={false}
              onChangeText={(newEmail) =>
                this.setState({
                  newEmail: newEmail,
                })
              }
            >
              {this.state.user ? this.state.user.email : ""}
            </TextInput>
            <Text style={styles.formHeader}>Password</Text>
            <TextInput
              secureTextEntry={true}
              style={styles.input}
              onChangeText={(newPassword) =>
                this.setState({
                  newPassword: newPassword,
                })
              }
            >
              {this.state.user ? this.state.user.password : ""}
            </TextInput>
          </ScrollView>
          <View style={styles.saveView}>
            <TouchableOpacity
              style={[styles.saveButton, styles.button50]}
              onPress={() => this.setState({ showPopup: true })}
            >
              <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.cancelButton, styles.button50]}
              onPress={() => this.setState({ editView: false })}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#101820FF",
  },
  formHeader: {
    marginTop: 25,
    color: "#F2AA4CFF",
    fontSize: 16,
  },
  formContent: {
    marginVertical: 25,
    borderRadius: 3,
    color: "white",
    fontSize: 20,
  },
  infoView: {
    borderBottomWidth: 1,
    borderColor: "#F2AA4CFF",
    borderRadius: 2,
    marginHorizontal: "5%",
  },
  logoutView: {
    marginTop: 25,
    alignItems: "center",
    justifyContent: "flex-end",
    flexDirection: "row",
  },
  logoutButton: {
    alignSelf: "center",
    borderColor: "#000000",
    backgroundColor: "#f10707",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: 55,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  editViewButton: {
    width: "50%",
    alignItems: "center",
    alignSelf: "flex-end",
    marginTop: 25,
    marginRight: "5%",
  },
  editButton: {
    borderRadius: 15,
    height: 55,
    alignSelf: "center",
    backgroundColor: "#2947cb",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    marginRight: 5,
  },
  button50: {
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    width: "50%",
    height: 55,
  },
  editView: {
    height: "80%",
    overflow: "scroll",
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
  input: {
    margin: 15,
    height: 40,
    padding: 10,
    borderColor: "#000000",
    borderWidth: 1,
    borderRadius: 15,
  },
  listItem: {
    fontSize: 16,
    marginTop: 10,
    height: "auto",
    color: "white",
    backgroundColor: "#25384A",
  },
  listItemContainer: {
    height: "100%",
  },
  invoiceHistory: {
    marginTop: 25,
    marginHorizontal: "5%",
    height: 250,
    marginBottom: 50,
  },
});

export default MyProfile;
