import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const baseUrl = "http://127.0.0.1:8080";
let userId;

const updateLocalStorage = (key, val) => {
  return localStorage.setItem(key, JSON.stringify(val));
};
const getLocalStorage = (key) => {
  let lc = localStorage.getItem(key);
  return lc ? JSON.parse(lc) : null;
};

export const createUser = createAsyncThunk(
  "user/createUser",
  async ({ userInfo }, { rejectWithValue }) => {
    const headers = {
      "Content-Type": "application/json",
    };
    const payload = {
      name: userInfo?.name,
      balance: parseFloat(userInfo?.balance),
      totalIncome: 0,
      totalExpense: 0,
      transactions: [],
      expenses: [],
      income: [],
    };
    try {
      const response = await axios.post(`${baseUrl}/user`, payload, {
        headers,
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err?.response);
    }
  }
);

export const getUserInfo = createAsyncThunk(
  "user/getUserInfo",
  async ({}, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${baseUrl}/user/${userId}`);
      return response.data;
    } catch (err) {
      return rejectWithValue(err?.response);
    }
  }
);

export const addTransaction = createAsyncThunk(
  "user/addTransaction",
  async ({ payload }, { rejectWithValue }) => {
    const headers = {
      "Content-Type": "application/json",
    };
    try {
      const response = await axios.put(
        `${baseUrl}/user/${userId}/addTransaction`,
        payload,
        {
          headers,
        }
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(err?.response);
    }
  }
);

export const updateTransaction = createAsyncThunk(
  "user/updateTransaction",
  async ({ id, payload }, { rejectWithValue }) => {
    const headers = {
      "Content-Type": "application/json",
    };
    try {
      const response = await axios.put(
        `${baseUrl}/user/${userId}/transactions/${id}`,
        payload,
        {
          headers,
        }
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(err?.response);
    }
  }
);

export const deleteTransaction = createAsyncThunk(
  "user/deleteTransaction",
  async ({ id }, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `${baseUrl}/user/${userId}/transactions/${id}/delete`
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(err?.response);
    }
  }
);

const initialState = {
  user: {
    id: getLocalStorage("userId"),
    userInfo: getLocalStorage("userInfo"),
  },
  userLoading: false,
  error: null,
};

export const userInfoSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(createUser.pending, (state, action) => {
        state.userLoading = true;
        state.error = null;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        let data = action.payload.data.data;
        updateLocalStorage("userId", data.id);
        updateLocalStorage("userInfo", data);
        userId = getLocalStorage("userId");
        state.user = { ...state.user, id: data?.id };
        state.user = { ...state.user, userInfo: data };
        state.userLoading = false;
        state.error = null;
      })
      .addCase(createUser.rejected, (state, action) => {
        state.user = null;
        state.userLoading = false;
        state.error = action.payload;
      })
      .addCase(getUserInfo.pending, (state, action) => {
        state.userLoading = true;
        state.error = null;
      })
      .addCase(getUserInfo.fulfilled, (state, action) => {
        let data = action.payload.data.data;

        updateLocalStorage("userInfo", data);
        state.user = { ...state.user, userInfo: data };
        state.userLoading = false;
        state.error = null;
      })
      .addCase(getUserInfo.rejected, (state, action) => {
        state.user = { ...state.user, userInfo: null };
        state.userLoading = false;
        state.error = action.payload;
      })
      .addCase(addTransaction.pending, (state, action) => {
        state.userLoading = true;
        state.error = null;
      })
      .addCase(addTransaction.fulfilled, (state, action) => {
        let data = action.payload.data;
        updateLocalStorage("userInfo", data);
        state.user = { ...state.user, userInfo: data };
        state.userLoading = false;
        state.error = null;
      })
      .addCase(addTransaction.rejected, (state, action) => {
        state.user = { ...state.user, userInfo: null };
        state.userLoading = false;
        state.error = action.payload;
      })
      .addCase(updateTransaction.pending, (state, action) => {
        state.userLoading = true;
        state.error = null;
      })
      .addCase(updateTransaction.fulfilled, (state, action) => {
        let data = action.payload.data;
        updateLocalStorage("userInfo", data);
        state.user = { ...state.user, userInfo: data };
        state.userLoading = false;
        state.error = null;
      })
      .addCase(updateTransaction.rejected, (state, action) => {
        state.user = { ...state.user, userInfo: null };
        state.userLoading = false;
        state.error = action.payload;
      })
      .addCase(deleteTransaction.pending, (state, action) => {
        state.userLoading = true;
        state.error = null;
      })
      .addCase(deleteTransaction.fulfilled, (state, action) => {
        let data = action.payload.data;
        updateLocalStorage("userInfo", data);
        state.user = { ...state.user, userInfo: data };
        state.userLoading = false;
        state.error = null;
      })
      .addCase(deleteTransaction.rejected, (state, action) => {
        state.user = { ...state.user, userInfo: null };
        state.userLoading = false;
        state.error = action.payload;
      });
  },
});

export const {} = userInfoSlice.actions;

export const selectUser = (state) => state.userInfo.user.userInfo;

export const selectUserId = (state) => state.userInfo.user.id;

export const selectUserLoading = (state) => state.userInfo.userLoading;

export default userInfoSlice.reducer;
