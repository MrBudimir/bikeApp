import {
    View,
    Text,
    StyleSheet,
    AppState,
    TouchableOpacity,
    TextInput,
    ScrollView,
} from "react-native";
import React, {Component} from "react";
import axios from "axios";
import ConfirmSavePopup from "../components/ConfirmSavePopup";
import {AsyncStorage} from "react-native";
import {BASE_URL, BASE_USER, GET_USER, USER_EDIT} from "../constants";

class MyProfile extends Component {

    email = null
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
        showPopup: false
    };

    constructor() {
        super();
    }

    async componentDidMount() {
        this.email = await this.getUserData();
        this.getCurrentUser(this.email);

        this.props.navigation.addListener("focus", () => {
            this.getCurrentUser(this.email);
        });

        AppState.addEventListener("change", this._handleAppStateChange);
    }

    getUserData = async () => {
        try {
            let userData = await AsyncStorage.getItem("userData");
            let data = JSON.parse(userData);
            return data.email
        } catch (err) {
            console.log("Get Token", err);
        }
    };

    componentWillUnmount() {
        if (this.props.navigation.event) {
            this.props.navigation.removeEventListener("focus", () => {
                this.getCurrentUser(this.email);
            });
        }

        AppState.removeEventListener("change", this._handleAppStateChange);
    }

    _handleAppStateChange = (nextAppState) => {
        if (
            this.state.appState.match(/inactive|background/) &&
            nextAppState === "active"
        ) {
            console.log('PROFILE: coming from background')
            this.getCurrentUser(this.email);
        }

        this.setState({appState: nextAppState});
    };

    getCurrentUser(emailOfUser) {
        // this.props.navigation.navigate('MyBike')
        const url = BASE_URL + BASE_USER + GET_USER;

        const params = {
            params: {
                email: emailOfUser,
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
            .catch((err) => console.log(err));
    }

    save() {
        const url = BASE_URL + BASE_USER + USER_EDIT

        const params = {
            params: {
                email: this.state.newEmail ? this.state.newEmail : this.state.user.email,
                password: this.state.newPassword ? this.state.newPassword : this.state.user.password,
                lastName: this.state.newLastName ? this.state.newLastName : this.state.user.lastName,
                firstName: this.state.newFirstName ? this.state.newFirstName : this.state.user.firstName
            },
        };

        axios.post(url, null, params)
            .then((response) => {
                if (response.data) {
                    console.log(response.data)
                    this.setState({
                        editView: false,
                        user: {
                            password: response.data.password,
                            lastName: response.data.lastName,
                            firstName: response.data.firstName,
                            email: response.data.email
                        }
                    });
                } else {
                    console.log("Save user was not successfully")
                }
            }).catch((err) => console.log(err));

        this.closePopup()

    //    TODO if not saved persist in Async and save again if navigate to here...have to push backend to work

    }

    closePopup = () => {
        this.setState({showPopup: false});
    };

    render() {
        if (!this.state.editView) {
            return (
                <View style={styles.screen}>
                    <View>
                        <Text style={styles.formHeader}>First Name</Text>
                        <Text style={styles.formContent}>
                            {this.state.user ? this.state.user.firstName : ""}
                        </Text>
                        <Text style={styles.formHeader}>Last Name</Text>
                        <Text style={styles.formContent}>
                            {this.state.user ? this.state.user.lastName : ""}
                        </Text>
                        <Text style={styles.formHeader}>Email</Text>
                        <Text style={styles.formContent}>
                            {this.state.user ? this.state.user.email : ""}
                        </Text>
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
                    <View style={styles.logoutView}>
                        <TouchableOpacity
                            style={styles.logoutButton}
                            onPress={() => this.props.navigation.navigate("login")}
                        >
                            <Text style={styles.buttonText}>Logout</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            );
        } else {
            return (
                <View styles={styles.screen}>
                    <ConfirmSavePopup visible={this.state.showPopup}
                                      onCancelPopup={this.closePopup}
                                      password={this.state.user.password}
                                      onConfirmPopup={() => this.save()}
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
                            onPress={() => this.setState({showPopup: true})}
                        >
                            <Text style={styles.buttonText}>Save</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.cancelButton, styles.button50]}
                            onPress={() => this.setState({editView: false})}
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
        height: "100%",
    },
    formHeader: {
        borderBottomWidth: 2,
        borderStyle: "solid",
        padding: 10,
        paddingLeft: 3,
        borderRadius: 3,
        fontWeight: "bold",
    },
    formContent: {
        padding: 10,
        paddingLeft: 3,
        borderRadius: 3,
    },
    logoutView: {
        alignItems: "center",
        justifyContent: "flex-end",
        position: "absolute",
        bottom: 0,
        flexDirection: "row",
    },
    logoutButton: {
        alignSelf: "center",
        height: 55,
        borderColor: "#000000",
        backgroundColor: "#f10707",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
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
        justifyContent: "flex-start",
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
    button50:{
        alignSelf: "center",
        alignItems: "center",
        justifyContent: "center",
        width: "50%",
        height: 55,
    },
    editView:{
        height: "80%",
        overflow: "scroll",
    },
    saveButton: {
        backgroundColor: "#2947cb",
    },
    cancelButton:{
        backgroundColor: "#f10707",
    },
    saveView: {
        height: '10%',
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
});

export default MyProfile;
