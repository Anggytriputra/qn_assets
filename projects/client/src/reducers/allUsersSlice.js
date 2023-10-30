import { createSlice } from "@reduxjs/toolkit";
import {
  successAlert,
  errorAlertWithMessage,
  errorAlert,
} from "../helper/alerts";

import axios from "axios";
import api from "../api/api";

const initDataAsset = {
  totalPages: 0,
  totalItems: 0,
  users: [],
  isLoading: false,
};

const BASE_URL = `/users`;

const allUserSlice = createSlice({
  name: "Users",

  initialState: initDataAsset,

  reducers: {
    setAllUsers(state, action) {
      state.users = action.payload;
    },
    setLoading(state, action) {
      return { ...state, isLoading: action.payload };
    },
  },
});

export const { setAllUsers, setLoading } = allUserSlice.actions;

export function fetchAllUsers(query) {
  return async (dispatch) => {
    try {
      dispatch(setLoading(true));
      const res = await api.get(BASE_URL, {
        params: {
          branchId: query,
        },
      });

      dispatch(setAllUsers(res.data.m_users));

      dispatch(setLoading(false));
    } catch (error) {
      console.log(error);
    }
  };
}

export default allUserSlice.reducer;
