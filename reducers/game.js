import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: {
    image: null,
    title: null,
    code: null,
    genre: null,
    nbPlayers: null,
    nbScenes: null,
    status: null,
    host: null,
  },
};

export const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {
    updateGame: (state, action) => {
      state.value = {
        ...state.value,
        ...action.payload,
      };
    },
    removeGame: (state) => {
      state.value = {
        image: null,
        title: null,
        code: null,
        genre: null,
        nbPlayers: null,
        nbScenes: null,
        status: null,
        host: null,
      };
    },
    addHost: (state, action) => {
      state.value.host = action.payload;
    },
  },
});

export const { updateGame, removeGame, addHost } = gameSlice.actions;
export default gameSlice.reducer;
