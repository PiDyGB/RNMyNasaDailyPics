import { createNativeStackNavigator, NativeStackNavigationProp, NativeStackScreenProps } from "@react-navigation/native-stack";
import PictureScreen from "../picture/PictureScreen";
import PicturesScreen from "./PicturesScreen";
import { ApodEntry } from "../data/apod.types";
import { backgroundColor } from "../theme/styles";


export type PicturesStackParamList = {
    PicturesScreen: undefined
    PictureScreen: { apod: ApodEntry } | undefined
};

const Stack = createNativeStackNavigator<PicturesStackParamList>()

export default function PicturesStack() {

    return (
        <Stack.Navigator screenOptions={{
            headerStyle: {
                backgroundColor: backgroundColor,
            }
        }
        }>
            <Stack.Screen name="PicturesScreen" options={{
                title: "NASA Daily Pics"
            }} component={PicturesScreen} />
            <Stack.Screen name="PictureScreen" options={({ route }) => ({ title: route.params?.apod?.title })} component={PictureScreen} />
        </Stack.Navigator>
    );
}