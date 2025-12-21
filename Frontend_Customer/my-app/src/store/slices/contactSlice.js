import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunks
export const submitContactQuery = createAsyncThunk(
  'contact/submitQuery',
  async (queryData, { rejectWithValue }) => {
    try {
      const response = await fetch('http://localhost:5000/api/contact/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(queryData),
      });

      const data = await response.json();

      if (response.ok) {
        return data;
      } else {
        return rejectWithValue(data);
      }
    } catch (error) {
      return rejectWithValue({ message: 'Network error. Please try again.' });
    }
  }
);

export const fetchUserQueries = createAsyncThunk(
  'contact/fetchUserQueries',
  async (_, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      const response = await fetch('http://localhost:5000/api/contact/user/queries', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (response.ok) {
        return data;
      } else {
        return rejectWithValue(data);
      }
    } catch (error) {
      return rejectWithValue({ message: 'Failed to fetch queries' });
    }
  }
);

const initialState = {
  userQueries: [],
  loading: false,
  error: null,
  success: false
};

const contactSlice = createSlice({
  name: 'contact',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = false;
    },
    clearContactState: (state) => {
      state.userQueries = [];
      state.loading = false;
      state.error = null;
      state.success = false;
    }
  },
  extraReducers: (builder) => {
    builder
      // Submit Contact Query
      .addCase(submitContactQuery.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(submitContactQuery.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;
      })
      .addCase(submitContactQuery.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to submit query';
        state.success = false;
      })
      // Fetch User Queries
      .addCase(fetchUserQueries.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserQueries.fulfilled, (state, action) => {
        state.loading = false;
        state.userQueries = action.payload.data;
        state.error = null;
      })
      .addCase(fetchUserQueries.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch queries';
      });
  }
});

export const { clearError, clearSuccess, clearContactState } = contactSlice.actions;
export default contactSlice.reducer; 