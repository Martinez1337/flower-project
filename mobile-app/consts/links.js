import {Platform} from "react-native";

export const API_LINK = Platform.OS === 'android'
    ? 'http://10.0.2.2:5224'
    : 'http://localhost:5224'

// export const API_LINK = 'http://192.168.50.229:5224';