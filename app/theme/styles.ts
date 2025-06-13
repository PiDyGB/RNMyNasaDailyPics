import { DefaultTheme } from "@react-navigation/native";
import { StyleSheet } from "react-native";

export const backgroundColor = '#0F1224'
const cardColor = '#21294A'

export const MyTheme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        primary: 'white',
        background: backgroundColor,
        card: cardColor,
        text: 'white',
        border: cardColor,
        notification: 'white',
    },
};
