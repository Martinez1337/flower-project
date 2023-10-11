import React, {useRef, useState} from "react";
import {Image, StyleSheet, Text, TextInput, TouchableOpacity, View} from "react-native";
import ImageModal from "react-native-image-modal";

export default function CartItem({navigation, cartItem}) {
    const [itemCount, setItemCount] = useState(cartItem.quantity);
    const inputRef = useRef(null);

    const handleIncrement = () => {
        setItemCount(itemCount + 1);
    };

    const handleDecrement = () => {
        if (itemCount > 1) {
            setItemCount(itemCount - 1);
        }
    };

    const handleInputChange = (text) => {
        if (text === '') {
            setItemCount(1);
        } else {
            const number = parseInt(text, 10);
            if (!isNaN(number) && number >= 1) {
                setItemCount(number);
            }
        }
    };

    const handleInputFocus = () => {
        if (inputRef.current) {
            inputRef.current.clear();
            setItemCount(null);
        }
    };

    const handleInputBlur = () => {
        if (itemCount === null) {
            setItemCount(cartItem.quantity);
        }
    };

    return (
        <TouchableOpacity style={styles.container}>
            <View style={styles.imageContainer}>
                <ImageModal source={{uri: cartItem.image}}
                            style={styles.itemImage}
                            placeholder={require("../assets/placeholder-image.png")}
                            disabled={true}
                            modalImageStyle={{flex: 1}}
                />
            </View>
            <View style={styles.itemInfoContainer}>
                <View style={{marginLeft: 5}}>
                    <Text style={[styles.itemInfoText,{fontSize: 16}]}>{cartItem.name}</Text>
                    <View style={styles.itemTagContainer}>
                        <Image source={require("../assets/tag.png")} style={styles.itemTag}/>
                        <Text style={styles.itemTagText}>{cartItem.categoryName}</Text>
                    </View>
                    <View style={styles.itemTagContainer}>
                        <Image source={require("../assets/barcode.png")} style={styles.itemTag}/>
                        <Text style={styles.itemTagText}>{cartItem.id}</Text>
                    </View>
                </View>
            </View>

            <View style={styles.editContainer}>
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
                            value={itemCount === null ? "" : itemCount.toString()}
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
                    <TouchableOpacity style={styles.deleteContainer}>
                        <Image source={require("../assets/delete.png")} style={styles.deleteIcon}/>
                    </TouchableOpacity>
                </View>
                <View style={{marginTop: 5}}>
                    <Text style={[styles.itemInfoText, {marginLeft: -30}]}>
                        {cartItem.price * cartItem.quantity} {"\u{20BD}"}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    )
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
    itemImage: {
        width: 90,
        height: 90,
        overflow: "hidden",
        borderRadius: 20
    },
    itemInfoContainer: {
        flex: 1,
        padding: 5,
        justifyContent: "space-between"
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
    editContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
        marginTop: 5
    },
    addingContainer: {
        flexDirection: "row",
        alignItems: "center",
        maxHeight: 40,
        marginBottom: -5
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
    deleteContainer: {
        marginHorizontal: 10
    },
    deleteIcon: {
        width: 20,
        height: 20
    }
})