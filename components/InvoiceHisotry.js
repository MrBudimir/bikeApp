import React, { Component } from "react";
import { View, Text, StyleSheet, Modal, FlatList } from "react-native";
import TextButton from "./TextButton";

class InvoiceHistory extends Component {
  formatDate(dateString) {
    if (dateString) {
      let dateObject = Date.parse(dateString);
      this.options = {
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        day: "numeric",
        month: "numeric",
        year: "numeric",
      };
      return new Intl.DateTimeFormat("de-DE", this.options).format(dateObject);
    } else {
      return "rent is ended";
    }
  }

  render() {
    return (
      <Modal
        visible={this.props.visible}
        animationType="fade"
        transparent={true}
      >
        <View style={styles.popup}>
          <View style={styles.popupCard}>
            <TextButton
              onPress={this.props.onExitPress.bind(this)}
              text="Exit"
              style={styles.button}
            />
            <View style={{ marginLeft: 25 }}>
              <Text style={styles.title}>Invoice History</Text>
              <View style={styles.listContainer}>
                <FlatList
                  data={this.props.data}
                  renderItem={({ item }) => (
                    <View style={styles.listItemContainer}>
                      <Text style={styles.listItem}>{item.ebike.model}</Text>
                      <Text style={styles.listItem}>
                        Begin: {this.formatDate(item.startDate)}
                      </Text>
                      <Text style={styles.listItem}>
                        End: {this.formatDate(item.endDate)}
                      </Text>
                    </View>
                  )}
                  keyExtractor={(item) => item.id.toString()}
                />
              </View>
            </View>
          </View>
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  popup: {
    flex: 1,
    backgroundColor: "#000000AA",
    justifyContent: "center",
    alignItems: "center",
  },
  popupCard: {
    backgroundColor: "#101820FF",
    height: "85%",
    width: "90%",
    borderRadius: 5,
  },
  title: {
    color: "#F2AA4CFF",
    alignSelf: "center",
    fontWeight: "bold",
    fontSize: 20,
    marginTop: 10,
  },
  button: {
    marginTop: 15,
    marginRight: 15,
    alignItems: "flex-end",
  },
  listContainer: {
    marginRight: 20,
    marginTop: 15,
    height: "85%",
  },
  listItemContainer: {
    marginTop: 15,
    borderBottomWidth: 2,
    borderBottomColor: "#F2AA4CFF",
    borderRadius: 2,
  },
  listItem: {
    color: "white",
    fontSize: 16,
    marginBottom: 10,
  },
});

export default InvoiceHistory;
