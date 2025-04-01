import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { StockRecord } from '../../types/Product';



interface StockState {
  stockRecords: StockRecord[];
}

const initialState: StockState = {
  stockRecords: [],
};

const stockSlice = createSlice({
  name: 'stock',
  initialState,
  reducers: {
    addStockRecord: (state, action: PayloadAction<StockRecord>) => {
      state.stockRecords.push(action.payload);
    },
  },
});

export const { addStockRecord } = stockSlice.actions;

export default stockSlice.reducer;
