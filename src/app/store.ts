import { configureStore } from '@reduxjs/toolkit';
import imageListReducer from './imageListSlice';
import imageDirReducer from './imageDirSlice';
import alertMsgReducer from './alertMsgSlice';
import settingsReducer from './settingsSlice';


export const store = configureStore({
  reducer: {
    images: imageListReducer,
    imagedir: imageDirReducer,
    alert: alertMsgReducer,
    setting: settingsReducer,
  },
})

export type RootState = ReturnType<typeof store.getState> 


