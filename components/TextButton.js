import React, { Component } from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

class TextButton extends Component {
  render() {
    return (
      <TouchableOpacity
        style={this.props.style}
        onPress={this.props.onPress.bind(this)}
      >
        <Text style={styles.buttonText}>{this.props.text}</Text>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  buttonText: { color: "#6597CA", fontSize: 18 },
});

export default TextButton;
