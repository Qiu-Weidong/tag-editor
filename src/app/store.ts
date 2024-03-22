import { configureStore } from '@reduxjs/toolkit';
import imageMapReducer from './imageListSlice';
import imageDirReducer from './imageDirSlice';




export const store = configureStore({
  reducer: {
    images: imageMapReducer,
    imagedir: imageDirReducer,
  },
})

export type RootState = ReturnType<typeof store.getState> 


