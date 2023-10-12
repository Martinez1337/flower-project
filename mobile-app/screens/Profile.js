import React, {useCallback, useContext, useEffect, useState} from "react";
import {
    SafeAreaView,
    ScrollView,
    Text,
    View,
    StyleSheet,
    RefreshControl,
    TouchableOpacity,
    ActivityIndicator
} from "react-native";
import {Image} from 'expo-image';
import {FlashList} from "@shopify/flash-list";
import axios from "axios";
import {API_LINK} from "../consts/links";
import OrdersHistoryItem from "../components/OrdersHistoryItem";
import {CurrentUserContext} from "../contexts/CurrentUserContext";
import {globalStyles} from "../styles/globalStyles";

export default function Profile({navigation}) {
    const {currentUser} = useContext(CurrentUserContext);
    const user = JSON.parse(currentUser);

    const [orders, setOrders] = useState(null);
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user && !orders) {
            setLoading(true);
            getOrders();
        }
    }, []);

    const getOrders = () => {
        axios.get(`${API_LINK}/Orders/byClientId?clientId=${user.id}`)
            .then((res) => {
                setOrders(res.data);
                setLoading(false);
                console.log("Profile.js: Axios get request's done - orders are fetched");
            }).catch((e) => {
                setLoading(false);
                console.log(e);
        });
    };

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        getOrders();
        setRefreshing(false);
        console.log("Profile.js: order history's refreshed");
    }, []);

    return (
        user &&
        <SafeAreaView style={globalStyles.container}>
            <View>
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

            {
                loading ? (
                    <View style={styles.emptyDataContainer}>
                        <ActivityIndicator size={"small"} color={"grey"}/>
                    </View>
                ) : (
                    <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>}
                                showsVerticalScrollIndicator={false}
                    >
                        {
                            !refreshing && orders ? (
                                <View style={{minHeight: 2}}>
                                    <FlashList data={orders.sort((a, b) => b.id - a.id)}
                                               estimatedItemSize={100}
                                               scrollEnabled={false}
                                               ItemSeparatorComponent={() => (
                                                   <View style={styles.itemSeparator}/>
                                               )}
                                               renderItem={({item}) => (
                                                   <OrdersHistoryItem navigation={navigation} orderInfo={item}/>
                                               )}
                                               ListHeaderComponent={() => <View style={styles.listHeader}/>}
                                               ListFooterComponent={() => <View style={styles.listFooter}/>}
                                    />
                                </View>
                            ) : (
                                <View style={[styles.emptyDataContainer, {marginTop: 20}]}>
                                    <Text>No orders yet</Text>
                                </View>
                            )
                        }
                    </ScrollView>
                )
            }
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    emptyDataContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
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
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderColor: "rgba(158, 150, 150, .5)",
        borderBottomLeftRadius: 15,
        borderBottomRightRadius: 15
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
        padding: 5
    },
    listHeader: {
        paddingTop: 10
    },
    listFooter: {
        paddingBottom: 10
    }
});
