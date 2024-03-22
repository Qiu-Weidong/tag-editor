import { PayloadAction, createSlice } from "@reduxjs/toolkit";


export interface ImageDirState {
  currentDir: string | null, // 当前路径
  historyDir: string[], // 历史路径
  cachedReturnDir: string[], // 缓存路径

  // loading: boolean,
  // stop: boolean,
  process: number,
};

const initialState: ImageDirState = {
  currentDir: null,
  historyDir: [],
  cachedReturnDir: [],
  
  process: 0,
};

export const imageDirSlice = createSlice({
  name: 'imagedir', 
  initialState,
  reducers: {
    push: (state, action: PayloadAction<string>) => {
      // 获取栈顶的元素
      const last = state.historyDir[state.historyDir.length-1];
      if(state.currentDir && last != state.currentDir) { 
        state.historyDir = [...state.historyDir, state.currentDir];
      }
      state.currentDir = action.payload;
    },

    back: (state) => {

      if(state.historyDir.length > 0) {
        if(state.currentDir) {
          state.cachedReturnDir = [...state.cachedReturnDir, state.currentDir];
        }
        state.currentDir = state.historyDir[state.historyDir.length-1];
        state.historyDir = state.historyDir.slice(0, -1);
      }

      console.log('history:', state.historyDir);
      console.log('current:', state.currentDir);
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

    // setLoadingState: (state, action: PayloadAction<boolean>) => { state.loading = action.payload; },
    setProcessState: (state, action: PayloadAction<number>) => { state.process = action.payload; },
  }
});




export default imageDirSlice.reducer;
export const { push, back, forward, setProcessState } = imageDirSlice.actions;







