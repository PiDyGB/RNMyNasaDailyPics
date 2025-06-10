import { View, Text, StyleSheet, StatusBar } from 'react-native';
import React from 'react';
import { backgroundStyle } from '../theme/styles';

export default function SettingsScreen() {
  return (
    <View style={backgroundStyle.container}>
      <StatusBar />
      <Text style={{ color: 'white' }}>Tab Settings</Text>
    </View>
  );
}