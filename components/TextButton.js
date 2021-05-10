import React, { Component } from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

class TextButton extends Component {
  render() {
    return (
      <TouchableOpacity
        style={this.props.style}
        onPress={this.props.onPress.bind(this)}
      >
        <Text style={styles.buttonText}>
          <Ionicons name={this.props.icon} size={18}></Ionicons>
          {this.props.text}
        </Text>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  buttonText: { color: "#6597CA", fontSize: 18 },
});

export default TextButton;
