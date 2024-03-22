import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";


export interface ImageState {
  src: string,
  id: string,
  isSelected: boolean,
  captions: string[],
};

const initialState : ImageState = {
  src: '',
  id: '',
  isSelected: false,
  captions: [],
};



export const imageSlice = createSlice({
  name: "image",
  initialState, 
  reducers: {
    select: (state) => { state.isSelected = true; },
    unselect: (state) => { state.isSelected = false; },
    addCaption: (state, action: PayloadAction<string>) => { state.captions.push(action.payload); },
    removeCaption: (state, action: PayloadAction<string>) => { state.captions = state.captions.filter((caption) => caption !== action.payload) },
    setCaption: (state, action: PayloadAction<string[]>) => { state.captions = action.payload },
  }
});
