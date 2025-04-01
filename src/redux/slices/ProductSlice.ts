import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Product } from '../../types/Product';


const initialProductData: Product[] = [
  { id: 1, code: 'STK-004', name: 'Ariston Çift Kapılı No Frost Buzdolabı', stock: 30, order: 355, shipment: 565, price: '410.00 USD', unit: 'ADET' },
  { id: 2, code: 'STK-007', name: 'BEYAZ KOT KUMAŞI', stock: -20, order: 16174, shipment: 16194, price: '4.29 USD', unit: 'METRE' },
  { id: 3, code: 'STK-005', name: 'MAVİ KOT KUMAŞI', stock: 0, order: 3552, shipment: 3552, price: '3.25 USD', unit: 'METRE' },
  { id: 4, code: 'ZYN-1970', name: 'POLYESTER BANYO SETİ', stock: 0, order: 3669, shipment: 3669, price: '302.50 USD', unit: 'ADET' },
  { id: 5, code: 'RB-001', name: 'RENK BEDEN TAKİPLİ - VARYANT', stock: 0, order: 0, shipment: 0, price: '-', unit: '-' },
];
const ProductSlice = createSlice({
  name: 'products',
  initialState: initialProductData,
  reducers: {
    addProduct: (state, action: PayloadAction<Product>) => {
      state.push(action.payload);
    },
    deleteProduct: (state, action: PayloadAction<number>) => {
      return state.filter((product) => product.id !== action.payload);
    },
  },
});

export const { addProduct, deleteProduct } = ProductSlice.actions;
export default ProductSlice.reducer;