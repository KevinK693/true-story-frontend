import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  value: { token: null, hasProfile: false },
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    updateToken: (state, action) => {
      state.value.token = action.payload;
    },
    removeToken: (state) => {
      state.value.token = null;
    },
    updateProfileStatus: (state, action) => {
      state.value.hasProfile = action.payload;
    },
  },
});

export const { updateToken, removeToken, updateProfileStatus } = userSlice.actions;
export default userSlice.reducer;
