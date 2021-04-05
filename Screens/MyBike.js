import React from "react";
import { View, Text, StyleSheet } from "react-native";

const MyBikeScreen = () => {
  return (
    <View style={styles.screen}>
      <Text>MyBikeScreen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
});

export default MyBikeScreen;
