import { StyleSheet, View, ActivityIndicator as RNActivityIndicator, ActivityIndicatorProps } from "react-native";
import { backgroundStyle } from "../theme/styles";


const activityContainerStyle = StyleSheet.compose(backgroundStyle.container, {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
});

export default function ActivityIndicator({ size = 'large', color = 'white', ...props }: ActivityIndicatorProps) {
    return (
        <View style={activityContainerStyle}>
            <RNActivityIndicator size={size} color={color} {...props} />
        </View>
    )
}