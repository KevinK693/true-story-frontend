import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  value: []
};

export const storySlice = createSlice({
  name: 'story',
  initialState,
  reducers: {
    addScene: (state, action) => {
      state.value.push(action.payload);
    },
  },
});

export const { addScene } = storySlice.actions;
export default storySlice.reducer;