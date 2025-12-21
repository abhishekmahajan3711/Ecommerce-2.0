import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api/cart';

// Helper function to get auth token
const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Async thunks
export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (_, { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error('No authentication token');
      }

      const response = await axios.get(API_BASE_URL, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch cart' });
    }
  }
);

export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async ({ productId, quantity = 1 }, { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error('No authentication token');
      }

      const response = await axios.post(`${API_BASE_URL}/add`, 
        { productId, quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to add to cart' });
    }
  }
);

export const updateCartItem = createAsyncThunk(
  'cart/updateCartItem',
  async ({ itemId, quantity }, { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error('No authentication token');
      }

      const response = await axios.put(`${API_BASE_URL}/update/${itemId}`, 
        { quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to update cart item' });
    }
  }
);

export const removeFromCart = createAsyncThunk(
  'cart/removeFromCart',
  async (itemId, { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error('No authentication token');
      }

      const response = await axios.delete(`${API_BASE_URL}/remove/${itemId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return { ...response.data, itemId };
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to remove from cart' });
    }
  }
);

export const clearCart = createAsyncThunk(
  'cart/clearCart',
  async (_, { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error('No authentication token');
      }

      const response = await axios.delete(`${API_BASE_URL}/clear`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to clear cart' });
    }
  }
);

export const cleanupInvalidItems = createAsyncThunk(
  'cart/cleanupInvalidItems',
  async (_, { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error('No authentication token');
      }

      const response = await axios.delete(`${API_BASE_URL}/cleanup-invalid`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to cleanup invalid items' });
    }
  }
);

const initialState = {
  items: [],
  total: 0,
  itemCount: 0,
  loading: false,
  addingItems: {}, // Track loading state for individual items
  error: null
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCartState: (state) => {
      state.items = [];
      state.total = 0;
      state.itemCount = 0;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Cart
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data.items || [];
        state.total = action.payload.data.total || 0;
        state.itemCount = action.payload.data.itemCount || 0;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch cart';
      })
      // Add to Cart
      .addCase(addToCart.pending, (state, action) => {
        state.loading = true;
        state.error = null;
        // Set loading state for specific product
        const productId = action.meta.arg.productId;
        state.addingItems[productId] = true;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data.items || [];
        state.total = action.payload.data.total || 0;
        state.itemCount = action.payload.data.itemCount || 0;
        // Clear loading state for specific product
        const productId = action.meta.arg.productId;
        delete state.addingItems[productId];
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to add to cart';
        // Clear loading state for specific product
        const productId = action.meta.arg.productId;
        delete state.addingItems[productId];
      })
      // Update Cart Item
      .addCase(updateCartItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCartItem.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data.items || [];
        state.total = action.payload.data.total || 0;
        state.itemCount = action.payload.data.itemCount || 0;
      })
      .addCase(updateCartItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to update cart item';
      })
      // Remove from Cart
      .addCase(removeFromCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data.items || [];
        state.total = action.payload.data.total || 0;
        state.itemCount = action.payload.data.itemCount || 0;
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to remove from cart';
      })
      // Clear Cart
      .addCase(clearCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(clearCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = [];
        state.total = 0;
        state.itemCount = 0;
      })
      .addCase(clearCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to clear cart';
      })
      // Cleanup Invalid Items
      .addCase(cleanupInvalidItems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(cleanupInvalidItems.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data.items || [];
        state.total = action.payload.data.total || 0;
        state.itemCount = action.payload.data.itemCount || 0;
      })
      .addCase(cleanupInvalidItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to cleanup invalid items';
      });
  }
});

export const { clearError, clearCartState } = cartSlice.actions;

// Selector to check if a product is in cart
export const selectIsProductInCart = (state, productId) => {
  return state.cart.items.some(item => item.product && item.product._id === productId);
};

export default cartSlice.reducer; 