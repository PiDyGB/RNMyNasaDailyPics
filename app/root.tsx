import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import PicturesScreen from "./pictures/pictures";
import SettingsScreen from './settings/settings'
import React from 'react';
import Icon from '@react-native-vector-icons/ionicons';

const Tab = createBottomTabNavigator();

export default function RootStack() {
    return (
        <Tab.Navigator
            screenOptions={{
                tabBarStyle: {
                    borderColor: '#171C36',
                    backgroundColor: '#171C36'
                }
            }}
        >
            <Tab.Screen name="Pictures" component={PicturesScreen} options={{ headerShown: false, tabBarIcon: ({ color, size }) => <Icon name='image' size={size} color={color} /> }} />
            <Tab.Screen name="Settings" component={SettingsScreen} options={{ headerShown: false, tabBarIcon: ({ color, size }) => <Icon name='settings' size={size} color={color} /> }} />
        </Tab.Navigator >
    );
}
