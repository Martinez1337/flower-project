import React, {useState} from "react";
import {View, Text, StyleSheet, TouchableOpacity} from "react-native";
import {Image} from 'expo-image';

export default function OrdersHistoryItem({navigation, orderInfo}) {
    const maxItemsToShow = 5;
    const [showAllItems, setShowAllItems] = useState(false);

    const order = {
        "id": orderInfo.id,
        "dateAndTime": orderInfo.dateAndTime,
        "status": orderInfo.status,
        "shoppingCart": orderInfo.shoppingCart,
        "price": orderInfo.price,
    }

    const renderedItems = showAllItems ? order.shoppingCart : order.shoppingCart.slice(0, maxItemsToShow);

    const formatDate = (dateTimeString) => {
        const dateTime = new Date(dateTimeString);
        const options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric'
        };

        return dateTime.toLocaleDateString('en', options);
    }

    return (
        <TouchableOpacity
            style={{flex: 1}}
            onPress={() => {navigation.navigate('OrderInfo', {orderInfo: orderInfo})}}
        >
            <View style={styles.container}>
                <View style={styles.orderTopInfo}>
                    <Text style={styles.orderTopInfoText}>Order ID: {order.id}</Text>
                    <Text style={styles.orderTopInfoText}>Price: {order.price} {"\u{20BD}"}</Text>
                </View>
                <View style={styles.orderTopInfo}>
                    <Text style={styles.commonText}>{formatDate(order.dateAndTime)}</Text>
                    <View style={{flexDirection: "row"}}>
                        <Image source={require("../assets/delivery-status.png")} style={styles.statusIcon}/>
                        <Text style={[styles.commonText]}>{order.status}</Text>
                    </View>
                </View>
                <View style={{paddingTop: 10, paddingLeft: 15}}>
                    <Text style={styles.orderTopInfoText}>Items:</Text>
                    {
                        renderedItems.map((item) => {
                            return (
                                <View key={item.id}>
                                    <Text style={styles.commonText}>{item.name} - {item.quantity} pcs</Text>
                                </View>
                            );
                        })
                    }
                    {
                        !showAllItems && order.shoppingCart.length > maxItemsToShow && (
                            <View style={{marginTop: -10}}>
                                <Text style={styles.moreItemsText}>...</Text>
                            </View>
                        )
                    }
                </View>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        borderWidth: 0.5,
        borderColor: "rgba(158, 150, 150, .4)",
        borderRadius: 25,
        marginHorizontal: 10,
        padding: 5
    },
    orderTopInfo: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingLeft: 15,
        paddingRight: 15
    },
    orderTopInfoText: {
        fontFamily: "os-bold",
    },
    commonText: {
        fontFamily: "os-regular"
    },
    moreItemsText: {
        fontFamily: "os-regular",
        alignSelf: "flex-start",
        fontSize: 20,
        marginLeft: 10
    },
    statusIcon: {
        width: 20,
        height: 20,
        marginHorizontal: 5
    }
});
