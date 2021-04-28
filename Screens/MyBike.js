import React, {Component} from 'react'
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity, AppState
} from 'react-native'
import axios from "axios";
import 'intl';
import 'intl/locale-data/jsonp/de';
import 'intl/locale-data/jsonp/en';
import {AsyncStorage} from "react-native";
import {BASE_INVOICE, BASE_URL, END_RENT, GET_CURRENT_INVOICE} from "../constants";

class MyBike extends Component {

    email = null
    state = {
        timer: null,
        counter: 0,
        currentInvoice: {},
        startDate: null,
        timerProperties: {
            minutes: 0,
            days: 0,
            hours: 0,
            seconds: 0
        },
        appState: AppState.currentState
    }
    options;

    constructor() {
        super();
    }

    async componentDidMount() {
        this.email = await this.getUserData()
        this.getCurrentInvoice(this.email)

        this.props.navigation.addListener('focus', () => {
            this.getCurrentInvoice(this.email);
        });

        let timer = setInterval(this.updateClock, 1000);
        this.setState({timer});

        AppState.addEventListener("change", this._handleAppStateChange)
    }

    getUserData = async () => {
        try {
            let userData = await AsyncStorage.getItem("userData");
            let data = JSON.parse(userData);
            return data.email
        } catch (err) {
            console.log("Get Token", err);
        }
    };

    componentWillUnmount() {
        clearInterval(this.state.timer);

        if (this.props.navigation.event) {
            this.props.navigation.removeEventListener('focus', () => {
                this.getCurrentInvoice(this.email);
            });
        }

        AppState.removeEventListener("change", this._handleAppStateChange);
    }

    _handleAppStateChange = nextAppState => {
        if (
            this.state.appState.match(/inactive|background/) &&
            nextAppState === "active"
        ) {
            console.log("BIKE:coming from background");
            this.getCurrentInvoice(this.email)
        }

        this.setState({appState: nextAppState});
    };

    updateClock = () => {
        let newDate = new Date();
        let newStamp = newDate.getTime();
        let startStamp = new Date(this.state.startDate).getTime()

        let diff = Math.round((newStamp - startStamp) / 1000);

        let d = Math.floor(diff / (24 * 60 * 60));
        diff = diff - (d * 24 * 60 * 60);
        let h = Math.floor(diff / (60 * 60));
        diff = diff - (h * 60 * 60);
        let m = Math.floor(diff / (60));
        diff = diff - (m * 60);
        let s = diff;

        this.setState({
            timerProperties: {
                minutes: m,
                days: d,
                hours: h,
                seconds: s
            }
        });
    }

    getCurrentInvoice(emailOfUser) {
        const url = BASE_URL + BASE_INVOICE + GET_CURRENT_INVOICE;

        const params = {
            params: {
                email: emailOfUser
            },
        };

        axios.get(url, params)
            .then((invoice) => {
                let newInvoice = invoice.data;
                let dateObject;
                if (newInvoice) {
                    dateObject = Date.parse(newInvoice.startDate)
                    newInvoice.startDate = this.formatDate(dateObject)
                    this.setState({
                        currentInvoice: newInvoice,
                        startDate: dateObject
                    })

                }
            })
            .catch((err) => console.log(err));
    }

    formatDate(dateObject) {
        this.options = {
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            day: 'numeric',
            month: 'numeric',
            year: 'numeric',
            timeZone: 'UTC',
            timeZoneName: 'short'
        };
        return new Intl.DateTimeFormat('de-DE', this.options).format(dateObject);
    }

    endRent() {
        const url = BASE_URL + BASE_INVOICE + END_RENT;

        const params = {
            params: {
                invoiceId: this.state.currentInvoice.id
            },
        };

        axios.post(url, null, params)
            .then((response) => {
                if (response.data) {
                    this.setState({
                        currentInvoice: {},
                        startDate: null
                    })
                }
            }).catch((err) => console.log(err));

        //    TODO if not ended, persist Request in Async and save again if navigate to here
    }

    render() {
        const {days, hours, minutes, seconds} = this.state.timerProperties
        let timerOrRefresh;
        if (this.state.startDate) {
            timerOrRefresh = <View style={styles.timer}><Text
                style={styles.timerText}>{`${days} d: ${hours} h: ${minutes} m: ${seconds} s`}</Text></View>;
        } else {
            timerOrRefresh =
                <TouchableOpacity style={styles.refresh} onPress={() => this.getCurrentInvoice(this.email)}>
                    <Text style={styles.buttonText}>Refresh...</Text>
                </TouchableOpacity>;
        }
        return (
            <View>
                <View style={styles.screen}>
                    <Text style={styles.formHeader}>
                        Model
                    </Text>
                    <Text style={styles.formContent}>
                        {(this.state.currentInvoice.ebike) ? (this.state.currentInvoice.ebike.model) : ""}
                    </Text>
                    <Text style={styles.formHeader}>
                        Rentstation Id
                    </Text>
                    <Text style={styles.formContent}>
                        {(this.state.currentInvoice.ebike) ? (this.state.currentInvoice.ebike.rentStation.id) : ""}
                    </Text>
                    <Text style={styles.formHeader}>
                        Start Date
                    </Text>
                    <Text style={styles.formContent}>
                        {(this.state.currentInvoice) ? (this.state.currentInvoice.startDate) : ""}
                    </Text>
                </View>
                <View style={styles.rentTimeContainer}>
                    {timerOrRefresh}
                </View>
                <View style={styles.endRent}>
                    <TouchableOpacity disabled={!this.state.startDate}
                                      style={this.state.startDate ? styles.endRentButton : styles.disabledButton}
                                      onPress={() => this.endRent()}>
                        <Text style={styles.buttonText}>End rent</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

}

const styles = StyleSheet.create({
    screen: {
        height: '50%'
    },
    formHeader: {
        borderBottomWidth: 2,
        borderStyle: "solid",
        padding: 10,
        paddingLeft: 3,
        borderRadius: 3,
        fontWeight: "bold"
    },
    formContent: {
        padding: 10,
        paddingLeft: 3,
        borderRadius: 3
    },
    rentTimeContainer: {
        height: '30%',
        alignItems: 'center',
        justifyContent: 'flex-end'
    },
    timer: {
        height: "50%",
        backgroundColor: "#000000",
        width: '90%',
        borderRadius: 10,
        justifyContent: 'center'
    },
    timerText: {
        textAlign: 'center',
        fontWeight: 'bold',
        color: "#F2AA4CFF",
        fontSize: 24
    },
    endRent: {
        height: '20%',
        alignItems: 'center',
        justifyContent: 'flex-end'
    },
    endRentButton: {
        alignSelf: "center",
        height: 55,
        borderColor: "#000000",
        backgroundColor: '#2947cb',
        alignItems: "center",
        justifyContent: "center",
        width: "100%"
    },
    buttonText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "bold",
    },
    refresh: {
        alignSelf: "center",
        height: 55,
        borderColor: "#000000",
        backgroundColor: '#2947cb',
        alignItems: "center",
        justifyContent: "center",
        width: "30%",
        borderRadius: 15
    },
    disabledButton: {
        alignSelf: "center",
        height: 55,
        backgroundColor: '#cccccc',
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        color: '#666666',
        borderColor: "#000000",
    }
});

export default MyBike;
