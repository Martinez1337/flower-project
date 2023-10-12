import React, {useContext} from "react";
import {Alert, Image, TouchableOpacity} from "react-native";
import {createStackNavigator} from "@react-navigation/stack";
import * as SecureStore from 'expo-secure-store';
import {CurrentUserContext} from "../contexts/CurrentUserContext";
import {globalStyles} from "../styles/globalStyles";
import {backArrow} from "../consts/backArrow";
import Profile from "./Profile";
import EditProfile from "./EditProfile";
import SignIn from "./SignIn";
import SignUp from "./SignUp";
import OrderInfo from "./OrderInfo";

const Stack = createStackNavigator();

export default function UserPage() {
    const {currentUser, setCurrentUser} = useContext(CurrentUserContext);

    const onLogoutHandler = () => {
        SecureStore.deleteItemAsync("user").then(() => {
            console.log("UserPage.js: user info was cleared");
            Alert.alert("Logging out", "Successfully logged out");
        });
        if (currentUser) {
            setCurrentUser(null);
            console.log(JSON.parse(currentUser));
        }
    }

    return (
        <Stack.Navigator screenOptions={{
            headerStyle: globalStyles.header,
            headerTitleStyle: globalStyles.headerText,
            headerBackTitleVisible: false,
            headerTitleAlign: "center",
            headerBackImage: backArrow
        }}>
            {currentUser ? (
                <Stack.Group>
                    <Stack.Screen name={'Profile'} component={Profile} options={{
                        headerRight: () => (
                            <TouchableOpacity onPress={() => {
                                Alert.alert('Logout', 'Are sure to logout?', [
                                    {
                                        text: "Yes",
                                        onPress: onLogoutHandler
                                    },
                                    {
                                        text: "No"
                                    }
                                ])
                            }}>
                                <Image source={require('../assets/logout.png')}
                                       style={{
                                           width: 20,
                                           height: 20,
                                           tintColor: '#ffffff',
                                           marginRight: 15,
                                       }}
                                />
                            </TouchableOpacity>
                        )
                    }}/>
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
                        title: "Sign In"
                    }}/>
                    <Stack.Screen name={'SignUp'} component={SignUp} options={{
                        title: "Sign Up"
                    }}/>
                </Stack.Group>
            )}
        </Stack.Navigator>
    );
}
