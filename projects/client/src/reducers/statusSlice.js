import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import api from "../api/api";

const initStatus = {
  statusReturn: [],
  isLoading: true,
};

const BASE_URL = `/status`;

const statusSlice = createSlice({
  name: "status",
  initialState: initStatus,
  reducers: {
    setStatusReturn(state, action) {
      state.statusReturn = action.payload;
    },
    setLoading(state, action) {
      state.isLoading = action.payload;
    },
  },
});

export const { setStatusReturn, setLoading } = statusSlice.actions;

export function fetchStatusReturn() {
  return async (dispatch) => {
    try {
      dispatch(setLoading(true));
      const res = await api.get(`${BASE_URL}`);
      console.log("ini res return", res.data);
      dispatch(setStatusReturn(res.data.statusReturn));
      dispatch(setLoading(false));
    } catch (error) {
      console.log("err return", error);
    }
  };
}

export default statusSlice.reducer;
