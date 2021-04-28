import React, { Component } from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { Ionicons } from "@expo/vector-icons";
import Carousel from "react-native-snap-carousel";
import Popup from "../components/Popup";
import FlashMessage from "react-native-flash-message";
import { showMessage } from "react-native-flash-message";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {BASE_INVOICE, BASE_RENT_STATION, BASE_URL, GET_ALL_STATIONS, RENT_BIKE} from "../constants";

class Home extends Component {
  region = {
    latitude: 47.07254033769078,
    longitude: 15.438058106976376,
    latitudeDelta: 0.04864195044303443,
    longitudeDelta: 0.040142817690068,
  };
  state = {
    showPopup: false,
    mapData: [],
  };
  email = AsyncStorage.getItem("userData").email;

  constructor() {
    super();
  }

  getMapData() {
    const cancelToken = axios.CancelToken;
    const source = cancelToken.source();
    const url = BASE_URL + BASE_RENT_STATION + GET_ALL_STATIONS;

    axios
      .get(url, { cancelToken: source.token })
      .then((stations) => {
        this.setState({ mapData: stations.data });
      })
      .catch((err) => console.log(err));

    return function cleanup() {
      source.cancel("request canceled");
    };
  }

  componentDidMount() {
    this.getMapData();
  }

  onCarouselItemChange = (index) => {
    let marker = this.state.mapData[index];

    this._map.animateToRegion({
      latitude: marker.address.latitude,
      longitude: marker.address.longitude,
      latitudeDelta: 0.04864195044303443,
      longitudeDelta: 0.040142817690068,
    });
  };

  showSuccessMessage = () => {
    showMessage({
      message: "Successful",
      type: "success",
      icon: "success",
      description: "You rent a bike successfully!",
      duration: 2000,
    });
  };

  showFailMessage = (err) => {
    showMessage({
      message: "Fail",
      type: "danger",
      icon: "danger",
      description: "Oops, something went wrong!",
      duration: 2000,
    });
    console.log(err);
  };

  onMarkerPressed = (index) => {
    this._carousel.snapToItem(index);
  };

  closePopup = () => {
    this.setState({ showPopup: false });
  };

  rentBike = (currentStationId) => {
    this.closePopup();

    const url = BASE_URL + BASE_INVOICE + RENT_BIKE;

    const params = {
      params: {
        stationId: currentStationId,
        email: this.email,
      },
    };

    axios
      .post(url, null, params)
      .then((response) => {
        console.log(response);
      })
      .catch((err) => this.showFailMessage(err));
  };

  renderCarouselItem({ item }) {
    return (
      <View style={styles.cardContainer}>
        <Popup
          visible={this.state.showPopup}
          onCancelPopup={this.closePopup}
          onConfirmPopup={() => this.rentBike(item.id)}
        />
        <Text style={styles.title}>{item.address.streetName}</Text>
        <View style={{ justifyContent: "center" }}>
          <Text style={styles.infoText}>{item.availableBikes} available</Text>
        </View>
        <TouchableOpacity
          style={styles.button}
          onPress={() =>
            this.setState({
              showPopup: true,
            })
          }
        >
          <Text style={styles.buttonText}> Rent bike</Text>
        </TouchableOpacity>
      </View>
    );
  }

  render() {
    return (
      <View style={styles.screen}>
        <MapView
          style={styles.map}
          initialRegion={this.region}
          ref={(ref) => (this._map = ref)}
        >
          {this.state.mapData.map((marker, index) => {
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
                onPress={() => this.onMarkerPressed(index)}
              >
                <Text
                  style={{
                    color: "black",
                  }}
                >
                  {marker.address.streetName}
                </Text>
                <Ionicons name="bicycle" size={40} color="#CC5500" />
              </Marker>
            );
          })}
        </MapView>
        <Carousel
          ref={(ref) => {
            this._carousel = ref;
          }}
          data={this.state.mapData}
          sliderWidth={300}
          itemWidth={300}
          renderItem={(ref) => this.renderCarouselItem(ref)}
          containerCustomStyle={styles.carousel}
          onSnapToItem={(index) => this.onCarouselItemChange(index)}
        />
      </View>
    );
  }
}

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
    height: 175,
    width: "100%",
    borderRadius: 5,
    opacity: 0.95,
    alignItems: "center",
    alignSelf: "center",
    justifyContent: "space-between",
  },
  title: {
    color: "#F2AA4CFF",
    marginTop: 5,
    fontSize: 18,
    fontWeight: "bold",
  },
  infoText: {
    color: "white",
    fontSize: 20,
  },
  button: {
    alignSelf: "center",
    marginBottom: 15,
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

export default Home;
