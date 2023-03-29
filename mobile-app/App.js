import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';
import {globalStyle} from "./styles/globalStyle";
import Header from "./components/Header";
import React, {useCallback, useEffect, useState} from 'react';
import {
    Text,
    SafeAreaView,
    View
} from 'react-native';

SplashScreen.preventAutoHideAsync();

export default function App() {
    const [appIsReady, setAppIsReady] = useState(false);

    useEffect(() => {
        async function prepare() {
            try {
                // Preload fonts, making any API calls
                await Font.loadAsync({
                    'os-bold': require('./assets/fonts/OpenSans-Bold.ttf'),
                    'os-bold-it': require('./assets/fonts/OpenSans-BoldItalic.ttf'),
                    'os-light': require('./assets/fonts/OpenSans-Light.ttf'),
                    'os-light-it': require('./assets/fonts/OpenSans-LightItalic.ttf')
                });
            } catch (e) {
                console.warn(e);
            } finally {
                // Tell the application to render
                setAppIsReady(true);
            }
        }

        prepare();
    }, []);

    const onLayoutRootView = useCallback(async () => {
        if (appIsReady) {
            await SplashScreen.hideAsync();
        }
    }, [appIsReady]);

    if (!appIsReady) {
        return null;
    }

    return (
        <SafeAreaView onLayout={onLayoutRootView}>
            <Text style={globalStyle.title}>Hello world!</Text>
        </SafeAreaView>
    );
}
