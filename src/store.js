import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./slices/authSlice";
import asyncActionMiddleware from "./middlewares/asyncActionMiddleware";
import uiSlice from "./slices/uiSlice";
import companySlice from "./slices/companySlice";

const setupStore = () =>
  configureStore({
    reducer: {
      auth: authSlice.reducer,
      companies: companySlice.reducer,
      ui: uiSlice.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(asyncActionMiddleware),
  });

export default setupStore;
