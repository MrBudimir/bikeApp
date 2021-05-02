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
import {
    BASE_INVOICE,
    BASE_URL,
    COSTS_PER_MIN,
    CURRENT_INVOICE_KEY,
    END_RENT,
    GET_CURRENT_INVOICE,
    USER_DATA_KEY
} from "../constants";
import DeviceStorage from "../storage/DeviceStorage";
import Message from "../components/Message";

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
    storage = new DeviceStorage();
    invoiceFromStorage = null;
    message = new Message();
    duration = 0;

    constructor() {
        super();
    }

    async componentDidMount() {
        let user = await this.storage.fetchData(USER_DATA_KEY);
        this.email = user.email;
        this.invoiceFromStorage = await this.storage.fetchData(CURRENT_INVOICE_KEY);
        await this._handleGettingBackOnline();

        this.props.navigation.addListener('focus', () => {
            this._handleGettingBackOnline()
        });

        let timer = setInterval(this.updateClock, 1000);
        this.setState({timer});

        AppState.addEventListener("change", this._handleAppStateChange)
    }

    async componentWillUnmount() {
        clearInterval(this.state.timer);

        if (this.props.navigation.event) {
            this.props.navigation.removeEventListener('focus', () => {
                this._handleGettingBackOnline();
            });
        }

        AppState.removeEventListener("change", this._handleAppStateChange);
    }

    async _handleGettingBackOnline() {
        this.invoiceFromStorage = await this.storage.fetchData(CURRENT_INVOICE_KEY);
        if (this.invoiceFromStorage.requestNeeded) {
            this.endRent()
        } else {
            this.getCurrentInvoice(this.email);
        }
    }

    _handleAppStateChange = nextAppState => {
        if (
            this.state.appState.match(/inactive|background/) &&
            nextAppState === "active"
        ) {
            console.log("BIKE:coming from background");
            this._handleGettingBackOnline().then(r => {
                console.log("handled getting back online");
            })
        }

        this.setState({appState: nextAppState});
    };

    updateClock = () => {
        let newDate = new Date();
        let newStamp = newDate.getTime();
        let startStamp = new Date(this.state.startDate).getTime()

        let diff = Math.round((newStamp - startStamp) / 1000);
        this.duration = diff;

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
            .catch((err) => {
                console.log(this.invoiceFromStorage)
                if(this.isEmpty(this.state.currentInvoice) && !this.isEmpty(this.invoiceFromStorage)){
                    console.log("Could not get invoice from db, instead using invoice from storage if existing", err);

                    let dateObject = Date.parse(this.invoiceFromStorage.startDate);
                    console.log(dateObject)
                    this.invoiceFromStorage.startDate = this.formatDate(dateObject)
                    this.setState({
                        currentInvoice: this.invoiceFromStorage,
                        startDate: dateObject
                    });
                }
            });
    }

    isEmpty(obj) {
        for(let key in obj) {
            if(obj.hasOwnProperty(key))
                return false;
        }
        return true;
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
                invoiceId: this.invoiceFromStorage.id,
                endDate: this.invoiceFromStorage.endDate ? this.invoiceFromStorage.endDate : new Date().getTime()
            },
        };

        axios.post(url, null, params)
            .then((response) => {
                this.storage.storeData(CURRENT_INVOICE_KEY, {})
                    .then(r => console.log("Stored data of current invoice"))

                this.message.successMessage("End Rent", "You successfully ended your rent!")

            }).catch((err) => {
                console.log("some error here mate")
                if(!this.invoiceFromStorage.requestNeeded){
                    console.log("Could not end rent but request will be saved to end rent later", err);

                    let invoiceWithRequestState = this.invoiceFromStorage;
                    invoiceWithRequestState.requestNeeded = true;
                    invoiceWithRequestState.endDate = new Date().getTime();

                    this.storage.storeData(CURRENT_INVOICE_KEY, invoiceWithRequestState)
                        .then(r => console.log("Stored data of current invoice"))
                }
        });
        this.setState({
            currentInvoice: {},
            startDate: null
        })
    }

    formatEuro(number) {
        return new Intl.NumberFormat('de-DE',
            { style: 'currency', currency: 'EUR' })
            .format(number)
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
                    <View style={styles.costsContainer}>
                        <Text>
                            Your costs so far:
                        </Text>
                        <Text style={styles.costs}>
                            {this.formatEuro((this.duration / 60) * COSTS_PER_MIN)}
                        </Text>
                    </View>
                </View>
                <View>

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
    },
    costs: {
        fontWeight: "bold",
        marginLeft: 5
    },
    costsContainer: {
        flex: 1,
        flexDirection: "row"
    }

});

export default MyBike;
