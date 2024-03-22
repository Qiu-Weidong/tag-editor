import { AlertColor } from "@mui/material";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export interface AlertMessageState {
  severity: AlertColor,
  message: string,
};


interface AlertMessageListState {
  alerts: AlertMessageState[],
}

const initialState: AlertMessageListState = {
  alerts: [],
};


const alertMsgSlice = createSlice({
  name: "alert",
  initialState, 
  reducers: {
    push: (state, action: PayloadAction<AlertMessageState>) => {
      state.alerts = [...state.alerts, action.payload];
    },

    deletebyindex: (state, action: PayloadAction<number>) => {
      if(action.payload >= state.alerts.length) return;
      state.alerts = state.alerts.filter((_, index) => index !== action.payload);
    },

    clearAlerts: (state) => {
      state.alerts = [];
    },
  },
});


export default alertMsgSlice.reducer;
export const { push, deletebyindex, clearAlerts } = alertMsgSlice.actions;



