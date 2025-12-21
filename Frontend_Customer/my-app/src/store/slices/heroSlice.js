import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchHeroSection = createAsyncThunk('hero/fetchHeroSection', async (_, { rejectWithValue }) => {
  try {
    const res = await axios.get('http://localhost:5000/api/products/hero');
    return res.data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch hero section');
  }
});

const heroSlice = createSlice({
  name: 'hero',
  initialState: {
    data: null,
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchHeroSection.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHeroSection.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchHeroSection.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export default heroSlice.reducer; 