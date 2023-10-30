import { createSlice } from "@reduxjs/toolkit";
import {
  successAlert,
  errorAlertWithMessage,
  errorAlert,
} from "../helper/alerts";

import axios from "axios";
import api from "../api/api";

const BASEURL = `/asset-byname`;

const initDataAsset = {
  totalPages: 0,
  totalItems: 0,
  allAsset: [],
  Assets: [],
  AssetByBranchId: [],
  noPolisi: [],
  serialNumber: [],
  accesoriesAsset: [],
  noPolSN: [],
  isLoading: false,
};

const assetSlice = createSlice({
  name: "asset",

  initialState: initDataAsset,

  reducers: {
    setAllAsset(state, action) {
      state.allAsset = action.payload;
    },
    setAssets(state, action) {
      state.Assets = action.payload;
    },
    setNoPolisi(state, action) {
      state.noPolisi = action.payload;
    },
    setSerialNumber(state, action) {
      state.serialNumber = action.payload;
    },
    setAssetByBranchId(state, action) {
      state.AssetByBranchId = action.payload;
    },
    setAccessories(state, action) {
      state.accesoriesAsset = action.payload;
    },
    setNoPolSN(state, action) {
      state.noPolSN = action.payload;
    },

    setLoading(state, action) {
      return { ...state, isLoading: action.payload };
    },
  },
});

export const {
  setAllAsset,
  setAssets,
  setNoPolisi,
  setSerialNumber,
  setAssetByBranchId,
  setAccessories,
  setNoPolSN,
  setLoading,
} = assetSlice.actions;

export function fetchAllAsset(query) {
  return async (dispatch) => {
    const URL = `/asset`;
    dispatch(setLoading(true));
    try {
      const res = await api.get(`${URL}?${query}`);
      dispatch(
        setAllAsset({
          asset: res.data.asset,
          totalItems: res.data.count,
          totalPages: Math.ceil(res.data.count / 10),
        })
      );
      dispatch(setLoading(false));
    } catch (error) {
      // errorAlert();
      console.log("error fetch all asset", error);
    }
  };
}
export function fetchAssetByname(query) {
  // const BASEURL = "http://localhost:2000/asset-byname";

  return async (dispatch) => {
    try {
      dispatch(setLoading(true));
      const res = await api.get(`${BASEURL}`, {
        params: {
          assetName: query,
        },
      });
      dispatch(setAssets(res));
      // console.log("asset", res);
      dispatch(setLoading(false));
    } catch (error) {
      // errorAlert();
      console.log(error.message);
    }
  };
}

export function fetchAssetByBranchIdCategoryId(query) {
  // const BASEURL = "http://localhost:2000/asset-byname/id";

  return async (dispatch) => {
    try {
      dispatch(setLoading(true));
      const res = await axios.get(`${BASEURL}/asset-byname/id`, {
        params: {
          branchId: query.branchId,
          categoryId: query.categoryId,
        },
      });
      dispatch(
        setAssetByBranchId({
          assets: res.data.asset,
          // noPolisi:
        })
      );

      dispatch(setLoading(false));
    } catch (error) {
      console.log(error.message);
    }
  };
}

// ketika user memilih asset name di return asset
export function fetchAssetAccesoriesbyAssetId(assetId, categoryId) {
  // const BASEURL = "http://localhost:2000/asset-byname/accesories";
  return async (dispatch) => {
    try {
      dispatch(setLoading(true));
      const res = await api.get(`${BASEURL}/accesories`, {
        params: {
          assetId: assetId,
          categoryId: categoryId,
        },
      });
      // console.log("res accesories", res.data);
      dispatch(setAccessories(res.data.accessories));

      dispatch(setLoading(false));
    } catch (error) {
      console.log(error);
    }
  };
}
export function fetchAssetNoPolisi(query) {
  // const BASEURL = "http://localhost:2000/asset-byname/no-polisi";
  return async (dispatch) => {
    try {
      dispatch(setLoading(true));
      const res = await api.get(`${BASEURL}/no-polisi`, {
        params: {
          branchId: query.branchId,
          categoryId: query.categoryId,
        },
      });
      // console.log("res noPolisi", res.data.noPolisi);
      dispatch(setNoPolisi(res.data.noPolisi));

      dispatch(setLoading(false));
    } catch (error) {
      console.log(error);
    }
  };
}

export function fetchAssetSerialNumber(query) {
  // const BASEURL = "http://localhost:2000/asset-byname/serial-number";
  return async (dispatch) => {
    try {
      dispatch(setLoading(true));
      const res = await api.get(`${BASEURL}/serial-number`, {
        params: {
          branchId: query.branchId,
          categoryId: query.categoryId,
        },
      });
      dispatch(setSerialNumber(res.data.serialNumber));

      dispatch(setLoading(false));
    } catch (error) {
      console.log(error);
    }
  };
}

export function fetchAssetNoPolSN(query) {
  // console.log("query nopol", query);
  // const BASEURL = "http://localhost:2000/asset-byname/nopol_sn";
  return async (dispatch) => {
    try {
      dispatch(setLoading(true));
      const res = await api.get(`${BASEURL}/nopol_sn`, {
        params: {
          branchId: query.branchId,
          role: query.role,
        },
      });
      dispatch(setNoPolSN(res.data.noPolSN));

      dispatch(setLoading(false));
    } catch (error) {
      console.log(error);
    }
  };
}

export default assetSlice.reducer;
