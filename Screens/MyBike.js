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
import InfoField from "../components/InfoField";
import TextButton from "../components/TextButton";

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
        if (this.invoiceFromStorage && this.invoiceFromStorage.requestNeeded) {
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
                invoiceId: this.invoiceFromStorage.id ? this.invoiceFromStorage.id : this.state.currentInvoice.id,
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

        let timerOrNot;
        let costs;
        let endButtonOrRefresh;
        if (this.state.startDate) {

            timerOrNot = <View style={styles.timer}><Text
                style={styles.timerText}>{`${days} d: ${hours} h: ${minutes} m: ${seconds} s`}</Text></View>;
            costs = <View style={styles.costsContainer} >
                <Text style={styles.costsText}>
                    Your costs so far:
                </Text>
                <Text style={styles.costs}>
                    {this.formatEuro((this.duration / 60) * COSTS_PER_MIN)}
                </Text>
            </View>
            endButtonOrRefresh = <TouchableOpacity disabled={!this.state.startDate}
                                                   style={this.state.startDate ? styles.endRentButton : styles.disabledButton}
                                                   onPress={() => this.endRent()}>
                <Text style={styles.buttonText}>End rent</Text>
            </TouchableOpacity>
        } else {
            endButtonOrRefresh =
                <TextButton
                    text="Refresh..."
                    onPress={() => this.getCurrentInvoice(this.email)}/>
        }
        return (
            <View style={styles.screen}>
                <View style={styles.invoiceMetaDataView}>
                    <InfoField
                        header="Model"
                        text={(this.state.currentInvoice.ebike) ? (this.state.currentInvoice.ebike.model) : "-"}/>
                    <InfoField
                        header="Rentstation Id"
                        text={(this.state.currentInvoice.ebike) ? (this.state.currentInvoice.ebike.rentStation.id) : "-"}/>
                    <InfoField
                        header="Start Date"
                        text={(this.state.currentInvoice) ? (this.state.currentInvoice.startDate) : "-"}/>
                </View>
                <View style={styles.rentTimeContainer}>
                    {timerOrNot}
                    {costs}
                </View>
                <View>
                </View>
                <View style={styles.endRent}>
                    {endButtonOrRefresh}
                </View>
            </View>
        )
    }

}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: "#101820FF",
    },
    invoiceMetaDataView:{
    },
    rentTimeContainer: {
        height: '30%',
        alignItems: 'center',
        justifyContent: 'flex-end'
    },
    timer: {
        marginTop: 10,
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
        alignItems: 'center',
        justifyContent: 'flex-end'
    },
    endRentButton: {
        alignSelf: "center",
        alignItems: "center",
        justifyContent: "center",
        width: "100%"
    },
    buttonText: {
        color: "#6597CA",
        fontSize: 18,
        fontWeight: "bold",
    },
    costs: {
        fontWeight: "bold",
        marginLeft: 5,
        color: "#F2AA4CFF",
    },
    costsContainer: {
        flex: 1,
        flexDirection: "row",
    },
    costsText: {
        color: "#F2AA4CFF",
    }

});

export default MyBike;
