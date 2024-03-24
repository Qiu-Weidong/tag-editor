import { PayloadAction, createSlice } from "@reduxjs/toolkit";


export interface SettingsState {
  defaultImageGalleryColumns: number, // 图片的列数
  thumbnailWidth: number, // 缩略图的宽度
};


const initialState: SettingsState = {
  defaultImageGalleryColumns: 12,
  thumbnailWidth: 128,
}


const settingsSlice = createSlice({
  name: "settings",
  initialState, 
  reducers: {
    setSettings: (state, action: PayloadAction<SettingsState>) => state = action.payload,
  }
});



export default settingsSlice.reducer;
export const { setSettings } = settingsSlice.actions;

