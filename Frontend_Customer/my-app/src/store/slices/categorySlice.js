import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunk for fetching categories
export const fetchCategories = createAsyncThunk(
  'category/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('http://localhost:5000/api/categories');
      const data = await response.json();
      
      if (data.success) {
        return data.data;
      } else {
        return rejectWithValue(data.message);
      }
    } catch (error) {
      return rejectWithValue('Failed to fetch categories');
    }
  }
);

const categorySlice = createSlice({
  name: 'category',
  initialState: {
    data: [],
    loading: false,
    error: null
  },
  reducers: {
    clearCategories: (state) => {
      state.data = [];
      state.loading = false;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.error = null;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearCategories } = categorySlice.actions;
export default categorySlice.reducer; 