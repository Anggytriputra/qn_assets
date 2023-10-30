import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import api from "../api/api";

const initCategory = {
  categories: [],
  subCategories: [],
  isLoading: true,
};

const BASE_URL = `/category`;

const categorySlice = createSlice({
  name: "category",
  initialState: initCategory,
  reducers: {
    setCategory(state, action) {
      state.categories = action.payload;
    },
    setSubCategory(state, action) {
      state.subCategories = action.payload;
    },
    setLoading(state, action) {
      state.isLoading = action.payload;
    },
  },
});

export const { setCategory, setSubCategory, setLoading } =
  categorySlice.actions;

export function fetchCategories(query = "") {
  return async (dispatch) => {
    try {
      dispatch(setLoading(true));
      const res = await api.get(`${BASE_URL}?/${query}`);
      // console.log("ini res", res.data.data);
      dispatch(setCategory(res.data.data));
      dispatch(setLoading(false));
    } catch (error) {
      console.log("err", error);
    }
  };
}

export function fetchSubCategories(id) {
  // console.log("id", id);
  return async (dispatch) => {
    try {
      if (id) {
        dispatch(setLoading(true));
        const res = await api.get(`${BASE_URL}/sub-categories`, {
          params: {
            categoryId: id,
          },
        });
        // console.log("ini res", res);
        dispatch(setSubCategory(res.data.data));
        dispatch(setLoading(false));
        // Handle the response data here, possibly with another dispatch to set subcategories
      }
    } catch (err) {
      console.log("An error occurred:", err);
    }
  };
}

export default categorySlice.reducer;
