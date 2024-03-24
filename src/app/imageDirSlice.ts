import { PayloadAction, createSlice } from "@reduxjs/toolkit";


export interface ImageDirState {
  currentDir: string | null, // 当前路径
  historyDir: string[], // 历史路径
  cachedReturnDir: string[], // 缓存路径

  progress: number,
  imageLoaded: boolean,
};

const initialState: ImageDirState = {
  currentDir: null,
  historyDir: [],
  cachedReturnDir: [],
  
  progress: 100,
  imageLoaded: false,
};

export const imageDirSlice = createSlice({
  name: 'imagedir', 
  initialState,
  reducers: {
    push: (state, action: PayloadAction<string>) => {
      // 首先判断 state.currentDir 是否和 action 相同
      if(state.currentDir === action.payload) {
        return;
      }

      // 获取栈顶的元素
      const last = state.historyDir[state.historyDir.length-1];
      if(state.currentDir && last != state.currentDir) { 
        state.historyDir = [...state.historyDir, state.currentDir];
      }
      state.currentDir = action.payload;
      state.cachedReturnDir = [];
    },

    back: (state) => {

      if(state.historyDir.length > 0) {
        if(state.currentDir) {
          state.cachedReturnDir = [...state.cachedReturnDir, state.currentDir];
        }
        state.currentDir = state.historyDir[state.historyDir.length-1];
        state.historyDir = state.historyDir.slice(0, -1);
      }
    },

    forward: (state) => {
      if(state.cachedReturnDir.length > 0) {
        if(state.currentDir) {
          state.historyDir = [...state.historyDir, state.currentDir];
        }
        state.currentDir = state.cachedReturnDir[state.cachedReturnDir.length-1];
        state.cachedReturnDir = state.cachedReturnDir.slice(0, -1);
      }
    },

    setProcessState: (state, action: PayloadAction<number>) => { state.progress = action.payload; },
    setImageLoaded: (state, action: PayloadAction<boolean>) => {state.imageLoaded = action.payload; },
  }
});




export default imageDirSlice.reducer;
export const { push, back, forward, setProcessState, setImageLoaded } = imageDirSlice.actions;







