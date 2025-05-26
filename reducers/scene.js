import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: {
    sceneNumber: 1,
  },
};

export const sceneSlice = createSlice({
  name: "scene",
  initialState,
  reducers: {
    updateScene: (state, action) => {
      state.value.sceneNumber = action.payload;
    },
  },
});

export const { updateScene } = sceneSlice.actions;
export default sceneSlice.reducer;
