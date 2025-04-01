import { configureStore } from '@reduxjs/toolkit';
import ProductReducer from './slices/ProductSlice'
import stockReducer from './slices/StockSlice'

const store = configureStore({
  reducer: {
    products: ProductReducer,
    stock: stockReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;