import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";


/**
 * ImageState {
 *   id: string, // filename 可能存在重复，采用 id 来标识图片
 *   filename: string, 
 *   path: string,
 *   captions: string[],
 *   width: number,
 *   height: number,
 *   isSelected: boolean,
 *   isFiltered: boolean,
 *   isOpened: boolean,
 * 
 *   src: 缩略图的base64编码
 * }
 * 
 * 缩略图 {
 *   src
 * }
 */




export interface ImageState {
  src: string,
  id: string,
  path: string,
  isSelected: boolean,
  isFiltered: boolean,
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

    setImageList: (state, action: PayloadAction<ImageState[]>) => { state.images = action.payload; },

    selectAllImages: (state) => {
      state.images = state.images.map((image) => ({ ...image, isSelected: true}));
    },

    unselectAllImages: (state) => {
      state.images = state.images.map((image) => ({ ...image, isSelected: true}));
    },


    selectAllFilteredImages: (state) => {
      // 将 isFiltered 的图片全部设为 selected
      state.images = state.images.map(image => {
        if(image.isFiltered) {
          return { ...image, isSelected: true };
        } else { return image; }
      });
    },

    unselectAllFilteredImages: (state) => {
      // 将 isFiltered 的图片全部设置为 false
      state.images = state.images.map(image => {
        if(image.isFiltered) {
          return { ...image, isSelected: false };
        }
        else {
          return image;
        }
      });
    },
  }
});

// 导出 reducers
export default imageListSlice.reducer;

// 导出 actions
export const { pushImage, selectImage, unselectImage, removeImage, clearImageList, setLabels, selectAllFilteredImages, unselectAllFilteredImages, setImageList } = imageListSlice.actions;


