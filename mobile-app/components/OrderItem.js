import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from "react-native";
import {Image} from 'expo-image';
import ImageModal from 'react-native-image-modal'

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
        <TouchableOpacity
            style={styles.container}
            onPress={() => navigation.navigate('Product', {item: route.item})}
        >
            <View style={styles.imageContainer}>
                <ImageModal source={{uri: orderItem.imageUrl}}
                            style={styles.itemImage}
                            placeholder={require("../assets/placeholder-image.png")}
                            disabled={true}
                            modalImageStyle={{flex: 1}}
                />
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
                    <Text style={styles.itemInfoText}>{orderItem.price * orderItem.quantity} {"\u{20BD}"}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "row",
        borderWidth: 0.5,
        borderColor: "rgba(158, 150, 150, .4)",
        borderRadius: 25,
        marginHorizontal: 10,
        paddingRight: 10
    },
    imageContainer: {
        padding: 5,
        paddingRight: 10
    },
    itemInfoContainer: {
        flex: 1,
        padding: 5,
        justifyContent: "space-between"
    },
    itemTitleContainer: {
        flex: 1,
        alignItems: "flex-start"
    },
    itemTagContainer: {
        flexDirection: "row",
        alignItems: "center"
    },
    itemSubtitleContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginRight: 15,
        marginBottom: 5
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
