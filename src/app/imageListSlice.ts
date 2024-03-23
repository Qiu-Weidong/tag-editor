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
 */




export interface ImageState {
  src: string,
  id: string,
  path: string,
  filename: string,
  captions: string[],


  isSelected: boolean,
  isFiltered: boolean,
  isOpen: boolean,
};

export interface LabelState {
  content: string, 
  frequency: number,
};


interface ImageListState {
  images: ImageState[],
  labels: LabelState[],
  currentOpenImage: string | undefined;
};


const initialState : ImageListState = {
  images: [],
  labels: [],
  currentOpenImage: undefined,
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

    openImage: (state, action: PayloadAction<string>) => {
      state.images = state.images.map(image => {
        if(image.id === action.payload) {
          return { ...image, isOpen: true };
        }
        else {
          return image;
        }
      });
      state.currentOpenImage = action.payload;
    },

    openAllFilterImages: (state) => {
      state.images = state.images.map(image => {
        if(image.isFiltered) {
          return { ...image, isOpen: true };
        } else { return image; }
      });
    },

    openAllSelectedImages: (state) => {
      state.images = state.images.map(image => {
        if(image.isSelected) {
          return { ...image, isOpen: true };
        } else { return image; }
      });
    },

    closeAllImages: (state) => {
      state.images = state.images.map(image => ({ ...image, isOpen: false }));
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
export const { openImage, closeAllImages, openAllFilterImages, openAllSelectedImages, pushImage, selectImage, unselectImage, removeImage, clearImageList, setLabels, selectAllFilteredImages, unselectAllFilteredImages, setImageList } = imageListSlice.actions;


