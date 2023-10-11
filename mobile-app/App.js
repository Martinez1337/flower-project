import React, {useCallback, useEffect, useState} from 'react';
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';
import * as SecureStore from 'expo-secure-store';
import {SafeAreaView, StatusBar, BackHandler, Alert} from 'react-native';
import Home from "./screens/Home";
import {globalStyles} from "./styles/globalStyles";
import {CurrentUserContext} from "./contexts/CurrentUserContext";
import axios from "axios";
import {API_LINK} from "./consts/links";

SplashScreen.preventAutoHideAsync().catch((e) => console.warn(e));

export default function App() {
    const [appIsReady, setAppIsReady] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);

    const [error, setError] = useState(null);

    useEffect(() => {
        loadApp();
    }, []);

    useEffect(() => {
        if (error) {
            console.log(error);
        }
    }, [error]);

    const loadApp = () => {
        setError(null);
        Font.loadAsync({
            'os-regular': require('./assets/fonts/OpenSans-Regular.ttf'),
            'os-bold': require('./assets/fonts/OpenSans-Bold.ttf'),
            'os-bold-it': require('./assets/fonts/OpenSans-BoldItalic.ttf'),
            'os-light': require('./assets/fonts/OpenSans-Light.ttf'),
            'os-light-it': require('./assets/fonts/OpenSans-LightItalic.ttf')
        }).then(() =>  {
            SecureStore.getItemAsync('user').then((item) => {
                if (item) {
                    axios.get(`${API_LINK}/Users/byId?id=${JSON.parse(item).id}`).then((res) => {
                        SecureStore.setItemAsync('user', JSON.stringify(res.data)).then(() => {
                            console.log("App.js: Latest user data was successfully set");
                        })
                    }).catch(e => {
                        console.log(e);
                        setError(e);
                    })
                }
                setCurrentUser(item);
                console.log("App.js: user = " + item);
                setAppIsReady(true);
            }).catch(e => {
                console.log(e);
                setError(e);
            })
        }).catch(e => {
            console.log(e);
            setError(e);
        })
    }

    const onLayoutRootView = useCallback(async () => {
        if (appIsReady) {
            await SplashScreen.hideAsync();
        }
    }, [appIsReady]);

    if (!appIsReady) {
        return null;
    }

    if (error) {
        setError(null);
        Alert.alert("Fatal error!", "Please reopen the app", [{
            text: "Ok"
        }])
        BackHandler.exitApp();

        return <SafeAreaView/>
    }

    return (
        <>
            <StatusBar barStyle={"light-content"}/>
            <CurrentUserContext.Provider value={{currentUser, setCurrentUser}}>
                <SafeAreaView onLayout={onLayoutRootView} style={globalStyles.mainSafeArea}>
                    <Home/>
                </SafeAreaView>
            </CurrentUserContext.Provider>
        </>
    );
}
