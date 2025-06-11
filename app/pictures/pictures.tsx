import { View, StatusBar, FlatList } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator, NativeStackNavigationProp } from '@react-navigation/native-stack';
import PictureScreen from '../picture/picture';
import { useQuery } from '@tanstack/react-query';
import { ApodEntry } from './data/apod.types';
import { getApod } from './data/apod.services';
import { ApodItem } from './components/ApodItem';
import { picturesViewModel } from './picturesViewModel';
import { backgroundStyle } from '../theme/styles';
import ActivityIndicator from '../components/ActivityIndicator';


type PicturesStackParamList = {
  // NomeDellaRotta: parametri | undefined (se non ne ha)
  Pictures: undefined;
  Picture: undefined; // La rotta a cui stai cercando di navigare
};

type PicturesNativeStackNavigationProp = NativeStackNavigationProp<PicturesStackParamList, 'Pictures'>;

function Pictures() {
  const navigation = useNavigation<PicturesNativeStackNavigationProp>()

  const { isPending, data } = picturesViewModel()

  if (isPending)
    return (
      <ActivityIndicator />
    )

  const renderItem = ({ item }: { item: ApodEntry }) => {
    return <ApodItem item={item} onPress={() => { }} />
  }

  return (
    <View style={backgroundStyle.container}>
      <StatusBar />
      <FlatList data={data} keyExtractor={item => item.date} renderItem={renderItem}></FlatList>
    </View>
  )
}

export default function PicturesScreen() {

  const Stack = createNativeStackNavigator()

  return (
    <Stack.Navigator screenOptions={{
      headerTintColor: 'white',
      headerStyle: {
        backgroundColor: backgroundStyle.container.backgroundColor
      }
    }}>
      <Stack.Screen name='Pictures' component={Pictures} />
      <Stack.Screen name='Picture' component={PictureScreen} />
    </Stack.Navigator>
  );
}
