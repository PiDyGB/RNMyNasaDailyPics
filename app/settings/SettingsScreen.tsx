import { View, Text, StatusBar } from 'react-native';
import React from 'react';

export default function SettingsScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <StatusBar />
      <Text style={{ color: 'white', fontSize: 20 }}>Tab Settings</Text>
    </View>
  );
}