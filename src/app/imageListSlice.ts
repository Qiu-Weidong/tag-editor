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
  currentOpenImageIndex: number,
};


const initialState: ImageListState = {
  images: [],
  labels: [],
  currentOpenImageIndex: 0,
};


function labelCnt(images: ImageState[]): LabelState[] {
  const _labels = new Map<string, number>();
  for (const image of images) {
    for (const caption of image.captions) {
      const cnt = (_labels.get(caption) || 0) + 1;
      _labels.set(caption, cnt);
    }
  }

  const labels: LabelState[] = []
  for (const [label, frequency] of _labels.entries()) {
    labels.push({
      content: label,
      frequency,
    });
  }
  return labels;
}



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
        if (image.id == action.payload) {
          return { ...image, isSelected: true };
        }
        else { return image; }
      });
    },

    unselectImage: (state, action: PayloadAction<string>) => {
      state.images = state.images.map((image) => {
        if (image.id == action.payload) {
          return { ...image, isSelected: false };
        }
        else { return image; }
      });
    },

    openImage: (state, action: PayloadAction<string>) => {
      state.images = state.images.map(image => {
        if (image.id === action.payload) {
          return { ...image, isOpen: true };
        }
        else {
          return image;
        }
      });
    },

    openAllFilterImages: (state, action: PayloadAction<string | undefined>) => {
      const index = state.images.filter(image => image.isFiltered).findIndex(image => image.id === action.payload);
      state.images = state.images.map(image => {
        if (image.isFiltered) {
          return { ...image, isOpen: true };
        } else { return image; }
      });
      state.currentOpenImageIndex = index >= 0 ? index : 0;
    },

    openAllSelectedImages: (state) => {
      state.images = state.images.map(image => {
        if (image.isSelected) {
          return { ...image, isOpen: true };
        } else { return image; }
      });
      state.currentOpenImageIndex = 0;
    },

    closeAllImages: (state) => {
      state.images = state.images.map(image => ({ ...image, isOpen: false }));
    },

    setLabels: (state, action: PayloadAction<LabelState[]>) => {
      state.labels = action.payload;
    },

    setImageList: (state, action: PayloadAction<ImageState[]>) => { state.images = action.payload; },

    selectAllImages: (state) => {
      state.images = state.images.map((image) => ({ ...image, isSelected: true }));
    },

    unselectAllImages: (state) => {
      state.images = state.images.map((image) => ({ ...image, isSelected: true }));
    },


    selectAllFilteredImages: (state) => {
      // 将 isFiltered 的图片全部设为 selected
      state.images = state.images.map(image => {
        if (image.isFiltered) {
          return { ...image, isSelected: true };
        } else { return image; }
      });
    },

    unselectAllFilteredImages: (state) => {
      // 将 isFiltered 的图片全部设置为 false
      state.images = state.images.map(image => {
        if (image.isFiltered) {
          return { ...image, isSelected: false };
        }
        else {
          return image;
        }
      });
    },

    changeCaptionsForImage: (state, action: PayloadAction<{ imageid: string, captions: string[] }>) => {
      // 去一下重
      const captions = Array.from(new Set([...action.payload.captions]));
      const images = state.images.map(img => {
        if (img.id !== action.payload.imageid) { return img }
        else {
          return { ...img, captions }
        }
      });

      // 记得更新 labels
      state.labels = labelCnt(images);
      state.images = images;
    },

    addCaptionForSelectedImages: (state, action: PayloadAction<string>) => {
      const images = state.images.map(img => {
        if (!img.isSelected) return img;
        else {
          const captions = Array.from(new Set([...img.captions, action.payload]));
          return { ...img, captions}
        };
      });

      // 记得更新 labels
      state.labels = labelCnt(images);
      state.images = images;
    },

    changeCaptionForSelectedImages: (state, action: PayloadAction<{ before: string, after: string }>) => {
      const images = state.images.map(img => {
        if (!img.isSelected) return img;
        else {
          const _captions = img.captions.map(caption => {
            if (caption === action.payload.before) { return action.payload.after.trim() }
            else return caption;
          });
          const captions = Array.from(new Set(_captions));

          return { ...img, captions };
        }
      });

      // 记得更新 labels
      state.labels = labelCnt(images);
      state.images = images;
    },

    removeCaptionForSelectedImages: (state, action: PayloadAction<string>) => {
      const images = state.images.map(img => {
        if (!img.isSelected) return img;
        else return { ...img, captions: img.captions.filter(caption => caption !== action.payload) };
      });

      // 记得更新 labels
      state.labels = labelCnt(images);
      state.images = images;
    },

  }
});

// 导出 reducers
export default imageListSlice.reducer;

// 导出 actions
export const { addCaptionForSelectedImages, changeCaptionForSelectedImages, removeCaptionForSelectedImages, changeCaptionsForImage, openImage, closeAllImages, openAllFilterImages, openAllSelectedImages, pushImage, selectImage, unselectImage, removeImage, clearImageList, setLabels, selectAllFilteredImages, unselectAllFilteredImages, setImageList } = imageListSlice.actions;


