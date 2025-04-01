import { FC, useState } from "react";
import { View } from "react-native";
import { Button, TextInput } from "react-native-paper";
import { useDispatch } from "react-redux";
import { addProduct } from "../redux/slices/ProductSlice";

const SayimFisiEkle: FC = () => {
    const dispatch = useDispatch();
    const [productName, setProductName] = useState('');
    const [productCode, setProductCode] = useState('');
    const [productBalance, setProductBalance] = useState('');
  
    const addProductHandler = () => {
      dispatch(
        addProduct({
          id: 1,
          name: productName,
          code: productCode,
          stock: parseFloat(productBalance),
          order: 0,
          shipment: 0,
          price: "",
          unit: ""
        })
      );
      setProductName('');
      setProductCode('');
      setProductBalance('');
      
    };
    return <View style={{flex:1, flexDirection:"column" ,gap:10}}>
            <TextInput
                placeholder="Product Name"
                value={productName}
                onChangeText={setProductName}
              />
              <TextInput
                placeholder="Product Code"
                value={productCode}
                onChangeText={setProductCode}
              />
              <TextInput
                placeholder="Balance"
                value={productBalance}
                onChangeText={setProductBalance}
                keyboardType="numeric"
              />
              <Button  style={{height:50,marginBottom:10}} icon={"delete"} onPress={addProductHandler} >Ürün Ekle</Button>
    </View>
}
 
export default  SayimFisiEkle;