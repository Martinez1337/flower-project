import React from 'react';
import {SafeAreaView, Text, View, StyleSheet} from "react-native";
import {FlashList} from "@shopify/flash-list";
import {Image} from 'expo-image';
import OrderItem from "../components/OrderItem";
import {globalStyles} from "../styles/globalStyles";

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
        <SafeAreaView style={globalStyles.container}>
            <View style={styles.listTitleContainer}>
                <Image source={require("../assets/shopping-bag.png")} style={{width: 25, height: 25}}/>
                <Text style={styles.listTitleText}>Order list</Text>
            </View>

            <View style={{flex: 1}}>
                <FlashList data={order.shoppingCart} estimatedItemSize={100}
                           ItemSeparatorComponent={() => (
                               <View style={styles.itemSeparator}/>
                           )}
                           renderItem={(item) => (
                               <OrderItem navigation={navigation} route={item}/>
                           )}
                           ListHeaderComponent={() => <View style={styles.listHeader}/>}
                           ListFooterComponent={() => <View style={styles.listFooter}/>}
                />
            </View>

            <View style={styles.subtitleContainer}>
                <View style={{flexDirection: "row", justifyContent: "space-between"}}>
                    <Text style={styles.orderDetailsText}>{formatDate(order.dateAndTime)}</Text>
                    <Text style={styles.orderDetailsText}>Status: {order.status}</Text>
                </View>
                <View>
                    <Text style={styles.orderDetailsText}>Total price: {order.price} {"\u{20BD}"}</Text>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    listTitleContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        padding: 12,
        borderColor: "rgba(158, 150, 150, .4)",
        borderWidth: 1,
        borderBottomLeftRadius: 15,
        borderBottomRightRadius: 15
    },
    listTitleText: {
        fontFamily: "os-bold",
        fontSize: 16,
        paddingLeft: 5
    },
    listHeader: {
        paddingTop: 10
    },
    listFooter: {
        paddingBottom: 10
    },
    itemSeparator: {
        padding: 5
    },
    subtitleContainer: {
        flex: 0.15,
        padding: 15,
        gap: 30,
        borderColor: "rgba(158, 150, 150, .4)",
        borderWidth: 1,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15
    },
    orderDetailsText: {
        fontFamily: "os-regular",
        fontSize: 16
    }
});
