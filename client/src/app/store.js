import { configureStore } from "@reduxjs/toolkit";
import userInfoSliceReducer from "../slice/user";

export default configureStore({
  reducer: {
    userInfo: userInfoSliceReducer,
  },
});
