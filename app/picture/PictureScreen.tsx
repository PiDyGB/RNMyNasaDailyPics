import { View, Text, Image, ScrollView, useWindowDimensions } from 'react-native';
import { PicturesStackParamList } from '../pictures/PicturesStackNavigator';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { secondaryText } from '../theme/styles';


type PictureNativeStackScreenProps = NativeStackScreenProps<PicturesStackParamList, 'PictureScreen'>;

export default function PictureScreen({ route }: PictureNativeStackScreenProps) {
  const { width, height } = useWindowDimensions()
  const isPortrait = width < height
  return (

    <View style={{ flex: 1, flexDirection: isPortrait ? 'column' : 'row' }}>
      <Image testID="picture-image" style={{ aspectRatio: '16/9', width: isPortrait ? '100%' : '50%', height: isPortrait ? 'auto' : '100%' }} source={{ uri: route.params?.apod?.hdurl }} loadingIndicatorSource={require('../assets/loading.png')}></Image>
      <ScrollView testID="picture-scrollview" style={{ paddingStart: 16, paddingEnd: 16, flex: 1 }}>
        <Text style={{ color: secondaryText, fontSize: 14 }}>{route.params?.apod?.date}</Text>
        <Text style={{ color: "white", fontSize: 16, marginTop: 16, marginBottom: 16 }}>{route.params?.apod?.explanation}</Text>
      </ScrollView>
    </View >
  );
}