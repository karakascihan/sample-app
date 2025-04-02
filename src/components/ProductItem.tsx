import { useState } from "react";
import { Product } from "../types/Product";
import { useDispatch } from "react-redux";
import { addStockRecord } from "../redux/slices/StockSlice";
import { Appbar, Button, Card, Menu,Modal,Portal,Text, TextInput } from "react-native-paper";
import { View ,StyleSheet} from "react-native";
import { AddProductCount } from "./AddProductCount";

export const ProductItem: React.FC<{ item: Product }> = ({ item }) => {
    const [menuVisible, setMenuVisible] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);

    const closeModal = () => {
      setModalVisible(false);
    };
  
    return (
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.cardHeader}>
            <Text style={styles.productCode}>Kod : {item.code}</Text>
            <Menu
              visible={menuVisible}
              onDismiss={() => setMenuVisible(false)}
              anchor={<Appbar.Action icon="dots-vertical" onPress={() => {setMenuVisible(!menuVisible); console.log(item.code +":"+ menuVisible)}} />}
            >
              <Menu.Item onPress={() => setModalVisible(true)} title="Sayım Fişi Oluştur" />
            </Menu>
          </View>
          <Text>{item.name}</Text>
          <Text>Fiili : {item.stock}</Text>
          <Text>Sipariş : {item.order}</Text>
          <Text>Sevk : {item.shipment}</Text>
          <Text>Satış Fiyatı: {item.price} - Birim: {item.unit}</Text>
        </Card.Content>
        <Portal>
          <Modal visible={modalVisible} onDismiss={() => setModalVisible(false)} contentContainerStyle={styles.modalContainer}>
            <AddProductCount product={item} closeModal={closeModal}   />
          </Modal>
        </Portal>
      </Card>
    );
  };
  const styles = StyleSheet.create({
    input: { marginBottom: 10 },
    card: { marginBottom: 10, padding: 10 },
    productCode: { fontWeight: 'bold', color: 'red' },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    modalContainer: { backgroundColor: 'white', padding: 20, margin: 20, borderRadius: 10 },
    saveButton: { marginTop: 10 },
    title: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 }
  });