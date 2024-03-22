import { configureStore } from '@reduxjs/toolkit';
import imageMapReducer from './imageListSlice';
import imageDirReducer from './imageDirSlice';
import alertMsgReducer from './alertMsgSlice';



export const store = configureStore({
  reducer: {
    images: imageMapReducer,
    imagedir: imageDirReducer,
    alert: alertMsgReducer,
  },
})

export type RootState = ReturnType<typeof store.getState> 


