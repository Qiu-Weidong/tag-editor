import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface ImageState {
  src: string,
  id: string,
  isSelected: boolean,
  captions: string[],
};

export interface LabelState {
  content: string, 
  frequency: number,
};


interface ImageListState {
  images: ImageState[],
  labels: LabelState[],
};


const initialState : ImageListState = {
  images: [],
  labels: [],
};



export const imageListSlice = createSlice({
  name: "images",
  initialState, 
  reducers: {
    pushImage: (state, action: PayloadAction<ImageState>) => {
      state.images = [...state.images, action.payload];
    },

    removeImage: (state, action: PayloadAction<string>) => {
      state.images = state.images.filter((image) => image.id !== action.payload);
    },

    clearImageList: (state) => { state.images = []; },

    selectImage: (state, action: PayloadAction<string>) => {
      state.images = state.images.map((image) => {
        if(image.id == action.payload) {
          return { ...image, isSelected: true };
        }
        else { return image; }
      });
    },

    unselectImage: (state, action: PayloadAction<string>) => {
      state.images = state.images.map((image) => {
        if(image.id == action.payload) {
          return { ...image, isSelected: false };
        }
        else { return image; }
      });
    },

    setLabels: (state, action: PayloadAction<LabelState[]>) => {
      state.labels = action.payload;
    },

    // removeCaption: (state, action: PayloadAction<string>) => { state.captions = state.captions.filter((caption) => caption !== action.payload) },
    // setCaption: (state, action: PayloadAction<string[]>) => { state.captions = action.payload },

  }
});

// 导出 reducers
export default imageListSlice.reducer;

// 导出 actions
export const { pushImage, selectImage, unselectImage, removeImage, clearImageList, setLabels } = imageListSlice.actions;


