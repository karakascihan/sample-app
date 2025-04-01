import React, { useState } from 'react';
import { View, StyleSheet, TextInput, Button, ScrollViewComponent, FlatList } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { addProduct, deleteProduct } from '../redux/slices/ProductSlice';
import { RootState } from '../redux/store';
import { Avatar, Card, IconButton, List, MD3Colors, Modal, Searchbar } from 'react-native-paper';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import SayimFisiEkle from '../components/SayimFisiEkle';

const ProductList: React.FC = () => {
  const products = useSelector((state: RootState) => state.products);
  const [searchQuery, setSearchQuery] = useState('');

  const [visible, setVisible] = useState(false);

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  return (
    <View style={{ padding: 10 }}>
      <Searchbar
        placeholder="Ürün ara"
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={{ marginBottom: 10 }}
      />
      <Modal visible={visible} onDismiss={closeMenu}>
        <TouchableWithoutFeedback onPress={closeMenu}>
          <View style={styles.overlay} />
        </TouchableWithoutFeedback>
        <Card style={styles.popover}>
          <Card.Title title="Menü" />
          <Card.Content>
            <SayimFisiEkle />
          </Card.Content>
        </Card>
      </Modal>
      <View style={{ flex: 1 }}>
      <FlatList
        style={{ paddingRight: 20, paddingLeft: 20 }}
        data={products}
        renderItem={({ item ,index}) =>
         <Card style={{ marginBottom: 10 }}>
            <Card.Title
              title={item.code}
              subtitle={item.name}
              left={(props) => <Avatar.Icon {...props} icon="stocking" />}
              right={(props) => <IconButton {...props} icon="dots-vertical" onPress={() => setVisible(true)} />}
            />
          </Card>
        }
        keyExtractor={item => item.id.toString()}
      />
        {/* {products.map((product) => (
          <Card style={{ marginBottom: 10 }}>
            <Card.Title
              title={product.code}
              subtitle={product.name}
              left={(props) => <Avatar.Icon {...props} icon="stocking" />}
              right={(props) => <IconButton {...props} icon="dots-vertical" onPress={() => setVisible(true)} />}
            />
          </Card>
        ))} */}
      </View>

    </View>
  );
};

export default ProductList;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  popover: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -100 }, { translateY: -50 }],
    width: 200,
    padding: 10,
  },
});
