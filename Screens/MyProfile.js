import {View, Text, StyleSheet} from "react-native";
import React, {Component} from 'react'
import axios from "axios";

class MyProfile extends Component {

    email = "PetraMeier@gmail.com"
    state = {
        user: {}
    }
    constructor() {
        super();
    }

    componentDidMount() {
        console.log("test")
        this.getCurrentUser(this.email)
        this.props.navigation.addListener('focus', () => {
            console.log("REST CALL HERE")
        });
    }

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
                console.log(user.data)
                let currentUser = user.data;

                if (currentUser) {
                    console.log(currentUser)
                    this.setState({
                        user: currentUser
                    })

                }
            })
            .catch((err) => console.log(err));
    }

    render() {
        const { navigation } = this.props;
        return (
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
        );
    }
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
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
});

export default MyProfile;
