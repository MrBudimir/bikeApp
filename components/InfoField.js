import React, { Component } from "react";
import { Text, StyleSheet, View } from "react-native";

class InfoField extends Component {
  render() {
    return (
      <View style={styles.infoView}>
        <Text style={styles.infoHeader}>{this.props.header}</Text>
        <Text style={styles.infoContent}>{this.props.text}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  infoHeader: {
    marginTop: 15,
    color: "#F2AA4CFF",
    fontSize: 18,
  },
  infoContent: {
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
});

export default InfoField;
