import { View, Text, Image, ScrollView } from 'react-native';
import { PicturesStackParamList } from '../pictures/PicturesStackNavigator';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { secondaryText } from '../theme/styles';


type PictureNativeStackScreenProps = NativeStackScreenProps<PicturesStackParamList, 'PictureScreen'>;

export default function PictureScreen({ route }: PictureNativeStackScreenProps) {
  return (
    <View style={{ flex: 1 }}>
      <Image style={{ aspectRatio: '16/9' }} source={{ uri: route.params?.apod?.hdurl }} loadingIndicatorSource={require('../assets/loading.png')}></Image>
      <ScrollView style={{ paddingStart: 16, paddingEnd: 16, flex: 1 }}>
        <Text style={{ color: "white", fontWeight: "bold", fontSize: 22, marginTop: 16 }}>{route.params?.apod?.title}</Text>
        <Text style={{ color: secondaryText, fontSize: 14, marginTop: 16 }}>{route.params?.apod?.date}</Text>
        <Text style={{ color: "white", fontSize: 16, marginTop: 16, marginBottom: 16 }}>{route.params?.apod?.explanation}</Text>
      </ScrollView>
    </View >
  );
}