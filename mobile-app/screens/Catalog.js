import React, {useCallback, useEffect, useState} from "react";
import {
    SafeAreaView,
    Text,
    StyleSheet,
    ActivityIndicator,
    View,
    TouchableOpacity,
    TextInput,
    RefreshControl,
    ScrollView,
    FlatList
} from "react-native";
import {Image} from 'expo-image';
import axios from "axios";
import {API_LINK} from "../consts/links";
import {FlashList} from "@shopify/flash-list";
import ShopListItem from "../components/ShopListItem";
import CategoryTag from "../components/CategoryTag";
import {globalStyles} from "../styles/globalStyles";

export default function Catalog({navigation}) {
    const [items, setItems] = useState([]);
    const [categories, setCategories] = useState([]);

    const [searchText, setSearchText] = useState("");
    const [expanded, setExpended] = useState(false);

    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState(null);

    const filteredData = items.filter(item => {
        const searchMatches = item.name
            .toLowerCase().replace(/\s/g, '')
            .includes(searchText.toLowerCase().replace(/\s/g, ''));

        const anyCategoryTagged = categories.some(category => category.isTagged);

        const categoryMatches = anyCategoryTagged
            ? categories.some(category => {
                return category.isTagged && category.id === item.categoryId;
            })
            : true;

        return searchMatches && categoryMatches;
    });

    useEffect(() => {
        setLoading(true);
        getData();
    }, []);

    const getData = () => {
        setError(null);
        try {
            axios.get(`${API_LINK}/Items`).then((itemsRes) => {
                console.log("Catalog.js: Axios get request's done - items are fetched");
                axios.get(`${API_LINK}/Categories`).then((categoriesRes) => {
                    console.log("Catalog.js: Axios get request's done - categories are fetched");
                    const taggedCategories = categoriesRes.data.map(category => ({...category, isTagged: false}))
                    setItems(itemsRes.data.map((item) => {
                        const category = taggedCategories.find((category) => category.id === item.categoryId);
                        if (category) {
                            return {...item, categoryName: category.name};
                        }
                        return item;
                    }));
                    setCategories(taggedCategories);
                    });
                });
        } catch (error) {
            setError(error);
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        void getData();
        setRefreshing(false);
        console.log("Catalog.js: catalog data was refreshed");
    }, []);

    const updateCategoriesTagsState = (id, newValue) => {
        setCategories(categories.map(category =>
            category.id === id ? {...category, isTagged: newValue} : category
        ));
    };

    if (loading) {
        return (
            <View style={styles.emptyDataContainer}>
                <ActivityIndicator size={"small"} color={"grey"}/>
            </View>
        )
    }

    if (error !== null) {
        return (
            <View style={styles.emptyDataContainer}>
                <Text>Error receiving data from server</Text>
                <TouchableOpacity style={styles.retryButton} onPress={onRefresh}>
                    <Text style={styles.retryText}>Try again</Text>
                </TouchableOpacity>
            </View>
        )
    }

    return (
        <SafeAreaView style={globalStyles.container}>
            <View style={{flexDirection: "row"}}>
                <View style={styles.searchBar}>
                    <Image source={require("../assets/find.png")} style={styles.searchIcon}/>
                    <TextInput
                        style={styles.searchTextInput}
                        placeholder={"Search"}
                        value={searchText}
                        clearButtonMode={"always"}
                        autoCapitalize={"none"}
                        autoCorrect={false}
                        onChangeText={text => setSearchText(text)}
                    />
                </View>
                <TouchableOpacity onPress={() => setExpended(!expanded)}>
                    <View style={styles.categoryIconContainer}>
                        <Image source={require("../assets/category.png")} style={styles.categoryIcon}/>
                    </View>
                </TouchableOpacity>
            </View>

            {
                expanded && (
                    <View style={styles.categoriesContainer}>
                        <View style={{flexDirection: "row", marginVertical: 10}}>
                            <Image source={require("../assets/tag.png")} style={styles.categoryTag}/>
                            <Text style={styles.categoryTitle}>Categories</Text>
                        </View>

                        <ScrollView
                            horizontal={true}
                            showsHorizontalScrollIndicator={false}
                            directionalLockEnabled={true}
                            alwaysBounceVertical={false}
                            style={{paddingHorizontal: 5}}
                        >
                            <FlatList
                                data={categories}
                                renderItem={({item}) =>
                                    <CategoryTag
                                        category={item}
                                        updateCategoriesTagsState={updateCategoriesTagsState}
                                    />
                                }
                                estimatedItemSize={80}
                                numColumns={Math.ceil(categories.length / 2)}
                                scrollEnabled={false}
                                ItemSeparatorComponent={() => (
                                    <View style={styles.itemSeparator}/>
                                )}
                            />
                        </ScrollView>
                    </View>
                )
            }

            <View style={styles.listContainer}>
                <FlashList
                    data={filteredData}
                    numColumns={2}
                    renderItem={({item}) =>
                        <ShopListItem navigation={navigation} item={item}/>
                    }
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>}
                    ItemSeparatorComponent={() =>
                        <View style={styles.itemSeparator}/>
                    }
                    estimatedItemSize={100}
                    contentContainerStyle={{paddingHorizontal: 5}}
                    ListHeaderComponent={() => <View style={styles.listHeader}/>}
                    ListFooterComponent={() => <View style={styles.listFooter}/>}
                />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    searchBar: {
        width: "82%",
        marginLeft: 15,
        marginTop: 10,
        marginBottom: 5,
        padding: 10,
        flexDirection: "row",
        backgroundColor: "white",
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "rgba(158, 150, 150, .3)",
        alignItems: "center"
    },
    searchIcon: {
        width: 20,
        height: 20,
        tintColor: "black",
        marginLeft: 5,
        marginRight: 10
    },
    searchTextInput: {
        flex: 1,
        fontFamily: "os-regular",
        fontSize: 15
    },
    categoryIconContainer: {
        flex: 1,
        borderRadius: 10,
        marginLeft: 5,
        marginBottom: 5,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
        marginTop: 10,
        borderColor: "rgba(158, 150, 150, .3)",
        padding: 10,
        backgroundColor: "#ab50ee"
    },
    emptyDataContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    retryButton: {
        borderRadius: 15,
        backgroundColor: "#ab50ee",
        padding: 5,
        margin: 10
    },
    retryText: {
        fontFamily: "os-regular",
        fontSize: 13,
        color: "white",
        paddingHorizontal: 5
    },
    categoriesContainer: {
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: "rgba(158, 150, 150, .3)"
    },
    categoryTag: {
        width: 25,
        height: 25,
        marginLeft: 15,
        tintColor: "#575757"
    },
    categoryTitle: {
        fontFamily: "os-light",
        fontSize: 18,
        marginLeft: 5,
        marginBottom: 5
    },
    categoryIcon: {
        width: 25,
        height: 25,
        tintColor: "white"
    },
    categoryTagContainer: {
        flexDirection: "row"
    },
    listContainer: {
        flex: 1,
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
})