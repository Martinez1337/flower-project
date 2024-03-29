import React, {useContext, useRef, useState} from "react";
import {
    SafeAreaView,
    StyleSheet,
    Image,
    TouchableOpacity,
    View,
    Text,
    TextInput,
    ScrollView,
    KeyboardAvoidingView,
    Platform, Alert
} from "react-native";
import ImageView from "react-native-image-viewing";
import {globalStyles} from "../styles/globalStyles";
import {useHeaderHeight} from '@react-navigation/elements';
import axios from "axios";
import {API_LINK} from "../consts/links";
import {CurrentUserContext} from "../contexts/CurrentUserContext";

export default function Product({navigation, route}) {
    const {currentUser, setCurrentUser} = useContext(CurrentUserContext);
    const user = JSON.parse(currentUser);

    const {item} = route.params;
    const headerHeight = useHeaderHeight();

    const [isImageVisible, setIsImageVisible] = useState(false);
    const [itemAddCount, setItemAddCount] = useState(() => {
        if (item.isInCart) {
            const cartItem = user.shoppingCart.find(cartItem => cartItem.id === item.id);
            if (cartItem) {
                return cartItem.quantity;
            } else {
                item.isInCart = false;
                return 1;
            }
        } else {
            return 1;
        }
    });

    const inputRef = useRef(null);

    const handleIncrement = () => {
        setItemAddCount(itemAddCount + 1);
        const itemIndex = user.shoppingCart.findIndex(cartItem => item.id === cartItem.id);
        if (itemIndex >= 0) {
            user.shoppingCart[itemIndex].quantity += 1;
            setCurrentUser(JSON.stringify(user));
        }
    };

    const handleDecrement = () => {
        if (itemAddCount > 1) {
            setItemAddCount(itemAddCount - 1);
            const itemIndex = user.shoppingCart.findIndex(cartItem => item.id === cartItem.id);
            if (itemIndex >= 0) {
                user.shoppingCart[itemIndex].quantity -= 1;
                setCurrentUser(JSON.stringify(user));
            }
        }
    };

    const handleInputChange = (text) => {
        const itemIndex = user.shoppingCart.findIndex(cartItem => item.id === cartItem.id);
        if (text === '') {
            setItemAddCount(1);
            if (itemIndex >= 0) {
                user.shoppingCart[itemIndex].quantity = 1;
                setCurrentUser(JSON.stringify(user));
            }
        } else {
            const number = parseInt(text, 10);
            if (!isNaN(number) && number >= 1) {
                setItemAddCount(number);
                if (itemIndex >= 0) {
                    user.shoppingCart[itemIndex].quantity = number;
                    setCurrentUser(JSON.stringify(user));
                }
            }
        }
    };

    const handleInputFocus = () => {
        if (inputRef.current) {
            inputRef.current.clear();
            setItemAddCount(null);
        }
    };

    const handleInputBlur = () => {
        if (itemAddCount === null) {
            setItemAddCount(1);
        }
    };

    const addToCart = ({item}) => {
        if (user) {
            console.log("Add to cart " + item.name);

            user.shoppingCart.push({ ...item, quantity: itemAddCount });

            axios.patch(`${API_LINK}/Users/shoppingCart?id=${user.id}`, user.shoppingCart).then(() => {
                setCurrentUser(() => JSON.stringify(user));
            }).catch(error => console.log(error));

            item.isInCart = true;
        } else {
            Alert.alert("Sign In", "To continue, please, sign in", [
                {
                    text: "Ok",
                    onPress: () => {navigation.navigate('UserPage')}
                },
                {
                    text: "Cancel"
                }
            ]);
        }
    }

    const deleteFromCart = ({cartItem}) => {
        if (user) {
            user.shoppingCart = user.shoppingCart.filter((item) => item.id !== cartItem.id);

            axios.patch(`${API_LINK}/Users/shoppingCart?id=${user.id}`, user.shoppingCart).then(() => {
                setCurrentUser(() => JSON.stringify(user));
            }).catch(error => console.log(error));

            cartItem.isInCart = false;
        }
    }

    return (
        <SafeAreaView style={globalStyles.container}>
            <View style={styles.productHeaderContainer}>
                <View>
                    <TouchableOpacity
                        style={styles.imageContainer}
                        onPress={() => setIsImageVisible(true)}
                    >
                        <Image source={{uri: item.image}} style={styles.itemImage}/>
                    </TouchableOpacity>
                    <ImageView
                        images={[{uri: item.image}]}
                        imageIndex={0}
                        visible={isImageVisible}
                        onRequestClose={() => setIsImageVisible(false)}
                    />
                </View>
                <View style={styles.itemInfoContainer}>
                    <View style={styles.labelContainer}>
                        <Text style={styles.itemLabelText}>{item.name}</Text>
                    </View>
                    <View style={{justifyContent: "flex-end"}}>
                        <View style={styles.itemTagContainer}>
                            <Image source={require("../assets/barcode.png")} style={styles.itemTagIcon}/>
                            <Text style={styles.itemTagText}>Item ID: {item.id}</Text>
                        </View>
                        <View style={styles.itemTagContainer}>
                            <Image source={require("../assets/tag.png")} style={styles.itemTagIcon}/>
                            <Text style={styles.itemTagText}>{item.categoryName}</Text>
                        </View>
                        <View style={styles.itemTagContainer}>
                            <Image source={require("../assets/ready-stock.png")} style={styles.itemTagIcon}/>
                            <Text style={styles.itemTagText}>In stock - {item.count} pcs</Text>
                        </View>
                    </View>
                </View>
            </View>

            <View style={styles.separatorLine}/>

            <ScrollView style={styles.descriptionContainer}>
                <View style={{marginHorizontal: 15}}>
                    <Text style={styles.descriptionLabelText}>Description</Text>
                    <Text style={styles.descriptionText}>{item.description}</Text>
                </View>
            </ScrollView>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={headerHeight + 100}
            >
                <View style={styles.subtitleContainer}>
                    <Text style={styles.priceText}>Price: {item.price} {"\u{20BD}"}</Text>
                    <View style={styles.addingContainer}>
                        <TouchableOpacity style={styles.minusButton} onPress={handleDecrement}>
                            <View style={styles.buttonTextContainer}>
                                <Text style={[styles.buttonText, {fontSize: 18}]}>–</Text>
                            </View>
                        </TouchableOpacity>
                        <View style={styles.countContainer}>
                            <TextInput
                                style={styles.textInput}
                                ref={inputRef}
                                value={itemAddCount === null ? "" : itemAddCount.toString()}
                                autoCorrect={false}
                                keyboardType={"numeric"}
                                onChangeText={handleInputChange}
                                onFocus={handleInputFocus}
                                onBlur={handleInputBlur}
                            />
                        </View>
                        <TouchableOpacity style={styles.plusButton} onPress={handleIncrement}>
                            <View style={styles.buttonTextContainer}>
                                <Text style={[styles.buttonText, {fontSize: 18}]}>+</Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => !item.isInCart
                                ? addToCart({item: item})
                                : deleteFromCart({cartItem: item})}
                        >
                            <View style={[styles.addButton, {backgroundColor: item.isInCart ? "#c388ef" : "#ab50ee"}]}>
                                <Text style={styles.buttonText}>{item.isInCart ? "Added to cart" : "Add to cart"}</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    productHeaderContainer: {
        flexDirection: "row",
        marginVertical: 20,
        marginHorizontal: 20
    },
    itemImage: {
        width: 180,
        height: 180,
        overflow: "hidden",
        borderRadius: 15
    },
    itemInfoContainer: {
        marginLeft: 20,
        marginRight: 180
    },
    labelContainer: {
        flex: 1,
        marginBottom: 5
    },
    itemLabelText: {
        fontFamily: "os-light-it",
        fontSize: 24
    },
    itemTagContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 5
    },
    itemTagIcon: {
        width: 20,
        height: 20,
        tintColor: "rgb(52,52,52)"
    },
    itemTagText: {
        marginLeft: 5,
        fontFamily: "os-light",
        fontSize: 14
    },
    separatorLine: {
        borderBottomWidth: 1,
        borderColor: "rgba(158, 150, 150, .4)",
    },
    descriptionContainer: {
        marginTop: 10
    },
    descriptionLabelText: {
        fontFamily: "os-light",
        fontSize: 22,
        marginBottom: 5
    },
    descriptionText: {
        fontFamily: "os-regular",
        fontSize: 14,
        lineHeight: 20,
        textAlign: "justify",
    },
    subtitleContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 20,
        borderColor: "rgba(158, 150, 150, .4)",
        borderTopWidth: 1,
        borderStartWidth: 1,
        borderEndWidth: 1,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        backgroundColor: "white"
    },
    priceText: {
        fontFamily: "os-regular",
        fontSize: 16,
        marginLeft: 10
    },
    addingContainer: {
        flexDirection: "row",
        alignItems: "center",
        maxHeight: 40
    },
    minusButton: {
        backgroundColor: "#ab50ee",
        borderTopLeftRadius: 30,
        borderBottomLeftRadius: 30,
        paddingHorizontal: 10,
    },
    countContainer: {
        borderWidth: 2,
        borderColor: "#ab50ee",
        padding: 10,
    },
    textInput: {
        fontFamily: "os-regular",
        fontSize: 15,
        textAlign: "center"
    },
    plusButton: {
        backgroundColor: "#ab50ee",
        borderTopRightRadius: 30,
        borderBottomRightRadius: 30,
        paddingHorizontal: 10
    },
    buttonTextContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    buttonText: {
        fontFamily: "os-bold",
        color: 'white',
        textAlign: "center",
        justifyContent: "center"
    },
    addButton: {
        flex: 1,
        borderRadius: 15,
        padding: 11,
        marginHorizontal: 10,
        alignItems: "center",
        justifyContent: "center",
    }
})