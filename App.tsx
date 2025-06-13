/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import React from 'react';
import { StyleSheet } from 'react-native';

import { Colors } from 'react-native/Libraries/NewAppScreen';
import TabNavigator from './app/TabNavigator';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MyTheme } from './app/theme/styles';

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 2 } },
})


function App(): React.JSX.Element {

  return (
    <QueryClientProvider client={queryClient}>
      <NavigationContainer theme={MyTheme}>
        <TabNavigator />
      </NavigationContainer>
    </QueryClientProvider>
  );
}

export default App;
