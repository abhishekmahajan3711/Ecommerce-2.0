import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import cartReducer from './slices/cartSlice';
import heroReducer from './slices/heroSlice';
import contactReducer from './slices/contactSlice';
import categoryReducer from './slices/categorySlice';
import themeReducer from './slices/themeSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    hero: heroReducer,
    contact: contactReducer,
    category: categoryReducer,
    theme: themeReducer,
  },
}); 