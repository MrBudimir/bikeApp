import React from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import axios from "axios";

const getAxios = () => {
  const Url = "http://84.112.202.204:5567/users/profile";

  const params = {
    params: {
      email: "maxMustermann@gmail.com",
    },
  };

  axios
    .get(Url, params)
    .then((data) => console.log(data.data.email))
    .catch((err) => console.log(err));
};

const MyBikeScreen = () => {
  return (
    <View style={styles.screen}>
      <Text>MyBikeScreen</Text>
      <Button title="test" onPress={() => getAxios()}></Button>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
});

export default MyBikeScreen;
