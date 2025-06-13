import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import SettingsScreen from './settings/SettingsScreen'
import React from 'react';
import Icon from '@react-native-vector-icons/ionicons';
import PicturesStack from './pictures/PicturesStackNavigator';

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
    return (
        <Tab.Navigator>
            <Tab.Screen name="Pictures" component={PicturesStack} options={{ headerShown: false, tabBarIcon: ({ color, size }) => <Icon name='image' size={size} color={color} /> }} />
            <Tab.Screen name="Settings" component={SettingsScreen} options={{ headerShown: false, tabBarIcon: ({ color, size }) => <Icon name='settings' size={size} color={color} /> }} />
        </Tab.Navigator >
    );
}
