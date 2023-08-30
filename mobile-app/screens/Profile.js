import React, {useCallback, useContext, useEffect, useState} from "react";
import {
    Image,
    SafeAreaView,
    ScrollView,
    Text,
    View,
    StyleSheet,
    RefreshControl,
    Dimensions,
    TouchableOpacity
} from "react-native";
import {FlashList} from "@shopify/flash-list";
import axios from "axios";
import OrdersHistoryItem from "../components/OrdersHistoryItem";
import {CurrentUserContext} from "../contexts/CurrentUserContext";

export default function Profile({navigation, route}) {
    const {currentUser} = useContext(CurrentUserContext);
    const user = JSON.parse(currentUser);

    const [orders, setOrders] = useState([]);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        getOrders();
    }, [currentUser]);

    const getOrders = () => {
        axios.get(`http://localhost:7153/Orders/byClientId?clientId=${user.id}`)
            .then((res) => {
                setOrders(res.data);
                console.log("Axios get request done - orders set res.data");
            }).catch((e) => {
                console.log(e);
        })
    };

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        getOrders();
        setRefreshing(false);
        console.log("refreshed");
    }, []);

    return (
        <SafeAreaView style={{flex: 1}}>
            <View style={{flex: 0.25}}>
                <View style={styles.userNameBlock}>
                    <View style={styles.avatarContainer}>
                        <Image source={require("../assets/user-profile.png")} style={styles.avatarImage}/>
                    </View>

                    <View style={styles.fullName}>
                        <Text style={styles.fullNameText}>{user.firstName}</Text>
                        <Text style={styles.fullNameText}>{user.lastName}</Text>
                    </View>
                </View>

                <View style={styles.contactDetails}>
                    <View>
                        <View style={{flexDirection: "row", alignItems: "center"}}>
                            <Image source={require("../assets/email.png")} style={styles.contactDetailsImage}/>
                            <Text style={styles.contactDetailsText}>{user.email}</Text>
                        </View>
                        <View style={{flexDirection: "row", alignItems: "center"}}>
                            <Image source={require("../assets/telephone.png")} style={styles.contactDetailsImage}/>
                            <Text style={styles.contactDetailsText}>{user.phoneNumber}</Text>
                        </View>
                    </View>

                    <TouchableOpacity onPress={() => navigation.navigate('EditProfile')}>
                        <Image source={require("../assets/resume.png")} style={styles.editImage}/>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.historyTitleContainer}>
                <Text style={styles.historyTitle}>Orders history</Text>
            </View>

            <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>}
                        style={{flex: 1}}
            >
                {
                    !refreshing && orders !== [] ? (
                        <View style={{height: Dimensions.get("screen").height}}>
                            <FlashList data={orders.sort((a, b) => b.id - a.id)} estimatedItemSize={150}
                                       ItemSeparatorComponent={() => (
                                           <View style={styles.itemSeparator}/>
                                       )}
                                       renderItem={({item}) => (
                                           <OrdersHistoryItem navigation={navigation} orderInfo={item}/>
                                       )}
                                       scrollEnabled={false}
                            />
                        </View>
                    ) : (
                        <View style={{flex: 1, alignItems: "center", justifyContent: "center"}}>
                            <Text>No orders yet</Text>
                        </View>
                    )
                }
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    avatarContainer: {
        borderRadius: 10,
        paddingBottom: 10,
        paddingTop: 10,
    },
    avatarImage: {
        width: 80,
        height: 80,
        borderRadius: 63,
        borderWidth: 5,
        borderColor: "rgba(87, 87, 87, 1)",
        tintColor: "rgba(87, 87, 87, 1)"
    },
    contactDetailsImage: {
        width: 18,
        height: 18,
        tintColor: "rgba(87, 87, 87, 1)"
    },
    userNameBlock: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center"
    },
    fullName: {
        padding: 20,
    },
    fullNameText: {
        fontFamily: "os-bold",
        fontSize: 20,
    },
    contactDetails: {
        paddingLeft: 15,
        paddingRight: 15,
        paddingBottom: 10,
        flexDirection: "row",
        justifyContent: "space-between"
    },
    contactDetailsText: {
        fontFamily: "os-regular",
        fontSize: 15,
        paddingLeft: 10
    },
    historyTitleContainer: {
        alignItems: "center",
        justifyContent: "center",
        paddingTop: 22,
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderColor: "rgba(158, 150, 150, .4)"
    },
    historyTitle: {
        fontFamily: "os-bold",
        fontSize: 16,
    },
    editImage: {
        width: 25,
        height: 25,
        tintColor: "rgba(87, 87, 87, 1)"
    },
    itemSeparator: {
        borderWidth: 1,
        borderColor: "rgba(158, 150, 150, .4)"
    }
});
