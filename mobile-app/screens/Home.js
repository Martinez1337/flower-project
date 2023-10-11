import React from 'react';
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import {Image} from 'expo-image';
import {NavigationContainer} from "@react-navigation/native";
import UserPage from "./UserPage";
import ShoppingCart from "./ShoppingCart";
import {globalStyles} from "../styles/globalStyles";
import ShopPage from "./ShopPage";

const BottomTab = createBottomTabNavigator();

export default function Home() {
    return (
        <NavigationContainer>
            <BottomTab.Navigator
                initialRouteName={'ShopPage'}
                screenOptions={{
                    headerStyle: globalStyles.header,
                    headerTitleStyle: globalStyles.headerText,
                    tabBarShowLabel: false,
                    tabBarActiveTintColor: "#ffffff",
                    tabBarInactiveTintColor: "#c388ef",
                    tabBarStyle: {backgroundColor: "#ab50ee"},
                    tabBarHideOnKeyboard: "true"
                }}>
                <BottomTab.Screen name={'UserPage'} component={UserPage} options={
                    {
                        headerShown: false,
                        tabBarIcon: ({color}) => {
                            return (
                                <Image source={require("../assets/user.png")}
                                       style={{width:25, height: 25, tintColor: color}}
                                />
                            );
                        }
                    }
                }/>
                <BottomTab.Screen name={'ShopPage'} component={ShopPage} options={
                    {
                        headerShown: false,
                        tabBarIcon: ({color}) => {
                            return (
                                <Image source={require("../assets/shop.png")}
                                       style={{width:25, height: 25, tintColor: color}}
                                />
                            );
                        }
                    }
                }/>
                <BottomTab.Screen name={'ShoppingCart'} component={ShoppingCart} options={
                    {
                        title: "Shopping Cart",
                        headerTitleAlign: "center",
                        tabBarIcon: ({color}) => {
                            return (
                                <Image source={require("../assets/shopping-cart.png")}
                                       style={{width:25, height: 25, tintColor: color}}
                                />
                            );
                        }
                    }
                }/>
            </BottomTab.Navigator>
        </NavigationContainer>
    );
}
