import React, { useState } from 'react';
import {  TextInput, Menu, Modal, Button, Portal, Provider } from 'react-native-paper';
import { View,  FlatList, StyleSheet } from 'react-native';
import {  useSelector } from 'react-redux';
import { Product } from '../types/Product';
import { RootState } from '../redux/store';
import { ProductItem } from '../components/ProductItem';


const ProductsScreen: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const initialProductData = useSelector((state: RootState) => state.products);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(initialProductData);
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const filtered = initialProductData
      .filter(product => product.name.toLowerCase().includes(query.toLowerCase()))
      .sort((a, b) => a.name.localeCompare(b.name));
    setFilteredProducts(filtered);
  };

  return (
    <Provider>
      <View style={{ flex: 1, padding: 10 }}>
        <TextInput
          label="Ürün Adı"
          value={searchQuery}
          onChangeText={handleSearch}
          style={styles.input}
        />
        <FlatList
          data={filteredProducts}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <ProductItem item={item} />}
        />
      </View>
    </Provider>
  );
};

export default ProductsScreen;

const styles = StyleSheet.create({
  input: { marginBottom: 10 },
  card: { marginBottom: 10, padding: 10 },
  productCode: { fontWeight: 'bold', color: 'red' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  modalContainer: { backgroundColor: 'white', padding: 20, margin: 20, borderRadius: 10 },
  saveButton: { marginTop: 10 },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 }
});
