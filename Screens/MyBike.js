import React, {Component} from 'react'
import {
    StyleSheet,
    Text,
    View,
    Button, TouchableOpacity
} from 'react-native'
import axios from "axios";
import 'intl';
import 'intl/locale-data/jsonp/de';
import 'intl/locale-data/jsonp/en';

class MyBike extends Component {

    email = "PetraMeier@gmail.com"
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
        }
    }
    options;

    constructor() {
        super();
    }

    componentDidMount() {
        this.getCurrentInvoice(this.email)
        let timer = setInterval(this.updateClock, 1000);
        this.setState({timer});
    }

    componentWillUnmount() {
        clearInterval(this.state.timer);
    }

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
        const Url = "http://84.112.202.204:5567/invoices/currentInvoice";

        const params = {
            params: {
                email: emailOfUser
            },
        };

        axios.get(Url, params)
            .then((invoice) => {
                console.log(invoice.data)
                let newInvoice = invoice.data;
                let dateObject;

                if (newInvoice) {
                    dateObject = Date.parse(newInvoice.startDate)
                    console.log(newInvoice.startDate)
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
        const Url = "http://84.112.202.204:5567/invoices/endRent";

        const params = {
            params: {
                invoiceId: this.state.currentInvoice.id
            },
        };

        axios.post(Url, null, params)
            .then((response) => {
                console.log(response.data)
                if (response.data) {
                    this.setState({
                        currentInvoice: {},
                        startDate: null
                    })
                }
            }).catch((err) => console.log(err));
    }

    render() {
        const {days, hours, minutes, seconds} = this.state.timerProperties
        let timerOrRefresh;
        if (this.state.startDate) {
            timerOrRefresh = <View style={styles.timer}><Text
                style={styles.timerText}>{`${days} : ${hours} : ${minutes} : ${seconds}`}</Text></View>;
        } else {
            timerOrRefresh =
                <TouchableOpacity style={styles.refresh} onPress={() => this.getCurrentInvoice('PetraMeier@gmail.com')}>
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
                    <TouchableOpacity disabled={!this.state.startDate} style={this.state.startDate ? styles.endRentButton : styles.disabledButton}
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
