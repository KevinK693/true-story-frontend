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
    resetScene: (state) => {
      state.value.sceneNumber = 1
    }
  },
});

export const { updateScene, resetScene } = sceneSlice.actions;
export default sceneSlice.reducer;
