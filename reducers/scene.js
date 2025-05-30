import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: {
    sceneNumber: 1,
    scenes: [],
    fullstory: "",
  },
};

export const sceneSlice = createSlice({
  name: "scene",
  initialState,
  reducers: {
    updateScene: (state, action) => {
      state.value.sceneNumber = action.payload.sceneNumber;
      state.value.scenes.push(action.payload.text);
      state.value.fullstory = state.value.scenes.join("\n\n");
    },
    resetScene: (state) => {
      state.value.sceneNumber = 1;
      state.value.scenes = [];
      state.value.fullstory = "";
    },
    addFirstScene: (state, action) => {
      if (!state.value.scenes.includes(action.payload)) {
        state.value.scenes.push(action.payload);
      }
    },
  },
});

export const { updateScene, resetScene, addFirstScene } = sceneSlice.actions;
export default sceneSlice.reducer;
