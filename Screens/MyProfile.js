import {View, Text, StyleSheet, AppState, TouchableOpacity} from "react-native";
import React, {Component} from 'react'
import axios from "axios";

class MyProfile extends Component {

    email = "PetraMeier@gmail.com"
    state = {
        user: {},
        appState: AppState.currentState
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
        if(this.props.navigation.event){
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

                if (currentUser) {
                    this.setState({
                        user: currentUser
                    })

                }
            })
            .catch((err) => console.log(err));
    }

    render() {
        const {navigation} = this.props;
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
                </View>
                <View style={styles.logoutView}>
                    <TouchableOpacity style={styles.logoutButton}
                                      onPress={() => this.props.navigation.navigate("login")}>
                        <Text style={styles.buttonText}>Logout</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    screen: {
        height: '70%'
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
        height: '30%',
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
    }
});

export default MyProfile;
