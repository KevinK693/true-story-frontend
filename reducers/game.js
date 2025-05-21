import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  value : { image: null, title: null, code: null, genre: null, nbPlayers: null, nbScenes: null, status: null },
}

export const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    updateGame: (state, action) => {
      state.value = action.payload;
    },
    removeGame: (state) => {
      state.value = { image: null, title: null, code: null, genre: null, nbPlayers: null, nbScenes: null, status: null };
    },
  },
});

export const {  updateGame, removeGame } = gameSlice.actions;
export default gameSlice.reducer;