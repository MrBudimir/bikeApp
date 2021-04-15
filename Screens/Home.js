import React from "react";
import { View, StyleSheet, Text } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { Ionicons } from "@expo/vector-icons";
import Carousel from "react-native-snap-carousel";

//47.07254033769078, 15.438058106976376
const mapData = require("./MapData/Map");

const handlePress = () => {
  console.log("pressed");
};

const renderCarouselItem = ({ item }) => {
  return (
    <View style={styles.cardContainer}>
      <Text style={styles.title}>{item.name}</Text>
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
  this._carousel.snapToItem(index);
};

const HomeScreen = () => {
  return (
    <View style={styles.screen}>
      <MapView
        style={styles.map}
        initialRegion={mapData.state.region}
        customMapStyle={mapData.generatedMapStyle}
        ref={(ref) => (_map = ref)}
      >
        {mapData.state.markers.map((marker, index) => {
          return (
            <Marker
              key={index}
              coordinate={marker.coordinate}
              onPress={onMarkerPressed(index)}
              ref={(ref) => {
                marker = ref;
              }}
            >
              <Text>{marker.name}</Text>
              <Ionicons name="bicycle" size={40} color="#F2AA4CFF" />
            </Marker>
          );
        })}
      </MapView>
      <Carousel
        ref={(ref) => (this._carousel = ref)}
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
    left: "25%",
    right: "25%",
    marginBottom: 25,
  },
  cardContainer: {
    backgroundColor: "#101820FF",
    height: 125,
    width: 225,
    borderRadius: 15,
    opacity: 0.9,
    alignItems: "center",
  },
  title: {
    color: "#F2AA4CFF",
  },
});

export default HomeScreen;
