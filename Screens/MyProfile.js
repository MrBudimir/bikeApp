import {View, Text, StyleSheet, AppState, TouchableOpacity, TextInput, ScrollView} from "react-native";
import React, {Component} from 'react'
import axios from "axios";

class MyProfile extends Component {

    email = "PetraMeier@gmail.com"
    state = {
        user: {
            firstName: null,
            lastName: null,
            email: null,
            password: null
        },
        newFirstName: null,
        newLastName: null,
        newEmail: null,
        newPassword: null,
        appState: AppState.currentState,
        editView: false
    }

    constructor() {
        super();
    }

    componentDidMount() {
        this.getCurrentUser(this.email)

        this.props.navigation.addListener('focus', () => {
            console.log("Entered Navigation")
        });

        AppState.addEventListener("change", this._handleAppStateChange)
    }

    componentWillUnmount() {
        if (this.props.navigation.event) {
            this.props.navigation.removeEventListener('focus', () => {
                console.log("Entered Navigation")
            });
        }

        AppState.removeEventListener("change", this._handleAppStateChange);
    }

    _handleAppStateChange = nextAppState => {
        if (
            this.state.appState.match(/inactive|background/) &&
            nextAppState === "active"
        ) {
            console.log("Maybe here some PROFILE REST Calls: coming from background");
        }

        this.setState({appState: nextAppState});
    };

    getCurrentUser(emailOfUser) {
        // this.props.navigation.navigate('MyBike')
        const Url = "http://84.112.202.204:5567/users/profile";

        const params = {
            params: {
                email: emailOfUser
            },
        };

        axios.get(Url, params)
            .then((user) => {
                let currentUser = user.data;
                console.log(currentUser)
                if (currentUser) {
                    this.setState({
                        user: currentUser
                    })

                }
            })
            .catch((err) => console.log(err));
    }

    save(){
        console.log('save changes...confirm by entering old password')
        this.setState({
            editView: false,
            user:{
                password: this.state.newPassword,
                lastName: this.state.newLastName,
                firstName: this.state.newFirstName,
                email: this.state.newEmail
            }
        })
    }

    render() {
        const editView = this.state.editView
        if (!this.state.editView) {
            return (
                <View>
                    <View style={styles.screen}>
                        <Text style={styles.formHeader}>
                            First Name
                        </Text>
                        <Text style={styles.formContent}>
                            {(this.state.user) ? (this.state.user.firstName) : ""}
                        </Text>
                        <Text style={styles.formHeader}>
                            Last Name
                        </Text>
                        <Text style={styles.formContent}>
                            {(this.state.user) ? (this.state.user.lastName) : ""}
                        </Text>
                        <Text style={styles.formHeader}>
                            Email
                        </Text>
                        <Text style={styles.formContent}>
                            {(this.state.user) ? (this.state.user.email) : ""}
                        </Text>
                        <Text style={styles.formHeader}>
                            Password
                        </Text>
                        <Text style={styles.formContent}>
                            {(this.state.user) ? (this.state.user.password) : ""}
                        </Text>
                    </View>
                    <View style={styles.editViewButton}>
                        <TouchableOpacity style={styles.editButton}
                                          onPress={() => this.setState({
                                              editView: true
                                          })}>
                            <Text style={styles.buttonText}>Edit Profile</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.logoutView}>
                        <TouchableOpacity style={styles.logoutButton}
                                          onPress={() => this.props.navigation.navigate("login")}>
                            <Text style={styles.buttonText}>Logout</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            );
        } else {
            return (
                <View styles={styles.scrollView}>
                    <ScrollView style={styles.editView}>
                        <Text style={styles.formHeader}>
                            First Name
                        </Text>
                        <TextInput style={styles.input}
                                   onChangeText={(newFirstName) => this.setState({
                                       newFirstName: newFirstName
                                   })}>
                            {(this.state.user) ? (this.state.user.firstName) : ""}
                        </TextInput>
                        <Text style={styles.formHeader}>
                            Last Name
                        </Text>
                        <TextInput style={styles.input}
                                   onChangeText={(newLastName) => this.setState({
                                       newLastName: newLastName
                                   })}>
                            {(this.state.user) ? (this.state.user.lastName) : ""}
                        </TextInput>
                        <Text style={styles.formHeader}>
                            Email
                        </Text>
                        <TextInput style={styles.input}
                                   onChangeText={(newEmail) => this.setState({
                                       newEmail: newEmail
                                   })}>
                            {(this.state.user) ? (this.state.user.email) : ""}
                        </TextInput>
                        <Text style={styles.formHeader}>
                            Password
                        </Text>
                        <TextInput secureTextEntry={true}
                                   style={styles.input}
                                   onChangeText={(newPassword) => this.setState({
                                       newPassword: newPassword
                                   })}>
                            {(this.state.user) ? (this.state.user.password) : ""}
                        </TextInput>
                    </ScrollView>
                    <View style={styles.saveView}>
                        <TouchableOpacity style={styles.saveButton}
                                          onPress={() => this.save()}>
                            <Text style={styles.buttonText}>Save</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )
        }
    }
}

const styles = StyleSheet.create({
    screen: {
        height: '50%'
    },
    formHeader: {
        borderBottomWidth: 2,
        borderStyle: "solid",
        padding: 10,
        paddingLeft: 3,
        borderRadius: 3,
        fontWeight: "bold"
    },
    formContent: {
        padding: 10,
        paddingLeft: 3,
        borderRadius: 3
    },
    logoutView: {
        height: '25%',
        alignItems: 'center',
        justifyContent: 'flex-end'
    },
    logoutButton: {
        alignSelf: "center",
        height: 55,
        borderColor: "#000000",
        backgroundColor: '#f10707',
        alignItems: "center",
        justifyContent: "center",
        width: "100%"
    },
    buttonText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "bold",
    },
    editViewButton: {
        height: '25%',
        width: '50%',
        alignItems: 'center',
        alignSelf: 'flex-end',
        justifyContent: 'flex-start'
    },
    editButton: {
        borderRadius: 15,
        height: 55,
        alignSelf: "center",
        backgroundColor: '#2947cb',
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        marginRight: 5
    },
    editView: {
        height: '80%',
        overflow: 'scroll'
    },
    saveButton: {
        alignSelf: "center",
        height: 55,
        borderColor: "#000000",
        backgroundColor: '#2947cb',
        alignItems: "center",
        justifyContent: "center",
        width: "100%"
    },
    saveView: {
        height: '20%',
        alignItems: 'center',
        justifyContent: 'flex-end'
    },
    input: {
        margin: 15,
        height: 40,
        padding: 10,
        borderColor: '#000000',
        borderWidth: 1,
        borderRadius: 15
    },
    scrollView: {
        flex: 1
    }
});

export default MyProfile;
