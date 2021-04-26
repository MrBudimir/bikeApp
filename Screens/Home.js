import React, { Component } from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { Ionicons } from "@expo/vector-icons";
import Carousel from "react-native-snap-carousel";
import Popup from "../components/Popup";
import FlashMessage from "react-native-flash-message";
import { showMessage } from "react-native-flash-message";
import axios from "axios";

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
  email = "PetraMeier@gmail.com";

  constructor() {
    super();
  }

  getMapData() {
    const cancelToken = axios.CancelToken;
    const source = cancelToken.source();
    const url = "http://84.112.202.204:5567/RentStation/allStations";

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

    _map.animateToRegion({
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
    _carousel.snapToItem(index);
  };

  closePopup = () => {
    this.setState({ showPopup: false });
  };

  rentBike = () => {
    this.closePopup();

    /*   const url = "http://84.112.202.204:5567/invoices/rentBike";

    const params = {
      params: {
        email: this.email,
        stationId: currentStationId,
      },
    };

    axios
      .post(url, params)
      .then((response) => {
        console.log(response);
      })
      .catch((err) => this.showFailMessage(err));
      */
  };

  renderCarouselItem({ item }) {
    return (
      <View style={styles.cardContainer}>
        <Popup
          visible={this.state.showPopup}
          onCancelPopup={this.closePopup}
          onConfirmPopup={this.rentBike}
        />
        <Text style={styles.title}>{item.address.streetName}</Text>
        <View>
          <Text style={styles.infoText}>{item.capacity} bikes available</Text>
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
          ref={(ref) => (_map = ref)}
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
            _carousel = ref;
          }}
          data={this.state.mapData}
          sliderWidth={300}
          itemWidth={300}
          renderItem={(ref) => this.renderCarouselItem(ref)}
          containerCustomStyle={styles.carousel}
          onSnapToItem={(index) => this.onCarouselItemChange(index)}
        />
        <FlashMessage position="top" />
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

export default Home;
