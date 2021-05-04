import React, { Component } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  AppState,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import { Ionicons } from "@expo/vector-icons";
import Carousel from "react-native-snap-carousel";
import Popup from "../components/Popup";
import axios from "axios";
import {
  BASE_INVOICE,
  BASE_RENT_STATION,
  BASE_URL,
  CURRENT_INVOICE_KEY,
  GET_ALL_STATIONS,
  RENT_BIKE,
  USER_DATA_KEY,
} from "../constants";
import DeviceStorage from "../storage/DeviceStorage";
import Message from "../components/Message";

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
    appState: AppState.currentState,
    stationId: 1,
  };
  storage = new DeviceStorage();
  message = new Message();
  email = null;

  constructor() {
    super();
  }

  async componentDidMount() {
    //TODO event for background reload and coming from navigation
    this.getMapData();
    let userStorageData = await this.storage.fetchData(USER_DATA_KEY);
    this.email = userStorageData.email;

    this.props.navigation.addListener("focus", () => {
      this.getMapData();
    });

    AppState.addEventListener("change", this._handleAppStateChange);
  }

  componentWillUnmount() {
    if (this.props.navigation.event) {
      this.props.navigation.removeEventListener("focus", () => {
        this.getMapData();
      });
    }

    AppState.removeEventListener("change", this._handleAppStateChange);
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

  _handleAppStateChange = (nextAppState) => {
    if (
      this.state.appState.match(/inactive|background/) &&
      nextAppState === "active"
    ) {
      console.log("STATION:coming from background");
      this.getMapData();
    }

    this.setState({ appState: nextAppState });
  };

  onCarouselItemChange = (index) => {
    let marker = this.state.mapData[index];
    this.setState({ stationId: marker.id });
    this._map.animateToRegion({
      latitude: marker.address.latitude,
      longitude: marker.address.longitude,
      latitudeDelta: 0.04864195044303443,
      longitudeDelta: 0.040142817690068,
    });
  };

  onMarkerPressed = (index) => {
    this._carousel.snapToItem(index);
  };

  closePopup = () => {
    this.setState({ showPopup: false });
  };

  //TODO always uses the same stationID!
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
        this.storage
          .storeData(CURRENT_INVOICE_KEY, response.data)
          .then((r) => console.log("successfully stored invoice"));
        this.getMapData();
        this.message.showSuccessMessage();
        console.log(response.data);
      })
      .catch((err) => this.message.showFailMessage(err));
  };

  renderCarouselItem({ item }) {
    let isDisabled = item.availableBikes === 0;
    console.log("render carousel", item.id);
    let id = item.id;
    return (
      <View style={styles.cardContainer}>
        <Text style={styles.title}>
          {item.address.streetName} {item.id}
        </Text>
        <View style={{ justifyContent: "center" }}>
          <Text style={styles.infoText}>{item.availableBikes} available</Text>
        </View>
        <TouchableOpacity
          style={isDisabled ? styles.disabledButton : styles.button}
          onPress={() =>
            this.setState({
              showPopup: true,
            })
          }
          disabled={isDisabled}
        >
          <Text
            style={isDisabled ? styles.disabledButtonText : styles.buttonText}
          >
            Rent bike
          </Text>
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
          useScrollView={true}
          containerCustomStyle={styles.carousel}
          onSnapToItem={(index) => this.onCarouselItemChange(index)}
        />
        <Popup
          visible={this.state.showPopup}
          onCancelPopup={this.closePopup}
          onConfirmPopup={() => this.rentBike(id)}
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
  disabledButton: {
    opacity: 0.7,
    alignSelf: "center",
    marginBottom: 15,
    width: "50%",
    height: 45,
    borderWidth: 3,
    borderColor: "#EBEBE4",
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#F2AA4CFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  disabledButtonText: {
    opacity: 0.7,
    color: "#EBEBE4",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default Home;
