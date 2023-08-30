import React from 'react';
import {SafeAreaView, Text, View, StyleSheet, Image, ScrollView} from "react-native";
import {FlashList} from "@shopify/flash-list";
import OrderItem from "../components/OrderItem";

export default function OrderInfo({navigation, route}) {
    const {orderInfo} = route.params;

    const order = {
        "id": orderInfo.id,
        "dateAndTime": orderInfo.dateAndTime,
        "status": orderInfo.status,
        "shoppingCart": orderInfo.shoppingCart,
        "price": orderInfo.price,
    }

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
        <SafeAreaView style={styles.container}>
            <View style={styles.listTitleContainer}>
                <Image source={require("../assets/shopping-bag.png")} style={{width: 25, height: 25}}/>
                <Text style={styles.listTitleText}>Order list</Text>
            </View>

            <ScrollView style={{flex: 1}}>
                <View style={{height: 100 * order.shoppingCart.length}}>
                    <FlashList data={order.shoppingCart} estimatedItemSize={100}
                               ItemSeparatorComponent={() => (
                                   <View style={styles.itemSeparator}/>
                               )}
                               renderItem={(item) => (
                                   <OrderItem navigation={navigation} route={item}/>
                               )}
                               scrollEnabled={false}
                    />
                </View>
            </ScrollView>

            <View style={styles.subtitleContainer}>
                <View style={{padding: 10, gap: 30}}>
                    <View style={{flexDirection: "row", justifyContent: "space-between"}}>
                        <Text style={styles.orderDetailsText}>{formatDate(order.dateAndTime)}</Text>
                        <Text style={styles.orderDetailsText}>Status: {order.status}</Text>
                    </View>
                    <View>
                        <Text style={styles.orderDetailsText}>Total price: {order.price} {"\u{20BD}"}</Text>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    listTitleContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        padding: 12,
        borderColor: "rgba(158, 150, 150, .4)",
        borderWidth: 1
    },
    listTitleText: {
        fontFamily: "os-bold",
        fontSize: 16,
        paddingLeft: 5
    },
    itemSeparator: {
        borderWidth: 0.5,
        borderColor: "rgba(158, 150, 150, .4)"
    },
    subtitleContainer: {
        flex: 0.15,
        borderColor: "rgba(158, 150, 150, .4)",
        borderWidth: 1,
    },
    orderDetailsText: {
        fontFamily: "os-regular",
        fontSize: 16
    }
});
