import React from "react";
import { View, Text, StyleSheet, Modal, TouchableOpacity } from "react-native";

const Popup = (props) => {
  return (
    <Modal visible={props.visible} animationType="fade" transparent={true}>
      <View style={styles.popup}>
        <View style={styles.popupCard}>
          <View style={{ marginLeft: 25 }}>
            <Text style={styles.title}>Rent bike</Text>
            <Text style={styles.question}>Do you want to rent a bike?</Text>
          </View>
          <View style={styles.buttons}>
            <TouchableOpacity
              style={styles.confirm}
              onPress={props.onConfirmPopup.bind(this)}
            >
              <Text style={styles.buttonText}>Confirm</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancel}
              onPress={props.onCancelPopup.bind(this)}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  popup: {
    flex: 1,
    backgroundColor: "#000000AA",
    justifyContent: "center",
    alignItems: "center",
  },
  popupCard: {
    backgroundColor: "#101820FF",
    height: "30%",
    width: "85%",
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
});

export default Popup;
