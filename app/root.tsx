import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import PicturesScreen from "./pictures/pictures";
import SettingsScreen from './settings/settings';

const Tab = createBottomTabNavigator();

export default function RootStack() {
    return (
        <Tab.Navigator>
            <Tab.Screen name="Pictures" component={PicturesScreen} options={{ headerShown: false }} />
            <Tab.Screen name="Settings" component={SettingsScreen} options={{ headerShown: false }} />
        </Tab.Navigator>
    );
}
