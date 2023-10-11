import React from "react";
import {Image, Platform} from "react-native";

export const backArrow = () => (
    <Image source={require('../assets/back-arrow.png')}
           style={{
               width: 25,
               height: 25,
               tintColor: '#ffffff',
               marginLeft: Platform.OS === 'ios' ? 20 : 5,
               padding: 13
           }}
    />
);