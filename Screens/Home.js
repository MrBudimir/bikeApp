import React from "react";
import { View, StyleSheet, Text, Button, TouchableOpacity } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { Ionicons } from "@expo/vector-icons";
import Carousel from "react-native-snap-carousel";

//47.07254033769078, 15.438058106976376
const mapData = require("./MapData/Map");

const renderCarouselItem = ({ item }) => {
  return (
    <View style={styles.cardContainer}>
      <Text style={styles.title}>{item.name}</Text>
      <View>
        <Text style={styles.infoText}>{item.adress}</Text>
        <Text style={styles.infoText}>{item.available} bikes available</Text>
      </View>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}> Rent bike</Text>
      </TouchableOpacity>
    </View>
  );
};

const onCarouselItemChange = (index) => {
  let marker = mapData.state.markers[index];

  _map.animateToRegion({
    latitude: marker.coordinate.latitude,
    longitude: marker.coordinate.longitude,
    latitudeDelta: 0.04864195044303443,
    longitudeDelta: 0.040142817690068,
  });
};

const onMarkerPressed = (index) => {
  _carousel.snapToItem(index);
};

const HomeScreen = () => {
  return (
    <View style={styles.screen}>
      <MapView
        style={styles.map}
        initialRegion={mapData.state.region}
        ref={(ref) => (_map = ref)}
      >
        {mapData.state.markers.map((marker, index) => {
          return (
            <Marker
              key={index}
              coordinate={marker.coordinate}
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
                {marker.name}
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
        data={mapData.state.markers}
        sliderWidth={300}
        itemWidth={300}
        renderItem={renderCarouselItem}
        containerCustomStyle={styles.carousel}
        onSnapToItem={(index) => onCarouselItemChange(index)}
      />
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
    marginBottom: 25,
  },
  cardContainer: {
    backgroundColor: "#101820FF",
    height: 140,
    width: 275,
    borderRadius: 15,
    opacity: 0.9,
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
    height: "25%",
    backgroundColor: "#F2AA4CFF",
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#101820FF",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default HomeScreen;
