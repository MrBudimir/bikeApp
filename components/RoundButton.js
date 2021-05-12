import React, { Component } from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

class RoundButton extends Component {
  render() {
    return (
      <TouchableOpacity
        style={this.props.disabled ? styles.buttonDisabled : styles.button}
        onPress={this.props.onPress.bind(this)}
        disabled={this.props.disabled}
      >
        <Text style={{ color: "#101820FF", fontWeight: "bold", fontSize: 18 }}>
          {this.props.text}
        </Text>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#F2AA4CFF",
    borderRadius: 25,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 25,
  },
  buttonDisabled: {
    opacity: 0.5,
    backgroundColor: "#F2AA4CFF",
    borderRadius: 25,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 25,
  },
});

export default RoundButton;
