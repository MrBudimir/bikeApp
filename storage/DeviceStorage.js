import { AsyncStorage } from "react-native";

class DeviceStorage {
  storeData = async (key, item) => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(item));
    } catch (err) {
      console.log("Storing data failed", err);
    }
  };

  fetchData = async (key) => {
    try {
      let item = await AsyncStorage.getItem(key);
      let data = JSON.parse(item);
      return data;
    } catch (err) {
      console.log("Fetching data failed", err);
    }
  };
}

export default DeviceStorage;
