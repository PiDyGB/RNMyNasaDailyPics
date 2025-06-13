import { StyleSheet, View, ActivityIndicator as RNActivityIndicator, ActivityIndicatorProps, StyleProp, ViewStyle } from "react-native";
import { backgroundColor, backgroundStyle } from "../theme/styles";


const ActivityIndicatorStyle = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: backgroundColor
    }
});

export default function ActivityIndicator({ size = 'large', color = 'white', style, ...props }: ActivityIndicatorProps) {
    return (
        <RNActivityIndicator style={StyleSheet.compose(ActivityIndicatorStyle.container, style)} size={size} color={color} {...props} />
    )
}