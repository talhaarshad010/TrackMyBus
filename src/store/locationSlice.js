import { createSlice } from '@reduxjs/toolkit';

const locationSlice = createSlice({
  name: 'location',
  initialState: {
    coords: null,
    loading: false,
  },
  reducers: {
    setLocation: (state, action) => {
      state.coords = action.payload;
      state.loading = false;
    },
    setLoading: state => {
      state.loading = true;
    },
  },
});

export const { setLocation, setLoading } = locationSlice.actions;
export default locationSlice.reducer;
