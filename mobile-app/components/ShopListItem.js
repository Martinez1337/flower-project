import React from "react";
import {StyleSheet, Text, TouchableOpacity, View, Image} from "react-native";

export default function ShopListItem({navigation, item, addToCart, deleteFromCart}) {
    return (
        <TouchableOpacity
            style={styles.container}
            onPress={() =>
            {navigation.navigate('Product', {item: item})}}
        >
            <View style={styles.imageContainer}>
                <Image source={{uri: item.image}} style={styles.itemImage}/>
            </View>
            <View style={{marginLeft: 5}}>
                <Text style={[styles.itemInfoText,{fontSize: 16}]}>{item.name}</Text>
                <View style={styles.itemTagContainer}>
                    <Image source={require("../assets/tag.png")} style={styles.itemTag}/>
                    <Text style={styles.itemTagText}>{item.categoryName}</Text>
                </View>
            </View>
            <View style={styles.cardSubtitleContainer}>
                <Text style={[styles.itemInfoText, {fontSize: 16}]}>{item.price} {"\u{20BD}"}</Text>
                <TouchableOpacity
                    onPress={() => !item.isInCart
                        ? addToCart({item: item})
                        : deleteFromCart({cartItem: item})}
                >
                    <View style={[styles.addButton, {backgroundColor: item.isInCart ? "#c388ef" : "#ab50ee"}]}>
                        <Text style={styles.addButtonText}>{item.isInCart ? "Added" : "Add"}</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        borderWidth: 0.5,
        borderColor: "rgba(158, 150, 150, .4)",
        borderRadius: 12,
        marginHorizontal: 5,
        padding: 5
    },
    imageContainer: {
        flex: 1,
        marginHorizontal: 5,
        marginVertical: 5,
    },
    itemImage: {
        aspectRatio: 1,
        width: '100%',
        borderRadius: 10,
        backgroundColor: "rgba(158, 150, 150, .4)"
    },
    itemInfoText: {
        fontFamily: "os-regular"
    },
    itemTagContainer: {
        flexDirection: "row",
        alignItems: "center"
    },
    itemTag: {
        width: 15,
        height: 15
    },
    itemTagText: {
        fontFamily: "os-light-it",
        fontSize: 14,
        paddingLeft: 5
    },
    cardSubtitleContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginHorizontal: 10,
        marginVertical: 10
    },
    addButton: {
        flex: 1,
        borderRadius: 25,
        padding: 5,
        paddingHorizontal: 10
    },
    addButtonText: {
        fontFamily: "os-bold",
        color: "white"
    }
});
