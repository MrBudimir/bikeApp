import React, { useEffect } from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { Ionicons } from "@expo/vector-icons";
import Carousel from "react-native-snap-carousel";
import { useState } from "react";
import Popup from "../components/Popup";
import FlashMessage from "react-native-flash-message";
import { showMessage } from "react-native-flash-message";
import axios from "axios";

const HomeScreen = ({ navigation }) => {
  const [show, setShow] = useState(false);
  const [mapData, setMapData] = useState([]);
  const Url = "http://84.112.202.204:5567/RentStation/allStations";

  useEffect(() => {
    const cancelToken = axios.CancelToken;
    const source = cancelToken.source();

    axios
      .get(Url, { cancelToken: source.token })
      .then((data) => {
        setMapData(data.data);
      })
      .catch((err) => console.log(err));

    return function cleanup() {
      source.cancel("request canceled");
    };
  });

  const region = {
    latitude: 47.07254033769078,
    longitude: 15.438058106976376,
    latitudeDelta: 0.04864195044303443,
    longitudeDelta: 0.040142817690068,
  };

  const onCarouselItemChange = (index) => {
    let marker = mapData[index];

    _map.animateToRegion({
      latitude: marker.address.latitude,
      longitude: marker.address.longitude,
      latitudeDelta: 0.04864195044303443,
      longitudeDelta: 0.040142817690068,
    });
  };

  const showSuccessMessage = () => {
    showMessage({
      message: "Successful",
      type: "success",
      icon: "success",
      description: "You rent a bike successfully!",
      duration: 2000,
    });
  };

  const showFailMessage = () => {
    showMessage({
      message: "Fail",
      type: "danger",
      icon: "danger",
      description: "Oops, something went wrong!",
      duration: 2000,
    });
  };

  const onMarkerPressed = (index) => {
    _carousel.snapToItem(index);
  };

  const closePopup = () => {
    setShow(false);
    navigation.navigate("MyBike");
  };

  const rentBike = () => {
    setShow(false);
    //showSuccessMessage();
    showFailMessage();
  };

  function renderCarouselItem({ item }) {
    return (
      <View style={styles.cardContainer}>
        <Popup
          visible={show}
          onCancelPopup={closePopup}
          onConfirmPopup={rentBike}
        />
        <Text style={styles.title}>{item.address.streetName}</Text>
        <View>
          <Text style={styles.infoText}>{item.capacity} bikes available</Text>
        </View>
        <TouchableOpacity style={styles.button} onPress={() => setShow(true)}>
          <Text style={styles.buttonText}> Rent bike</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <MapView
        style={styles.map}
        initialRegion={region}
        ref={(ref) => (_map = ref)}
      >
        {mapData.map((marker, index) => {
          const location = {
            coordinate: {
              latitude: marker.address.latitude,
              longitude: marker.address.longitude,
            },
          };
          return (
            <Marker
              key={index}
              coordinate={location.coordinate}
              ref={(ref) => {
                marker = ref;
              }}
              onPress={() => onMarkerPressed(index)}
            >
              <Text
                style={{
                  color: "black",
                }}
              >
                {marker.id}
              </Text>
              <Ionicons name="bicycle" size={40} color="#CC5500" />
            </Marker>
          );
        })}
      </MapView>
      <Carousel
        ref={(ref) => {
          _carousel = ref;
        }}
        data={mapData}
        sliderWidth={300}
        itemWidth={300}
        renderItem={renderCarouselItem}
        containerCustomStyle={styles.carousel}
        onSnapToItem={(index) => onCarouselItemChange(index)}
      />
      <FlashMessage position="top" />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  carousel: {
    position: "absolute",
    bottom: 0,
    alignSelf: "center",
    marginBottom: 20,
  },
  cardContainer: {
    backgroundColor: "#101820FF",
    height: 150,
    width: "100%",
    borderRadius: 5,
    opacity: 0.95,
    alignSelf: "center",
  },
  title: {
    color: "#F2AA4CFF",
    alignSelf: "center",
    marginTop: 5,
    marginBottom: 10,
    fontSize: 16,
    fontWeight: "bold",
  },
  infoText: {
    color: "white",
    marginLeft: 10,
    marginBottom: 5,
  },
  button: {
    marginTop: 10,
    alignSelf: "center",
    width: "50%",
    height: 45,
    borderWidth: 3,
    borderColor: "#F2AA4CFF",
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#F2AA4CFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default HomeScreen;
