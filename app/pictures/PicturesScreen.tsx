import { View, FlatList, Text } from 'react-native';
import React from 'react';
import { ApodEntry } from '../data/apod.types';
import { ApodItem } from './components/ApodItem';
import { picturesViewModel } from './picturesViewModel';
import ActivityIndicator from '../components/ActivityIndicator';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { PicturesStackParamList } from './PicturesStackNavigator';


type PicturesNativeStackScreenProps = NativeStackScreenProps<PicturesStackParamList, 'PicturesScreen'>;


export default function PicturesScreen({ navigation }: PicturesNativeStackScreenProps) {

  const { isFetching, isFetchingNextPage, fetchNextPage, apods } = picturesViewModel()

  if (isFetching && !isFetchingNextPage)
    return (
      <ActivityIndicator style={{ flex: 1 }} />
    )

  const renderItem = ({ item }: { item: ApodEntry }) => {
    return <ApodItem item={item} onPress={() => { navigation.navigate('PictureScreen', { apod: item }) }} />
  }

  return (
    <View>
      <FlatList data={apods} keyExtractor={item => item.date} renderItem={renderItem} onEndReachedThreshold={5} onEndReached={() => fetchNextPage()} />
      {isFetchingNextPage && <ActivityIndicator size={'small'} />}
    </View>
  )
}
