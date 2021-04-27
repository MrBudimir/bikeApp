import React, {Component} from "react";
import {Modal, StyleSheet, TouchableOpacity, View, Text, TextInput} from "react-native";
import {showMessage} from "react-native-flash-message";

class ConfirmSavePopup extends Component {

    state={
        password: null,
    }

    isAllowedToConfirm(){
        if (this.props.password === this.state.password){
            this.props.onConfirmPopup()
        }else {
            this.props.onCancelPopup()
            showMessage({
                message: "Wrong Password!",
                type: "danger",
                icon: "danger",
                description: "Please enter the correct password.",
                duration: 3000,
            })
        }
    }

    render() {
        return (
            <Modal visible={this.props.visible} animationType="fade" transparent={true}>
                <View style={styles.popup}>
                    <View style={styles.popupCard}>
                        <View style={{marginLeft: 25}}>
                            <Text style={styles.title}>Confirmation</Text>
                            <Text style={styles.question}>Please enter you password to confirm</Text>
                        </View>
                        <TextInput
                            style={styles.input}
                            secureTextEntry={true}
                            onChangeText={(password) => {
                                this.setState({
                                    password: password
                                })
                            }}
                        >
                            {this.state ? this.state.password : ""}
                        </TextInput>
                        <View style={styles.buttons}>
                            <TouchableOpacity
                                style={styles.confirm}
                                onPress={() => this.isAllowedToConfirm()}
                            >
                                <Text style={styles.buttonText}>Confirm</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.cancel}
                                onPress={this.props.onCancelPopup.bind(this)}
                            >
                                <Text style={styles.buttonText}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        );
    }

}

const styles = StyleSheet.create({
    popup: {
        flex: 1,
        backgroundColor: "#000000AA",
        justifyContent: "center",
        alignItems: "center",
    },
    popupCard: {
        backgroundColor: "#101820FF",
        width: "85%",
        padding: 10,
        borderRadius: 5,
    },
    title: {
        color: "white",
        fontWeight: "bold",
        fontSize: 28,
        marginTop: 25,
    },
    question: {
        color: "white",
        fontSize: 18,
        marginTop: 12,
    },
    buttons: {
        flexDirection: "row",
        justifyContent: "space-around",
        marginTop: 40,
    },
    cancel: {
        borderWidth: 3,
        borderColor: "red",
        borderRadius: 25,
        justifyContent: "center",
        alignItems: "center",
        height: 45,
        width: "40%",
    },
    confirm: {
        borderWidth: 3,
        borderColor: "green",
        borderRadius: 25,
        justifyContent: "center",
        alignItems: "center",
        height: 45,
        width: "40%",
    },
    buttonText: {
        fontWeight: "bold",
        color: "white",
    },
    input: {
        marginTop: 15,
        marginRight: 15,
        marginLeft: 15,
        height: 40,
        padding: 10,
        borderColor: "#FFFFFF",
        color: "#FFFFFF",
        borderWidth: 1,
        borderRadius: 15,
    },
});

export default ConfirmSavePopup;
