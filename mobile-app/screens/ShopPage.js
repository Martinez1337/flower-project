import React from "react";
import {createStackNavigator} from "@react-navigation/stack";
import {backArrow} from "../consts/backArrow";
import {globalStyles} from "../styles/globalStyles";
import Catalog from "./Catalog";
import Product from "./Product";

const Stack = createStackNavigator();

export default function ShopPage() {
    return (
        <Stack.Navigator screenOptions={{
            headerStyle: globalStyles.header,
            headerTitleStyle: globalStyles.headerText,
            headerBackTitleVisible: false,
            headerTitleAlign: "center",
            headerBackImage: backArrow
        }}>
            <Stack.Screen name={"Catalog"} component={Catalog} options={{
                title: "Shop",
                headerTitleAlign: "center"
            }}/>
            <Stack.Screen name={"Product"} component={Product} options={({route}) => (
                {
                    title: route.params.item.name
                }
            )}/>
        </Stack.Navigator>
    )
}