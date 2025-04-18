import { combineReducers, configureStore } from "@reduxjs/toolkit";
import userReducer from "./user/userSlice";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import persistStore from "redux-persist/es/persistStore";
import popupReducer from "./popup/popupSlice";

// to save the values in local storage directly
// by redux-persist
const rootReducer = combineReducers({
  user: userReducer,
  popup: popupReducer,
});

const persistConfig = {
  key: "root",
  storage,
  version: 1,
  whiteList: ["user"], // Persist only the user slice (Saved to localStorage)
};

// const persistedReducer = persistReducer(persistConfig, rootReducer);
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  //   reducer: { user: userReducer },
  reducer: persistedReducer,

  middleware: (getDefaultMiddleWare) =>
    getDefaultMiddleWare({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);
