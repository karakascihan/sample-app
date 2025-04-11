import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-redux';
import store from './src/redux/store';
import { PaperProvider } from 'react-native-paper';
import ProductsScreen from './src/screens/ProductListScreen';
import StockRecordsScreen from './src/screens/StockRecordsScreen';
import AddMontajScreen from './src/screens/AddMontajScreen';
import ListScreen from './src/screens/ListScreen';
import * as ScreenOrientation from 'expo-screen-orientation';
import RNBlobUtil from 'react-native-blob-util';

const Drawer = createDrawerNavigator();

function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Ana Sayfa </Text>
    </View>
  );
}

export default function App() {
  useEffect(() => {
    const unlockScreenOerientation = async () => {
      await ScreenOrientation.unlockAsync()
    }
    unlockScreenOerientation()
  }, [])
  return (
    <Provider store={store}>
      <PaperProvider>
    <NavigationContainer>
      <Drawer.Navigator>
        <Drawer.Screen name="Ana Sayfa" component={HomeScreen} />
        <Drawer.Screen name="Ürünler"   component={ProductsScreen} />
        <Drawer.Screen name="Sayım Fişleri"   component={StockRecordsScreen} />
        <Drawer.Screen name="Montaj Ekle/Düzenle"   component={AddMontajScreen} />
        <Drawer.Screen name="Montajlar"   component={ListScreen} />
      </Drawer.Navigator>
    </NavigationContainer>
    </PaperProvider>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});