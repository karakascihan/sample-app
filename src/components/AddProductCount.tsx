import React, { FC, useState } from 'react'
import { View ,StyleSheet} from 'react-native'
import { Button, Text, TextInput } from 'react-native-paper'
import { useDispatch } from 'react-redux'
import { addStockRecord } from '../redux/slices/StockSlice'
import { Product } from '../types/Product'

interface Props {
  
    product:Product
    closeModal :CallableFunction
}
export const AddProductCount: FC<Props> = (props) => {
    const [count, setCount] = useState('');
    const [description, setDescription] = useState('');
    const dispatch = useDispatch();

    const handleSave = () => {
        dispatch(addStockRecord({ id: Date.now().toString(), product:props.product, count, description }));
        props.closeModal();
    };

    return (
        <View >
            <Text style={styles.text}>Ürün Kodu: {props.product.code}</Text>
            <Text style={styles.text}>Ürün Adı: {props.product.name}</Text>
            <TextInput style={styles.text} label="Sayım Miktarı" value={count} onChangeText={setCount} keyboardType="numeric" />
            <TextInput style={styles.text} label="Açıklama" value={description} onChangeText={setDescription} />
            <Button mode="contained" onPress={handleSave} style={styles.text}>Kaydet</Button>
        </View>
    )
}
  const styles = StyleSheet.create({
    text: { marginBottom: 10 },
  });
