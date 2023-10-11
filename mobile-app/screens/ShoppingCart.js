import React, {useContext} from "react";
import {Alert, SafeAreaView, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {globalStyles} from "../styles/globalStyles";
import {Image} from "expo-image";
import {CurrentUserContext} from "../contexts/CurrentUserContext";
import {FlashList} from "@shopify/flash-list";
import CartItem from "../components/CartItem";

export default function ShoppingCart({navigation}) {
    const {currentUser} = useContext(CurrentUserContext);
    const user = JSON.parse(currentUser);

    user && console.log("ShoppingCart.js: shoppingCart = " + JSON.stringify(user.shoppingCart));

    const totalCartPrice = user
        ? user.shoppingCart.reduce((sum, product) => {
            const productTotal = product.price * product.quantity;
            return sum + productTotal;
        }, 0)
        : null;

    return (
        <SafeAreaView style={globalStyles.container}>
            <View style={styles.listTitleContainer}>
                <Image source={require("../assets/shopping-bag.png")} style={{width: 25, height: 25}}/>
                <Text style={styles.listTitleText}>Cart list</Text>
            </View>

            {
                user && user.shoppingCart.length > 0 ? (
                    <>
                        <View style={{flex: 1}}>
                            <FlashList
                                data={user.shoppingCart}
                                renderItem={({item}) =>
                                    <CartItem navigation={navigation} cartItem={item}/>
                                }
                                estimatedItemSize={100}
                                ItemSeparatorComponent={() =>
                                    <View style={styles.itemSeparator}/>
                                }
                                ListHeaderComponent={() => <View style={styles.listHeader}/>}
                                ListFooterComponent={() => <View style={styles.listFooter}/>}
                            />
                        </View>
                        <View style={styles.subtitleContainer}>
                            <Text style={styles.subtitleInfoText}>Total price: {totalCartPrice}</Text>

                            <TouchableOpacity onPress={() => {
                                Alert.alert("Order submission", "Submit order?", [
                                    {
                                        text: "Yes",
                                    },
                                    {
                                        text: "No"
                                    }
                                ]);
                            }}>
                                <View style={styles.submitButton}>
                                    <Text style={styles.buttonText}>Submit order</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </>
                ) : (
                    <View style={styles.emptyDataContainer}>
                        <Text>Empty Cart</Text>
                    </View>
                )
            }
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    emptyDataContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center"
    },
    emptyDataText: {
        fontFamily: "os-regular",
        fontSize: 16
    },
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
    itemSeparator: {
        padding: 5
    },
    listHeader: {
        paddingTop: 10
    },
    listFooter: {
        paddingBottom: 10
    },
    subtitleContainer: {
        flex: 0.15,
        flexDirection: "row",
        justifyContent: "space-around",
        padding: 15,
        gap: 30,
        borderColor: "rgba(158, 150, 150, .4)",
        borderWidth: 1,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15
    },
    subtitleInfoText: {
        fontFamily: "os-regular",
        fontSize: 16
    },
    submitButton: {
        flex: 1,
        borderRadius: 15,
        backgroundColor: "#ab50ee",
        padding: 5,
        paddingHorizontal: 10,
        maxHeight: 50,
        alignItems: "center",
        justifyContent: "center"
    },
    buttonText: {
        fontFamily: "os-bold",
        color: 'white',
        textAlign: "center",
        justifyContent: "center"
    }
})
