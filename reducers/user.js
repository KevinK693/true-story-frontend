import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  value: { token: null, avatar: null, nickname: null },
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
      state.value.avatar = null;
      state.value.nickname = null;
    },
    updateAvatar: (state, action) => {
      state.value.avatar = action.payload;
    },
    updateNickname: (state, action) => {
      state.value.nickname = action.payload;
    },
  },
});

export const { updateToken, removeToken, updateAvatar, updateNickname } = userSlice.actions;
export default userSlice.reducer;
