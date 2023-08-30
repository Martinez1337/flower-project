import React from 'react';
import {View, Text, StyleSheet, Image, Dimensions} from "react-native";

export default function OrderItem({navigation, route}) {
    const orderItem = {
        "id": route.item.id,
        "name": route.item.name,
        "categoryName": route.item.categoryName,
        "quantity": route.item.quantity,
        "price": route.item.price,
        "imageUrl": route.item.image,
    }

    return (
        <View style={styles.container}>
            <View style={styles.imageContainer}>
                <Image source={{uri: orderItem.imageUrl}} style={styles.itemImage}/>
            </View>
            <View style={styles.itemInfoContainer}>
                <View style={styles.itemTitleContainer}>
                    <Text style={[styles.itemInfoText, {fontSize: 16}]}>{orderItem.name}</Text>
                    <View style={styles.itemTagContainer}>
                        <Image source={require("../assets/tag.png")} style={styles.itemTag}/>
                        <Text style={styles.itemTagText}>{orderItem.categoryName}</Text>
                    </View>
                    <View style={styles.itemTagContainer}>
                        <Image source={require("../assets/barcode.png")} style={styles.itemTag}/>
                        <Text style={styles.itemTagText}>{orderItem.id}</Text>
                    </View>
                </View>
                <View style={styles.itemSubtitleContainer}>
                    <Text style={styles.itemCountText}>{orderItem.quantity} pcs</Text>
                    <Text style={styles.itemInfoText}>{orderItem.price} {"\u{20BD}"}</Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "row",
    },
    imageContainer: {
        padding: 5,
        paddingRight: 10
    },
    itemInfoContainer: {
        padding: 5,
        justifyContent: "space-between"
    },
    itemTitleContainer: {
        flexWrap: "wrap",
        alignItems: "flex-start",
        width: Dimensions.get("screen").width * 0.7
    },
    itemTagContainer: {
        flexDirection: "row",
        alignItems: "center"
    },
    itemSubtitleContainer: {
        flexDirection: "row",
        justifyContent: "space-between"
    },
    itemImage: {
        width: 90,
        height: 90,
        overflow: "hidden",
        borderRadius: 20
    },
    itemTag: {
        width: 15,
        height: 15
    },
    itemInfoText: {
        fontFamily: "os-regular"
    },
    itemCountText: {
        fontFamily: "os-light-it"
    },
    itemTagText: {
        fontFamily: "os-light-it",
        fontSize: 14,
        paddingLeft: 5
    }
})
