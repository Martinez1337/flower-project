import React, {useCallback, useEffect, useState} from 'react';
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';
import {SafeAreaView} from 'react-native';
import Home from "./screens/Home";
import {globalStyles} from "./styles/globalStyles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {CurrentUserContext} from "./contexts/CurrentUserContext";

SplashScreen.preventAutoHideAsync().catch((e) => console.warn(e));

export default function App() {
    const [appIsReady, setAppIsReady] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        Font.loadAsync({
            'os-regular': require('./assets/fonts/OpenSans-Regular.ttf'),
            'os-bold': require('./assets/fonts/OpenSans-Bold.ttf'),
            'os-bold-it': require('./assets/fonts/OpenSans-BoldItalic.ttf'),
            'os-light': require('./assets/fonts/OpenSans-Light.ttf'),
            'os-light-it': require('./assets/fonts/OpenSans-LightItalic.ttf')
        }).then(() =>  {
            AsyncStorage.getItem('user')
                .then(item => {
                    setCurrentUser(item);
                    setAppIsReady(true);
                })
                .catch(e => console.log(e));
        }).catch(e => console.warn(e));
    }, []);

    const onLayoutRootView = useCallback(async () => {
        if (appIsReady) {
            await SplashScreen.hideAsync();
        }
    }, [appIsReady]);

    if (!appIsReady) {
        return null;
    }

    // AsyncStorage.removeItem("user").then(() => console.log("User data was deleted"));

    return (
        <CurrentUserContext.Provider value={{currentUser, setCurrentUser}}>
            <SafeAreaView onLayout={onLayoutRootView} style={globalStyles.mainSafeArea}>
                <Home/>
            </SafeAreaView>
        </CurrentUserContext.Provider>
    );
}
