import React, {useContext, useEffect, useState} from "react";
import {Image} from "react-native";
import {createStackNavigator} from "@react-navigation/stack";
import Profile from "./Profile";
import EditProfile from "./EditProfile";
import SignIn from "./SignIn";
import SignUp from "./SignUp";
import {globalStyles} from "../styles/globalStyles";
import {CurrentUserContext} from "../contexts/CurrentUserContext";
import OrderInfo from "./OrderInfo";

const Stack = createStackNavigator();

const backArrow = () => (
    <Image
        source={require('../assets/back-arrow.png')}
        style={{width: 25, height: 25, tintColor: '#ffffff', marginLeft: 20, padding: 13}}
    />
);

export default function UserPage({navigation, route}) {
    const {currentUserInfo} = useContext(CurrentUserContext);

    return (
        <Stack.Navigator screenOptions={{
            headerStyle: globalStyles.header,
            headerTitleStyle: globalStyles.headerText,
            headerBackTitleVisible: false,
            headerTitleAlign: "center",
            headerBackImage: backArrow
        }}>
            {currentUserInfo !== null ? (
                <Stack.Group>
                    <Stack.Screen name={'Profile'} component={Profile}/>
                    <Stack.Screen name={'EditProfile'} component={EditProfile} options={{
                        title: "Edit Profile"
                    }}/>
                    <Stack.Screen name={'OrderInfo'} component={OrderInfo} options={({route}) => (
                        {
                            title: "Order ID: " + route.params.orderInfo.id
                        }
                    )}/>
                </Stack.Group>
            ) : (
                <Stack.Group screenOptions={{animationTypeForReplace: "pop"}}>
                    <Stack.Screen name={'SignIn'} component={SignIn} options={{
                        title: "Sing In"
                    }}/>
                    <Stack.Screen name={'SignUp'} component={SignUp} options={{
                        title: "Sign Up"
                    }}/>
                </Stack.Group>
            )}
        </Stack.Navigator>
    );
}
