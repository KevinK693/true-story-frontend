import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: {
    sceneNumber: 1, scenes: [], fullstory: '', remainingScenes: null
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
      state.value.remainingScenes -= 1
    },
    resetScene: (state) => {
      state.value.sceneNumber = 1
      state.value.scenes = []
      state.value.fullstory = ''
    },
    addScene: (state, action) => {
      state.value.sceneNumber = 1
      state.value.scenes.push(action.payload.scene)
      state.value.remainingScenes = (action.payload.remainingScenes)
    }
  },
});

export const { updateScene, resetScene, addScene } = sceneSlice.actions;
export default sceneSlice.reducer;
