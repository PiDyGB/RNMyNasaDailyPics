import { View, Text, StyleSheet, StatusBar } from 'react-native';
import { backgroundStyle } from '../theme/styles';

export default function PictureScreen() {
  return (
    <View style={backgroundStyle.container}>
      <StatusBar />
      <Text style={{ color: 'white' }}>Day Picture</Text>
    </View>
  );
}