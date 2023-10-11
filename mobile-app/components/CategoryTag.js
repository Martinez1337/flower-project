import React from "react";
import {View, Text, TouchableOpacity, StyleSheet, Image} from "react-native";

export default function CategoryTag({category, updateCategoriesTagsState}) {
    return (
        <TouchableOpacity
            style={[styles.container, {backgroundColor: category.isTagged ? "rgba(171,80,238,0.8)" : "#ffffff"}]}
            onPress={() => updateCategoriesTagsState(category.id, !category.isTagged)}
        >
            <View>
                <View style={styles.imageContainer}>
                    <Image source={{uri: category.image}} style={styles.tagImage}/>
                </View>
                <View>
                    <Text
                        style={[styles.tagText, {color: category.isTagged ? "white" : "black"}]}
                        numberOfLines={1}
                        ellipsizeMode={"tail"}
                    >
                        {category.name}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        maxWidth: 100,
        padding: 5,
        marginHorizontal: 5,
        borderRadius: 10,
        borderWidth: .5,
        borderColor: "rgba(158, 150, 150, .5)",
    },
    imageContainer: {
        width: 100,
        marginHorizontal: 5,
        marginVertical: 5,
    },
    tagImage: {
        aspectRatio: 1,
        width: '80%',
        borderRadius: 15,
    },
    tagText: {
        fontFamily: "os-bold-it",
        textAlign: "center",
        fontSize: 12,
    }
})