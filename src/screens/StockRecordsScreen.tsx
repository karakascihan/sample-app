import React from 'react';
import { View, FlatList, Text, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';

const StockRecordsScreen: React.FC = () => {
  
  const stockRecords = useSelector((state: RootState) => state.stock.stockRecords);

  return (
    <View style={{ flex: 1, padding: 10 }}>
      <FlatList
        data={stockRecords}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.recordContainer}>
            <Text style={styles.recordText}>Ürün Kodu: {item.product.code}</Text>
            <Text style={styles.recordText}>Ürün Adı: {item.product.name}</Text>
            <Text style={styles.recordText}>Sayım Miktarı: {item.count}</Text>
            <Text style={styles.recordText}>Açıklama: {item.description}</Text>
          </View>
        )}
      />
    </View>
  );
};

export default StockRecordsScreen;

const styles = StyleSheet.create({
  recordContainer: {
    backgroundColor: 'lightgray',
    marginBottom: 10,
    padding: 10,
    borderRadius: 8,
  },
  recordText: {
    fontSize: 14,
    marginBottom: 5,
  },
});
