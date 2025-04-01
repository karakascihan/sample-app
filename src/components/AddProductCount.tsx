import React, { FC, useState } from 'react'
import { View } from 'react-native'
import { Button, Text, TextInput } from 'react-native-paper'
import { useDispatch } from 'react-redux'
import { addStockRecord } from '../redux/slices/StockSlice'
import { Product } from '../types/Product'

interface Props {
  
    product:Product
}
export const AddProductCount: FC<Props> = (props) => {
    const [count, setCount] = useState('');
    const [description, setDescription] = useState('');
    const dispatch = useDispatch();

    const handleSave = () => {
        dispatch(addStockRecord({ id: Date.now().toString(), product:props.product, count, description }));
    };

    return (
        <View >
            <Text>Ürün Kodu: {props.product.code}</Text>
            <Text>Ürün Adı: {props.product.name}</Text>
            <TextInput label="Sayım Miktarı" value={count} onChangeText={setCount} keyboardType="numeric" />
            <TextInput label="Açıklama" value={description} onChangeText={setDescription} />
            <Button mode="contained" onPress={handleSave} style={{ marginTop: 10 }}>Kaydet</Button>
        </View>
    )
}
