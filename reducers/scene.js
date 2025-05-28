import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: {
    sceneNumber: 1, scenes: [], fullstory: ''
  },
};

export const sceneSlice = createSlice({
  name: "scene",
  initialState,
  reducers: {
    updateScene: (state, action) => {
      state.value.sceneNumber += 1
      state.value.scenes.push(action.payload)
      state.value.fullstory = state.value.scenes.join('\n\n')
    },
    resetScene: (state) => {
      state.value.sceneNumber = 1
      state.value.scenes = []
      state.value.fullstory = ''
    },
    addFirstScene: (state, action) => {
      state.value.scenes.push(action.payload)
    }
  },
});

export const { updateScene, resetScene, addFirstScene } = sceneSlice.actions;
export default sceneSlice.reducer;
